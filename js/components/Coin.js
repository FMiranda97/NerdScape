"use strict";

class Coin extends Component{

    constructor(x, y, w, h, image, value) {
        if (y === undefined) {
            super();
            this.constructWithString(x);
            this.imageData = this.getPixelData();
        }else{
            super(x, y, w, h, image);
            if(value === undefined)
                this.value = 1;
            else this.value = value;
        }
        this.active = true;
    }

    reset() {
        super.reset();
        this.active = true;
    }

    collect(){
        if(this.active){
            this.active = false;
            return this.value;
        }else return 0;
    }

    draw(ctx) {
        if(this.active) super.draw(ctx);
    }

    constructWithString(str) {
        let index = super.constructWithString(str);
        str = str.split("|");
        this.value = parseInt(str[index++].split(":")[1]);
    }

    toString() {
        let str = super.toString() + "|";
        str += "value:" + this.value;
        return str;
    }
}