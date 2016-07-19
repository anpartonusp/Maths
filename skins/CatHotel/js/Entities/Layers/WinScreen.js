const RAM = "Rammetto One";

class BigStar extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.sin = 0;
        this.baseScale = 1;
    }
    update(delta) {
        super.update(delta);
        this.sin+=1.2*delta;
        this.rotation = Math.cos(this.sin*1.5)*0.15;
        var sc = Math.abs(Math.sin(this.sin));
        this.scaleX = this.scaleY = this.baseScale+(sc/8);
        this.shadowBlur = 10 + 40*sc;
    }
}

class Star extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.origX;
        this.origY;
    }
    startMoving() {
        this.origX = this.x;
        this.origY = this.y;
        this.chooseNewPos();
    }
    chooseNewPos() {
        var newX = randomInt(this.origX-30, this.origX+30);
        var newY = randomInt(this.origY-30, this.origY+30);
        this.animate({x:newX,y:newY},randomInt(10,30)/10, function(o) {
            o.chooseNewPos()
        });
    }
    update(delta) {
        super.update(delta);
        this.rotation += 0.5*delta;
    }
}

class Shape extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.pos = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.chooseNewPos();
    }
    chooseNewPos() {
        var newX = randomInt(-70, 70);
        var newY = randomInt(-50, 50);
        this.animate({offsetX:newX,offsetY:newY},randomInt(10,30)/10, function(o) {
            o.chooseNewPos()
        });
    }

    update(delta) {
        super.update(delta);
        this.rotation -= 1.2*delta;
        this.x = X + (500 * Math.sin(this.pos)) + this.offsetX;
        this.y = Y-30 + (300 * Math.cos(this.pos)) + this.offsetY;
        this.pos -= 1.2 * delta;
    }
}

class WinText extends Text {
    constructor(txt,dat) {
        super(txt,dat);
        this.shadowColor = "black";
        this.sin = 0;
        this.baseScale = 1;
    }
    update(delta) {
        super.update(delta);
        this.sin+=2*delta;
        this.rotation = Math.sin(this.sin)*0.1;
        this.scaleX = this.scaleY = this.baseScale+0.2+Math.sin(this.sin*1.3)*0.08;
    }
}

class Shapes extends View {
    constructor(dat) {
        super(dat);
        this.cashew = new Shape("images/wins/cashew_shape.png");
        this.cat = new Shape("images/wins/cat_shape.png");
        this.fishbones = new Shape("images/wins/fish_bones_shape.png");
        this.fish = new Shape("images/wins/fish_shape.png");
        this.flower = new Shape("images/wins/flower_shape.png");
        this.flower2 = new Shape("images/wins/flower_shape_2.png");
        this.food = new Shape("images/wins/food_shape_2.png");
        this.heart = new Shape("images/wins/heart_shape.png");
        this.moon = new Shape("images/wins/moon_shape.png");
        this.random = new Shape("images/wins/random_shape.png");
        this.sun = new Shape("images/wins/sun_shape.png");

        var shapes = [
            this.cashew, this.cat, this.fishbones, this.fish, this.flower, this.flower2, this.food, this.heart, this.moon, this.random, this.sun
        ]
        var l = shapes.length;
        var ang = 0;
        for(var i = 0;i<l;i++) {
            shapes[i].pos = ((3.142*2) / l) * i;

            this.add(shapes[i]);
        }

    }
    update(delta) {
        super.update(delta);
    }

}

class Stars extends View {
    constructor(dat) {
        super(dat);
        this.blueStar = new Star("images/wins/STAR_blue.png");
        this.greenStar = new Star("images/wins/STAR_green.png");
        this.lightblueStar = new Star("images/wins/STAR_light_blue.png");
        this.lightgreenStar = new Star("images/wins/STAR_light_green.png");
        this.orangeStar = new Star("images/wins/STAR_orange.png");
        this.purpleStar = new Star("images/wins/STAR_purple.png");
        this.redStar = new Star("images/wins/STAR_red.png");
        this.yellowStar = new Star("images/wins/STAR_yellow.png");

        this.layout = [
            {star:this.lightblueStar, x:-380,y:150},
            {star:this.blueStar, x:-350,y:-200},
            {star:this.yellowStar, x:-130,y:-300},
            {star:this.orangeStar, x:130,y:-280},
            {star:this.greenStar, x:330,y:-200},
            {star:this.purpleStar, x:-400,y:-30},
            {star:this.redStar, x:400,y:0},
            {star:this.lightgreenStar, x:380,y:150},
        ]
        this.layout.forEach(function(s) {
            s.star.x = this.x+s.x;
            s.star.y = this.y+s.y;
            s.star.startMoving();
            this.add(s.star)
        }.bind(this));
    }
    update(delta) {
        super.update(delta);
    }
}
class Letter extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.offsetX = this.offsetY = 0;
        this.chooseNewPos();

    }
    chooseNewPos() {

        var newX = randomInt(-10, 10);
        var newY = randomInt(-10, 10);
        this.animate({offsetX: newX, offsetY: newY}, randomInt(5, 20) / 10, function (o) {
            o.chooseNewPos()
        });

    }
    update(delta) {
        this.x = this.origX+this.offsetX;
        this.y = this.origY+this.offsetY;
    }

}

class WinHeading extends View {
    constructor(dat) {
        super(dat);
    }
    trigger() {
        this.children.forEach(function(l) {
            var y = l.y;
            l.y = 720;
            l.animate({y:y},1.5);
        });
    }
}
class Pawsome extends WinHeading {
    constructor(dat) {
        super(dat);
        const R = 0.15;
        var rot = R;
        var x = X+200;
        var xinc = -95;
        var y = 25;
        var p = "images/wins/letters/";
        this.letters = [
            new Letter(p+"P.png"),
            new Letter(p+"A.png"),
            new Letter(p+"W.png"),
            new Letter(p+"S.png"),
            new Letter(p+"O.png"),
            new Letter(p+"M.png"),
            new Letter(p+"E.png"),
        ]
        for (var i = this.letters.length-1;i>=0;i--) {
            this.add(this.letters[i]);
            this.letters[i].x = this.letters[i].origX = x;
            this.letters[i].y = this.letters[i].origY = y;
            this.letters[i].rotation = rot;
            rot = rot==-R ? R : -R;
            x+=xinc;
        }

    }


}

class Catnificent extends WinHeading {
    constructor(dat) {
        super(dat);
        const R = 0.15;
        var rot = R;
        var x = X+200;
        var xinc = -95;
        var y = 25;
        var p = "images/wins/letters/";
        this.letters = [
            new Letter(p+"C.png"),
            new Letter(p+"A.png"),
            new Letter(p+"T.png"),
            new Letter(p+"N.png"),
            new Letter(p+"I.png"),
            new Letter(p+"F.png"),
            new Letter(p+"I.png"),
            new Letter(p+"C.png"),
            new Letter(p+"E.png"),
            new Letter(p+"N.png"),
            new Letter(p+"T.png"),
        ]
        for (var i = this.letters.length-1;i>=0;i--) {
            this.add(this.letters[i]);
            this.letters[i].x = this.letters[i].origX = x;
            this.letters[i].y = this.letters[i].origY = y;
            this.letters[i].rotation = rot;
            rot = rot==-R ? R : -R;
            x+=xinc;
        }

    }
}

class Meowrvelous extends WinHeading {
    constructor(dat) {
        super(dat);
        const R = 0.15;
        var rot = R;
        var x = X+200;
        var xinc = -95;
        var y = 25;
        var p = "images/wins/letters/";
        this.letters = [
            new Letter(p+"M.png"),
            new Letter(p+"E.png"),
            new Letter(p+"O.png"),
            new Letter(p+"W.png"),
            new Letter(p+"R.png"),
            new Letter(p+"V.png"),
            new Letter(p+"E.png"),
            new Letter(p+"L.png"),
            new Letter(p+"O.png"),
            new Letter(p+"U.png"),
            new Letter(p+"S.png"),
        ]
        for (var i = this.letters.length-1;i>=0;i--) {
            this.add(this.letters[i]);
            this.letters[i].x = this.letters[i].origX = x;
            this.letters[i].y = this.letters[i].origY = y;
            this.letters[i].rotation = rot;
            rot = rot==-R ? R : -R;
            x+=xinc;
        }

    }
}

class Fancatstic extends WinHeading {
    constructor(dat) {
        super(dat);
        const R = 0.15;
        var rot = R;
        var x = X+200;
        var xinc = -95;
        var y = 25;
        var p = "images/wins/letters/";
        this.letters = [
            new Letter(p+"F.png"),
            new Letter(p+"A.png"),
            new Letter(p+"N.png"),
            new Letter(p+"C.png"),
            new Letter(p+"A.png"),
            new Letter(p+"T.png"),
            new Letter(p+"S.png"),
            new Letter(p+"T.png"),
            new Letter(p+"I.png"),
            new Letter(p+"C.png"),
        ]
        for (var i = this.letters.length-1;i>=0;i--) {
            this.add(this.letters[i]);
            this.letters[i].x = this.letters[i].origX = x;
            this.letters[i].y = this.letters[i].origY = y;
            this.letters[i].rotation = rot;
            rot = rot==-R ? R : -R;
            x+=xinc;
        }

    }
}

class Purrfect extends WinHeading {
    constructor(dat) {
        super(dat);
        const R = 0.15;
        var rot = R;
        var x = X+200;
        var xinc = -95;
        var y = 25;
        var p = "images/wins/letters/";
        this.letters = [
            new Letter(p+"P.png"),
            new Letter(p+"U.png"),
            new Letter(p+"R.png"),
            new Letter(p+"R.png"),
            new Letter(p+"F.png"),
            new Letter(p+"E.png"),
            new Letter(p+"C.png"),
            new Letter(p+"T.png")
        ]
        for (var i = this.letters.length-1;i>=0;i--) {
            this.add(this.letters[i]);
            this.letters[i].x = this.letters[i].origX = x;
            this.letters[i].y = this.letters[i].origY = y;
            this.letters[i].rotation = rot;
            rot = rot==-R ? R : -R;
            x+=xinc;
        }

    }
}

class WinScreen extends View {
    constructor(dat) {
        super(dat);
        this.visible = false;
        this.bigstar = new BigStar("images/wins/big_star.png",{x:X,y:Y-20, shadowColor:"white", shadowX:0, shadowY:0, shadowBlur:40});
        this.rainbow = new Sprite("images/wins/rainbow.png", {x:X,y:Y-100});
        this.stars = new Stars({x:X,y:Y, width:W, height:H, clip:false, clearScreen:false});
        this.shapes = new Shapes({x:X,y:Y, width:W, height:H, clip:false, clearScreen:false});
        this.wintext = new WinText("",{x:X,y:Y,font:RAM, fontSize:90, color:"#232140"})
        this.purrfect = new Purrfect({x:X+130,y:Y-140,width:W,height:50, clip:false, clearScreen:false});
        this.catnificent = new Catnificent({x:X+200,y:Y-130,width:W,height:50, scaleX:0.7, scaleY:0.7, clip:false, clearScreen:false});
        this.pawsome = new Pawsome({x:X+50,y:Y-110,width:W,height:50, scaleX:0.6, scaleY:0.6,clip:false, clearScreen:false});
        this.meowrvelous = new Meowrvelous({x:X+200,y:Y-130,width:W,height:50, scaleX:0.7, scaleY:0.7, clip:false, clearScreen:false});
        this.fancatstic = new Fancatstic({x:X+200,y:Y-130,width:W,height:50, scaleX:0.9, scaleY:0.9, clip:false, clearScreen:false});
        this.add(this.rainbow);
        this.add(this.shapes);
        this.add(this.stars);
        this.add(this.bigstar);
        this.add(this.wintext);
        this.add(this.purrfect);
        this.add(this.catnificent);
        this.add(this.pawsome);
        this.add(this.meowrvelous);
        this.add(this.fancatstic);

    }
    set winAmount(w) {
        this.wintext.text = w.toFixed(2);
    }
    show(amount) {
        this.winAmount = amount;
        this.wintext.y = Y;
        var cost = Config.stakePerLine * Config.numLines;
        var pc = amount / cost;
        var screen;

        if (pc<1) {
            return false;
        } else if (pc>=1 && pc<3) {
            screen = "pawsome";
        } else if (pc>=3 && pc<5) {
            screen = "catnificent";
        } else if (pc>=5 && pc<7) {
            screen = "meowrvelous";
        } else if (pc>7 && pc<9) {
            screen = "fancatstic";
        } else {
            screen = "purrfect";
        }



/*
        if (pc<20) {
            return false;
        } else if (pc>=20 && pc<40) {
            screen = "pawsome";
        } else if (pc>=40 && pc<60) {
            screen = "catnificent";
        } else if (pc>=60 && pc<80) {
            screen = "meowrvelous";
        } else if (pc>80 && pc<100) {
            screen = "fancatstic";
        } else {
            screen = "purrfect";
        }
*/
        var busy = 10;
        this.rainbow.visible = this.shapes.visible = this.stars.visible = this.purrfect.visible = this.catnificent.visible = this.pawsome.visible = this.fancatstic.visible = this.meowrvelous.visible = false;
        var sc = null;
        switch(screen) {
            
            case "small":
                this.bigstar.baseScale = 0.5;
                this.wintext.baseScale=0.6;
                busy = 5;
                break;
            case "pawsome":
                this.pawsome.visible = true;
                this.pawsome.trigger();
                this.bigstar.baseScale = 0.6;
                this.wintext.baseScale=0.6;
                sc = this.pawsome;
                busy = 6;
                audiomanager.play("Pawsome");
                break;
            case "catnificent":
                this.catnificent.visible = true;
                this.catnificent.trigger();
                this.bigstar.baseScale = 0.7;
                this.wintext.baseScale=0.7;
                busy = 7;
                sc = this.catnificent;
                audiomanager.play("Catnificent");
                break;
            case "meowrvelous":
                this.meowrvelous.visible = true;
                this.meowrvelous.trigger();
                this.bigstar.baseScale = 0.8;
                this.wintext.baseScale=0.8;
                this.shapes.visible = this.stars.visible = true;
                busy = 8;
                sc = this.meowrvelous;
                audiomanager.play("Meowrvelous");
                break;
            case "fancatstic":
                this.fancatstic.visible = true;
                this.fancatstic.trigger();
                this.bigstar.baseScale = 0.8;
                this.wintext.baseScale=0.8;
                this.shapes.visible = this.stars.visible = this.rainbow.visible = true;
                busy = 9;
                sc = this.fancatstic;
                audiomanager.play("Fancatstic");
                break;
            case "purrfect":
                this.catnificent.visible = this.rainbow.visible = this.shapes.visible = this.stars.visible = true;
                this.catnificent.trigger();
                this.bigstar.baseScale = 1;
                this.wintext.baseScale=1;
                busy = 10;
                sc = this.purrfect;
                audiomanager.play("Purrfect");
                break;

        }
        audiomanager.duck(music,0.3,1.5);
        this.visible = true;
        this.scaleX = this.scaleY = 0;
//        this.rotation = 3.142*2;
        toplayer.dark.darken(true);
        this.animate({scaleX:1.1,scaleY:1.1,opacity:1, rotation:0},0.5, function(o) {
            o.animate({scaleX:1,scaleY:1},0.2);
        })
        toplayer.coins.launch(busy,30);
        return true;
    }
    hide() {
        this.animate({scaleX:0,scaleY:0,opacity:0},0.5, function(o) {
            o.visible = false;
        });
        toplayer.coins.stop();
        toplayer.dark.darken(false);
    }
    update(delta) {
        super.update(delta);
        this.wintext.update(delta);
    }
}
