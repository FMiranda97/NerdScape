"use strict";

class Flag extends Component{

    constructor(x, y, w, h, image, reward) {
        if (y === undefined) {
            super();
            this.constructWithString(x);
            this.imageData = this.getPixelData();
        }else{
            super(x, y, w, h, image);
            if(reward === undefined)
                this.basicReward = 100;
            else this.basicReward = reward;
        }
        this.reward = this.basicReward;
    }

    constructWithString(str) {
        let index = super.constructWithString(str);
        str = str.split("|");
        this.basicReward = parseInt(str[index++].split(":")[1]);
    }

    toString() {
        let str = super.toString();
        str += "|reward:" + this.basicReward;
        return str;
    }

    reset() {
        this.reward = this.basicReward;
    }
}