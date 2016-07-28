class Character extends Sprite {
    constructor(src, map, dat) {
        super(src, dat);
        this.type = "";
        this.map = map;
        this.collisionList = [];
        this.currCollision = null;

        this.targets = null;
        this.astarCallback = function() {};
        this.currDir = randomInt(0,7);
        this._character = 1;
        this.walkFrame = 0;
        this.walkSpeed = 128;
        this.walking = false;
        this.baseFrame = 0;
        this.animationSpeed = 8;
        this.animSpeed = 1/this.animationSpeed;
        this.diroffsets = [0,0,20,20,30,30,10,10];
    }
    addCollisionTarget(target) {
        if (this.collisionList.indexOf(target) == -1) {
            this.collisionList.push(target);
        }
    }

    testForCollisions() {
        var coll = false;
        this.collisionList.forEach(function (other) {
            if (other != this.currCollision) {
                if (Math.abs(this.x - other.x) <= 32 && Math.abs(this.y - other.y) <= 32) {
                    this.currCollision = other;
                    other.onCollide(this);
                    this.onCollide(other);
                    coll = true;
                }
            }
        }.bind(this));
        if (!coll) this.currCollision = null;

    }

    onCollide(other) {};


    update(delta) {
        this.animSpeed-=delta;
        if (this.animSpeed<=0) {
            this.animSpeed += 1 / this.animationSpeed;
            if (this.walking) {
                this.walkFrame += 1;
                if (this.walkFrame == 7) this.walkFrame = 0;
            }
            this.frame = this.baseFrame + this.walkFrame;
        }
    }
    /**
     * Places the character in the map array for drawing
     */
    placeInMap() {
        if (this.map.map) {
            var pos = to2round({x: this.x, y: this.y});
            if (pos.x>=0 && pos.x<100 && pos.y>=0 && pos.y<100) {
                this.map.map[pos.x][pos.y].character.push(this);    //.push(this);
            }
        }
    }

    set character(c) {
        this._character = c;
        this.baseFrame = this._character * 43 + this.diroffsets[this.currDir];
        this.frame = this.baseFrame + this.walkFrame;
    }
    /**
     * Directions are:
     * 0:south, 1:southwest, 2:west, 3:northwest, 4:north, 5:northeast, 6:east, 7:southeast
     * @param dir
     */
    changeDirection(dir) {
        this.baseFrame = this.diroffsets[dir] + (this._character * 43);
        this.frame = this.diroffsets[dir] + (this._character * 43) + this.walkFrame;
    }
    /**
     * Provides an array of waypoints
     * @param posList - array of squares
     * @param callback - callback to run when completed
     */
    setTargets(posList, callback) {
        this.astarCallback = callback || function() {};
        this.targets = [];
        posList.forEach(function(i) {
            this.targets.push({x:i.x,y:i.y});
        }.bind(this));
        this.stop();
        this._moveToNextTarget(true);
    }

    /**
     * Internal - pops a tile off the stack and starts moving towards it.
     * 0:south, 1:southwest, 2:west, 3:northwest, 4:north, 5:northeast, 6:east, 7:southeast
     * @param first
     * @private
     */
    _moveToNextTarget(first) {
        if (this.targets.length==0) {
            this.targets = null;
            this.astarCallback();
            this.walking = false;
            return;
        }
        this.walking = true;
        var curve = "linear";
        if (first) curve = "easeInQuad";

        var pos = this.targets.shift();

        var cp = to2({x:this.x,y:this.y});
        var tp = {x:pos.x-cp.x,y:pos.y-cp.y};
        var dir = -1;
        if (tp.x<0) {
            dir = 2;
            if (tp.y<0) {
                dir = 3;
            } else if (tp.y>0) {
                dir = 1;
            }
        } else if (tp.x>0) {
            dir = 6;
            if (tp.y<0) {
                dir = 5;
            } else if (tp.y>0) {
                dir = 7;
            }
        } else {    //we're up or down
            if (tp.y<0) {
                dir = 4;
            } else if (tp.y>0) {
                dir = 0;
            }
        }
        if (dir!=this.currDir) {
            this.currDir = dir;
            this.changeDirection(dir);
        }




        if (this.targets.length==0) curve = "easeOutQuad";
        var three = to3(pos);
        var a = this.x-three.x;
        var b = this.y-three.y;
        var c = Math.sqrt(a*a + b*b);
        var time = c / this.walkSpeed;
        this.animate(to3(pos),curve=="linear" ? time : time * 1.5, function(o) {
            if (o.targets.length==1) {
                o.map.target.active = false;
            }
            o._moveToNextTarget(false);
        }, curve)
    }

    /**
     * Adds (or removes) the character to the map internal list of Characters In effect, makes it active in the map
     * @param visible
     */
    makeVisible(visible) {
        if (visible && this.map && this.map.chars.indexOf(this)==-1) {
            this.map.chars.push(this)
        } else if (!visible && this.map) {
            var i = this.map.chars.indexOf(this);
            if (i!=-1) {
                this.map.chars.splice(i,1);
            }
        }
    }
    drawExtras() {};

    goto(pos2d) {
        var pos = to2({x:this.x, y:this.y});
        var cx = pos.x;
        var cy = pos.y;
        var res = astar.search(this.map.map, this.map.map[cx][cy], this.map.map[pos2d.x][pos2d.y], false);
        this.setTargets(res);
    }
}
