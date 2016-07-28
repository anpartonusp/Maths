class MapItem extends Sprite {
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
                    coll = true;
                }
            }
        }.bind(this));
        if (!coll) this.currCollision = null;

    }
    onCollide(other) {};

    /**
     * Places the character in the map array for drawing
     */
    placeInMap() {
        if (this.map.map) {
            var pos = to2round({x: this.x, y: this.y});
            if (pos.x>0 && pos.x<100 && pos.y>0 && pos.y<100) {
                this.map.map[pos.x][pos.y].character.push(this);    //.push(this);
            }
        }
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
}
