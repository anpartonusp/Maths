
var spriteInfo = [];



class Sprite extends Entity {
    constructor(path, dat) {
        super(dat);
        this.src = null;
        this.type = "SPRITE";
        this.frameAnimations = [];
        this.currFrame = null;
        this.currAnimation = null;
        this.flipX = this.flipY = false;
        this.originalImage = null;
        this.path = path;
        this.animOffsets = [];
        this.animOffset = {x:0,y:0};
        this.frames = [];
        this._frame = 0;
        this.spritesheet = null;
        dat = dat || {};
        merge(this, dat);
        if (path==null) {
            this.mouseEnabled = false;
            return;
        }
        this.source = path;



    }
    set source(path) {
        if (path==null) return;

        if (typeof(path)=="object" && path.hasOwnProperty("_spritesheet_")) {
            this.spritesheet = path;
            this.image = this.originalImage = path.image;
            console.log("Sprite from Spritesheet");
            return;
        }


        if (spriteInfo.hasOwnProperty(path)) {
            this.src = spriteInfo[path];
            this.image = this.originalImage = this.src.image;
        } else {
            if (path.indexOf("http:")!=-1) {
                this.image = this.originalImage = new Image();
                this.image.ready = false;
                this.image.onload = function() {
                    this.ready = true;
                }
                this.image.src = path;
                return;
            } else {
                this.image = this.originalImage = game.imageManager.get(path);
                this.src = null;
            }
        }

    }
    set frame(f) {
        this._frame = f;

    }
    get ready() {
        if (!this.image) return false;
        return this.image.ready;
    }
    get right() {
        var w = (this.src) ? this.src.width : this.image.width;
        return this.x+(w * this.scaleX * (1-this.handle.x));
    }
    set right(r) {

    }
    get bottom() {
        var h = (this.src) ? this.src.height : this.image.height;
        return this.y+(h*this.scaleY*(1-this.handle.y));
    }
    set bottom(b) {

    }
    get top() {
        var h = (this.src) ? this.src.height : this.image.height;
        return this.y - h*this.scaleY*0.5;
    }
    set top(t) {
        this.y = t;
    }
    get left() {
        if (!this.src && !this.image) return 0;
        var w = (this.src) ? this.src.width : this.image.width;
        return this.x - w*this.scaleX*this.handle.x;
    }
    set left(l) {
        //this.x = l;
    }
    get height() {
        if (!this.src && !this.image) return 0;
        return (this.src) ? this.src.height : this.image.height;
    }
    set height(h) {

    }

    draw() {
        var s = this.surf;
        if (this.image == null || !this.image.ready || !this.enabled || !this.visible) return;
        if (arguments.length==2) {
            this.x = arguments[0];
            this.y = arguments[1];
        }
        //this.x = Math.round(this.x);
        //this.y = Math.round(this.y);
        s.save();
        s.translate(this.x+this.animOffset.x, this.y+this.animOffset.y);
        if (this.rotation) s.rotate(this.rotation);
        var a = this.parent ? this.parent.opacity : 1;
        var o = this.opacity*a;
        if (o < 1) {
            s.globalAlpha = o;
        }
        if (this.shadowColor!="none") {
            s.shadowColor = this.shadowColor;
            s.shadowBlur = this.shadowBlur;
            s.shadowOffsetX = this.shadowX;
            s.shadowOffsetY = this.shadowY;
            s.shadowSize = this.shadowBlur/2;
        }
        //if (this.blur) {
        //    s.filter = "blur("+this.blur+"px)";
        //}
        if (this.spritesheet) {
            if (this.scaleX && this.scaleY) {
                s.scale(this.flipX ? -this.scaleX : this.scaleX, this.flipY ? -this.scaleY : this.scaleY);
                var area = this.spritesheet.get(this._frame);
                if (area) {
                    s.drawImage(this.image, area.x, area.y, area.w, area.h, -(area.w * this.handle.x), -(area.h * this.handle.y), area.w, area.h);
                }
            }
        } else if (this.src == null) {
            if (this.scaleX && this.scaleY) {
                s.scale(this.flipX ? -this.scaleX : this.scaleX, this.flipY ? -this.scaleY : this.scaleY);
                s.drawImage(this.image, -(this.image.width * this.handle.x), -(this.image.height * this.handle.y));
            }
        } else {    //We're from a sprite sheet
            if (this.scaleX && this.scaleY) {
                s.scale(this.flipX ? -this.scaleX : this.scaleX, this.flipY ? -this.scaleY : this.scaleY);
                s.drawImage(this.image, this.src.x, this.src.y, this.src.width, this.src.height, -(this.src.width * this.handle.x), -(this.src.height * this.handle.y), this.src.width, this.src.height);
            }
        }
        this.postDraw(0);
        //Draw all children
        this.children.forEach(function(ch) {
            ch.draw();
        }.bind(this));

        s.restore();
        return this;
    }
    _update(delta) {
        super._update(delta);
        this.processFrameAnimation(delta);
        this.update(delta);
        this.children.forEach(function(ch) {
            ch._update(delta);
        });
        return this;
    }


    /**
     * name: The name given to the animation
     * data: Holds frame and speed information
     *    speed: Time between frames (in seconds)
     *    loopType: 'none', 'loop', 'pingpong' [defaults to none]
     *    frames: array of frames in order. Can be sprites or paths to images
     *
     */

    addFrameAnimation(name, data) {
        this.frameAnimations[name] = data;

    }


    /**
     *
     * @param name - Name of animation
     * @param options :
     *  completeCallback [optional]: Called when the animation has ended
     *  loopCallback [optional]: Called when the animation loops
     *  frameCallback(frameNum) [optional]: Called at each frame
     *
     */
    startFrameAnimation(name, options) {
        options = options || {};
        if (this.frameAnimations.hasOwnProperty(name)) {
            var a = this.frameAnimations[name];
            this.animSpeed = a.speed;
            this.animTimer = 1/this.animSpeed;
            this.animFrame = this.currFrame = 0;
            this.animLoopCount = 0;
            this.completeCallback = options.completeCallback || function() {};
            this.loopCallback = options.loopCallback || function() {};
            this.frameCallback = options.frameCallback || function() {};
            this.currAnimation = a;
            this.currAnimationName = name;
            this.animOffsets = [];
            this.frames = [];
            a.frames.forEach(function(f) {
                var ao = {x:0,y:0};
                if (f.indexOf(":")!=-1) {
                    var ff = f.split(":");
                    if (ff.length==2) {
                        var ff2 = ff[1].split(",");
                        ao.x = parseFloat(ff2[0]);
                        ao.y = parseFloat(ff2[1]);
                    }
                    this.frames.push(ff[0])
                } else {
                    this.frames.push(f);
                }
                this.animOffsets.push(ao);
            }.bind(this))
        }
    }

    stopFrameAnimation() {
        this.currAnimation = null;
    }
    /**
     * Does this sprite contain this animation?
     * @param name
     * @returns {boolean}
     */
    hasAnimation(name) {
        return this.frameAnimations.hasOwnProperty(name);
    }

    /**
     * Does all the animation processing
     * @param delta
     */
    processFrameAnimation(delta) {
        if (this.currAnimation) {
            this.animTimer-=delta;
            if (this.animTimer<=0) {
                var a = this.currAnimation;
                if (this.animSpeed==0) return;
                this.animTimer+=1/this.animSpeed;
                if (this.animTimer<0) this.animTimer = 1/this.animSpeed; //stops us getting too far behind
                this.animFrame++;
                this.currFrame = this.animFrame;
                if (this.animFrame==this.frames.length) {
                    if (a.loopType=="none") {
                        this.completeCallback();
                        this.currAnimation = null;
                        return;
                    } else if (a.loopType=="loop") {
                        this.animLoopCount++;
                        this.loopCallback(this.animLoopCount);
                        this.animFrame = 0;
                    }
                }
                this.source = this.frames[this.animFrame];
                this.animOffset = this.animOffsets[this.animFrame];
            }
        }
    }
    showFrame(name, frameNum) {
        if (this.hasAnimation(name)) {
            var a = this.frameAnimations[name];
            frameNum = Math.min(frameNum, a.frames.length-1);
            var f = a.frames[frameNum];
            if (f.indexOf(":")!=-1) {
                var f2 = f.split(":");
                if (f2.length==2) {
                    var f3 = f2[1].split(",");
                    this.animOffset = {x:parseFloat(f3[0]),y:parseFloat(f3[1])};
                }
                this.source = f2[0];
            } else {
                this.source = f;
                this.animOffset = {x:0,y:0};
            }
        }
    }
    hideAnimation() {
        this.source = this.originalImage;
        this.animOffset = {x:0,y:0};
        this.currAnimation = null;
    }
}


function addSprites(sps) {


    if (typeof(sps)=="string") {
        sps = [sps];
    }
    sps.forEach(function(sp) {
        $.ajax({
            url: `json/${sp}.json`,
            dataType:"json",
            async:false,
            success: function(data) {
                for (var s in data) {
                    var item = data[s];
                    spriteInfo[s] = {
                        x: item.x,
                        y: item.y,
                        width: item.width,
                        height: item.height,
                        image: game.imageManager.get("sprites/"+item.image.replace(/^.*[\\\/]/, ''))
                    }
                }
            }
        });

    })

}

function initSprites(sps) {
    spriteInfo = [];
    addSprites(sps);
}



