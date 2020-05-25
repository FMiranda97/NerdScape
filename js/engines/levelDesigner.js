"use strict";


const NUM_STATIC_ELEMENTS = 1;
const NUM_BACKGROUNDS = 2;
const NUM_ENEMIES = 3;

(function () {
    window.addEventListener("load", main);
}());


function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const upload = document.getElementById("createLevelbtn");
    const selectors = document.getElementById("selectors");
    const preview = document.getElementById("preview");
    const ld = new levelDesigner(ctx, upload, selectors, preview);
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    $.ajax({
        type: "post",
        url: 'actions/get_level.php',
        dataType: 'json',
        data: {play: vars['play'], edit: vars['edit']},
        success: function (response) {
            if (response['op'] === 'edit') {
                ld.level.clear();
                ld.level.fromString(response['level_data'])
            } else if (response['op'] === 'play') {
                alert('Wrong page')
            }
        }
    });
}

class levelDesigner extends Engine {

    constructor(ctx, upload, selectors, preview) {
        super(ctx);

        //selection and placement
        this.rightClicked = false;
        this.drag = false;
        this.preview = preview;
        this.upload = upload;
        //editor
        this.selectors = selectors;
        this.editor = new Editor(this);
        //selection imgs
        this.backgroundImgs = [];
        this.staticImgs = [];
        this.enemyImgs = [];
        this.playerImg = null;
        this.flagImg = null;
        this.portalImg = null;
        //start engine
        this.init();
    }

    init() {
        this.initButtons();
        // component selection loader
        this.initSelectors();
        //event handlers loader
        this.initHandlers();
    }

    initButtons() {
        const me = this;
        this.preview.onclick = function () {
            for (let i = 0; i < me.level.enemySprites.length; i++) {
                me.level.enemySprites[i].shouldMove = me.level.enemySprites[i].shouldMove === false;
                me.level.enemySprites[i].reset();
            }
        };
        this.upload.onsubmit = function (ev) {
            //stops preview
            for (let i = 0; i < me.level.enemySprites.length; i++) {
                me.level.enemySprites[i].shouldMove = false;
                me.level.enemySprites[i].reset();
            }
            ev.preventDefault();
            if (!me.level.playerSprite || !me.level.flagSprite) {
                alert("Must have a player and a flag.");
                return;
            }
            let level = me.level.toString();
            let ow = 'unchecked';
            jQuery.ajax({
                type: "POST",
                url: 'actions/upload_level.php',
                dataType: 'json',
                data: {level_name: ev.target['name'].value, level_info: level, overwrite: ow},

                success: function (response) {
                    if (response.status === "NeedConfirmation") {
                        ow = confirm("Level with this name already exists. Overwrite?");
                        if (ow === true) {
                            jQuery.ajax({
                                type: "POST",
                                url: 'actions/upload_level.php',
                                dataType: 'json',
                                data: {level_name: ev.target['name'].value, level_info: level, overwrite: "ok"},

                                success: function (response) {
                                    if (response.status !== "Failed") {
                                        alert(response.status);
                                    } else {
                                        for (let error of response.error)
                                            alert(error);
                                    }
                                }
                            });
                        }
                    } else if (response.status !== "Failed") {
                        alert(response.status);
                    } else {
                        for (let error of response.error)
                            alert(error);
                    }
                }
            });
        };
    }

    initHandlers() {
        let me = this;
        let rightClick = function (ev) {
            ev.preventDefault();
            if (me.selectedSprite && me.rightClicked === false) return;
            me.selectedSprite = me.findSelectedSprite(ev);
            if (me.selectedSprite) {
                me.rightClicked = true;
                me.editor.spawnEditor(me.selectedSprite, me.selectors);
            } else {
                me.selectedSprite = null;
                me.spawnSelector()
            }
        };
        let mouseDown = function (ev) {
            if (ev.button > 0) return;
            let aux = me.findSelectedSprite(ev);
            if (aux !== me.selectedSprite || !me.rightClicked) {
                if (me.selectedSprite instanceof Enemy) {
                    me.selectedSprite.shouldMove = false;
                    me.selectedSprite.reset();
                }
                me.selectedSprite = aux;
                me.rightClicked = false;
                me.spawnSelector();
            } else me.drag = true;
        };
        let mouseUp = function (ev) {
            if (ev.button > 0) return;
            me.drag = false;
            if (!me.rightClicked) {
                if (me.selectedSprite instanceof Enemy) {
                    me.selectedSprite.shouldMove = false;
                    me.selectedSprite.reset();
                }
                me.spawnSelector();
                me.rightClicked = false;
                me.selectedSprite = null;
            }
        };
        let mouseMove = function (ev) {
            if (me.selectedSprite && (me.rightClicked === false || me.drag === true)) {
                let speedX = ev.offsetX - me.selectedSprite.width / 2 - me.selectedSprite.x;
                let speedY = ev.offsetY - me.selectedSprite.height / 2 - me.selectedSprite.y;
                me.selectedSprite.updatePosition(me.ctx.canvas.width, me.ctx.canvas.height, speedX, speedY, true);
                if (me.rightClicked === true && me.drag === true) {
                    me.editor.spawnEditor(me.selectedSprite, me.selectors);
                }
            }
        };
        let keyDown = function (ev) {
            me.keysPressed[ev.key] = true;
            if (me.selectedSprite) {
                let updated = me.selectedSprite.updateDimensions(me.keysPressed);
                if (updated && me.selectedSprite instanceof Enemy && me.rightClicked) me.editor.spawnEditor(me.selectedSprite, me.selectors);
            }
        };
        let keyUp = function (ev) {
            delete me.keysPressed[ev.key];
            if (me.selectedSprite) {
                me.selectedSprite.updateDimensions(me.keysPressed);
                if (me.selectedSprite instanceof Enemy && me.rightClicked) me.editor.spawnEditor(me.selectedSprite, me.selectors);
            }
        };
        this.ctx.canvas.addEventListener("contextmenu", rightClick);
        this.ctx.canvas.addEventListener("mousedown", mouseDown);
        this.ctx.canvas.addEventListener("mouseup", mouseUp);
        this.ctx.canvas.addEventListener("mousemove", mouseMove);
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
    }

    initSelectors() {
        let resdir = "resources/components/";
        const ext = ".png";
        const me = this;
        let loadHandler = function (ev) { //set apropriate dimensions for display
            let ratio = 100 / ev.target.naturalHeight;
            ev.target.height = ev.target.naturalHeight * ratio;
            ratio = 100 / ev.target.naturalWidth;
            ev.target.width = ev.target.naturalWidth * ratio;
        };

        //backgrounds
        let imgsrc = [];
        for (let i = 0; i < NUM_BACKGROUNDS; i++) imgsrc[i] = resdir + "bkg" + i + ext;
        let bkg_container = document.getElementById('backgroundContainer');
        let docFrag = document.createDocumentFragment();
        imgsrc.forEach(function (name, i) {
            me.backgroundImgs[i] = document.createElement('img');
            docFrag.appendChild(me.backgroundImgs[i]);
            me.backgroundImgs[i].src = name;
            me.backgroundImgs[i].onload = loadHandler;
            me.backgroundImgs[i].onclick = function (ev) {
                me.level.addBackgroundSprite(ev.target);
            }
        });
        bkg_container.appendChild(docFrag);
        this.ajaxContainer("Background", bkg_container, this.backgroundImgs);


        //static components
        imgsrc = [];
        for (let i = 0; i < NUM_STATIC_ELEMENTS; i++) imgsrc[i] = resdir + "img" + i + ext;
        let static_container = document.getElementById('staticContainer');
        docFrag = document.createDocumentFragment();
        imgsrc.forEach(function (name, i) {
            me.staticImgs[i] = document.createElement('img');
            docFrag.appendChild(me.staticImgs[i]);
            me.staticImgs[i].src = name;
            me.staticImgs[i].onload = loadHandler;
            me.staticImgs[i].onclick = function (ev) {
                me.level.addStaticSprite(ev.target);
            }
        });
        static_container.appendChild(docFrag);
        this.ajaxContainer("Static", static_container, this.staticImgs);


        resdir = "resources/enemies/";
        //enemies
        imgsrc = [];
        for (let i = 0; i < NUM_ENEMIES; i++) imgsrc[i] = resdir + "enm" + i + ext;
        let enemy_container = document.getElementById('enemyContainer');
        docFrag = document.createDocumentFragment();
        imgsrc.forEach(function (name, i) {
            me.enemyImgs[i] = document.createElement('img');
            docFrag.appendChild(me.enemyImgs[i]);
            me.enemyImgs[i].src = name;
            me.enemyImgs[i].onload = loadHandler;
            me.enemyImgs[i].onclick = function (ev) {
                let type;
                if (i === 0) type = "randomizer";
                if (i === 1) type = "repeater";
                if (i === 2) type = "sniper";
                me.level.addEnemySprite(ev.target, type);
            }
        });
        enemy_container.appendChild(docFrag);
        this.ajaxContainer("Sniper", enemy_container, this.enemyImgs);
        this.ajaxContainer("Repeater", enemy_container, this.enemyImgs);
        this.ajaxContainer("Randomizer", enemy_container, this.enemyImgs);

        resdir = "resources/components/";
        //unique elements
        let unique_container = document.getElementById('uniqueContainer');
        docFrag = document.createDocumentFragment();

        //player
        this.playerImg = document.createElement('img');
        docFrag.append(this.playerImg);
        this.ajaxUnique(this.playerImg, "player", resdir, ext);


        //flag
        this.flagImg = document.createElement('img');
        docFrag.append(this.flagImg);
        this.ajaxUnique(this.flagImg, "flag", resdir, ext);

        //portal
        this.portalImg = document.createElement('img');
        docFrag.append(this.portalImg);
        this.ajaxUnique(this.portalImg, "portal", resdir, ext);

        //coin
        this.coinImg = document.createElement('img');
        docFrag.append(this.coinImg);
        this.ajaxUnique(this.coinImg, "coin", resdir, ext);

        //chest
        this.chestImg = document.createElement('img');
        docFrag.append(this.chestImg);
        this.ajaxUnique(this.chestImg, "Chest", resdir, ext);

        //append to document
        unique_container.appendChild(docFrag);
    }

    spawnSelector() {
        this.selectors.style.display = "block";
        this.editor.despawn();
    }

    findSelectedSprite(ev) {
        if (this.level.playerSprite && this.level.playerSprite.mouseOver(ev)) {
            return this.level.playerSprite;
        }
        for (let i = this.level.enemySprites.length - 1; i >= 0; i--) {
            if (this.level.enemySprites[i].mouseOver(ev)) {
                return this.level.enemySprites[i];
            }
        }
        for (let i = 0; i < this.level.coinSprites.length; i++) {
            if (this.level.coinSprites[i].mouseOver(ev)) {
                return this.level.coinSprites[i];
            }
        }
        for (let i = 0; i < this.level.portalSprites.length; i++) {
            if (this.level.portalSprites[i].mouseOver(ev)) {
                return this.level.portalSprites[i];
            }
        }
        if (this.level.flagSprite && this.level.flagSprite.mouseOver(ev)) {
            return this.level.flagSprite;
        }
        for (let i = this.level.staticSprites.length - 1; i >= 0; i--) {
            if (this.level.staticSprites[i].mouseOver(ev)) {
                return this.level.staticSprites[i];
            }
        }
        for (let i = this.level.chestSprites.length - 1; i >= 0; i--) {
            if (this.level.chestSprites[i].mouseOver(ev)) {
                return this.level.chestSprites[i];
            }
        }
        return null;
    }

    render(total_time) {
        for (let i = 0; i < this.level.enemySprites.length; i++) {
            this.level.enemySprites[i].update(total_time, 1, this.level.playerSprite);
        }

        super.render(total_time);
        //highlight selected sprite
        if (this.selectedSprite && this.rightClicked) {
            this.ctx.strokeStyle = '#f00';  // some color/style
            this.ctx.lineWidth = 2;         // thickness
            this.ctx.strokeRect(this.selectedSprite.x, this.selectedSprite.y, this.selectedSprite.width, this.selectedSprite.height);
        }
        //draw portal ids
        for (let i = 0; i < this.level.portalSprites.length; i++) {
            this.ctx.font = "8px Comic Sans MS";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "right";
            this.ctx.fillText(this.level.portalSprites[i].id, this.level.portalSprites[i].x + this.level.portalSprites[i].width / 4, this.level.portalSprites[i].y + this.level.portalSprites[i].height);
            this.ctx.fillStyle = "blue";
            this.ctx.textAlign = "left";
            this.ctx.fillText(this.level.portalSprites[i].destination_id, this.level.portalSprites[i].x + 3 * this.level.portalSprites[i].width / 4, this.level.portalSprites[i].y + this.level.portalSprites[i].height);
        }
        //draw coin value
        for (let i = 0; i < this.level.coinSprites.length; i++) {
            this.ctx.font = "8px Comic Sans MS";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "right";
            this.ctx.fillText(this.level.coinSprites[i].value, this.level.coinSprites[i].x + this.level.coinSprites[i].width / 2, this.level.coinSprites[i].y + this.level.coinSprites[i].height);
        }
        //draw chest value
        for (let i = 0; i < this.level.chestSprites.length; i++) {
            this.ctx.font = "8px Comic Sans MS";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "right";
            this.ctx.fillText(this.level.chestSprites[i].value, this.level.chestSprites[i].x + this.level.chestSprites[i].width / 2, this.level.chestSprites[i].y + this.level.chestSprites[i].height);
        }

        //draw level reward
        this.ctx.font = "8px Comic Sans MS";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "right";
        if (this.level.flagSprite)
            this.ctx.fillText(this.level.flagSprite.basicReward, this.level.flagSprite.x + this.level.flagSprite.width / 2, this.level.flagSprite.y + this.level.flagSprite.height);

    }

    ajaxContainer(type, container, array) {
        let me = this;
        $.ajax({
            type: "POST",
            url: 'actions/get_sprite.php',
            dataType: 'json',
            data: {type: type},

            success: function (response) {
                if (response.status !== "Failed") {
                    let loadHandler = function (ev) { //set apropriate dimensions for display
                        let ratio = 100 / ev.target.naturalHeight;
                        ev.target.height = ev.target.naturalHeight * ratio;
                        ratio = 100 / ev.target.naturalWidth;
                        ev.target.width = ev.target.naturalWidth * ratio;
                    };
                    let docFrag = document.createDocumentFragment();
                    for (let sprite of response.sprites) {
                        let element = document.createElement('img');
                        array.push(element);
                        docFrag.appendChild(element);
                        element.src = sprite;
                        element.onload = loadHandler;
                        if (type === "Background") {
                            element.onclick = function (ev) {
                                me.level.addBackgroundSprite(ev.target);
                            }
                        } else if (type === "Static") {
                            element.onclick = function (ev) {
                                me.level.addStaticSprite(ev.target);
                            }
                        } else {
                            element.onclick = function (ev) {
                                me.level.addEnemySprite(ev.target, type.toLowerCase());
                            }
                        }
                    }
                    container.appendChild(docFrag);
                }
            }
        });
    }

    ajaxUnique(img, type, resdir, ext) {
        let me = this;
        let loadHandler = function (ev) { //set apropriate dimensions for display
            let ratio = 100 / ev.target.naturalHeight;
            ev.target.height = ev.target.naturalHeight * ratio;
            ratio = 100 / ev.target.naturalWidth;
            ev.target.width = ev.target.naturalWidth * ratio;
        };
        $.ajax({
            type: "POST",
            url: 'actions/get_sprite.php',
            dataType: 'json',
            data: {type: type},
            success: function (response) {
                img.onload = loadHandler;
                if (response.status !== "Failed" && response.sprites.length > 0) {
                    img.src = response.sprites[0];
                } else {
                    if (type === "Chest"){
                        img.src = CLOSED_CHEST_IMG;
                    }else img.src = resdir + type + ext;
                }
                if (type === "Player") {
                    img.onclick = function (ev) {
                        me.level.addPlayerSprite(ev.target);
                    };
                } else if (type === "Flag") {
                    img.onclick = function (ev) {
                        me.level.addFlagSprite(ev.target);
                    };
                } else if (type === "Portal") {
                    img.onclick = function (ev) {
                        me.level.addPortalSprite(ev.target);
                    };
                } else if (type === "Coin") {
                    img.onclick = function (ev) {
                        me.level.addCoinSprite(ev.target);
                    };
                } else if (type === "Chest") {
                    img.onclick = function (ev) {
                        me.level.addChestSprite(ev.target);
                    };
                }
            }
        });

    }
}