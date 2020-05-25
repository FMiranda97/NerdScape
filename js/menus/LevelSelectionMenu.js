"use strict";

const IMG_BOX = "resources/menus/levelbox.png";
const IMG_CROSS = "resources/menus/cross.png";
const LEVELS_PER_LINE = 5;
const N_LINES = 3;

class LevelSelectionMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = false;
        this.background = new MenuComponent(0, 0, engine.ctx.canvas.width, engine.ctx.canvas.height, IMG_BKG, false);
        this.back = new MenuComponent(engine.ctx.canvas.width/2-30, engine.ctx.canvas.height - 45, 60, 30, IMG_BACK, true);
        this.levelBoxes = [];
        let spacingx = (engine.ctx.canvas.width - 75)/LEVELS_PER_LINE;
        let spacingy = (engine.ctx.canvas.height - 75)/N_LINES;
        for (let j = 0; j < N_LINES; j++) {
            for (let i = 0; i < LEVELS_PER_LINE; i++) {
                let newBox = new MenuComponent(75 + spacingx * i, 50 + spacingy * j, 75, 75 , IMG_BOX, true);
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
        ctx.font = "24px Audiowide";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        for (let i = 0; i < LEVELS_PER_LINE * N_LINES; i++) {
            this.levelBoxes[i].draw(ctx);
            ctx.fillText(String(i + 1), this.levelBoxes[i].x + this.levelBoxes[i].width / 2, this.levelBoxes[i].y + this.levelBoxes[i].height / 2 + 8);
            if (i+1 > this.engine.user.maxLevel || i+1 > MAX_LEVEL) ctx.drawImage(this.cross, this.levelBoxes[i].x + this.levelBoxes[i].width/2 - 25, this.levelBoxes[i].y + this.levelBoxes[i].height/2 - 25, 50, 50);
        }
    }

    clickSprite(ev) {
        if (!this.active) return false;
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
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.level.generatePreset(i+1);
            this.engine.levelStartMenu.active = true;
        }
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev)) {
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.mainMenu.active = true;
        }
    }
}