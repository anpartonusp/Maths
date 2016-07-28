class Lesson extends Character {
    constructor(src, map, dat) {
        super(src, map, dat);
        this.type = "lesson";
        var pos = to3({x:this.gx, y:this.gy});
        this.x = pos.x;
        this.y = pos.y;
        this.handle = {x:0.5,y:0.7};
        if (!this.hasOwnProperty("active")) this.active = true;
        this.score = 0;
    }

    activate(a = true) {
        this.frame = 2;
        if (a!=this.active) {

            if (a) {
                this.visible = true;
                this.active = a;
                this.opacity = 0;
                this.scale = 0;
                this.animate({scaleX: 1.5, scaleY: 1.5, opacity: 1}, 2, function (o) {
                    o.animate({scaleX: 1, scaleY: 1}, 1);
                })
            } else {
                this.animate({scaleX:0, scaleY:0}, 2, function(o) {
                    o.visible = false;
                    o.active = a;
                })
            }
            this.map.setOverrideTarget(this.x, this.y, 5);

        }
    }

    onCollide(other) {
        if (this.active) {
            this.activate(false);
        }
    }
    update(delta) {
        if (this.active) {
            this.testForCollisions();
        }
    }
    toJSON() {
        var data = {
            id:this.id,
            active:this.active,
            score:this.score,
        }
        return data;
    }
}
