
class BoxLayer extends View {
    constructor(dat) {
        super(dat);
        this.wins = null;
        this.winLine = null;
        this.columns = [];
        //Add columns left-to-right - so they draw in the right order
        for (var i = 0;i<5;i++) {
            var c = new Column({x:200+(i*178),y:720/2 + (i*2),width:200,height:700, col:i}, i*150);
            this.columns.push(c);
            this.add(c);
        }
        this.spinning = false;
        this.thickness = 0;
        this.clip = false;
        this.handleX = 0.5;
        this.handleY = 0.5;

        this.disabledTimer = 2;

    }
    resetStartPositions() {
        for(var i = 0;i<5;i++) {
            this.columns[i].resetStartPosition();
        }
    }
    moveBoxToBackup(x,y) {
        this.columns[x].moveBoxToBackup(y);
    }

    clear() {
        for(var i = 0;i<5;i++) {
            this.columns[i].clear(i*100);
        }
    }
    getBox(x,y) {
        return this.columns[x].getBox(y);
    }

    /**
     * Clears the board, which will automatically fill up with whatever boxes are in the queue
     */
    clearGrid() {
        this.clear();
    }
    update(delta) {
        super.update(delta);
        this.disabledTimer-=delta;
        if (this.disabledTimer<0) this.disabledTimer = 0;

    }

    /**
     * Called after the main update function, still rotated & scaled & translated & shit
     * @param delta
     */

    postDraw(delta) {
        if (!this.wins) return;
        this.thickness += delta*5;
        var s = this.surf;
        s.save();
        s.lineWidth = Math.abs(Math.sin(this.thickness)) * 8;
        s.lineCap = "round";
        s.globalAlpha = 0.8;
        s.strokeStyle = "red";

        s.beginPath();
        s.moveTo(this.wins[0].screenX, this.wins[0].y);

        for (var i = 1;i<this.wins.length;i++) {
            var b = this.wins[i];
            s.lineTo(b.screenX,b.y);
        }
        s.stroke();
        s.restore();

    }


    moveBoxToBackupColumn(x,y) {
        this.columns[x].moveBoxToBackup(y);
    }
    get animating() {
        for(var i = 0;i<5;i++) {
            if (this.columns[i].animating) return true;
        }
        return false;
    }

}
