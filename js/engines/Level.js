"use strict";
const NOT_STARTED = -1;
const NOT_OVER = 0;
const LOST = 1;
const WON = 2;
const MAX_LEVEL = 4;

class Level {
    constructor(ctx, lvl) {
        this.ctx = ctx;
        //canvas sprites
        this.clear();
        if (lvl !== undefined) {
            if (typeof lvl == "string") this.fromString(lvl);
            else this.generatePreset(lvl);
        }
        this.timestamp = 0;
        this.init_time = 0;
        this.body_count = 0;
        this.id = -1;
    }

    addBackgroundSprite(img) {
        this.backgroundSprite = new Component(0, 0, this.ctx.canvas.width, this.ctx.canvas.height, img);
    }

    addStaticSprite(img) {
        const newSprite = new Component(0, 0, img.width, img.height, img);
        this.staticSprites.push(newSprite);
    }

    addEnemySprite(img, type) {
        let newEnemy;
        if (type === "sniper") {
            newEnemy = new Sniper(0, 0, img.width, img.height, img);
        } else if (type === "repeater") {
            newEnemy = new Repeater(0, 0, img.width, img.height, img, 0);
        } else if (type === "randomizer") {
            newEnemy = new Randomizer(0, 0, img.width, img.height, img, 0);
        } else {
            newEnemy = new Enemy(0, 0, img.width, img.height, img);
        }
        this.enemySprites.push(newEnemy);
    }

    addPlayerSprite(img) {
        this.playerSprite = new Player(0, 0, this.ctx.canvas.width, this.ctx.canvas.height, img);
    }

    addFlagSprite(img) {
        this.flagSprite = new Flag(0, 0, this.ctx.canvas.width, this.ctx.canvas.height, img);
    }

    addPortalSprite(img) {
        let id = this.portalSprites.length > 0 ? this.portalSprites[this.portalSprites.length - 1].id + 1 : 0;
        const newPortal = new Portal(0, 0, img.width, img.height, img, id);
        this.portalSprites.push(newPortal);
    }

    addCoinSprite(img) {
        const newCoin = new Coin(0, 0, img.width, img.height, img);
        this.coinSprites.push(newCoin);
    }

    addChestSprite(img_open, img_closed) {
        const newChest = new Chest(0, 0, img_open.width, img_open.height, img_open, img_closed);
        this.chestSprites.push(newChest);
    }

    toString() {
        let string = "";
        //background
        if (this.backgroundSprite) {
            string += "bkg:1\n";
            string += this.backgroundSprite.toString() + "\n";
        } else
            string += "bkg:0\n";
        //static elements
        string += "static:" + this.staticSprites.length + "\n";
        for (let i = 0; i < this.staticSprites.length; i++) {
            string += this.staticSprites[i].toString() + "\n";
        }
        //enemies
        string += "enemies:" + this.enemySprites.length + "\n";
        for (let i = 0; i < this.enemySprites.length; i++) {
            string += this.enemySprites[i].toString() + "\n";
        }
        //portals
        string += "portals:" + this.portalSprites.length + "\n";
        for (let i = 0; i < this.portalSprites.length; i++) {
            string += this.portalSprites[i].toString() + "\n";
        }
        //coins
        string += "coins:" + this.coinSprites.length + "\n";
        for (let i = 0; i < this.coinSprites.length; i++) {
            string += this.coinSprites[i].toString() + "\n";
        }
        //chests
        string += "chests:" + this.chestSprites.length + "\n";
        for (let i = 0; i < this.chestSprites.length; i++) {
            string += this.chestSprites[i].toString() + "\n";
        }
        //unique elements
        if (this.playerSprite) {
            string += "player:1\n";
            string += this.playerSprite.toString() + "\n";
        } else string += "player:0\n";

        if (this.flagSprite) {
            string += "flag:1\n";
            string += this.flagSprite.toString() + "\n";
        } else string += "flag:0\n";

        return string;
    }

    fromString(str) {
        this.reset();
        const lines = str.split("\n");
        let index = 0;
        //background
        if (lines[index++].split(":")[1] !== "0") {
            let spriteData = lines[index++];
            this.backgroundSprite = new Component(spriteData);
        }
        //static
        const nStatic = parseInt(lines[index++].split(":")[1]);
        for (let i = 0; i < nStatic; i++) {
            let spriteData = lines[index++];
            this.staticSprites.push(new Component(spriteData));
        }
        //enemies
        const nEnemies = parseInt(lines[index++].split(":")[1]);
        for (let i = 0; i < nEnemies; i++) {
            let spriteData = lines[index++];
            let type = spriteData.split("|")[0];
            let enemy;
            if (type === "sniper") {
                spriteData = spriteData.slice("sniper".length + 1, spriteData.length);
                enemy = new Sniper(spriteData);
            } else if (type.startsWith("repeater")) {
                spriteData = spriteData.slice("repeater".length + 1, spriteData.length);
                enemy = new Repeater(spriteData);
            } else if (type === "randomizer") {
                spriteData = spriteData.slice("randomizer".length + 1, spriteData.length);
                enemy = new Randomizer(spriteData);
            } else {
                enemy = new Enemy(spriteData);
            }

            let nMoves = parseInt(spriteData.split("moves:")[1]);
            for (let i = 0; i < nMoves; i++) {
                let moveData = lines[index++];
                enemy.movements.push(new Movement(moveData));
            }
            this.enemySprites.push(enemy);
        }
        //portals
        const nPortals = parseInt(lines[index++].split(":")[1]);
        for (let i = 0; i < nPortals; i++) {
            let spriteData = lines[index++];
            this.portalSprites.push(new Portal(spriteData));
        }
        //coins
        const nCoins = parseInt(lines[index++].split(":")[1]);
        for (let i = 0; i < nCoins; i++) {
            let spriteData = lines[index++];
            this.coinSprites.push(new Coin(spriteData));
        }
        //chests
        const nChests = parseInt(lines[index++].split(":")[1]);
        for (let i = 0; i < nChests; i++) {
            let spriteData = lines[index++];
            this.chestSprites.push(new Chest(spriteData));
        }
        //unique elements
        if (lines[index++].split(":")[1] !== "0") {
            let spriteData = lines[index++];
            this.playerSprite = new Player(spriteData);
        }
        if (lines[index++].split(":")[1] !== "0") {
            let spriteData = lines[index++];
            this.flagSprite = new Flag(spriteData);
        }
    }

    reset() {
        this.active = false;
        this.alive = true;
        this.won = false;
        for (let i = 0; i < this.enemySprites.length; this.enemySprites[i++].reset());
        for (let i = 0; i < this.coinSprites.length; this.coinSprites[i++].reset());
        for (let chest of this.chestSprites){
            chest.reset();
        }
        if (this.playerSprite) this.playerSprite.reset();
        if (this.flagSprite) this.flagSprite.reset();
    }

    clear() {
        this.backgroundSprite = null;
        this.staticSprites = [];
        this.enemySprites = [];
        this.portalSprites = [];
        this.coinSprites = [];
        this.chestSprites = [];
        this.playerSprite = null;
        this.flagSprite = null;
        this.reset();
    }

    draw() {
        if (this.backgroundSprite)
            this.backgroundSprite.draw(this.ctx);

        for (let i = 0; i < this.staticSprites.length; i++) {
            this.staticSprites[i].draw(this.ctx);
        }

        if (this.flagSprite) this.flagSprite.draw(this.ctx);

        for (let i = 0; i < this.portalSprites.length; i++) {
            this.portalSprites[i].draw(this.ctx);
        }

        for (let i = 0; i < this.coinSprites.length; i++) {
            this.coinSprites[i].draw(this.ctx);
        }

        for (let i = 0; i < this.enemySprites.length; i++) {
            this.enemySprites[i].draw(this.ctx);
        }

        for (let i = 0; i < this.chestSprites.length; i++) {
            this.chestSprites[i].draw(this.ctx);
        }

        if (this.playerSprite) this.playerSprite.draw(this.ctx);
    }

    start(total_time) {
        if(this.init_time === 0) this.init_time = total_time;
        this.active = true;
        for (let i = 0; i < this.enemySprites.length; i++) {
            this.enemySprites[i].shouldMove = true;
            if (total_time !== undefined)
                this.enemySprites[i].time = total_time;
        }
    }

    pause() {
        this.active = false;
        for (let i = 0; i < this.enemySprites.length; i++) {
            this.enemySprites[i].shouldMove = false;
        }
    }

    update(total_time, keysPressed, user) {
        //move enemies
        if (!this.active) return;
        this.updateEnemies(total_time, user.difficulty);
        this.updatePlayer(user);
        this.updatePortals(keysPressed, user);
        this.updateChest(keysPressed, user);
        this.updateLife();
        this.updateWin(total_time, user.difficulty);
        this.updateCoin();
    }

    updateEnemies(total_time, difficulty) {
        let me = this;
        for (let i = 0; i < this.enemySprites.length; i++) {
            if(!this.enemySprites[i].active) continue;
            this.enemySprites[i].update(total_time, difficulty, this.playerSprite);
            //check if projectile hits static components
            for (let j = 0; j < this.enemySprites[i].shots.length; j++) {
                for (let k = 0; k < this.staticSprites.length; k++) {
                    //if intersects, delete from array
                    if (this.staticSprites[k].intersects(this.enemySprites[i].shots[j])) {
                        this.enemySprites[i].shots = this.enemySprites[i].shots.filter(function (value) {
                            return value !== me.enemySprites[i].shots[j];
                        });
                        break;
                    }
                }
            }
        }

        for(let shot of this.playerSprite.shots){
            for (let enemy of this.enemySprites)
            if(enemy.active && shot.intersects(enemy)){
                this.body_count++;
                enemy.active = false;
                enemy.shots = [];
            }
        }
    }

    updatePlayer(user) {
        let me = this;
        this.playerSprite.update(user, this.staticSprites, this.ctx.canvas);
        this.playerSprite.shots = this.playerSprite.shots.filter(function (value) {
            for(let sp of me.staticSprites){
                if(sp.intersects(value) || sp.intersectsCanvas()) return false;
            }
            return true;
        });
    }

    updatePortals(keysPressed, user) {
        if (!keysPressed["f"] || !user.canPort) return;
        for (let i = 0; i < this.portalSprites.length; i++) {
            if (this.playerSprite.intersects(this.portalSprites[i])) {
                let destination = this.getPortal(this.portalSprites[i].destination_id);
                destination.port(this.playerSprite);
                keysPressed["f"] = false;
                return;
            }
        }
    }

    updateCoin() {
        for (let i = 0; i < this.coinSprites.length; i++) {
            if (this.coinSprites[i].intersects(this.playerSprite))
                this.flagSprite.reward += this.coinSprites[i].collect();
        }
    }

    updateChest(keysPressed, user) {
        if (!keysPressed["f"] || !user.canLockpick) return;
        for(let chest of this.chestSprites){
            if(chest.intersects(this.playerSprite)){
                this.flagSprite.reward += chest.collect(user);
            }
        }
    }

    updateLife() {
        //check if fell through map
        this.alive = this.playerSprite.y < this.ctx.canvas.height;
        //check if touched enemy or a projectile
        for (let i = 0; i < this.enemySprites.length && this.alive; i++) {
            if(!this.enemySprites[i].active) continue;
            this.alive = !this.enemySprites[i].intersects(this.playerSprite);
            if (this.enemySprites[i].shots !== undefined) {
                for (let j = 0; j < this.enemySprites[i].shots.length && this.alive; j++) {
                    this.alive = !this.enemySprites[i].shots[j].intersects(this.playerSprite);
                }
            }
        }
    }

    updateWin(total_time, difficulty) {
        this.timestamp = total_time;
        if (this.playerSprite.intersects(this.flagSprite) && this.won === false){
            this.won = true;
            let beat_time = this.timestamp - this.init_time;
            $.ajax({
                type: "post",
                url: 'actions/upload_score.php',
                dataType: 'json',
                data:{beat_time: beat_time, body_count: this.body_count, money: (this.flagSprite.reward*difficulty), level_id: this.id},
            });
            this.init_time = 0;
            this.body_count = 0;
        }
    }

    getPortal(id) {
        for (let i = 0; i < this.portalSprites.length; i++) {
            if (this.portalSprites[i].id === id) {
                return this.portalSprites[i];
            }
        }
        return null;
    }

    isOver() {
        if (!this.active) return NOT_STARTED;
        if (!this.alive) return LOST;
        if (this.won) return WON;
        return NOT_OVER;
    }

    nextLevel() {
        this.lvl++;
        this.generatePreset(this.lvl);
    }

    generatePreset(lvl) {
        this.clear();
        this.lvl = lvl;
        let me = this;
        jQuery.ajax({
            type: "post",
            url: 'actions/get_main_level.php',
            dataType: 'json',
            data:{level: lvl},
            success: function (response) {
                if(response.status === "success"){
                    me.fromString(response.level_data);
                    me.id = parseInt(response.id);
                }else{
                    alert("Error loading level");
                }

            }
        });

    }
}