"use strict";

const IMG_PLAY = "resources/menus/play.png";

class LevelStartMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = false;
        this.background = new MenuComponent(engine.ctx.canvas.width / 2 - 100, engine.ctx.canvas.height / 2 - 150, 200, 300, IMG_BKG, false);
        this.back = new MenuComponent(engine.ctx.canvas.width / 2 - 50 - 30, engine.ctx.canvas.height / 2 + 80, 60, 30, IMG_BACK, true);
        this.options = new MenuComponent(engine.ctx.canvas.width / 2 + 50 - 15, engine.ctx.canvas.height / 2 + 80, 30, 30, IMG_OPTIONS, true);
        this.play = new MenuComponent(engine.ctx.canvas.width / 2  - 30, engine.ctx.canvas.height / 2 -30 , 60, 60, IMG_PLAY, true);
    }

    draw(ctx) {
        if (!this.active) return;
        this.background.draw(ctx);
        this.back.draw(ctx);
        this.options.draw(ctx);
        this.play.draw(ctx);
        ctx.font = "32px Audiowide";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        let level;
        if(!this.engine.level.lvl) level = "Explorer";
        else level = "Level " + this.engine.level.lvl;
        ctx.fillText(level, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 - 80);

    }

    clickSprite(ev) {
        if (!this.active) return false;
        this.clickBack(ev);
        this.clickOptions(ev);
        this.clickPlay(ev);
        return true;
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev) && !this.engine.exploreMode) {
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.mainMenu.active = true;
        }
    }

    clickOptions(ev) {
        if (this.options.mouseOverBoundingBox(ev)) {
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.optionsMenu.active = true;
            this.engine.optionsMenu.callerMenu = this;
        }
    }

    clickPlay(ev) {
        if (this.play.mouseOverBoundingBox(ev) && this.engine.level.playerSprite) {
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.level.start(this.engine.total_time);
            this.engine.keysPressed = {};
        }
    }
}