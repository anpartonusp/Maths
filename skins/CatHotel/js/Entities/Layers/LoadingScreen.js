class Bar extends View {
    constructor(dat) {
        super(dat);
        this.width = 138;
        this.height = 80;
        this.clearScreen = false;
        this.barback = new Sprite("loading_bar_empty", {x:this.width/2,y:this.height/2});
        this.barfull = new Sprite("loading_bar_full", {x:0,y:this.height/2, scaleX:0, handle:{x:0,y:0.5}});
        this.bartip = new Sprite("loading_bar_tip", {x:-28,y:this.height/2,handle:{x:1,y:0.5}});
        this.scaleY = 2.5;
        this.scaleX = 3.2;
        this.add(this.barback);
        this.add(this.barfull);
        this.add(this.bartip);
    }
    set value(v) {
        this.barfull.scale = v;
        this.bartip.x = (this.width * v);
    }
}

class LoadingScreen extends View {
    constructor(dat, callback) {
        super(dat);
        this.scale = 1.0;

        this.sprite = new Sprite("logo", {x:X, y:Y-50, scale:0, opacity:0});
        this.add(this.sprite);
        this.bar = new Bar({x:X,y:Y+10, opacity:0});
        this.add(this.bar);
        var self = this;
        this.sprite.animate({opacity:1, scaleX:1.1,scaleY:1.1},1,function(o) {
            o.animate({scaleX:1,scaleY:1},0.4);
            self.bar.animate({opacity:1},0.3);
            if (callback) callback();
        })
        this.tap = new Text("Tap to start",{fontSize:50,x:X,y:H-50, fontFamily:"Montserrat", color:"white", opacity:0});

        this.add(this.tap);

        this.tapShowing = false;
        this.callback = null;
    }
    set value(v) {
        this.bar.value = v;
    }
    showTapMessage(callback) {
        this.callback = callback;
        this.tapShowing = true;
        this.tap.animate({opacity:1},0.5);

    }
    onWindowMouseUp() {
        if (this.tapShowing) {
            this.tapShowing = false;
            this.callback();
        }
    }
    onWindowTouchEnd() {
        this.onWindowMouseUp();
    }

}
