"use strict";

const PROJECTILE_IMG = "resources/enemies/light_ball.png";
const PROJECTILE_DARK_IMG = "resources/components/dark_orb.png";
const PROJECTILE_SPEED = 3;
const PROJECTILE_RATIO = 3;

class Projectile extends Component {
    constructor(x, y, w, h, img, sprite_or_angle_or_Sx, Sy) {
        super(x + w / 2, y + h / 2, w / PROJECTILE_RATIO, h / PROJECTILE_RATIO, img);
        let alfa;
        if(Sy !== undefined){
            this.Sx = sprite_or_angle_or_Sx;
            this.Sy = Sy;
        }else if (typeof sprite_or_angle_or_Sx === "object") {
            let varx = sprite_or_angle_or_Sx.x - this.x;
            let vary = sprite_or_angle_or_Sx.y - this.y;
            if (vary === 0) {
                if (varx > 0) alfa = 0;
                else alfa = Math.PI;
            } else {
                alfa = Math.atan(varx / vary);
            }
            this.Sx = Math.abs(Math.sin(alfa) * PROJECTILE_SPEED);
            this.Sx = varx > 0 ? this.Sx : -this.Sx;
            this.Sy = Math.abs(Math.cos(alfa) * PROJECTILE_SPEED);
            this.Sy = vary > 0 ? this.Sy : -this.Sy;
        } else if (typeof sprite_or_angle_or_Sx === "number") {
            alfa = sprite_or_angle_or_Sx * Math.PI * 2 / 360;
            this.Sx = Math.cos(alfa) * PROJECTILE_SPEED;
            this.Sy = Math.sin(alfa) * PROJECTILE_SPEED;
        } else {
            alfa = Math.random() * Math.PI * 2;
            this.Sx = Math.abs(Math.sin(alfa) * PROJECTILE_SPEED);
            this.Sy = Math.abs(Math.cos(alfa) * PROJECTILE_SPEED);
            this.Sx = Math.random() > 0.5 ? this.Sx : -this.Sx;
            this.Sy = Math.random() > 0.5 ? this.Sy : -this.Sy;
        }
    }

    update(difficulty) {//return true if should delete
        this.x += this.Sx * difficulty;
        this.y += this.Sy * difficulty;
        return this.x < 0 || this.x > CANVAS_WIDTH && this.y < 0 || this.y > CANVAS_HEIGHT;
    }
}