const GRAVITY = 4000;
const MAX_GRAVITY = 30000;

var OFFSETX = 0;
var OFFSETY = 0;

/**
 * Box factory functions
 */

var boxFactory = [];

function retrieveBox(type, parent) {
    var b = new Box(null, type);
    b.parent = parent;
    return b;
}

function returnBox(box) {
}

class JumpingCat extends Sprite {
    constructor(path,dat) {
        super(path,dat);

        this.ay = 0;
        this.xx = this.x;
        this.yy = this.y;
        this.jumping = false;


    }
    jump() {
        this.xx = this.x;
        this.yy = this.y;
        this.ay = 0;

        this.jumping = true;

    }
    update(delta) {
        super.update(delta);
        if (this.jumping) {
            if (this.currFrame>=this.firstUnclippedFrame) {
                this.ay+=80*delta;
                this.yy += this.ay;
                this.xx -= 800*delta;
            }
            this.x = snap(this.xx,8);
            this.y = snap(this.yy,8);
            if (this.y > 800) {
                this.destroyMe = true;
            }
        }
    }
}



class Box extends Sprite {
    constructor(src, sym) {
        super(src);

        this.sprite = new JumpingCat(`cat${sym}_trigger_01`);   //boxSprites[sym].cat);
        if (boxSprites[sym].triggerAnim) {
            this.sprite.addFrameAnimation("TRIGGER",boxSprites[sym].triggerAnim);
        }
        this.blink = boxSprites[sym].blink || false;
        this.blinkTimer = randomInt(5,20);
        this.mask = new Sprite(`cat${sym}_mask`);
        this.secondMask = boxSprites[sym].hasOwnProperty("mask2") ? boxSprites[sym].mask2 : "";
        this.mask.scaleX = this.mask.scaleY = 2;
        this.mask.opacity = 0.0;
        this.source = boxSprites[sym].box;
        if (boxSprites[sym].hasOwnProperty("jumpAnim")) {
            this.sprite.addFrameAnimation("JUMP",boxSprites[sym].jumpAnim);
            this.sprite.firstUnclippedFrame = boxSprites[sym].firstUnclippedFrame || 0;
        }
        if (boxSprites[sym].collapseAnim) {
            this.addFrameAnimation("COLLAPSE",boxSprites[sym].collapseAnim)
        }

        this.dust = new Sprite("blank",{x:randomInt(-40,40),y:95});
        this.dust.addFrameAnimation("DUST", DustAnim);
        this.glow = new Sprite("win_glow",{x:this.x,y:this.y, scaleX:0,scaleY:0,opacity:0});
        //this.wildglow = new Sprite("win_glow_wild",{x:this.x,y:this.y, scaleX:0,scaleY:0,opacity:0});

        this.targetY = 0;
        this.dying = false;
        this.markedForDeath = false;

        //this.jumpSprite = null;
        this.darkened = false;


        this.symbol = sym;
        this.originalX = this.x;

        this.mask.opacity = 0;

        this.source = boxSprites[sym].box;
        this.dropping = false;
        this.dropTimer = 0;
        this.ay = 0;
        this.dy = 0;
        this.boxToCrush = null;
        //this.glowing = false;
        this.glowTimeoutHandle = null;
        this.crushplayed = false;
    }
    setGlow(on, delay=0, wild=false) {
        clearTimeout(this.glowTimeoutHandle);
        setTimeout(function() {
            if (on) {   //} && !this.glowing) {
                this.glowing = true;
                this.glow.source = wild ? "win_glow_wild" : "win_glow";
                this.glow.stop().animate({opacity:1, scaleX:2.3, scaleY:2.3},0.2, function(o) {
                    o.animate({scaleX:2.1,scaleY:2.1},0.1);
                });
                return;
            }
            if (!on) {  //} && this.glowing) {
                this.glowing = false;
                this.glow.stop().animate({opacity:0, scaleX:0, scaleY:0},0.2);
            }

        }.bind(this),Math.max(delay,10));
    }

    darken(d) {
        if (d) {
            if (!this.darkened) {
                this.darkened = true;
                this.mask.stop().animate({opacity: 0.7}, 0.3);
            }
        } else {
            if (this.darkened) {
                this.darkened = false;
                this.mask.stop().animate({opacity: 0.0}, 0.3);
                this.setGlow(false);
            }
        }
    }
    startDrop(delay, speed, rotation) {
        speed = speed || 1;
        this.rotation = rotation || 0;
        this.dropping = true;
        this.dropTimer = delay/1000;
    }
    dropOffScreen(timeToTake) {
        var rot = Math.random()*4;
        rot = randomInt(0,100)<50 ? rot : -rot;
        this.animate({y:this.y + 5000, rotation:rot},timeToTake, function(o) {
            o.destroyMe = true;
            returnBox(o);
        }, "easeInQuad");

    }
    bounce(o) {
        audiomanager.play("BoxLand", this.parent.x);
        if (this==this.parent.boxes[2]) {   //Are we on the ground?
            o.dust.startFrameAnimation("DUST");
        }

        var YOFF = 13;
        var SCALE = 0.9;

        if (randomInt(0,100)>50) {
            o.animate({y: o.y + YOFF, rotation: 0.00, scaleX:1.1,scaleY: SCALE}, 0.05, function (o) {
                o.animate({y: o.y - YOFF, rotation: -0.0, scaleX:1,scaleY: 1}, 0.2, function (o) {
                    o.animate({rotation: 0}, 0.07);
                });
            });
        } else {
            o.animate({y: o.y + YOFF, rotation: -0.00, scaleX:1.1,scaleY: SCALE}, 0.05, function (o) {
                o.animate({y: o.y - YOFF, rotation: +0.0, scaleX:1,scaleY: 1}, 0.2, function (o) {
                    o.animate({rotation: 0}, 0.07);
                });
            });
        }
    }

    killMe(delay) {
        if (!this.dying) {
            this.dying = true;
        }
    }

    explodeMe(delay) {
        setTimeout(function() {
            this.animate({scaleX:0,scaleY:0, rotation:3.142, opacity:0},0.4, function(o) {
                o.destroyMe = true;
                returnBox(o);
            })
        }.bind(this),delay || 0)
    }
    _update(delta) {
        super._update(delta);
        if (this.sprite)
            this.sprite._update(delta);
        if (this.mask)
            this.mask._update(delta);
        if (this.glow) {
            this.glow._update(delta);

        }
        this.dust._update(delta);
        if (this.blink && !this.markedForDeath && this.mask.opacity<0.001) {
            this.blinkTimer -= delta;
            if (this.blinkTimer<=0) {
                this.blinkTimer = randomInt(30, 60);
                //anp blink
                if (this.sprite && !this.sprite.currAnimation) {
                    this.sprite.startFrameAnimation("TRIGGER");
                    audiomanager.play("Cat"+this. symbol, this.x+this.parent.x);
                }
            }

        }
    }
    update(delta) {
        super.update(delta);
        if (this.dropping) {
            this.dropTimer-=delta;
            if (this.dropTimer<=0) {
                this.ay = GRAVITY;
                this.dy = Math.min(this.dy + GRAVITY * delta, MAX_GRAVITY);
                this.y += this.dy * delta;
                if (this.y >= this.targetY) {
                    this.dropping = false;
                    this.y = this.targetY;
                    this.bounce(this);
                }
            }
            if (this.boxToCrush) {
                let H = 90;
                let NUMFRAMES = 5;
                let bc = this.boxToCrush;
                if ((this.y+H)>=(bc.y-H)) {
                    if (!this.crushplayed) {
                        audiomanager.play("Crush", this.x+this.parent.x);
                    }
                    var ratio = ((this.y+H)-(bc.y-H)) / (H*2);
                    var frame = Math.round(NUMFRAMES*ratio);
                   // if (frame>1)
                   //     bc.scale = 2;
                    bc.showFrame("COLLAPSE",frame);
                    this.y -= (this.dy*.5) * delta;
                    this.x += randomInt(-3,3);
                    this.rotation = randomInt(-5,5) / 200;
                    if (frame>=NUMFRAMES) {
                        bc.destroyMe = true;
                        this.boxToCrush = null;
                    }
                }
            }
        }
    }
    openBox() {
        if (!this.opening) {
            this.opening = true;
            if (this.sprite && this.sprite.hasAnimation("TRIGGER")) {
                if (this.secondMask!="") {
                    this.mask.source = this.secondMask; //Different mast is shown when box has opened. not all cats have these
                }
                var self = this;
                setTimeout(function () {
                    if (self.symbol>1) {
                        audiomanager.play("Cat"+self.symbol, self.x+self.parent.x);
                    }
                    this.startFrameAnimation("TRIGGER")
                }.bind(this.sprite), randomInt(0, 500));

            } else {
                this.markedForDeath = true;
            }
        }
    }
    closeBox() {
        if (this.opening) {
            this.opening = false;
            if (this.sprite && this.sprite.hasAnimation("TRIGGER")) {
                this.sprite.showFrame("TRIGGER",0);
            }
        }
    }

    jump(delay) {
        if (!this.jumping) {
            this.jumping = true;
            if (this.sprite) {
                if (this.sprite.hasAnimation("JUMP")) {
                    if (this.sprite.currAnimationName != "JUMP") {
                        if (this.symbol=="1") delay = 5;   //Make mouse jump straightaway
                        setTimeout(function () {
                            audiomanager.play(this.symbol=="1" ? "Squeak" : "Jump",this.x+this.parent.x);
                            this.sprite.x = this.x;
                            this.sprite.y = this.y; //Add the cat sprite to the parent VIEW
                            this.sprite.jump();
                            this.parent.add(this.sprite);
                            this.sprite.startFrameAnimation("JUMP");
                            //Sort the parent's children to ensure things draw in the correct order
                            this.parent.children.sort(function (a, b) {
                                return a.y >= b.y ? -1 : 1;
                            })
                            this.markedForDeath = false;
                            this.sprite = null;
                            this.dying = true;
                            audiomanager.play("cat1", this.parent.x);

                        }.bind(this), delay);
                    }
                } else {
                    this.killMe(0);
                }
            }
        }
    }

    draw() {
        if (this.markedForDeath) {
            this.x += randomInt(-1,1);
            this.rotation = randomInt(-3,3) / 200;
        }
        super.draw();
        if (!this.dying) {
            var s = this.surf;
            s.save();
            s.translate(this.x, this.y);
            s.rotate(this.rotation);
            s.scale(this.scaleX, this.scaleY);
            if (this.mask.opacity==0) {
                if (this.glow && this.glow.opacity > 0) {
                    this.glow.draw(-48, 22);
                }
            }
            if (this.sprite) {
                this.sprite.opacity = this.opacity;
                this.sprite.draw(0, 0);
            }
//            if (this.blink && !this.opening) {
//                this.blink.draw(0,0);
//            }
            if (this.mask && this.mask.opacity>0) {
                this.mask.draw(0,0);
                if (this.glow && this.glow.opacity > 0) {
                    this.glow.opacity = Math.min(this.glow.opacity,0.7);
                    this.glow.draw(-48, 22);
                }
            }
            if (this.dust.currAnimation) {
                this.dust.draw();
            }
            s.restore();

        }
        this.x = this.originalX;
    }
}

