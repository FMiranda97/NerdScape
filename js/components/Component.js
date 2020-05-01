"use strict";

const NO_INTERSECT = 0;
const HORIZ_INTERSECT = 1;
const VERT_INTERSECT = 2;
const ALL_INTERSECT = 3;

class Component {
    constructor(x, y, w, h, img) {
        if (x === undefined)
            return;
        if (y === undefined) {
            this.constructWithString(x);
            this.imageData = this.getPixelData();
            return;
        }

        this.xIni = x;
        this.yIni = y;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        if (typeof img === "string") {
            let image = new Image();
            image.src = img;
            this.image = image;
        } else this.image = img;
        this.imageData = this.getPixelData();
    }

    constructWithString(str) {
        let index = 0;
        str = str.split("|");
        this.xIni = parseInt(str[index++].split(":")[1]);
        this.yIni = parseInt(str[index++].split(":")[1]);
        this.x = this.xIni;
        this.y = this.yIni;
        this.width = parseInt(str[index++].split(":")[1]);
        this.height = parseInt(str[index++].split(":")[1]);
        this.image = new Image();
        this.image.src = str[index++].split(":")[1];
        return index;
    }

    intersects(target) {
        let limA = this.getLimits();
        let limB = target.getLimits();
        if (this.intersectsBoundingBox(target, limA, limB)) {
            //obter coordenadas de retangulo de intersecao
            let Esquerdo = Math.round(Math.max(limA[0], limB[0]));
            let Direito = Math.round(Math.min(limA[1], limB[1]));
            let Topo = Math.round(Math.max(limA[2], limB[2]));
            let Fundo = Math.round(Math.min(limA[3], limB[3]));
            //get pixels of intersection rectangle for each image
            let thisPx = this.imageData;
            let targetPx = target.imageData;
            //check if pixel's alpha component is not null for 2 correspondent pixels
            for (let i = Esquerdo; i <= Direito; i++) {
                for (let j = Topo; j <=  Fundo; j++) {
                    let pixels1 = (j - Math.round(this.y)) * Math.round(this.width) + (i - Math.round(this.x));
                    // noinspection JSUnresolvedVariable
                    if((this instanceof Player || this instanceof Enemy) && this.movedBack) pixels1 = (j - Math.round(this.y)) * Math.round(this.width) + (this.width - i - Math.round(this.x));
                    let pixels2 = (j - Math.round(target.y)) * Math.round(target.width) + (i - Math.round(target.x));
                    if (thisPx[pixels1 * 4 + 3] > 0 && targetPx[pixels2 * 4 + 3] > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getPixelData() {
        //draw image on an offscreen canvas, and grabs pixels of area defined by the arguments
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        context.drawImage(this.image, 0, 0, Math.round(this.width), Math.round(this.height));
        let Px = context.getImageData(0, 0, Math.round(this.width), Math.round(this.height)).data;
        canvas.remove();
        return Px;
    }

    intersectsBoundingBox(target, limA = this.getLimits(), limB = target.getLimits()) {
        return limA[0] < limB[1] && limB[0] < limA[1] && limA[2] < limB[3] && limB[2] < limA[3];
    }

    getLimits() {
        return [this.x, this.x + this.width, this.y, this.y + this.height];
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    reset() {
        this.x = this.xIni;
        this.y = this.yIni;
    }

    updateDimensions(keysPressed) {
        let updated = false;
        if (keysPressed["w"] || keysPressed["ArrowUp"]) {
            this.height *= 10 / 9;
            updated = true;
        }
        if (keysPressed["a"] || keysPressed["ArrowLeft"]) {
            this.width *= 0.9;
            updated = true;
        }
        if (keysPressed["s"] || keysPressed["ArrowDown"]) {
            this.height *= 0.9;
            updated = true;
        }
        if (keysPressed["d"] || keysPressed["ArrowRight"]) {
            this.width *= 10 / 9;
            updated = true;
        }
        return updated;
    }

    intersectsCanvas(dx, dy, cw, ch) {
        //can't intersect more than 2 sides at the same time
        let intersect = NO_INTERSECT;
        if (dy < 0) {
            let px = this.getPixelData(0, 0, this.width, -dy);
            for (let i = 3; i < px.length; i += 4) if (px[i] > 0) {
                intersect += VERT_INTERSECT;
                break;
            }
        }
        if (dx < 0) {
            let px = this.getPixelData(0, 0, -dx, this.height);
            for (let i = 3; i < px.length; i += 4) if (px[i] > 0) {
                intersect += HORIZ_INTERSECT;
                break;
            }
        }
        if (dy > ch - this.height) {
            let px = this.getPixelData(0, ch - dy, this.width, this.height - (ch - dy));
            for (let i = 3; i < px.length; i += 4) if (px[i] > 0) {
                intersect += VERT_INTERSECT;
                break;
            }
        }
        if (dx > cw - this.width) {
            let px = this.getPixelData(cw - dx, 0, this.width - (cw - dx), this.height);
            for (let i = 3; i < px.length; i += 4) if (px[i] > 0) {
                intersect += HORIZ_INTERSECT;
                break;
            }
        }
        return intersect;
    }

    updatePosition(cw, ch, speedX, speedY) {
        //update xAxis
        const desired_coordinatex = this.x + speedX;
        const desired_coordinatey = this.y + speedY;
        const collides = this.intersectsCanvas(desired_coordinatex, desired_coordinatey, cw, ch);
        if (!collides) {
            this.x = desired_coordinatex;
            this.xIni = this.x;
            this.yIni = this.y;
            this.y = desired_coordinatey;
        }
    }

    mouseOverBoundingBox(ev) {//ev.target é a canvas
        const mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
        const my = ev.offsetY;

        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

    mouseOver(ev) {
        if (this.mouseOverBoundingBox(ev)) {
            let Px = (ev.offsetX - Math.round(this.x)) + (ev.offsetY - Math.round(this.y)) * Math.round(this.width);
            return this.imageData[Px * 4 + 3] > 0; //check if alpha component bigger than 0
        }
        return false;
    }

    toString() {
        let str = "";
        str += "x:" + this.x + "|";
        str += "y:" + this.y + "|";
        str += "w:" + this.width + "|";
        str += "h:" + this.height + "|";
        let src = this.image.src.split("/");
        src = src[src.length - 3] + "/" + src[src.length - 2] + "/" + src[src.length - 1];
        str += "src:" + src;
        return str;
    }
}