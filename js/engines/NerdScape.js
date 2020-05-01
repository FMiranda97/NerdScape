"use strict";

const SAVE_GAME = "user_data";

(function () {
    window.addEventListener("load", main);
}());


function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const music = document.getElementById("music");
    new NerdScape(ctx, music);
}

class NerdScape extends Engine {

    constructor(ctx, music) {
        super(ctx);
        this.loadGame();
        this.music = music;
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
        this.music.volume = 0;
        this.level = new Level(this.ctx, 1);
        this.initHandlers();
    }

    initHandlers() {
        let me = this;
        let rightClick = function (ev) {
            ev.preventDefault();
        };
        let mouseClick = function (ev) {
            me.clickSprite(ev);
            if(me.level.active && me.user.canRange){
                me.level.playerSprite.shoot(ev, me.user);
            }
        };
        let keyDown = function (ev) {
            if(ev.key === "Escape"){me.pressEscape(); return;}
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

    pressEscape(){
        if(this.level.active){
            this.levelStartMenu.active = true;
            this.level.pause();
        }else if(this.levelStartMenu.active === true){
            this.levelStartMenu.active = false;
            this.level.start();
        }else if(this.optionsMenu.active === true){
            this.optionsMenu.active = false;
            this.optionsMenu.easy.clickable = false;
            this.optionsMenu.medium.clickable = false;
            this.optionsMenu.hard.clickable = false;
            this.optionsMenu.callerMenu.active = true;
        }else if(this.levelSelectionMenu.active === true){
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
        //update engine time
        this.total_time = total_time;
        //move sprites
        if(this.user)
            this.level.update(total_time, this.keysPressed, this.user);
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
                this.user.money += this.level.flagSprite.reward * this.user.difficulty;
                if (this.user.maxLevel === this.level.lvl) this.user.maxLevel++;
                this.saveGame();
            } else this.levelOverMenu.won = false;
        }
        if (this.levelStartMenu) this.levelStartMenu.draw(this.ctx, total_time);
        if (this.levelOverMenu) this.levelOverMenu.draw(this.ctx, total_time);
        if (this.levelSelectionMenu) this.levelSelectionMenu.draw(this.ctx);
        if (this.mainMenu) this.mainMenu.draw(this.ctx);
        if (this.optionsMenu) this.optionsMenu.draw(this.ctx);
        if (this.shopMenu) this.shopMenu.draw(this.ctx);
    }

    saveGame(){
        localStorage.setItem(SAVE_GAME, JSON.stringify(this.user));
    }

    loadGame(){
        let save = localStorage.getItem(SAVE_GAME);
        if(save){
            try{
                this.user = JSON.parse(save);
            }catch (e) {
                localStorage.removeItem(SAVE_GAME);
                this.user = new User();
            }
        }else{
            this.user = new User();
        }
    }
}