var canvas;
const CANCEL = 93284;


class GameManager {
    constructor(dat) {
        this.imageManager = new ImageManager();
        this.backEnd = new BackEnd();
        this.children = [];
        //Merge the game config with main config

        Config = merge(Config, gameConfig || {});
        getCommandLine();

        MOCK = Config.settings.offline=="true"; //Sets offline mode if 'offline' is set to true in address bar

        function hideAddressBar()
        {
            if(!window.location.hash)
            {
                if(document.height < window.outerHeight)
                {
                    document.body.style.height = (window.outerHeight + 50) + 'px';
                }

                setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
            }
        }

        window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
        window.addEventListener("orientationchange", hideAddressBar );


        dat = dat || {};
        this.touch = false;
        this.fpsAvg = 0;
        this.fps = 0;
        canvas = this.canvas = new Canvas("container");
        canvas.size = {width: dat.width, height: dat.height};


        this.states = new StateManager(this);


        this.lastTime = 0;
        this.canv = canvas.canvas;
        this.surf = this.canv.getContext("2d");

        dat = dat || {};
        merge(this, dat);

        this.gameupdate();
        var el = document;

        this.lastX = 0;
        this.lastY = 0;

        $("#canvas").mousemove(function(e) {
            var pos = this.getMouseXY(e);
            if (e.buttons==1) {
                this.children.forEach(function(ent) {
                    ent._mousedrag(pos.x,pos.y, pos.x-this.lastX, pos.y-this.lastY,e.buttons);
                }.bind(this));
            } else {
                this.children.forEach(function (ent) {
                    ent._mousemove(pos.x, pos.y);
                }.bind(this));
            }
            this.lastX = pos.x;
            this.lastY = pos.y;
        }.bind(this));



        $("#canvas").mousedown(function(e) {
            if (!this.touch) {
                e.preventDefault();
                var pos = this.getMouseXY(e);
                this.lastX = pos.x;
                this.lastY = pos.y;
                for(var i = this.children.length-1;i>=0;i--) {
                    if (this.children[i]._mousedown(pos.x,pos.y)==CANCEL) return;
                }
                //this.children.forEach(function (vp) {
                //    vp._mousedown(pos.x, pos.y);
                //}.bind(this));
            }
        }.bind(this));


        $("#canvas").mouseup(function(e) {
            if (!this.touch) {
                e.preventDefault();
                var pos = this.getMouseXY(e);
                for(var i = this.children.length-1;i>=0;i--) {
                    if (this.children[i]._mouseup(pos.x,pos.y)==CANCEL) return;
                }

            }
        }.bind(this));

        window.ontouchend = function(e) {
            var pos = {x:e.offsetX,y:e.offsetY};
            this.children.forEach(function (vp) {
                vp._windowtouchend(pos.x, pos.y);
            }.bind(this));
        }.bind(this);

        window.onmouseup = function(e) {
            var pos = {x:e.offsetX,y:e.offsetY};
            this.children.forEach(function (vp) {
                vp._windowtouchend(pos.x, pos.y);
            }.bind(this));
        }.bind(this);

        window.onkeydown = function(e) {
            this.children.forEach(function(vp) {
                vp._keydown(e);
            }.bind(this));
        }.bind(this);
        window.focus();
/*
        //Load fonts
        WebFont.load({
            google: {
                families: Config.fonts
            },
            async : false
        });
*/
    }


    getMouseXY(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var scaleX = canvas.width / canvas.displayWidth;
        var scaleY = canvas.height / canvas.displayHeight;
        x*=scaleX;
        y*=scaleY;
        return {x:x,y:y};
    }



    add(obj) {
        obj.parent = this;
        this.children.push(obj);
        return obj;
    }
    remove(obj) {
        var i = this.children.indexOf(obj);
        if (i!=-1) {
            this.children.splice(i);
        }
    }
    gameupdate(time) {
        if (typeof(time) === 'undefined') time = 0;
        var delta = time - this.lastTime;
        this.lastTime = time;
        delta /= 1000;
        if (delta>0.5) delta = 0.5;
        this.states.update(delta);
        canvas.clear();

        this.children.forEach(function(c) {
            c._update(delta);
        }.bind(this));

        requestAnimationFrame(function (time) {
            this.fps += delta; this.fps /=2;
            this.gameupdate(time);
        }.bind(this));
    }
}
