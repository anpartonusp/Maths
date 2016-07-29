class Npc extends Character {
    constructor(src, map, dat) {
        super(src, map, dat);
        this.type = "npc";
        this.pauseTimer = randomInt(5,20);

        this.walkSpeed /= 2.4;
        this.animationSpeed /=2.2;
        this.roamRadius = this.data.hasOwnProperty("roamRadius") ? parseInt(this.data.roamRadius) : 5;

        this.nameText = new Text(this.data.name,{color:"yellow", fontSize:14, font:"Anton", shadowColor:"black"});
        this._highlighted = false;
        this.highlight = new HIGHLIGHT(general, {frame:1, visible:true});
        this.handle = {x: 0.5, y: 0.6};
    }

    set highlighted(t) {
        this._highlighted = t;

        this.highlight.show(t);
    }
    get highlighted() {
        return this._highlighted;
    }

    update(delta) {
        if (!this.visible) return;
        this.highlight._update(delta);
        if (!this.walking && this.wander && !this.highlighted && !this.map.paused) {
            this.pauseTimer-=delta;
            if (this.pauseTimer<=0) {
                this.pauseTimer = randomInt(5,20);
                var x,y, cx, cy;
                var pos = to2({x:this.x, y:this.y});
                cx = pos.x;
                cy = pos.y;

                do {
                    x = randomInt(Math.max(1,this.data.sourceX-this.roamRadius),Math.min(98,this.data.sourceX + this.roamRadius));
                    y = randomInt(Math.max(0,this.data.sourceY-this.roamRadius),Math.min(98,this.data.sourceY+this.roamRadius));
                } while (this.map.isCollide(x,y));
                var res = astar.search(this.map.map, this.map.map[cx][cy], this.map.map[x][y], false);
                this.setTargets(res);
            }
        }
        super.update(delta);
        if (this.highlighted) {
            this.testForCollisions();
        }
    }
    preDraw() {
        if (!this.visible) return;
        this.highlight.y = 25;
        this.highlight.draw();
    }


    drawExtras() {
        if (!this.visible) return;
        var tx = this.x-20;
        var ty = this.y-40;
        this.nameText.x += (tx-this.nameText.x)*0.1;
        this.nameText.y += (ty-this.nameText.y)*0.1;
        this.nameText._update(0);
    }

    selectMe() {
        this.highlighted = true;
        this.targets = [];

    }
}

class HIGHLIGHT extends Sprite {
    constructor(src, dat) {
        super(src,dat);
        this.visible = false;
    }
    startExpand() {
        this.animate({scaleX:1.1,scaleY:1.1, opacity:1},2,function(o) {
            o.animate({scaleX:1,scaleY:1, opacity:0.7},2,function(o) {
                o.startExpand();
            });
        })
    }
    show(b) {
        if (b && !this.visible) {
            this.scale = 0;
            this.visible = true;
            this.opacity = 0;
            this.stop().animate({scaleX:1.3, scaleY:1.3, opacity:1},0.4, function(o) {
                o.animate({scaleX:1,scaleY:1},0.2, function(o) {
                    o.startExpand();
                });
            });
        } else {
            this.stop().animate({scaleX:0,scaleY:0,opacity:0},0.25, function(o) {
                o.visible = false;
            })
        }
    }
}

