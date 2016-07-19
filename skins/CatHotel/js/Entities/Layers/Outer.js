class Outer extends View {
    constructor(dat) {
        super(dat);
        this.dis = false;
        this.op = 0;
    }
    update(delta) {
        super.update(delta);
        if (this.dis && this.op) {
            this.surf.save();
            this.surf.fillStyle = "black";
            this.surf.globalAlpha = this.op;
            this.surf.fillRect(0,0,this.width, this.height);
            this.surf.restore();
        }
    }
    disable() {
        this.mouseEnabled = false;
        this.dis = true;
        this.animate({op:0.8},0.3);
    }
    enable() {
        this.mouseEnabled = true;
        this.sid = false;
        this.animate({op:0.0},0.3);
    }
}
