
class Cat extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this.falling = false;
        this.dy = 0;
    }
    fall(delay) {
        delay = delay || 10;
        setTimeout(function() {
            this.dy = 0;
            this.falling = true;
            var x = this.x+this.parent.x;
            audiomanager.play("Jump",x);
            setTimeout(function() {
                audiomanager.play("ComboLeave",x);
            }, 500);

        }.bind(this),delay);
    }
    update(delta) {
        if (this.falling) {
            this.dy += 200 * delta;
            this.y += this.dy;
            if (this.y > 900) {
                this.destroyMe = true;
            }
            //this.animate({rotation:3.142},2);
        }
    }
}

class ComboColumn extends View {
    constructor(location, dat) {
        super(dat);
        this.loc = location;
        this.flip = [false, true, true, true, false, false]; //This is list indicating whether the cat should be flipped when displayed on the left
        this.clearScreen = false;
        this.clip = false;
        this.yposes = [720-100, 720/2, 150];
        this.cats = [];
        this.counter = 0;

    }
    addCat(catId) {
        catId %=6;
        var s = new Cat("CH_combo_"+(catId+1));
        var x1 = this.loc=="LEFT" ? -100 : this.width+100;
        var x2 = this.loc=="LEFT" ? 80 : this.width-80;
        var overshoot = this.loc=="LEFT" ? 8 : -8;
        if (this.counter==3) {
            this.cats[0].fall();
            this.add(this.cats.shift());    //Move out of the cats array, and into the general children
            this.counter = 2;
            for(var i = 0;i<this.cats.length;i++) {
                this.cats[i].animate({y:this.yposes[i]},0.5,null,"easeOutQuad");
            }
        }
        s.y = this.yposes[this.counter]+100;
        s.x = x1;
        s.flipX = this.loc=="LEFT" ? this.flip[catId] : !this.flip[catId];

        s.animate({x:x2+overshoot,y:this.yposes[this.counter]},0.4, function(o) {
            o.animate({x:x2},0.2);
        });
        this.cats[this.counter] = s;
        this.counter++;
    }
    clear() {

        var i = this.cats.length;;
        while (this.cats.length) {
            var c = this.cats.pop();
            c.fall(200*i--);
            this.add(c);
        }
        this.counter = 0;
    }

    update(delta) {
        for(var i = this.cats.length-1;i>=0;i--) {
            var c = this.cats[i];
            if (c) {
                c._update(delta);
                c.draw();
            }
        }
    }
}

class CatComboLayer extends View {
    constructor(dat) {
        super(dat);
        this.leftColumn = new ComboColumn("LEFT",{x:100,y:Y,width:200,height:H});
        this.rightColumn = new ComboColumn("RIGHT",{x:W-100,y:Y,width:200,height:H});
        this.catCounter = 0;
        this.add(this.leftColumn);
        this.add(this.rightColumn);
        this.soundIndex = 1;
        //setInterval(function() {
        //    this.addCat();
        //}.bind(this),1000);

    }
    addCat() {
        var cc = this.catCounter;
        if (cc&1) {
            this.leftColumn.addCat(this.catCounter);
            audiomanager.play(`ComboArrive${this.soundIndex}`,100);
            audiomanager.play(`Purr`,100);
        } else {
            this.rightColumn.addCat(this.catCounter);
            audiomanager.play(`ComboArrive${this.soundIndex}`,1280-100);
            audiomanager.play(`Purr`,1280-100);
        }
        audiomanager.duck(music,0.3,1.0);
        audiomanager.play(`Combo${this.soundIndex}`);


        if (this.soundIndex<5)
            this.soundIndex++;

        this.catCounter++;
    }
    clear() {
        this.leftColumn.clear();
        this.rightColumn.clear();
        this.soundIndex = 1;
    }
}
