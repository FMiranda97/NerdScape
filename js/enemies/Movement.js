"use strict";

class Movement {

    constructor(Sx, Sy, Ax, Ay, t, freq) {
        this.currt = 0;
        this.actiont = 0;
        if (Sx === undefined) {
            this.iSx = 0;
            this.iSy = 0;
            this.Ax = 0;
            this.Ay = 0;
            this.t = 0;
            this.freq = 0;
            return;
        }
        if (Sy === undefined) {
            this.constructWithString(Sx);
            return;
        }
        this.iSx = Sx;
        this.iSy = Sy;
        this.Ax = Ax;
        this.Ay = Ay;
        this.t = t;
        this.freq = freq;
    }

    constructWithString(str) {
        let index = 0;
        str = str.split("|");
        this.iSx = parseFloat(str[index++].split(":")[1]);
        this.iSy = parseFloat(str[index++].split(":")[1]);
        this.Ax = parseFloat(str[index++].split(":")[1]);
        this.Ay = parseFloat(str[index++].split(":")[1]);
        this.t = parseInt(str[index++].split(":")[1]);
        this.freq = parseFloat(str[index++].split(":")[1]);
        return index;
    }

    execute(enemy, time_diff, difficulty, player, sfxLightShot) {
        //initial conditions
        if (this.currt === 0) {
            this.Sx = this.iSx;
            this.Sy = this.iSy;
        }
        //decide if should do action
        if(this.freq > 0){
            if(this.actiont === 0) {
                enemy.doAction(player);
                sfxLightShot.play();
            }
            this.actiont += time_diff * difficulty;
            let T = 1000/this.freq;
            if(this.actiont > T) this.actiont = 0;
        }
        //define movements
        this.currt += time_diff * difficulty;
        enemy.x += this.Sx * difficulty;
        enemy.y += this.Sy * difficulty;
        this.Sx += this.Ax;
        this.Sy += this.Ay;
        //decide if movement is over and should go to next
        if (this.currt >= this.t) {
            this.currt = 0;
            this.actiont = 0;
            return true;
        }
        return false;
    }

    setiSx(value) {
        this.iSx = value;
    }

    setiSy(value) {
        this.iSy = value;
    }

    setAx(value) {
        this.Ax = value;
    }

    setAy(value) {
        this.Ay = value;
    }

    setT(value) {
        this.t = value;
    }

    setFreq(value) {
        this.freq = value;
    }

    toString() {
        return "\niSx:" + this.iSx + "|iSy:" + this.iSy + "|Ax:" + this.Ax + "|Ay:" + this.Ay + "|t:" + this.t + "|freq:" + this.freq;
    }
}