"use strict";

class User {
    constructor(str) {
        if (str) {
            this.constructWithString(str);
        } else {
            this.money = 1;
            this.maxLevel = 1;
            this.difficulty = 1;
            this.sfxVolume = 1;
            this.musicVolume = 1;
            this.canJump = false;
            this.canDouble = false;
            this.canPort = false;
            this.canLockpick = false;
            this.canRange = false;
        }
    }

    constructWithString(str) {
        str = str.split("|");
        let index = 0;
        this.money = parseInt(str[index++].split(":")[1]);
        this.maxLevel = parseInt(str[index++].split(":")[1]);
        this.difficulty = parseInt(str[index++].split(":")[1]);
        this.sfxVolume = parseFloat(str[index++].split(":")[1]);
        this.canJump = str[index++].split(":")[1] === "true";
        this.canDouble = str[index++].split(":")[1] === "true";
        this.canPort = str[index++].split(":")[1] === "true";
        this.canLockpick = str[index++].split(":")[1] === "true";
        this.canMellee = str[index++].split(":")[1] === "true";
        this.canRange = str[index++].split(":")[1] === "true";
    }

    toString() {
        let str = "";
        str += "money:" + this.money;
        str += "|maxlvl:" + this.maxLevel;
        str += "|difficulty:" + this.difficulty;
        str += "|sfx:" + this.sfxVolume;
        str += "|jump:" + this.canJump;
        str += "|double:" + this.canDouble;
        str += "|port:" + this.canPort;
        str += "|lockpick:" + this.canLockpick;
        str += "|mellee:" + this.canMellee;
        str += "|ranged:" + this.canRange;
        return str;
    }
}