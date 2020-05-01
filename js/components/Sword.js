

class Sword extends Component{
    constructor(x, y, w, h, img){
        super(x, y, w, h, img);
        this.angle = SWORD_START_ANGLE;
        this.active = false;
    }

    update(user){
        if(!user.canMelee || !this.active) return;
        if(this.angle < SWORD_STOP_ANGLE){
            this.angle += SWORD_ANGLE_SPEED;
            if(this.angle >= SWORD_STOP_ANGLE){
                this.angle = SWORD_START_ANGLE;
                this.active = false;
            }
        }
    }
}