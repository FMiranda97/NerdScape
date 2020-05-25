"use strict";

const IMG_BKG = "resources/menus/menu_background.png";
const IMG_OPTIONS = "resources/menus/options.png";
const IMG_START = "resources/menus/start.png";
const IMG_SAVE = "resources/menus/save.png";
const IMG_NEW = "resources/menus/newGame.png";
const IMG_SHOP = "resources/menus/shop/shop.png";

class MainMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = true;
        this.background = new MenuComponent(0, 0, engine.ctx.canvas.width, engine.ctx.canvas.height, IMG_BKG, false);
        this.options = new MenuComponent(engine.ctx.canvas.width/3 - 25, engine.ctx.canvas.height/2-25, 50, 50, IMG_OPTIONS, true);
        this.play = new MenuComponent(engine.ctx.canvas.width/2-50, engine.ctx.canvas.height/2-25, 100, 50, IMG_START, true);
        this.save = new MenuComponent(2*engine.ctx.canvas.width/3 - 25, engine.ctx.canvas.height/2-25, 50, 50, IMG_SAVE, true);
        this.newGame = new MenuComponent(engine.ctx.canvas.width/2 -75, engine.ctx.canvas.height/2+50, 150, 50, IMG_NEW, true);
        this.shop = new MenuComponent(engine.ctx.canvas.width/2 - 50, engine.ctx.canvas.height/2-100, 100, 50, IMG_SHOP, true);
    }

    draw(ctx){
        if(!this.active) return;
        this.background.draw(ctx);
        this.options.draw(ctx);
        this.play.draw(ctx);
        this.save.draw(ctx);
        this.newGame.draw(ctx);
        this.shop.draw(ctx);
    }

    clickSprite(ev){
        if(!this.active) return false;
        this.clickStart(ev);
        this.clickOptions(ev);
        this.clickSave(ev);
        this.clickNew(ev);
        this.clickShop(ev);
        return true;
    }

    clickStart(ev){
        if(this.play.mouseOverBoundingBox(ev)){
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.levelSelectionMenu.active = true;
        }
    }

    clickOptions(ev){
        if(this.options.mouseOverBoundingBox(ev)){
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.optionsMenu.active = true;
            this.engine.optionsMenu.easy.clickable = true;
            this.engine.optionsMenu.medium.clickable = true;
            this.engine.optionsMenu.hard.clickable = true;
            this.engine.optionsMenu.callerMenu = this;
        }
    }

    clickSave(ev){
        if(this.save.mouseOverBoundingBox(ev)){
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.engine.saveGame();
        }
    }

    clickNew(ev){
        if(this.newGame.mouseOverBoundingBox(ev)){
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.engine.user = new User();
            this.engine.optionsMenu = new OptionsMenu(this.engine);
            this.engine.shopMenu = new ShopMenu(this.engine);
        }
    }

    clickShop(ev){
        if(this.shop.mouseOverBoundingBox(ev)){
            this.engine.sfxMenu.currentTime = 0;
            this.engine.sfxMenu.play();
            this.active = false;
            this.engine.shopMenu.active = true;
        }
    }
}