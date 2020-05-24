"use strict";

const IMG_JUMP = "resources/menus/shop/jump.png";
const IMG_DOUBLE = "resources/menus/shop/double_jump.png";
const IMG_LOCKPICK = "resources/menus/shop/lockpick.png";
const IMG_RANGED = "resources/menus/shop/ranged.png";
const IMG_RANGED2 = "resources/menus/shop/ranged2.png";
const IMG_PORTAL = "resources/components/portal.png";
const MAX_RANGE_SPEED = 5;


class ShopMenu {

    constructor(engine) {
        this.engine = engine;
        this.active = false;
        this.background = new MenuComponent(engine.ctx.canvas.width / 2 - 200, engine.ctx.canvas.height / 2 - 200, 400, 400, IMG_BKG, false);
        this.back = new MenuComponent(engine.ctx.canvas.width / 2 - 45, engine.ctx.canvas.height - 100, 90, 40, IMG_BACK, true);
        this.jump = new ShopSkill(engine.ctx.canvas.width / 2 - 30, engine.ctx.canvas.height - 380, 60, 60, IMG_JUMP, true, this.engine.user.canJump, 1);
        this.double = new ShopSkill(engine.ctx.canvas.width / 2 - 30, engine.ctx.canvas.height - 300, 60, 60, IMG_DOUBLE, true, this.engine.user.canDouble, 200);
        this.lockpick = new ShopSkill(engine.ctx.canvas.width / 2 - 150, engine.ctx.canvas.height - 300, 60, 60, IMG_LOCKPICK, true, this.engine.user.canLockpick, 500);
        this.ranged = new ShopSkill(engine.ctx.canvas.width / 2 + 70, engine.ctx.canvas.height - 380, 100, 60, IMG_RANGED, true, this.engine.user.canRange, 400);
        this.portal = new ShopSkill(engine.ctx.canvas.width / 2 - 150, engine.ctx.canvas.height - 380, 60, 60, IMG_PORTAL, true, this.engine.user.canPort, 200);
        this.ranged2 = new ShopSkill(engine.ctx.canvas.width / 2 + 70, engine.ctx.canvas.height - 300, 100, 60, IMG_RANGED2, true, this.engine.user.canRange === MAX_RANGE_SPEED, 1000 - this.ranged.cost);
        this.price = "";
        let me = this;
        let moveHandler = function (ev) {
            me.checkPrices(ev);
        }
        this.engine.ctx.canvas.addEventListener("mousemove", moveHandler);
    }

    draw(ctx) {
        if (!this.active) return;
        this.background.draw(ctx);
        this.back.draw(ctx);
        this.jump.draw(ctx);
        this.double.draw(ctx);
        this.lockpick.draw(ctx);
        this.ranged.draw(ctx);
        this.portal.draw(ctx);
        this.ranged2.draw(ctx);
        ctx.font = "32px Audiowide";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Money: " + this.engine.user.money, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 + 40);
        ctx.fillStyle = "blue"
        ctx.fillText("Ability cost: " + this.price, this.engine.ctx.canvas.width / 2, this.engine.ctx.canvas.height / 2 + 80);
    }

    clickSprite(ev) {
        if (!this.active) return false;
        this.clickBack(ev);
        this.clickJump(ev);
        this.clickDouble(ev);
        this.clickLockpick(ev);
        this.clickRanged2(ev);
        this.clickPortal(ev);
        this.clickRanged(ev);
        return true;
    }

    clickBack(ev) {
        if (this.back.mouseOverBoundingBox(ev)) {
            this.active = false;
            this.engine.mainMenu.active = true;
        }
    }

    clickJump(ev) {
        if (!this.jump.isBought && this.engine.user.money >= this.jump.cost && this.jump.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.jump.cost;
            this.jump.isBought = true;
            this.engine.user.canJump = true;
        }
    }

    clickDouble(ev) {
        if (!this.double.isBought && this.engine.user.money >= this.double.cost && this.double.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.double.cost;
            this.double.isBought = true;
            this.engine.user.canDouble = true;
        }
    }

    clickLockpick(ev) {
        if (!this.lockpick.isBought && this.engine.user.money >= this.lockpick.cost && this.lockpick.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.lockpick.cost;
            this.lockpick.isBought = true;
            this.engine.user.canLockpick = true;
        }
    }

    clickRanged(ev) {
        if (!this.ranged.isBought && this.engine.user.money >= this.ranged.cost && this.ranged.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.ranged.cost;
            this.ranged.isBought = true;
            this.engine.user.canRange = 1;
            this.ranged2.cost -= this.ranged.cost;
        }
    }

    clickPortal(ev) {
        if (!this.portal.isBought && this.engine.user.money >= this.portal.cost && this.portal.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.portal.cost;
            this.portal.isBought = true;
            this.engine.user.canPort = true;
        }
    }

    clickRanged2(ev) {
        if (this.ranged.isBought && !this.ranged2.isBought && this.engine.user.money >= this.ranged2.cost && this.ranged2.mouseOverBoundingBox(ev)) {
            this.engine.user.money -= this.ranged2.cost;
            this.ranged2.isBought = true;
            this.engine.user.canRange = MAX_RANGE_SPEED;
        }
    }

    checkPrices(ev) {
        if (!this.active) return;
        for (let field in this) {
            if (this[field] instanceof ShopSkill && this[field].mouseOverBoundingBox(ev)) {
                if (this[field].isBought)
                    this.price = 0;
                else
                    this.price = this[field].cost;
                return;
            }
        }
        this.price = "";
    }

}