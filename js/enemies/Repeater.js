"use strict";

class Repeater extends Enemy {

    constructor(x, y, w, h, img, angle) {
        let string_angle;
        if(y === undefined){
            string_angle = x.split("|")[0];
            x = x.slice(string_angle.length+1, x.length);
            super(x);
            this.angle = parseInt(string_angle);
        }else{
            super(x, y, w, h, img);
            this.angle = angle;
        }
        this.shots = [];
        this.projectle_img = new Image();
        this.projectle_img.src = PROJECTILE_IMG;
    }

    doAction() {
        this.shots.push(new Projectile(this.x, this.y, this.width, this.height, this.projectle_img, this.angle));
    }

    update(total_time, difficulty) {
        let me = this;
        super.update(total_time, difficulty);
        for (let i = 0; i < this.shots.length; i++) {
            if (this.shots[i].update(difficulty))
                this.shots = this.shots.filter(function (value) {
                    return value !== me.shots[i];
                });
        }
    }

    draw(ctx) {
        super.draw(ctx);
        for (let i = 0; i < this.shots.length; i++) {
            this.shots[i].draw(ctx);
        }
    }

    toString() {
        return "repeater:" + this.angle + "|" + super.toString();
    }

    reset() {
        super.reset();
        this.shots = [];
    }
}