class Player extends Sprite {
    constructor(path, dat) {
        super(path, dat);
        this.target = null;
    }
    setTarget(pos) {
        this.target = pos;
        this.stop();
        if (pos) {
            this.animate(to3(pos),10, function(o) {
                o.target = null;
            })
        }
    }
}
