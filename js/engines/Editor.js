"use strict";

class Editor {

    // noinspection DuplicatedCode,DuplicatedCode
    constructor(engine) {
        this.engine = engine;
        this.editor = document.getElementById("Editor");
        this.enemyEditor = document.getElementById("enemyEditor");
        this.portalEditor = document.getElementById("portalEditor");
        this.flagEditor = document.getElementById("flagEditor");
        this.coinEditor = document.getElementById("coinEditor");
        this.removeBtn = document.getElementById("remove");
        this.x = document.getElementById("x");
        this.y = document.getElementById("y");
        this.w = document.getElementById("w");
        this.h = document.getElementById("h");
        this.angle_container = document.getElementById("angle_container");
        this.angle = document.getElementById("angle");
        this.dest_id = document.getElementById("dest_id");
        this.reward = document.getElementById("reward");
        this.value = document.getElementById("value");
        this.addBtn = document.getElementById("insertMovement");
        this.previewBtn = document.getElementById("previewMovement");
        this.movements = document.getElementById("movements");
        this.selectedSprite = null;
        let me = this;
        this.removeBtn.onclick = function () {
            if (me.selectedSprite instanceof Enemy) {
                me.engine.level.enemySprites = me.engine.level.enemySprites.filter(function (value) {
                    return value !== me.selectedSprite;
                });
            } else if (me.selectedSprite instanceof Flag) {
                me.engine.level.flagSprite = null;
            } else if (me.selectedSprite instanceof Portal) {
                me.engine.level.portalSprites = me.engine.level.portalSprites.filter(function (value) {
                    return value !== me.selectedSprite;
                });
            } else if (me.selectedSprite instanceof Coin) {
                me.engine.level.coinSprites = me.engine.level.coinSprites.filter(function (value) {
                    return value !== me.selectedSprite;
                });
            } else if (me.selectedSprite instanceof Player) {
                me.engine.level.playerSprite = null;
            } else if (me.selectedSprite instanceof Chest) {
                me.engine.level.chestSprites = me.engine.level.chestSprites.filter(function (value) {
                    return value !== me.selectedSprite;
                });
            } else {
                me.engine.level.staticSprites = me.engine.level.staticSprites.filter(function (value) {
                    return value !== me.selectedSprite;
                });
            }
            me.engine.selectedSprite = null;
            me.engine.rightClicked = false;
            me.engine.spawnSelector();
        };
        this.addBtn.onclick = function () {
            me.selectedSprite.movements.push(new Movement());
            me.spawnEditor();
        };
        this.previewBtn.onclick = function () {
            if (me.selectedSprite.shouldMove) {
                me.selectedSprite.shouldMove = false;
                me.selectedSprite.reset();
            } else me.selectedSprite.shouldMove = true;
        };
        this.x.onchange = function () {
            me.selectedSprite.x = parseInt(me.x.value);
            me.selectedSprite.xIni = parseInt(me.x.value);
            me.x.value = me.selectedSprite.x;
        };
        this.y.onchange = function () {
            me.selectedSprite.y = parseInt(me.y.value);
            me.selectedSprite.yIni = parseInt(me.y.value);
            me.y.value = me.selectedSprite.y;
        };
        this.w.onchange = function () {
            me.selectedSprite.width = parseInt(me.w.value);
            me.w.value = me.selectedSprite.width;
        };
        this.h.onchange = function () {
            me.selectedSprite.height = parseInt(me.h.value);
            me.h.value = me.selectedSprite.height;
        };
        this.angle.onchange = function () {
            me.selectedSprite.angle = parseInt(me.angle.value);
            me.angle.value = me.selectedSprite.angle;
        };
        this.dest_id.onchange = function () {
            me.selectedSprite.destination_id = parseInt(me.dest_id.value);
            me.dest_id.value = me.selectedSprite.destination_id;
        };
        this.reward.onchange = function () {
            me.selectedSprite.basicReward = parseInt(me.reward.value);
            me.reward.value = me.selectedSprite.basicReward;
        };
        this.value.onchange = function () {
            me.selectedSprite.value = parseInt(me.value.value);
            me.value.value = me.selectedSprite.value;
        };
    }

    spawnEditor(selectedSprite, selectors) {
        if (selectedSprite !== undefined) this.selectedSprite = selectedSprite;
        if (selectors !== undefined) selectors.style.display = "none";
        this.editor.style.display = "block";
        if (selectedSprite instanceof Enemy) this.enemyEditor.style.display = "block";
        if (selectedSprite instanceof Repeater) this.angle_container.style.display = "block";
        if (selectedSprite instanceof Flag) this.flagEditor.style.display = "block";
        if (selectedSprite instanceof Portal) this.portalEditor.style.display = "block";
        if (selectedSprite instanceof Coin || selectedSprite instanceof Chest) this.coinEditor.style.display = "block";
        if (this.x !== document.activeElement)
            this.x.value = this.selectedSprite.x;
        if (this.y !== document.activeElement)
            this.y.value = this.selectedSprite.y;
        if (this.w !== document.activeElement)
            this.w.value = this.selectedSprite.width;
        if (this.h !== document.activeElement)
            this.h.value = this.selectedSprite.height;
        if (this.angle !== document.activeElement && selectedSprite instanceof Repeater)
            this.angle.value = this.selectedSprite.angle;
        if (selectedSprite instanceof Portal && this.dest_id !== document.activeElement)
            this.dest_id.value = this.selectedSprite.destination_id;
        if (selectedSprite instanceof Flag && this.reward !== document.activeElement)
            this.reward.value = this.selectedSprite.basicReward;
        if ((selectedSprite instanceof Coin || selectedSprite instanceof Chest) && this.h !== document.activeElement)
            this.value.value = this.selectedSprite.value;
        //add movements, a movement is defined by 2 speeds, 2 accelerations and a duration
        if (this.selectedSprite instanceof Enemy)
            this.spawnMovementControls()
    }

    despawnMovementControls() {
        this.movements.innerHTML = "";
    }

    spawnMovementControls() {
        let me = this;
        this.despawnMovementControls();
        let container = this.movements;
        let docFrag = document.createDocumentFragment();
        this.selectedSprite.movements.forEach(function (movement) {
            //spawn x speed slider
            me.createSlider(movement.iSx, -5, 5, 20, movement.setiSx.bind(movement), docFrag);
            me.createSlider(movement.iSy, -5, 5, 20, movement.setiSy.bind(movement), docFrag);
            me.createSlider(movement.Ax, -0.2, 0.2, 20, movement.setAx.bind(movement), docFrag);
            me.createSlider(movement.Ay, -0.2, 0.2, 20, movement.setAy.bind(movement), docFrag);
            me.createSlider(movement.t, 0, 5000, 20, movement.setT.bind(movement), docFrag);
            me.createSlider(movement.freq, 0, 5, 20, movement.setFreq.bind(movement), docFrag);
            docFrag.append(document.createElement("br"));
            docFrag.append(document.createElement("br"));
            container.append(docFrag);
        });
    }

    createSlider(value, min, max, steps, func, docFrag) {
        let span = document.createElement("span");
        let slider = document.createElement('input');
        slider.type = "range";
        slider.step = ((max - min) / steps).toString();
        slider.min = min;
        slider.max = max;
        slider.value = value.toString();
        let label = document.createElement('label');
        label.innerHTML = slider.value.toString();
        span.append(label);
        slider.onchange = function () {
            func(parseFloat(slider.value));
            label.innerHTML = slider.value.toString();
        };
        span.append(slider);
        docFrag.append(span);
    }

    despawn() {
        this.despawnMovementControls();
        this.editor.style.display = "none";
        this.enemyEditor.style.display = "none";
        this.portalEditor.style.display = "none";
        this.flagEditor.style.display = "none";
        this.coinEditor.style.display = "none";
        this.angle_container.style.display = "none";
    }
}