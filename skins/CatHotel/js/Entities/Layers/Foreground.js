class Foreground extends View {
    constructor(dat) {
        super(dat);
        //var b = this.back = new Sprite("images/CH_Overlay.png");
        this.clearScreen = false;
        //this.add(b);
        //b.autoDraw = true;
        //b.x = 1280/2;
        //b.y = 720/2;
        this.scale = 2;
      //  b.scale = 0;
      //  b.animate({scaleX:2.05,scaleY:2.05},1,function(o) {
      //      o.animate({scaleX:2,scaleY:2},0.2);
      //  })
    }
}
