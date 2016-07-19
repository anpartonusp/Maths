
var coinSpinAnim = {
    loopType:"loop",
    speed:16,
    frames: [
        "coin_sprite_00000:0,0",
        "coin_sprite_00001:0,0",
        "coin_sprite_00002:0,0",
        "coin_sprite_00003:0,0",
        "coin_sprite_00004:0,0",
        "coin_sprite_00005:0,0",
        "coin_sprite_00006:0,0",
        "coin_sprite_00007:0,0",
    ]
}

class Coin extends Sprite {
    constructor(dat) {
        super("coin_sprite_00000", dat);
        this.dy = randomInt(-350,-200)*1.2;
        this.dx = randomInt(-150,150);
        this.addFrameAnimation("SPIN",coinSpinAnim);
        this.startFrameAnimation("SPIN");
    }
    update(delta) {
        super.update(delta);
        this.x+=this.dx*delta;
        this.y+=this.dy*delta;
        this.dy += 200*delta*2;
        if (this.y>(720+32)) {
            this.destroyMe = true;
        }
        this.draw();
    }

}

class CoinFactory extends View {
    constructor(dat) {
        super(dat);
        this.clip = false;
        this.coins = [];
        this.timer = 0;
        this.launchTimer = 0;
        this.max = 100;
        this.busy = 0.1;
    }

    /**
     * Start coins flowing
     * @param busyness - 0 to 10. 10 is very busy
     * @param duration - How long (in seconds) does the launching last
     */
    launch(busyness, duration) {
        if (busyness>10) busyness = 10;
        busyness = 10-busyness;
        this.busy = busyness / 20;

        this.timer = duration;
        this.launchTimer = 0;
    }

    /**
     * Stops any more launching
     */
    stop() {
        this.timer = 0;
    }
    update(delta) {
        super.update(delta);
        this.timer -= delta;
        if (this.timer > 0) {
            this.launchTimer -= delta;
            if (this.launchTimer <= 0) {
                this.launchTimer = this.busy;
                if (this.coins.length < this.max) {
                    var lx = randomInt(0, this.width);
                    var c = new Coin({x: lx, y: this.height / 2, opacity: 0, scaleX: 0, scaleY: 0});
                    c.animate({scaleX: 1, scaleY: 1, opacity: 1}, 0.3);
                    this.coins.push(c);
                }
            }
        }
        //Draw all the coins
        for (var i = this.coins.length - 1; i >= 0; i--) {
            var c = this.coins[i];
            c._update(delta);
            c.update(delta);
            if (c.destroyMe) {
                this.coins.splice(i, 1);
            }
        }

    }
}