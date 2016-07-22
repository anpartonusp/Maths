class Character extends Sprite {
    constructor(src, map, dat) {
        super(src, dat);
        this.targets = null;
        this.map = map;
        this.astarCallback = function() {};
    }
    placeInMap() {
        if (this.map.map) {
            var pos = to2round({x: this.x, y: this.y});
            if (pos.x>0 && pos.x<100 && pos.y>0 && pos.y<100) {
                this.map.map[pos.x][pos.y].character = this;
            }
        }
    }

    setTargets(posList, callback) {
        this.astarCallback = callback || function() {};
        this.targets = [];
        posList.forEach(function(i) {
            this.targets.push({x:i.x,y:i.y});
        }.bind(this));
        this.stop();
        this.moveToNextTarget(true);
    }
    moveToNextTarget(first) {
        if (this.targets.length==0) {
            this.targets = null;
            this.astarCallback();
            return;
        }
        var curve = "linear";
        if (first) curve = "easeInQuad";

        var pos = this.targets.shift();
        if (this.targets.length==0) curve = "easeOutQuad";
        var three = to3(pos);
        var a = this.x-three.x;
        var b = this.y-three.y;
        var c = Math.sqrt(a*a + b*b);
        var time = c / 128;
        this.animate(to3(pos),curve=="linear" ? time : time * 1.5, function(o) {
            if (o.targets.length==1) {
                o.map.target.active = false;
            }
            o.moveToNextTarget(false);
        }, curve)
    }

    makeVisible(v) {
        if (v && this.map && this.map.chars.indexOf(this)==-1) {
            this.map.chars.push(this)
        } else if (!v && this.map) {
            var i = this.map.chars.indexOf(this);
            if (i!=-1) {
                this.map.chars.splice(i,1);
            }
        }
    }
}
