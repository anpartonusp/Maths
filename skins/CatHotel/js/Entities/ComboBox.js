var comboanim = {
    loopType:"loop",
    speed:10,
    frames: [
        "Combomeer_1",
        "Combomeer_2",
        "Combomeer_3",
    ]
}
class ComboBox extends View {
    constructor(dat) {
        super(dat);
        this.width = W;
        this.height = 80;
        this.x = X;
        this.clearScreen = false;
        this.clip = false;
        this.sprite = new Sprite("Combomeer_1",{x:X,y:45});
        this.sprite.addFrameAnimation("FLASH",comboanim);
        this.sprite.startFrameAnimation("FLASH");
        this.text = new Text("0",{x:X-158,y:50,color:"#232140", font:"Rammetto One", fontSize:30, opacity:0.8});
        this.add(this.sprite);
        this.add(this.text);

    }
    show() {
        this.visible = true;
        this.stop().animate({x:X,y:44},0.3);
        //hide the title
        if (ui) {
            ui.title.stop().animate({scaleX: 0, scaleY: 0}, 0.3);
        }
    }
    hide() {
        this.stop().animate({x:X,y:-39},0.3, function(o) {
            o.visible = false;
        });
        //show the title
        if (ui && ui.title.scale!=1) {
            ui.title.stop().animate({scaleX: 1.1, scaleY: 1.1}, 0.3, function (o) {
                o.animate({scaleX: 1, scaleY: 1}, 0.1);
            });
        }
    }
    set value(v) {
        this.text.stop().animate({scaleX:0,scaleY:0},0.2, function(o) {
            o.text = v;
            o.animate({scaleX:1,scaleY:1},0.2);
        })

    }
}

