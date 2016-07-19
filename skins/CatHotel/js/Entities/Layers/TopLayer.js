//The very top view. Contains info screens & stuff that MUST be on top of everything else
class TopLayer extends View {
    constructor(dat) {
        super(dat);

        this.dark = new DarkLayer({x:X,y:Y,width:W, height:H, clearScreen:false, opacity:0});
        this.add(this.dark);


        /**
         * Coin factory
         */
        this.coins = new CoinFactory({x:X,y:this.height-10,width:500,height:50, clearScreen:false});
        this.add(this.coins);


        this.winscreen = new WinScreen({x:X,y:Y,width:W,height:H, clearScreen:false});
        this.add(this.winscreen);
    }
}


class DarkLayer extends View {
    constructor(dat) {
        super(dat);
    }
    update(delta) {
        if (this.opacity>0) {
            this.surf.save();
            this.surf.fillStyle = "black";
            this.surf.globalAlpha = this.opacity;
            this.surf.fillRect(0,0,W,H);
            this.surf.restore();
        }
    }
    darken(d) {
        if (d) {
            this.stop().animate({opacity:0.5},0.3);
            outer.mouseEnabled = false;
        } else {
            this.stop().animate({opacity:0.0},0.3);
            outer.mouseEnabled = true;
        }
    }
}
