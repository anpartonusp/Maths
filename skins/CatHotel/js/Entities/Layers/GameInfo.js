class GameInfo extends View {
    constructor(dat) {
        super(dat);
        this.backgroundColor = "black";
        this.screens = [];
        this.offset = 0;
        this.currScreen = 0;
        this.numScreens = 0;
    }
    addScreen(s) {
        var sp = new Sprite(s, {handle:{x:0,y:0}});
        this.screens.push(sp);
        this.add(sp);
        this.numScreens = this.screens.length;
    }
    addScreens(s) {
        if (typeof(s)=="string") {
            this.addScreen(s);
        } else {
            s.forEach(function(sc) {
                this.addScreen(sc);
            }.bind(this));
        }
    }
    update(delta) {
        super.update(delta);
        var x = this.offset;
        for(var i = 0;i<this.screens.length;i++) {
            var s = this.screens[i];
            s.x = x;
            s.y = 0;
            x+=s.image.width+4;
        }
    }
    show() {
        this.scaleX = this.scaleY = this.opacity = 0;
        this.visible = true;
        this.animate({opacity:0.9,scaleX:1, scaleY:1},0.5);
        toplayer.dark.darken(true);

    }
    hide() {

        toplayer.dark.darken(false);
        this.animate({opacity:0.0,scaleX:0, scaleY:0},0.5, function(o) {
            o.visible = false;
            o.currScreen = 0;
            o.offset = 0;
        });
    }
    onMouseDown(x,y) {
        if (this.animations.length==0) {
            if (x>800 && this.currScreen<this.numScreens-1) {
                this.animate({offset:this.offset-1004},0.4);
                this.currScreen++;
            } else if (x<200 && this.currScreen>0) {
                this.animate({offset:this.offset+1004},0.4);
                this.currScreen--;
            }
        }
    }
}
