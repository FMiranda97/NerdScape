"use strict";

(function () {
    window.addEventListener("load", main);
}());

function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const form = document.getElementById("level_selector");
    const ns = new NerdScape(ctx);
    if (form) {
        //ajax to get level
        let vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
            if(vars['play']){
                ns.exploreMode = true;
            }
        });
        jQuery.ajax({
            type: "post",
            url: 'actions/get_level.php',
            dataType: 'json',
            data: {play: vars['play'], edit: vars['edit']},
            success: function (response) {
                if (response['op'] === 'play') {
                    ns.exploreLevel(response['level_data'], parseInt(vars['play']));
                } else if (response['op'] === 'edit') {
                    alert('Wrong page');
                } else {
                    ns.exploreLevel("bkg:0\nstatic:0\nenemies:0\nportals:0\ncoins:0\nchests:0\nplayer:0\nflag:0\n", -1);
                }
            }
        });
    }
}

class NerdScape extends Engine {

    constructor(ctx) {
        super(ctx);
        this.exploreMode = false;
        this.loadGame();
        this.music = new Audio("resources/sounds/music/game_music.mp3");
        this.mainMenu = new MainMenu(this);
        this.levelStartMenu = new LevelStartMenu(this);
        this.levelOverMenu = new LevelOverMenu(this);
        this.levelSelectionMenu = new LevelSelectionMenu(this);
        this.optionsMenu = new OptionsMenu(this);
        this.shopMenu = new ShopMenu(this);
        //start engine
        this.init();
    }

    init() {
        this.music.volume = this.user.musicVolume;
        this.level = new Level(this.ctx);
        this.initHandlers();
        this.initSfx();
    }

    initSfx(){
        this.sfxDarkShot = new Audio("resources/sounds/SFX/dark_shot.mp3");
        this.sfxDyingEnemy = new Audio("resources/sounds/SFX/dying_enemy.mp3");
        this.sfxGrabCoin = new Audio("resources/sounds/SFX/grab_coin.mp3");
        this.sfxHeroDeath = new Audio("resources/sounds/SFX/hero_death.mp3");
        this.sfxJump = new Audio("resources/sounds/SFX/jump.mp3");
        this.sfxLightShot = new Audio("resources/sounds/SFX/light_shot.mp3");
        this.sfxMenu = new Audio("resources/sounds/SFX/menu.mp3");
        this.sfxOpenChest = new Audio("resources/sounds/SFX/open_chest.mp3");
        this.sfxPortal = new Audio("resources/sounds/SFX/Portal.mp3");
        this.sfxWin = new Audio("resources/sounds/SFX/win.mp3");
    }

    updateSfxVolume(){
        for(let field in this){
            if(field !== "music" && this[field] instanceof Audio){
                this[field].volume = this.user.sfxVolume;
            }
        }
    }

    initHandlers() {
        let me = this;
        let rightClick = function (ev) {
            ev.preventDefault();
        };
        let mouseClick = function (ev) {
            me.clickSprite(ev);
            if (me.level.active && me.user.canRange) {
                me.level.playerSprite.shoot(ev, me.user);
                me.sfxDarkShot.currentTime = 0;
                me.sfxDarkShot.play();
            }
        };
        let keyDown = function (ev) {
            if (ev.key === "Escape") {
                me.pressEscape();
                return;
            }
            if (!me.level.active) return;
            me.keysPressed[ev.key] = true;
            me.level.playerSprite.updateSpeed(me.keysPressed, me.user);

        };
        let keyUp = function (ev) {
            if (!me.level.active) return;
            delete me.keysPressed[ev.key];
            me.level.playerSprite.updateSpeed(me.keysPressed, me.user);
        };
        this.ctx.canvas.addEventListener("contextmenu", rightClick);
        this.ctx.canvas.addEventListener("click", mouseClick);
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
    }

    pressEscape() {
        if (this.level.active) {
            this.levelStartMenu.active = true;
            this.level.pause();
        } else if (this.levelStartMenu.active === true) {
            this.levelStartMenu.active = false;
            this.level.start();
        } else if (this.optionsMenu.active === true) {
            this.optionsMenu.active = false;
            this.optionsMenu.easy.clickable = false;
            this.optionsMenu.medium.clickable = false;
            this.optionsMenu.hard.clickable = false;
            this.optionsMenu.callerMenu.active = true;
        } else if (this.levelSelectionMenu.active === true) {
            this.levelSelectionMenu.active = false;
            this.mainMenu.active = true;
        }
    }

    clickSprite(ev) {
        if (this.mainMenu.clickSprite(ev)) return;
        if (this.levelStartMenu.clickSprite(ev)) return;
        if (this.levelOverMenu.clickSprite(ev)) return;
        if (this.levelSelectionMenu.clickSprite(ev)) return;
        if (this.shopMenu.clickSprite(ev)) return;
        this.optionsMenu.clickSprite(ev);
    }

    render(total_time) {
        try{
            this.music.play();
        }catch (e) {
            console.log("No interaction yet");
        }
        //update engine time
        this.total_time = total_time;
        //move sprites
        if (this.user)
            this.level.update(total_time, this.keysPressed, this.user, this);
        //check if player still alive
        //draw necessary sprites
        super.render(total_time);
        //check for level end conditions
        let status = this.level.isOver();
        //draw menus (on top of everything else)
        if (status > 0) {
            this.level.active = false;
            this.levelOverMenu.active = true;
            if (status === WON) {
                this.levelOverMenu.won = true;
                if (!this.exploreMode) {
                    this.user.money += this.level.flagSprite.reward * this.user.difficulty;
                }
                if (this.user.maxLevel === this.level.lvl) this.user.maxLevel++;
                this.saveGame();
            } else{
                this.levelOverMenu.won = false;
                this.sfxHeroDeath.currentTime = 0;
                this.sfxHeroDeath.play();
            }
        }
        this.activateExplorer();
        if (this.levelStartMenu) this.levelStartMenu.draw(this.ctx, total_time);
        if (this.levelOverMenu) this.levelOverMenu.draw(this.ctx, total_time);
        if (this.levelSelectionMenu) this.levelSelectionMenu.draw(this.ctx);
        if (this.mainMenu) this.mainMenu.draw(this.ctx);
        if (this.optionsMenu) this.optionsMenu.draw(this.ctx);
        if (this.shopMenu) this.shopMenu.draw(this.ctx);
    }

    saveGame() {
        let save = JSON.stringify(this.user);
        console.log(save);
        $.ajax({
            type: "post",
            url: "actions/do_save.php",
            dataType: "json",
            data: {save: save},
        });
    }

    loadGame() {
        let me = this;
        this.user = new User();
        $.ajax({
            type: "post",
            url: "actions/do_load.php",
            dataType: "json",
            data: {},
            success: function (response) {
                if(response.status !== "Failure" && response.save){
                    me.user = JSON.parse(response.save);
                    me.optionsMenu = new OptionsMenu(me);
                    me.shopMenu = new ShopMenu(me);
                    me.music.volume = me.user.musicVolume;
                    me.updateSfxVolume();
                }
            }
        });
    }

    exploreLevel(lvl, level_id) {
        this.exploreMode = true;
        this.level.clear();
        this.level.fromString(lvl);
        this.level.id = level_id;
        this.mainMenu.active = false;
        this.levelStartMenu.active = true;
    }

    activateExplorer() {
        if (!this.exploreMode) return;
        if (this.levelStartMenu && this.optionsMenu && (!this.level.active || this.level.isOver() !== NOT_OVER) && !this.levelOverMenu.active && !this.optionsMenu.active) this.levelStartMenu.active = true;
        if (this.levelSelectionMenu) this.levelSelectionMenu.active = false;
        if (this.mainMenu) this.mainMenu.active = false;
        if (this.shopMenu) this.shopMenu.active = false;
    }
}