

class Text extends Entity {
    constructor(txt, dat) {
        super();
        this._text = txt;
        this._font = "arial";
        this._fontSize = 20;
        this.align = "center";
        this._color = "white";
        this._strokeColor = "none";
        this._strokeWidth = 1;
        this._fontWeight = 400;
        this.alwaysCache = false;
        merge(this, dat);
        this.CANVAS = this.SURF = null;
        this.cacheTimer = 2;
        this.ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;    //Slightly different text positioning on ff
        this.cacheTimer = 3;
    }
    set text(t) {
        if (t!=this._text) {
            this._text = t;
            this.cache();
        }
    }
    set font(f) {
        if (f!=this._font) {
            this._font = f;
            this.cache();
        }
    }
    set fontSize(s) {
        if (s!=this._fontSize) {
            this._fontSize = s;
            this.cache();
        }
    }
    set color(c) {
        if (c!=this._color) {
            this._color = c;
            this.cache();
        }
    }
    set strokeColor(c) {
        if (c!=this._strokeColor) {
            this._strokeColor = c;
            this.cache();
        }
    }
    set strokeWidth(w) {
        if (w!=this._strokeWidth) {
            this._strokeWidth = w;
            this.cache();
        }
    }
    set fontWeight(w) {
        if (w!=this._fontWeight) {
            this._fontWeight = w;
            this.cache();
        }
    }

    cache() {
        if (!this.CANVAS) {
            this.CANVAS = document.createElement("canvas");
            this.SURF = this.CANVAS.getContext("2d");
        }
        var c = this.CANVAS;
        var s = this.SURF;
        this.textWidth = s.measureText(this._text).width;
        c.width = this.textWidth;
        c.height = this.textHeight;
        s = this.SURF = this.CANVAS.getContext("2d");
        s.font = `${this._fontWeight} ${this._fontSize}px ${this._font}`;
        s.textAlign = "left";
        this.textWidth = s.measureText(this._text).width+10;
        this.textHeight = this._fontSize * 1.5;
        c.width = this.textWidth;
        c.height = this.textHeight;
        s = this.SURF = this.CANVAS.getContext("2d");
        s.font = `${this._fontWeight} ${this._fontSize}px ${this._font}`;
        s.textAlign = "left";
        s.fillStyle = this._color;
        s.textBaseline = "top";

        s.clearRect(0,0,c.width, c.height);
        s.save();
        if (this.shadowColor!="none") {
            s.shadowColor = this.shadowColor;
            s.shadowBlur = this.shadowBlur;
            s.shadowOffsetX = this.shadowX;
            s.shadowOffsetY = this.shadowY;
        }

        s.fillStyle = this._color;
        var yyy = 0;
        if (this.ff) {
            yyy = this._fontSize/3;
        }
        s.fillText(this._text,0,yyy);
        s.restore();
        if (this._strokeColor!="none") {
            s.strokeStyle = this._strokeColor;
            s.lineWidth = this._strokeWidth;
            s.strokeText(this._text,0,yyy);
        }

    }


    _update(delta) {
        super._update(delta);
        //this forces a redraw randomly - in case the font wasn't loaded first time

        this.cacheTimer-=delta;
        if (this.cacheTimer<=0 || this.alwaysCache) {
            this.cache();
            this.cacheTimer = randomInt(10,20);
        }



        if (this.CANVAS) {

            if (this.cacheTimer>0) {
                this.cacheTimer-=delta;
                if (this.cacheTimer<=0) {
                    this.cache();
                }
            }

            var s = this.surf;
            s.save();
            var c = this.CANVAS;
            var off = this.align=="center" ? 0.5 : this.align=="right" ? 1 : 0;
            s.translate(this.x,this.y);
            s.scale(this.scaleX, this.scaleY);
            s.rotate(this.rotation);

            var a = this.parent ? this.parent.opacity : 1;
            var o = this.opacity * a;

            if (o<1) {
                s.globalAlpha = o;
            }
            s.drawImage(c,-c.width*off,-c.height/2);


            this.children.forEach(function(ch) {
                ch._update(delta);
            }.bind(this));
            s.restore();

            return;
        }



        var s = this.surf;
        s.save();
        s.translate(this.x,this.y);
        s.font = `${this._fontWeight} ${this._fontSize}px ${this._font}`;
        s.textAlign = this.align;
        s.fillStyle = this._color;
        s.textBaseline = "middle";
        s.scale(this.scaleX, this.scaleY);
        s.rotate(this.rotation);

        if (this.opacity<1) {
            s.globalAlpha = this.opacity;
        }
        s.save();
        if (this.shadowColor!="none") {
            s.shadowColor = this.shadowColor;
            s.shadowBlur = this.shadowBlur;
            s.shadowOffsetX = this.shadowX;
            s.shadowOffsetY = this.shadowY;
        }
        s.fillText(this._text,0,0);
        s.restore();
        if (this._strokeColor!="none") {
            s.strokeStyle = this._strokeColor;
            s.lineWidth = this._strokeWidth;
            s.strokeText(this._text,0,0);
        }

        this.children.forEach(function(ch) {
            ch._update(delta);
        }.bind(this));



        s.restore();
    }

}

