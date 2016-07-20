class Player extends Sprite {
    constructor(path, dat) {
        super(path, dat);
        this.target = null;
        this.targets = null;
    }
    setTarget(pos) {
        this.target = pos;
        this.stop();
        if (pos) {
            var three = to3(pos);
            var a = this.x-three.x;
            var b = this.y-three.y;
            var c = Math.sqrt(a*a + b*b);
           // console.log("Distance is "+c/64);
            this.animate(to3(pos),c/128, function(o) {
                o.target = null;
            }, "linear")
        }
    }

    setTargets(posList) {
        this.targets = [];
        posList.forEach(function(i) {
            this.targets.push({x:i.x,y:i.y});
        }.bind(this));
        this.stop();
        this.moveToNextTarget();
    }
    moveToNextTarget() {
        if (this.targets.length==0) {
            this.targets = null;
            return;
        }
        var pos = this.targets.shift();
        var three = to3(pos);
        var a = this.x-three.x;
        var b = this.y-three.y;
        var c = Math.sqrt(a*a + b*b);
        this.animate(to3(pos),c/128, function(o) {
            o.moveToNextTarget();
        }, "linear")


    }
}
