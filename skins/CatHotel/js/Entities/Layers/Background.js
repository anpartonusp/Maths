var buttcolors = ["blue","green","brown","orange","pink","yellow"];

var catTailAnim = {
    loopType:"none",
    speed:10,
    frames: [
        "cat_tail_01:0,0",
        "cat_tail_02:0,0",
        "cat_tail_03:0,0",
        "cat_tail_04:0,0",
        "cat_tail_05:0,0",
        "cat_tail_06:0,0",
        "cat_tail_07:0,0",
        "cat_tail_08:0,0",
        "cat_tail_09:0,0",
        "cat_tail_10:0,0",
        "cat_tail_10:0,0",
        "cat_tail_09:0,0",
        "cat_tail_08:0,0",
        "cat_tail_07:0,0",
        "cat_tail_06:0,0",
        "cat_tail_05:0,0",
        "cat_tail_04:0,0",
        "cat_tail_03:0,0",
        "cat_tail_02:0,0",

    ]
}

class CatTail extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.timer = 5;
        this.addFrameAnimation("WAG",catTailAnim);
        //this.startFrameAnimation("WAG");
    }
    update(delta) {
        super.update(delta);
        this.timer-=delta;
        if (this.timer<=0) {
            this.startFrameAnimation("WAG");
            this.timer = randomInt(10,30);
        }
    }
}

class Background extends View {
    constructor(dat) {
        super(dat);
        var b = this.back = new Sprite("images/CH_Background.jpg");
        this.add(b);
        b.autoDraw = true;
        b.x = X;
        b.y = Y;
        this.butts = [];
        //add cat tail
        var tail = new CatTail("blank",{x:114,y:Y-37});
        this.add(tail);


        for(var i = 0;i<5;i++) {
            if (randomInt(0,100)>50) {
                var b = new Butterfly(buttcolors[randomInt(0,buttcolors.length-1)],{});
                b.background = false;
                ui.unshift(b);   //Randomly in front of everything
            } else {
                var b = new Butterfly("light"+buttcolors[randomInt(0,buttcolors.length-1)],{});
                b.background = true;
                this.add(b);
                b.scaleX = b.scaleY = 0.8;
            }
            b.init();
            this.butts.push(b);

        }


    }
    scatterButterflies() {
        this.butts.forEach(function(b) {
            b.scatter();
        });
    }
}
