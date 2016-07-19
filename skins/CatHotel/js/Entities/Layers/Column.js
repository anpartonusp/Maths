/**
 * Magic numbers used to control the speed the boxes drop
 * @type {number}
 */
const DROPTIME = 0.15;
const DROPFROM = 600;
const DROPMULT = 2.3;

var reels = [
    ["2","3","4","5","6","6","7","7","7","8","8","8","8"],
    ["2","3","4","5","6","6","7","7","7","8","8","8","1"],
    ["2","3","4","5","6","6","7","7","7","8","8","8","1"],
    ["2","3","4","5","6","6","7","7","8","8","8","1","1"],
    ["2","3","4","5","6","6","7","7","7","8","8","8","8","1"],
]


/**
 * Column class. Represents one vertical column.
 * Contains room for 3 Box classes.
 */
class Column extends View {
    constructor(dat, initialDelay) {
        super(dat);
        this.yposes = [0,165,330,395];

        this.clearScreen = false;
        this.clip = false;
        this.boxes = [];
        this.boxesBackup = [null, null, null]; //Backup array where boxes go to die
        this.backupQueue = [];
        for(var i = 0;i<3;i++) {
            var sym = randomInt(1,8);
            var b = retrieveBox(sym, this);    //new Box();

            b.x = this.width/2;
            b.y = this.yposes[i]-700;
            b.targetY = this.yposes[i];
            this.boxes.push(b);
            b.startDrop(initialDelay + (2-i)*200);
        }
    }

    getNewSymbol(reel, line) {
        var r = reels[reel];
        return (parseInt(r[line])+1).toString();
    }
    /**
     * removes boxes from the column
     * @param delay - delay before dropping boxes off screen
     *
     * removes the boxes from the box array. Adds the Boxes to the viewport and starts them dropping
     */

    clear(delay) {
        setTimeout(function() {
            for(var i = 2;i>=0;i--) {
                if (this.boxes[i]) {
                    this.boxes[i].autoDraw = true;
                    this.boxes[i].dropOffScreen(1-(i/3));
                    this.add(this.boxes[i]);
                    this.boxes[i] = null;
                }
            }
        }.bind(this), delay)
    }

    /**
     * gets the symbol of the box indicated (0 - top, 2 - bottom)
     * @param index
     * @returns {*}
     */
    getSym(index) {
        if (this.boxes[index])
            return this.boxes[index].symbol;
        else
            return null;
    }

    /**
     * returns the box at the specified position
     * @param index
     * @returns {Box at position [index] or null}
     */
    getBox(index) {
        return this.boxes[index];
    }
    moveBoxToBackup(index, delay) {
        delay = delay || 0;
        this.backupQueue.push(
            {
                timer:2,
                index:index
            }
        );
    }
    resetStartPosition() {
        this.startPosition = -160;
    }
    /**
     * Checks to see whether any column spaces are empty. if so, moves the box above, or creates a new one
     * Also does all the drawing
     *
     * @param delta - times since last frame
     */
    update(delta) {
        if (ui.isTitle) return;
        for(var i = this.backupQueue.length-1;i>=0;i--) {
            b = this.backupQueue[i];
            b.timer-=delta;
            if (b.timer<=0) {
                if (this.boxes[b.index]) {
                    this.boxesBackup[b.index] = this.boxes[b.index];
                    this.boxes[b.index] = null;
                }
                this.backupQueue.splice(i,1);

            }
        }


        var b = this.boxes;
        var b2 = this.boxesBackup;

        for(var i = 2;i>=0;i--) {
            var rot = Math.random();
            rot = randomInt(0,100)<50 ? rot : -rot;

            if (!b[i]) {
                if (i==2) {
                    if (b[i-1]) {
                        b[i] = b[i-1];
                        b[i-1]=null;
                        b[i].targetY = this.yposes[i];
                        b[i].startDrop(0,DROPTIME,0);
                        if (b2[i]) {
                            b[i].boxToCrush = b2[i];
                        }
                        break;
                    } else if (b[i-2]) {
                        b[i] = b[i-2];
                        b[i-2]=null;
                        b[i].targetY = this.yposes[i];
                        b[i].startDrop(0,DROPTIME*2,0);
                        if (b2[i]) {
                            b[i].boxToCrush = b2[i];
                        }

                        break;
                    } else {
                        var sym = this.getNewSymbol(this.col,2);
                        var box = retrieveBox(sym,this);
                        box.x = this.width/2;
                        box.y = this.yposes[i]-DROPFROM;
                        box.dy = 1000;
                        box.targetY = this.yposes[i];
                        b[i] = box;
                        box.startDrop(this.col*100,DROPTIME*DROPMULT, 0,"linear");
                        if (b2[i]) {
                            b[i].boxToCrush = b2[i];
                        }
                        break;
                    }
                } else if (i==1) {
                    if (b[i-1]) {
                        b[i] = b[i - 1];
                        b[i - 1] = null;
                        b[i].targetY = this.yposes[i];
                        b[i].startDrop(0, DROPTIME,0);
                        if (b2[i]) {
                            b[i].boxToCrush = b2[i];
                        }

                        break;
                    } else {
                        var sym = this.getNewSymbol(this.col,1);
                        var box = retrieveBox(sym,this);

                        box.x = this.width/2;
                        box.y = this.yposes[i]-DROPFROM;

                        box.dy = 1000;
                        box.targetY = this.yposes[i];
                        b[i] = box;
                        box.startDrop(this.col*100+200,DROPTIME*DROPMULT, 0, "linear");
                        if (b2[i]) {
                            b[i].boxToCrush = b2[i];
                        }

                        break;
                    }
                } else if (i==0) {
                    var sym = this.getNewSymbol(this.col,0);
                    var box = retrieveBox(sym,this);

                    box.x = this.width/2;
                    box.y = this.yposes[i]-DROPFROM;
                    box.dy = 1000;

                    box.targetY = this.yposes[i];
                    b[i] = box;
                    box.startDrop(this.col*100+300,DROPTIME*DROPMULT, 0, "linear");
                    if (b2[i]) {
                        b[i].boxToCrush = b2[i];
                    }
                    break;
                }
            }
        }

        /**
         * update crushBoxes settings
         */
        for(var i = 2;i>=0;i--) {
            if (b2[i]) {
                for(var j = 2;j>=0;j--) {
                    if (b[j] && b[j].y<b2[i].y) {
                        b[j].boxToCrush = b2[i];
                        break;
                    }
                }
            }
            if (i!=2 && b[i] && b[i+1]) {
                if ((b[i+1].y-b[i].y)<160) {
                    b[i].y = b[i+1].y-160;
                    b[i].dy = 0;
                }
            }
        }




        /**
         * update the box sprites
         */


        for(var i = 2;i>=0;i--) {
            //Draw the backup column first (which holds doomed boxes)
            if (b2[i]) {
                b2[i]._update(delta);
                //b2[i].draw();
                if (b2[i].destroyMe) {
                    returnBox(b2[i]);
                    b2[i] = null;
                }
            }
            if (b[i]) {
                b[i]._update(delta);
                //b[i].draw();
                if (b[i].destroyMe) {
                    returnBox(b[i]);
                    b[i] = null;
                }
            }

        }
        var B = [];
        for(var i = 0;i<3;i++) {
            if (b[i]) {
                B.push(b[i])
            }
            if (b2[i]) {
                B.push(b2[i])
            }
        }
        B.sort(function(a,b) {
            return b.y-a.y;
        });
        B.forEach(function(bb) {
            bb.draw();
        })

    }

    /**
     * are any boxes animating?
     * @returns {boolean}
     */

    get animating() {
        for(var i = 0;i<3;i++) {
            if (this.boxes[i] && this.boxes[i].dropping) {
                return true;
            }
        }

        return false;
    }

    /**
     * Destroys the specified box. Just shrinks it down, and destroys at end of animation
     * @param index
     */
    destroyBox(index) {
        if (this.boxes[index]) {
            this.boxes[index].animate({scaleX:0,scaleY:0},0.2, function(o) {
                o.destroyMe = true;
                returnBox(o);
            });
        }
    }
}

