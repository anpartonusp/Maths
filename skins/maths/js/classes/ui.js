class UI extends View {
    constructor(dat) {
        super(dat);
        this.center = new CENTER("centericon",{x:64,y:this.height-64});
        this.add(this.center);
        this.clearScreen = false;


    }
}

class CENTER extends Sprite {
    constructor(path, dat) {
        super(path,dat);
    }
    onMouseUp() {
        return CANCEL;
    }
    onMouseDown() {
        return CANCEL;
    }
}