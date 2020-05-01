"use strict";

const IMG_BOX = "resources/menus/levelbox.png";
const IMG_CROSS = "resources/menus/cross.png";
const LEVELS_PER_LINE = 10;
const N_LINES = 5;

class LevelSelectionMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = false;
        this.background = new MenuComponent(0, 0, engine.ctx.canvas.width, engine.ctx.canvas.height, IMG_BKG, false);
        this.back = new MenuComponent(engine.ctx.canvas.width/2-15, engine.ctx.canvas.height - 45, 30, 30, IMG_BACK, true);
        this.levelBoxes = [];
        for (let j = 0; j < N_LINES; j++) {
            for (let i = 0; i < LEVELS_PER_LINE; i++) {
                let newBox = new MenuComponent(40 + 75 * i, 50 + 75 * j, 50, 50, IMG_BOX, true);
                this.levelBoxes.push(newBox);
            }
        }
        this.cross = new Image();
        this.cross.src = IMG_CROSS;
    }

    draw(ctx) {
        if (!this.active) return;
        this.background.draw(ctx);
        this.back.draw(ctx);
        ctx.font = "24px Comic Sans MS";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        for (let i = 0; i < LEVELS_PER_LINE * N_LINES; i++) {
            this.levelBoxes[i].draw(ctx);
            ctx.fillText(i + 1, this.levelBoxes[i].x + this.levelBoxes[i].width / 2, this.levelBoxes[i].y + this.levelBoxes[i].height / 2 + 8);
            if (i+1 > this.engine.user.maxLevel || i+1 > MAX_LEVEL) ctx.drawImage(this.cross, this.levelBoxes[i].x + this.levelBoxes[i].width/2 - 25, this.levelBoxes[i].y + this.levelBoxes[i].height/2 - 25, 50, 50);
        }
    }

    clickSprite(ev) {
        if (!this.active) return false;
        //TODO
        this.clickBack(ev);
        this.clickLevel(ev);
        return true;
    }

    clickLevel(ev){
        let i;
        for (i = 0; i < LEVELS_PER_LINE * N_LINES; i++) {
            if(this.levelBoxes[i].mouseOverBoundingBox(ev)) break;
        }
        if(i+1 <= this.engine.user.maxLevel && i+1 <= MAX_LEVEL){
            this.active = false;
            this.engine.level.generatePreset(i+1);
            this.engine.levelStartMenu.active = true;
        }
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.engine.mainMenu.active = true;
        }
    }
}