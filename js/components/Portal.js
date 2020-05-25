"use strict";

class Portal extends Component{

    constructor(x, y, w, h, image, id, destination_id) {
        if (y === undefined) {
            super();
            this.constructWithString(x);
            this.imageData = this.getPixelData();
        }else{
            super(x, y, w, h, image);
            this.id = id;
            if(destination_id !== undefined)
                this.destination_id = destination_id;
            else this.destination_id = this.id;
        }
    }

    constructWithString(str) {
        let index = super.constructWithString(str);
        str = str.split("|");
        this.id = parseInt(str[index++].split(":")[1]);
        this.destination_id = parseInt(str[index++].split(":")[1]);
    }

    toString() {
        let str = super.toString() + "|";
        str += "id:" + this.id + "|";
        str += "destination_id:" + this.destination_id;
        return str;
    }

    port(target, sfx){
        //align portal and player mass centers
        sfx.play();
        target.x = this.x + this.width/2 - target.width/2;
        target.y = this.y + this.height/2 - target.height/2;
    }
}