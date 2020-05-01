"use strict";


class Sniper extends Enemy {

    constructor(x, y, w, h, img) {
        super(x, y, w, h, img);
        this.shots = [];
        this.projectle_img = new Image();
        this.projectle_img.src = PROJECTILE_IMG;
    }

    doAction(player) {
        this.shots.push(new Projectile(this.x, this.y, this.width, this.height, this.projectle_img, player));
    }

    update(total_time, difficulty, player) {
        let me = this;
        super.update(total_time, difficulty, player);
        for (let i = 0; i < this.shots.length; i++) {
            if (this.shots[i].update(difficulty))
                this.shots = this.shots.filter(function (value) {return value !== me.shots[i];});
        }
    }

    draw(ctx) {
        super.draw(ctx);
        for (let i = 0; i < this.shots.length; i++) {
            this.shots[i].draw(ctx);
        }
    }

    toString() {
        return "sniper|" + super.toString();
    }

    reset() {
        super.reset();
        this.shots = [];
    }
}