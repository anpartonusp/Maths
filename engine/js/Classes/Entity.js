var __ecnt = 1;
var canvas = null;
class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.handle = {
            x: 0.5,
            y: 0.5
        };
        this.size = null;
        this.width = 0;
        this.height = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.opacity = 1;
        this.canv = canvas.canvas;
        this.surf = canvas.surface;
        this.visible = true;
        this.enabled = true;
        this.name = "Entity "+__ecnt++;
        this.animations = [];
        this.children = [];
        this.stateManager = new StateManager();
        this.stateManager.obj = this;
        this.mouseX = 0;
        this.mouseY = 0;
        this.parent = null;
        this.shadowColor = "none";
        this.shadowX = 4;
        this.shadowY = 4;
        this.shadowBlur = 6;
        this.autoDraw = false;
        this.destroyMe = false;
        this._mouseisover = false;
        this.mouseEnabled = true;
        this.mouseButtonDown = false;

    }
    set scale(s) {
        this.scaleX = s;
        this.scaleY = s;
    }

    get scale() {
        return (this.scaleX+this.scaleY)/2;
    }
    get animating() {
        return this.animations.length>0;
    }

    get state() {
        return this.stateManager.state;
    }
    set state(s) {
        this.stateManager.state = s;
    }


    get right() {
        return this.x+(this.width * this.scaleX*(1-this.handle.x));
    }
    set right(r) {

        //this.width = r-this.x;
    }
    get bottom() {
        return this.y+(this.height*this.scaleY*(1-this.handle.y));
    }
    set bottom(b) {
        //this.height = b-this.y;
    }
    get top() {
        return this.y - this.height*this.scaleY*this.handle.y;
    }
    set top(t) {
        this.y = t;
    }
    get left() {
        return this.x - this.width*this.scaleX*this.handle.x;
    }
    set left(l) {
        //this.x = l;
    }
    get screenX() {
        var xx = this.x;
        var a = this;
        while (a.parent) {
            a = a.parent;
            xx+=a.x;
        }
        return xx;
    }
    onMouseMove(x,y) {};
    onMouseDrag(x,y, deltaX, deltaY, button) {};
    onMouseDown(x,y) {};
    onMouseUp(x,y) {};
    onWindowTouchEnd(x,y) {};
    onMouseEnter(x,y) {}
    onMouseLeave(x,y) {}
    onKeyDown(e) {};
    postDraw(delta) {};

    _update(delta) {
        this.updateAnimations(delta);

    }


    update(delta) {
    }
    draw() {};

    find(name) {
        for(var i = 0;i<this.children.length;i++) {
            if (this.children[i].name==name) {
                return this.children[i];
            }
        }
        return null;
    }

    add(obj) {
        if (this.type=="VIEW" && obj.type=="SPRITE") obj.autoDraw = true;
        obj.parent = this;
        this.children.push(obj);
        return obj;
    }
    unshift(obj) {
        if (this.type=="VIEW" && obj.type=="SPRITE") obj.autoDraw = true;
        obj.parent = this;
        this.children.unshift(obj);
        return obj;
    }
    remove(obj) {
        var i = this.children.indexOf(obj);
        if (i!=-1) {
            this.children.splice(i);
        }
    }
    addState(obj) {
        this.stateManager.add(obj);
    }

    fadeOut(t,callback) {
        this.animate({opacity:0},t,callback);
        return this;
    }
    fadeIn(t,callback) {
        this.animate({opacity:1},t,callback);
        return this;
    }

    _mousedrag(x,y,deltaX, deltaY, button) {
        if (this.visible && this.enabled && this.mouseEnabled) {
            var roted = rotatePoint(x, y, this.x, this.y, -this.rotation);
            x = roted.x;
            y = roted.y;
            var ok = (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
            if (this.type == "VIEW" && !this.clip) ok = true;
            if (ok) {
                this.onMouseDrag(this.mouseX, this.mouseY, deltaX, deltaY, button);
                this.children.forEach(function (ent) {
                    ent._mousemove(this.mouseX, this.mouseY, deltaX, deltaY, button);
                }.bind(this));
            }
        }


    }

    _mousemove(x,y) {
        if (this.visible && this.enabled && this.mouseEnabled) {
            var roted = rotatePoint(x,y,this.x,this.y,-this.rotation);
            x = roted.x;y = roted.y;
            var ok = (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
            if (this.type=="VIEW" && !this.clip) ok = true;
            if (ok) {
                this.mouseX = x-this.left;
                this.mouseY = y-this.top;
                if (!this._mouseisover) {
                    this._mouseisover = true;
                    this.onMouseEnter(this.mouseX, this.mouseY);
                } else if (this._mouseisover) {
                    this._mouseisover = false;
                    this.onMouseLeave(this.mouseX, this.mouseY);
                }
                this.onMouseMove(this.mouseX, this.mouseY);
                this.children.forEach(function (ent) {
                    ent._mousemove(this.mouseX, this.mouseY);
                }.bind(this));

            }
        }
    }
    _mousedown(x,y) {
        this.mouseButtonDown = true;
        this.lastMouseX = x;
        this.lastMouseY = y;
        if (this.visible && this.enabled && this.mouseEnabled) {
            var roted = rotatePoint(x,y,this.x,this.y,-this.rotation);
            x = roted.x;y = roted.y;

            var ok = (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
            if (this.type=="VIEW" && !this.clip) ok = true;
            if (ok) {
                this.mouseX = x - this.left;
                this.mouseY = y - this.top;
                var res = this.onMouseDown(this.mouseX, this.mouseY);
                if (typeof(res)=="undefined") res = true;
                if (res) {
                    this.children.forEach(function (ent) {
                        ent._mousedown(this.mouseX, this.mouseY);
                    }.bind(this));
                }
            }
        }
    }
    _mouseup(x,y) {
        this.mouseButtonDown = false;
        if (this.visible && this.enabled && this.mouseEnabled) {
            var roted = rotatePoint(x,y,this.x,this.y,-this.rotation);
            x = roted.x;y = roted.y;

            var ok = (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
            if (this.type=="VIEW" && !this.clip) ok = true;
            if (ok) {

                this.mouseX = x - this.left;
                this.mouseY = y - this.top;
                this.onMouseUp(this.mouseX, this.mouseY);
                this.children.forEach(function (ent) {
                    ent._mouseup(this.mouseX, this.mouseY);
                }.bind(this));

            }
        }
    }
    _windowtouchend(x,y) {
        this.mouseX = x;
        this.mouseY = y;
        this.onWindowTouchEnd(this.mouseX, this.mouseY);
        this.children.forEach(function (ent) {
            ent._windowtouchend(this.mouseX, this.mouseY);
        }.bind(this));
    }

    _keydown(e) {
        if (this.visible && this.enabled) {
            this.onKeyDown(e);
            this.children.forEach(function (ent) {
                ent._keydown(e);
            }.bind(this));
        }
    }
    disableMouse() {
        this.mouseEnabled = false;
    }
    enableMouse() {
        this.mouseEnabled = true;
    }
    animate(dat, duration, callback, type = "easeInOutQuad") {
        var a = new Anim(this, dat, duration, callback, type);
        this.animations.push(a);
    }
    stop() {
        this.animations = [];
        return this;
    }
    updateAnimations(delta) {
        for(var i = this.animations.length-1;i>=0;i--) {
            this.animations[i].update(delta);
            if (this.animations[i].counter>=1) {
                this.animations.splice(i,1);    //Remove any anims that have finished
            }
        }
    }


}

var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

class Anim {
    constructor(obj, dat, duration, callback, type, delay) {
        this.duration = duration;
        this.callback = callback;
        this.counter = 0;
        this.ease = EasingFunctions["easeInOutQuad"];
        this.obj = obj;
        this.delay = delay || 0;
        if (EasingFunctions.hasOwnProperty(type)) {
            this.ease = EasingFunctions[type];
        }

        this.start = {};
        this.end = {};
        for (var a in dat) {
            if (obj.hasOwnProperty(a) /*&& typeof(obj[a])==="number"*/) {
                this.start[a] = obj[a];
                this.end[a] = dat[a];
            }
        }
    }

    update(delta) {
        if ((this.delay-=delta)<=0) {
            this.counter += (delta / this.duration);
            if (this.counter > 1) this.counter = 1;
            for (var a in this.start) {
                this.obj[a] = this.start[a] + (this.end[a] - this.start[a]) * this.ease(this.counter);
            }
            if (this.counter >= 1 && this.callback) {
                this.callback(this.obj);
            }
        }
    }
}