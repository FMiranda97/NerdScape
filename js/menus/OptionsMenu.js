"use strict";

const IMG_TICKBOX = "resources/menus/tick_box.png";
const IMG_TICK = "resources/menus/check_mark.png";
const IMG_SLIDER1 = "resources/menus/music.png";
const IMG_SLIDER2 = "resources/menus/audio.png";
const SLIDER_X_MIN = 250;
const SLIDER_LEN = 300;
const SLIDER_WIDTH = 30;

class OptionsMenu {

    constructor(engine) {
        this.callerMenu = null;
        this.engine = engine;
        this.active = false;
        this.background = new MenuComponent(engine.ctx.canvas.width/2-200, engine.ctx.canvas.height/2-200, 400, 400, IMG_BKG, false);
        this.easy = new MenuComponent(engine.ctx.canvas.width/2-125, engine.ctx.canvas.height/2-100, 50, 50, IMG_TICKBOX, this.engine.user.difficulty === 1);
        this.medium = new MenuComponent(engine.ctx.canvas.width/2-25, engine.ctx.canvas.height/2-100, 50, 50, IMG_TICKBOX, this.engine.user.difficulty === 2);
        this.hard = new MenuComponent(engine.ctx.canvas.width/2+75, engine.ctx.canvas.height/2-100, 50, 50, IMG_TICKBOX, this.engine.user.difficulty === 3);
        this.back = new MenuComponent(engine.ctx.canvas.width/2-45, engine.ctx.canvas.height - 100, 90, 40, IMG_BACK, true);
        this.tick = new Image();
        this.tick.src = IMG_TICK;
        //create sliders
        this.musicSlider = new MenuComponent(250 - SLIDER_WIDTH/2, 250-15, SLIDER_WIDTH, 30, IMG_SLIDER1, true);
        this.sfxSlider = new MenuComponent(250 - SLIDER_WIDTH/2 + SLIDER_LEN*this.engine.user.sfxVolume, 300-15, SLIDER_WIDTH, 30, IMG_SLIDER2, true);
        let me = this;
        let mouseHandler = function(ev){
            me.moveSlider(ev);
        };
        this.engine.ctx.canvas.addEventListener("mousedown", mouseHandler);
        this.engine.ctx.canvas.addEventListener("mouseup", mouseHandler);
        this.engine.ctx.canvas.addEventListener("mousemove", mouseHandler);
        this.selectedSlider = null;
    }

    draw(ctx){
        if(!this.active) return;
        //draw sprites
        this.background.draw(ctx);
        this.back.draw(ctx);
        this.easy.draw(ctx);
        this.medium.draw(ctx);
        this.hard.draw(ctx);
        //draw labels
        ctx.font = "24px Audiowide";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText("Easy", this.easy.x + this.easy.width / 2, this.easy.y + this.easy.height / 2 - 32);
        ctx.fillText("Medium", this.medium.x + this.medium.width / 2, this.medium.y + this.medium.height / 2 - 32);
        ctx.fillText("Hard", this.hard.x + this.hard.width / 2, this.hard.y + this.hard.height / 2 - 32);
        //draw selected difficulty
        let dif_x = this.engine.ctx.canvas.width/2-225 + 100* this.engine.user.difficulty;
        ctx.drawImage(this.tick, dif_x, this.easy.y + this.easy.height/2 - 25, 50, 50);
        //draw sliders
        this.drawSlider(ctx, this.musicSlider);
        this.drawSlider(ctx, this.sfxSlider);
    }

    drawSlider(ctx, slider){
        let label_text;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(SLIDER_X_MIN, slider.y+15);
        if(slider === this.musicSlider) {
            ctx.lineTo(SLIDER_X_MIN + SLIDER_LEN*this.engine.music.volume, slider.y+15);
            label_text = "Music Volume";
        }
        else {
            ctx.lineTo(SLIDER_X_MIN + SLIDER_LEN*this.engine.user.sfxVolume, slider.y+15);
            label_text = "SFX Volume";
        }
        ctx.stroke();
        ctx.strokeStyle = "gold";
        ctx.strokeRect(SLIDER_X_MIN, slider.y - 5 + 15, SLIDER_LEN, 10);
        slider.draw(ctx);
        //draw labels
        ctx.font = "24px Audiowide";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText(label_text, ctx.canvas.width/2, slider.y);
    }

    clickSprite(ev){
        if(!this.active) return false;
        this.clickBack(ev);
        this.clickDifficulty(ev);
        this.engine.saveGame();
        return true;
    }

    clickDifficulty(ev) {
        if (this.easy.mouseOverBoundingBox(ev) && this.easy.clickable) {
            this.engine.user.difficulty = 1;
        }
        if (this.medium.mouseOverBoundingBox(ev) && this.medium.clickable) {
            this.engine.user.difficulty = 2;
        }
        if (this.hard.mouseOverBoundingBox(ev) && this.hard.clickable) {
            this.engine.user.difficulty = 3;
        }
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.callerMenu.active = true;
            this.easy.clickable = false;
            this.medium.clickable = false;
            this.hard.clickable = false;
        }
    }

    moveSlider(ev){
        if(!this.active) return;
        if(ev.type === "mousedown"){
            if(this.musicSlider.mouseOverBoundingBox(ev)) {
                this.selectedSlider = this.musicSlider;
                this.engine.music.play();}
            if(this.sfxSlider.mouseOverBoundingBox(ev)) this.selectedSlider = this.sfxSlider;
        }else if(ev.type === "mouseup"){
            this.selectedSlider = null;
        }else if(ev.type === "mousemove"){
            let x = ev.offsetX - SLIDER_X_MIN;
            if(x < 0) x = 0;
            if(x > SLIDER_LEN) x = SLIDER_LEN;
            if(this.selectedSlider === this.musicSlider){
                this.engine.music.volume = x/SLIDER_LEN;
                this.musicSlider.x = SLIDER_X_MIN + SLIDER_LEN * this.engine.music.volume - SLIDER_WIDTH/2;
            }else if(this.selectedSlider === this.sfxSlider){
                this.engine.user.sfxVolume = x/SLIDER_LEN;
                this.sfxSlider.x = SLIDER_X_MIN + SLIDER_LEN * this.engine.user.sfxVolume - SLIDER_WIDTH/2;
            }
        }
    }
}