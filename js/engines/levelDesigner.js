"use strict";


const NUM_STATIC_ELEMENTS = 3;
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
    new levelDesigner(ctx, upload, selectors, preview);
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
            let level = me.level.toString();
            $.ajax({
                type: "POST",
                url: 'actions/upload_level.php',
                dataType: 'json',
                data: {level_name: ev.target['name'].value, level_info: level},

                success: function (response) {
                    if(response.status !== "Failed"){
                        alert(response.status);
                    }else{
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
            if(me.selectedSprite){
                me.rightClicked = true;
                me.editor.spawnEditor(me.selectedSprite, me.selectors);
            }else{
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
        let container = document.getElementById('backgroundContainer');
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
        container.appendChild(docFrag);

        //static components
        imgsrc = [];
        for (let i = 0; i < NUM_STATIC_ELEMENTS; i++) imgsrc[i] = resdir + "img" + i + ext;
        container = document.getElementById('staticContainer');
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
        container.appendChild(docFrag);
        resdir = "resources/enemies/";
        //enemies
        imgsrc = [];
        for (let i = 0; i < NUM_ENEMIES; i++) imgsrc[i] = resdir + "enm" + i + ext;
        container = document.getElementById('enemyContainer');
        docFrag = document.createDocumentFragment();
        imgsrc.forEach(function (name, i) {
            me.enemyImgs[i] = document.createElement('img');
            docFrag.appendChild(me.enemyImgs[i]);
            me.enemyImgs[i].src = name;
            me.enemyImgs[i].onload = loadHandler;
            me.enemyImgs[i].onclick = function (ev) {
                let type;
                if(i === 0) type = "randomizer";
                if(i === 1) type = "repeater";
                if(i === 2) type = "sniper";
                me.level.addEnemySprite(ev.target, type);
            }
        });
        container.appendChild(docFrag);

        resdir = "resources/components/";
        //unique elements
        container = document.getElementById('uniqueContainer');
        docFrag = document.createDocumentFragment();
        //player
        this.playerImg = document.createElement('img');
        docFrag.append(this.playerImg);
        this.playerImg.src = resdir + "player" + ext;
        this.playerImg.onload = loadHandler;
        this.playerImg.onclick = function (ev) {
            me.level.addPlayerSprite(ev.target);
        };
        //flag
        this.flagImg = document.createElement('img');
        docFrag.append(this.flagImg);
        this.flagImg.src = resdir + "flag" + ext;
        this.flagImg.onload = loadHandler;
        this.flagImg.onclick = function (ev) {
            me.level.addFlagSprite(ev.target);
        };
        //portal
        this.portalImg = document.createElement('img');
        docFrag.append(this.portalImg);
        this.portalImg.src = resdir + "portal" + ext;
        this.portalImg.onload = loadHandler;
        this.portalImg.onclick = function (ev) {
            me.level.addPortalSprite(ev.target);
        };
        //coin
        this.coinImg = document.createElement('img');
        docFrag.append(this.coinImg);
        this.coinImg.src = resdir + "coin" + ext;
        this.coinImg.onload = loadHandler;
        this.coinImg.onclick = function (ev) {
            me.level.addCoinSprite(ev.target);
        };
        //chest
        this.chestImg = document.createElement('img');
        docFrag.append(this.chestImg);
        this.chestImg.src = CLOSED_CHEST_IMG;
        this.chestImg.onload = loadHandler;
        this.chestImg.onclick = function (ev) {
            me.level.addChestSprite(ev.target);
        };

        //append to document
        container.appendChild(docFrag);
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

    render(reqID, total_time) {
        for (let i = 0; i < this.level.enemySprites.length; i++) {
            this.level.enemySprites[i].update(total_time, 1, this.level.playerSprite);
        }

        super.render(reqID, total_time);
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
}