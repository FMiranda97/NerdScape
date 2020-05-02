"use strict";

const IMG_WIN = "resources/menus/win.png";
const IMG_LOSE = "resources/menus/lose.png";
const IMG_BACK = "resources/menus/back.png";
const IMG_RETRY = "resources/menus/restart.png";
const IMG_NEXT = "resources/menus/next.png";

class LevelOverMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = false;
        this.won = false;
        this.background = new MenuComponent(engine.ctx.canvas.width / 2 - 100, engine.ctx.canvas.height / 2 - 150, 200, 300, IMG_BKG, false);
        this.back = new MenuComponent(engine.ctx.canvas.width / 2 - 50 - 15, engine.ctx.canvas.height / 2 + 80, 30, 30, IMG_BACK, true);
        this.retry = new MenuComponent(engine.ctx.canvas.width / 2 - 15, engine.ctx.canvas.height / 2 + 80, 30, 30, IMG_RETRY, true);
        this.next = new MenuComponent(engine.ctx.canvas.width / 2 + 50 - 25, engine.ctx.canvas.height / 2 + 80 - 10, 50, 50, IMG_NEXT, false);
        this.win = new MenuComponent(engine.ctx.canvas.width / 2 - 50, engine.ctx.canvas.height / 2 - 125, 100, 100, IMG_WIN, false);
        this.lose = new MenuComponent(engine.ctx.canvas.width / 2 - 50, engine.ctx.canvas.height / 2 - 125, 100, 100, IMG_LOSE, false);
    }

    draw(ctx) {
        if (!this.active) return;
        this.background.draw(ctx);
        this.back.draw(ctx);
        this.retry.draw(ctx);
        if (this.engine.user.maxLevel > this.engine.level.lvl && this.engine.user.maxLevel <= MAX_LEVEL) {
            this.next.draw(ctx);
            this.next.clickable = true;
        } else this.next.clickable = false;
        if (this.won) {
            this.win.draw(ctx);
            ctx.font = "32px Comic Sans MS";
            ctx.fillStyle = "blue";
            ctx.textAlign = "center";
            let level_reward = this.engine.level.flagSprite.basicReward * this.engine.user.difficulty;
            let coins = this.engine.level.flagSprite.reward * this.engine.user.difficulty - level_reward;
            ctx.fillText(level_reward, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 + 10);
            ctx.fillText("+ " + coins, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 + 40);
            ctx.fillText("= " + this.engine.user.money, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 + 70);
        } else this.lose.draw(ctx);
    }

    clickSprite(ev) {
        if (!this.active) return false;
        this.clickRetry(ev);
        if(this.engine.exploreMode) return;
        this.clickBack(ev);
        this.clickNext(ev);
        return true;
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.engine.mainMenu.active = true;
        }
    }

    clickRetry(ev) {
        if (this.retry.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.won = false;
            this.engine.level.reset();
            this.engine.levelStartMenu.active = true;
        }
    }

    clickNext(ev) {
        if (this.next.clickable && this.next.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.engine.level.nextLevel();
            this.engine.levelStartMenu.active = true;
        }
    }
}