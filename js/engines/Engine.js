"use strict";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;

class Engine {

    constructor(ctx) {
        this.ctx = ctx;
        //canvas control
        this.keysPressed = {};
        this.level = new Level(ctx);
        this.startAnim();
        this.total_time = 0;
    }

    startAnim() {
        this.level.draw();
        this.animLoop(0);
    }

    animLoop(total_time) {
        let me = this;
        const al = function (total_time) {
            me.animLoop(total_time);
        };
        window.requestAnimationFrame(al);
        this.render(total_time);
    }

    render() {
        const cw = this.ctx.canvas.width;
        const ch = this.ctx.canvas.height;

        //apagar canvas
        this.ctx.clearRect(0, 0, cw, ch);
        this.level.draw();
    }

}