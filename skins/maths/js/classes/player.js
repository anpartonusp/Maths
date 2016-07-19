class Player extends Sprite {
    constructor(path, dat) {
        super(path, dat);
        this.target = null;
    }
    setTarget(pos) {
        this.target = pos;
        this.stop();
        if (pos) {
            var three = to3(pos);
            var a = this.x-three.x;
            var b = this.y-three.y;
            var c = Math.sqrt(a*a + b*b);
            console.log("Distance is "+c/64);
            this.animate(to3(pos),c/64, function(o) {
                o.target = null;
            }, "linear")
        }
    }
}
