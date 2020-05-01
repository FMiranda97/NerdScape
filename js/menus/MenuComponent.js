"use strict";


class MenuComponent extends Component{
    constructor(x, y, w, h, img, clickable) {
        super(x, y, w, h, img);
        this.clickable = clickable;
        if(clickable === undefined) this.clickable = true;
    }
}