/**
 * A Glowing target which your character moves toward
 */

class TARGET extends Character {
    constructor(src, map, dat) {
        super(src, map, dat);
        this._active = false;
        this.sinCounter = 0;
    }
    set active(b) {
        this._active = b;
        if (b) {
            this.animate({opacity:0.3},0.4);
            this.makeVisible(true);
        } else {
            this.animate({opacity:0.0},0.1, function(o) {
                o.makeVisible(false);
            });
        }
    }
    update(delta) {
        if (this._active) {
            this.sinCounter += delta;
            this.opacity = Math.abs(Math.sin(this.sinCounter))/2;
        }
    }

}