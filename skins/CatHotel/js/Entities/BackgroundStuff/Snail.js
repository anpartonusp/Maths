class Snail extends Sprite {
    constructor(dat) {
        super("snail", dat);
        this.dir = -1;
        this.x = 1280+100;
    }
    update(delta) {
        super.update(delta);
        if (game.states.state!="TITLE") {
            this.x += this.dir * (5 * delta);
            if (this.dir < 0) {
                if (this.x <= -100) {
                    this.dir = 1;
                }
            } else {
                if (this.x > 1280 + 100) {
                    this.dir = -1;
                }
            }
            this.flipX = this.dir == -1 ? false : true;
        }

    }
    scatter() {
        if (this.x<1280/2) {
            this.dir=-1;
            this.animate({x:-100},1);
        } else {
            this.dir=1;
            this.animate({x:1280+100},1);
        }
    }
}

