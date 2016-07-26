class Npc extends Character {
    constructor(src, map, dat) {
        super(src, map, dat);
        this.pauseTimer = randomInt(5,20);

        this.walkSpeed /= 2.4;
        this.animationSpeed /=2.2;
        this.roamRadius = this.data.hasOwnProperty("roamRadius") ? parseInt(this.data.roamRadius) : 5;

        this.nameText = new Text(this.data.name,{color:"yellow", fontSize:14, font:"Anton", shadowColor:"black"});
    }

    update(delta) {
        if (!this.walking && this.wander) {
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
    }

    drawExtras() {
        var tx = this.x-20;
        var ty = this.y-40;
        this.nameText.x += (tx-this.nameText.x)*0.1;
        this.nameText.y += (ty-this.nameText.y)*0.1;
        this.nameText._update(0);

    }
}
