"use strict";

class Enemy extends Component {

    constructor(x, y, w, h, img) {
        super(x, y, w, h, img);
        this.movements = [];
        this.time = 0;
        this.currMove = 0;
        this.shouldMove = false;
        this.movedBack = false;
        this.active = true;
    }

    update(total_time, difficulty, player, sfxLightShot) {
        if (this.shouldMove && this.movements.length > 0) {
            let isOver = this.movements[this.currMove].execute(this, total_time - this.time, difficulty, player, sfxLightShot);
            if(this.movements[this.currMove].Sx < 0) this.movedBack = true;
            else if(this.movements[this.currMove].Sx > 0) this.movedBack = false;
            if (isOver)
                this.currMove = (this.currMove + 1) % this.movements.length;
        }
        this.time = total_time;
    }

    reset() {
        super.reset();
        this.active = true;
        if(this.movements.length > 0){
            this.movements[this.currMove].currt = 0;
            this.currMove = 0;
        }
    }

    toString() {
        let str = super.toString();
        str += "|moves:" + this.movements.length;
        for(let i = 0; i < this.movements.length; i++){
            str += this.movements[i].toString();
        }
        return str;
    }

    doAction(){
        //do nothing
    }

    draw(ctx) {
        if(!this.active) return;
        if(this.movedBack){
            ctx.save();
            ctx.scale(-1,1);
            this.width = -this.width;
            this.x = -this.x;
            super.draw(ctx);
            this.width = -this.width;
            this.x = - this.x;
            ctx.scale(1,1);
            ctx.restore();
        }else{
            super.draw(ctx);
        }
    }
}