"use strict";

const JUMP_SPEED = -0.24 / 1.7; //allows jumping his height

const GRAVITY_RELATION = 9.81 / 1000 / 1.70; //consider g = 9.81m/s^2 and a human of size 1.70m, /1000 to convert seconds to ms

const INSIDE = 0;
const LEFT = 1;
const RIGHT = 10;
const ABOVE = 100;
const BELOW = 1000;

class Player extends Component {

    constructor(x, y, w, h, image) {
        super(x, y, w, h, image);
        this.jumpFramesWindow = 0;
        this.Sx = 0;
        this.Sy = 0;
        this.defaultSx = this.height / 12.5;
        this.movedBack = false;
        this.hasJumped = false;
        this.hasDoubled = false;
        this.projectle_img = new Image();
        this.projectle_img.src = PROJECTILE_DARK_IMG;
        this.shots = [];
    }

    updateSpeed(keysPressed, user) {
        this.Sx = 0;
        if (keysPressed["w"] || keysPressed["ArrowUp"]) {
            //jump has a 5 frame window to occur
            if (this.hasJumped && !this.hasDoubled && user.canDouble) {
                this.Sy = JUMP_SPEED * this.height;
                this.hasDoubled = true;
            } else if (!this.hasJumped && user.canJump) this.jumpFramesWindow = 5;
        }
        if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
            this.Sx += -this.defaultSx;
        }
        if (keysPressed["d"] || keysPressed["ArrowRight"]) {
            this.Sx += this.defaultSx;
        }
    }

    update(user, staticSprites, canvas, enemySprites){
        this.updatePosition(user, staticSprites, canvas);
        this.updateShots(user, canvas, enemySprites);
    }

    updateShots(user){
        for (let i = 0; i < this.shots.length; i++) {
            let me = this;
            if (this.shots[i].update(user.difficulty))
                this.shots = this.shots.filter(function (value) {return value !== me.shots[i];});
        }
    }

    updatePosition(user, staticSprites, canvas, call_super) {
        if(call_super !== undefined){
            super.updatePosition(user, staticSprites, canvas, call_super);
            return;
        }
        if(this.Sx < 0) this.movedBack = true;
        else if(this.Sx > 0) this.movedBack = false;
        let canL = true, canR = true, canD = true, canU = true;
        for (let i = 0; i < staticSprites.length; i++) {
            if (this.intersects(staticSprites[i])) {
                let relativePosition = this.getRelativePosition(staticSprites[i]);
                if (relativePosition % 10)
                    canR = false;
                if (Math.round(relativePosition / 10) % 10)
                    canL = false;
                if (Math.round(relativePosition / 100) % 10)
                    canD = false;
                if (Math.round(relativePosition / 1000) % 10)
                    canU = false;
            }
        }
        let canvasIntersect = this.intersectsCanvas(this.x + this.Sx, this.y + this.Sy, canvas.width, canvas.height);
        if ((this.Sx > 0 && canR || this.Sx < 0 && canL) && canvasIntersect !== HORIZ_INTERSECT && canvasIntersect !== ALL_INTERSECT) {
            this.x += this.Sx;
        }
        if (this.Sy > 0 && canD || this.Sy < 0 && canU) {
            this.y += this.Sy;
        }
        if (canD) {
            this.Sy += GRAVITY_RELATION * this.height;
            this.jumpFramesWindow = 0;
        }
        if (this.jumpFramesWindow === 5 && (user.canJump && !canD && !this.hasJumped || user.canDouble && this.hasJumped && !this.hasDoubled)) {
            this.Sy = JUMP_SPEED * this.height;
            if (!this.hasJumped)
                this.hasJumped = true;
            else
                this.hasDoubled = true;
        } else if (!canD && !this.jumpFramesWindow) {
            this.Sy = 0;
            this.hasJumped = false;
            this.hasDoubled = false;
        }
        if (this.jumpFramesWindow > 0)
            this.jumpFramesWindow--;
    }

    getCenterY() {
        return this.y + this.height / 2;
    }

    getCenterX() {
        return this.x + this.width / 2;
    }

    getRelativePosition(target) {
        let lim = target.getLimits();
        let pos = INSIDE;

        if (this.getCenterX() + this.width/3 < lim[0]) {
            pos += LEFT;
        } else if (this.getCenterX() - this.width/3 > lim[1]) {
            pos += RIGHT;
        }else if (this.getCenterY() < lim[2]) {
            pos += ABOVE;
        } else if (this.getCenterY() > lim[3]) {
            pos += BELOW;
        }
        return pos;
    }

    reset() {
        super.reset();
        this.jumpFramesWindow = 0;
        this.Sx = 0;
        this.Sy = 0;
        this.shots = [];
    }

    draw(ctx) {
        if (this.movedBack) {
            ctx.save();
            ctx.scale(-1, 1);
            //draw player
            this.width = -this.width;
            this.x = -this.x;
            super.draw(ctx);
            this.width = -this.width;
            this.x = -this.x;
            ctx.scale(1, 1);
            ctx.restore();
        } else {
            super.draw(ctx);
        }
        for (let p of this.shots){
            p.draw(ctx);
        }
    }

    shoot(ev, user){
        let varx = -this.x + ev.offsetX;
        let vary = -this.y + ev.offsetY;
        let angle = Math.atan(varx / vary);
        let Sx = Math.abs(Math.sin(angle) * PROJECTILE_SPEED * user.canRange);
        Sx = varx > 0 ? Sx : -Sx;
        let Sy = Math.abs(Math.cos(angle) * PROJECTILE_SPEED * user.canRange);
        Sy = vary > 0 ? Sy : -Sy;
        let p = new Projectile(this.x, this.y, this.width, this.height, this.projectle_img, Sx, Sy);
        this.shots.push(p);
    }
}