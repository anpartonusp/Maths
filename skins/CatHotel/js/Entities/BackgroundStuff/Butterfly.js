var butts = {
    "blue" : "butterfliy_blue_0",
    "lightblue" : "butterfliy_blue_bright_0",
    "green" : "butterfliy_green_0",
    "lightgreen" : "butterfliy_green_bright_0",
    "brown" : "butterfliy_brown_0",
    "lightbrown" : "butterfliy_brown_bright_0",
    "orange" : "butterfliy_orange_0",
    "lightorange" : "butterfliy_orange_bright_0",
    "pink" : "butterfliy_pink_0",
    "lightpink" : "butterfliy_pink_bright_0",
    "yellow" : "butterfliy_yellow_0",
    "lightyellow" : "butterfliy_yellow_bright_0",
}

var buttTargets = [
    {x:18,y:133},
    {x:110,y:202},
    {x:208,y:207},
    {x:124,y:412},
    {x:1151,y:223},
    {x:1200,y:219},
    {x:1255,y:208},
    {x:132,y:27},
    {x:1207,y:24},
]

class Butterfly extends Sprite {
    constructor(src, dat) { //src is just the color (blue, lightblue, brown, lightbrown, green, lightgreen, orange, lightorange, pink, lightpink, yellow, lightyellow
        //Leave src null to pick a random butterfly
        super (null, dat);
        this.tx = 0;
        this.ty = 0;
        this.scaleX = this.scaleY = 1;
        this.opacity = 0.8;
        this.background = false;
        this.targeting = false;
        if (src==null || !butts.hasOwnProperty(src)) {  //pick a random one
            var k = Object.keys(butts);
            var r = randomInt(0,k.length-1);
            src = k[r];
        }

        var frame = butts[src];

        var anim = {
            loopType:"loop",
            speed:20,
            frames: [
                `${frame}1`,
                `${frame}2`,
                `${frame}3`,
                `${frame}4`,
            ]
        }
        this.addFrameAnimation("FLAP",anim);
        this.startFrameAnimation("FLAP");
    }
    init() {
        if (randomInt(0,100)<50) {
            this.x = randomInt(-200, -50);
        } else {
            this.x = randomInt(1280+50, 1280+250);
        }
        this.y = randomInt(-50,720+50);
        this.pickTarget();
    }
    pickTarget() {
        this.animSpeed = 20;
        if (this.background && randomInt(0,100)>70) {
            //Fly to a target
            var l = buttTargets.length;
            var targ = buttTargets[randomInt(0,l-1)];
            this.tx = targ.x; this.ty = targ.y;
            this.animate({x:targ.x,y:targ.y-8}, randomInt(5,15), function(o) {
                o.animSpeed = 0;
                o.showFrame("FLAP",0);
                o.animate({x:o.x,y:o.y}, randomInt(5,10), function(o) {
                    o.pickTarget();
                });
            });
            return;
        }

        if (randomInt(0,10)>5) {
            this.tx = (randomInt(0,10)>5) ? -30 : 1280+30;
        } else {
            this.tx = randomInt(-50, 1280 + 50);
        }
        this.ty = randomInt(-50,500);

        this.animate({x:this.tx,y:this.ty}, randomInt(5,15), function(o) {
            o.pickTarget();
        });
    }
    scatter() {
        var tx = 1280+50;
        if (this.x<(1280/2)) {
            tx = -50;
        }
        this.tx = tx;
        this.animSpeed = 20;
        this.stop().animate({x:tx, y:this.y + randomInt(-100,100)},0.5+Math.random()/2, function(o) {
            o.animate({},randomInt(3,10), function(o) {
                o.pickTarget();
            })
        });




    }
    update(delta) {
        super.update(delta);
        this.flipX = this.tx>this.x;
    }
}
