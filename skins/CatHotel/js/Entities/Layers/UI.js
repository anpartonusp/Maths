const DRAWFPS = false;
var spinScale = 1.7;  //Scale of spin button

class ERROR extends View {
    constructor(dat) {
        super(dat);
        this._text = [];
        this.texts = [];
        this.visible = false;
    }
    set text (t) {
        this._text = t;
        if (t=="") {
            this.animate({opacity:0},0.5, function(o) {
                o.visible = false;
                o.texts = [];
            });
        } else {
            this.texts = [];
            if (typeof(t)==="string") {
                this.texts.push(new Text(t, {color:"white", font:"Times New Roman", fontSize:30}));
            }

            this.opacity = 0;
            this.visible = true;
            this.animate({opacity: 0.9}, 0.5);
        }


    }
    update(delta) {
        super.update(delta);
        this.texts.forEach(function(t) {
            t.update(delta);
        })
    }

}

class WIN extends Text {
    constructor(txt,dat) {
        super(txt, dat);
        this.add(new Text("Win",{name:"heading", x:0,y:-100,font:"Bangers", fontSize:90, color:"red", shadowColor:"black", strokeColor:"lightyellow", strokeWidth:3}));
        this.heading = this.find("heading");
    }
    _update(delta) {
        super._update(delta);
        var wa = Config.winAmountTarget;
        var stake = Config.stakePerLine * Config.numLines;
/*
        if (wa<=stake) {
            this.heading.text = "WIN";
        } else if (wa>stake && wa<stake*4) {
            this.heading.text = "GOOD WIN";
        } else if (wa>=stake*4 && wa<stake*8) {
            this.heading.text = "EXCELLENT WIN";
        } else if (wa>=stake*8) {
            this.heading.text = "AMAZING WIN !!!";
        }
*/
        Config.winAmount += (Config.winAmountTarget-Config.winAmount)*(10*delta);
        this.text = `${Config.currencySymbol}${Config.winAmount.toFixed(2)}`;

    }

}


class WildStar extends Sprite {
    constructor(src, dat) {
        super("images/wins/STAR_yellow.png", dat);
        this.opacity = this.scale = 0;
        this.y = Y;
    }
    show(y) {
        this.y = y;
        this.stop().animate({scaleX:1,scaleY:1,opacity:1},0.3);
        winLayer.show(false);
    }
    hide() {
        this.stop().animate({scaleX:0,scaleY:0,opacity:0},0.3);
        winLayer.show(true);
    }
    update(delta) {
        this.rotation+=delta*4;
    }

}

class BETDOUBLE extends Sprite {
    constructor(src, dat) {
        super(src, dat);
        this._active = false;
        this.oldBet = 0;
        this.shadowOffsetX = this.shadowOffsetY = 0;
        this.shadowBlur = 20;
        this.active = false;

    }
    set active(a) {
        if (a && !this._active) {
            this.oldBet = Config.stakePerLine;
            Config.stakePerLine = Math.min(this.oldBet*2, 1);
            this.scale = 1.2;
            this.stop().animate({scaleX:1.1, scaleY:1.1},0.3);
            //this.shadowColor = "white";
            this.source = testPlatform()=="MOBILE" ? "images/ui/mobile_double_lit.png" : "images/ui/desktop/double_lit.png";
            if (ui.panel.bet) {
                ui.panel.bet.color = "#f6d89c";
                ui.panel.bet.stop().animate({scaleX:1.15},0.1, function(o) {
                    o.animate({scaleX:1},0.1);
                })
            }
        } else if (!a && this._active) {
            this.stop().animate({scaleX:1,scaleY:1},0.3);
            //this.shadowColor = "none";
            this.source = testPlatform()=="MOBILE" ? "images/ui/CH_mobile_btn_double.png" : "images/ui/desktop/CH_desktop_btn_double.png";
            Config.stakePerLine = this.oldBet;
            if (ui.panel.bet) {
                ui.panel.bet.color = "white";
                ui.panel.bet.stop().animate({scaleX:1.15},0.1, function(o) {
                    o.animate({scaleX:1},0.1);
                })

            }

        }
        this._active = a;
    }
    get active() {
        return this._active;
    }

}


class FULLSCREEN extends Sprite {
    constructor(dat) {
        super("images/ui/desktop/full_screen.png",dat);
        this.minSprite = new Sprite("images/ui/desktop/full_screen_state.png");
        this.oldImage = this.image;
        this.fs = false;
    }
    onMouseDown(x,y) {
        if (!this.fs) {
            this.launchFullScreen();
        } else {
            this.exitFullScreen();
        }
    }
    launchFullScreen() {
        var el = $("#container")[0];
        launchFullscreen(el);
        this.image = this.minSprite.image;
        this.fs = true;
    }
    exitFullScreen() {
        exitFullscreen();
        this.image = this.oldImage;
        this.fs = false;

    }
    update(delta) {
        this.visible = (screenMode=="LANDSCAPE");
    }
}

class UI extends View {
    constructor(dat) {
        super(dat);
        spinScale = 1.6;

        this.isTitle = false;
        this.fps = new Text("",{align:"left",x:4,y:32, fontSize:30, visible:DRAWFPS, shadowColor:"black"});
        this.add(this.fps);
        this.snail = new Snail({x:1280+100,y:580});
        this.add(this.snail);

        this.fs = new FULLSCREEN({x:W-50,y:50});
        if (hasFullscreen()) {
            this.add(this.fs);
        }
        /**
         * Title setup
         * @type {Sprite}
         */
        var t = this.title = new Sprite("images/CH_title.png");
        t.x = X;
        t.y = 30;
        t.autoDraw = true;
        var isMobile = testPlatform()=="MOBILE";
        this.add(this.title);


        /**
         * Win setup
         */
        this.win = new WIN("WIN",{align:"center", x:X, y:Y+30, font:"Bangers", fontSize:100, color:"red", shadowColor:"black", strokeColor:"lightyellow", strokeWidth:3})
        this.add(this.win);
        this.win.scale = 0;this.win.opacity = 0;this.win.visible = false;








        /**
         * Wild stars
         */
        this.wildstars = [new WildStar(null, {x:150}), new WildStar(null, {x:1280-150})];
        this.add(this.wildstars[0]);
        this.add(this.wildstars[1]);

        /**
         * Spin button setup
         */

        var s = this.spin = new Sprite("images/spin.png",{name:"spin",x:W-120,y:Y-20, scaleX:spinScale, scaleY:spinScale});
        this.add(this.spin);
        s.onMouseEnter = function(x,y) {
            this.scaleX = this.scaleY = spinScale+0.2;
            this.animate({scaleX:spinScale,scaleY:spinScale, opacity:1},0.3);
            $(window).css({cursor:"pointer"});
        };
        s.onMouseLeave = function() {
            $(window).css({cursor:"auto"});
        }
        s.onMouseUp = function() {
            audiomanager.play("Button", s.x);
            startSpin();

        }

        /**
         * Bet double
         */

        s = this.double = new BETDOUBLE("images/ui/CH_mobile_btn_double.png",{name:"double",x:W-100,y:Y+150});
        this.add(this.double);
        s.onMouseEnter = function(x,y) {
//            this.scaleX = this.scaleY = 1.2;
//            this.animate({scaleX:1,scaleY:1, opacity:1},0.3);
//            $(window).css({cursor:"pointer"});
        };
        s.onMouseLeave = function() {
//            $(window).css({cursor:"auto"});
        }
        s.onMouseUp = function() {
            s.active = !s.active;
            audiomanager.play("Button2", s.x);
            //doubleAndSpin();
        }

        /**
         * Combo counter
         */
        this.combo = new ComboBox({visible:false});
        this.add(this.combo);
        this.combo.hide();


        this.onMouseUp = function(x,y) {
            if (this.isTitle) {
                this.isTitle = false;
                game.states.setState("IDLE");
            }
        }
        this.onMouseDown = function() {
            if (game.states.state=="SHOW-SINGLE-WINS") {
                game.states.queueStates(["NOTHING:1","DOCASCADE"]);

            }
        }

    }
    showSpin(s) {
        if (s && screenMode=="LANDSCAPE" && game.states.state=="IDLE") {
            this.spin.scaleX = this.spin.scaleY = 0;
            this.spin.visible = true;
            this.double.scaleX = this.double.scaleY = 0;
            this.double.visible = true;
            this.double.stop().animate({scaleX: 1.2, scaleY: 1.2, opacity: 1}, 0.5, function (o) {
                o.animate({scaleX: 1, scaleY: 1}, 0.2);
            })

            this.spin.stop().animate({scaleX: spinScale+0.2, scaleY: spinScale+0.2, opacity: 1}, 0.5, function (o) {
                o.animate({scaleX: spinScale, scaleY: spinScale}, 0.2);
            })
            if (this.panel && this.panel.home) {
                this.panel.home.animate({opacity: 1}, 0.3);
                this.panel.settings.animate({opacity: 1}, 0.6);
                this.panel.info.animate({opacity: 1}, 0.9);
            }
        } else {
            this.spin.stop().animate({scaleX:0,scaleY:0,opacity:0},0.3, function(o) {
                o.visible = false;
            })
            this.double.stop().animate({scaleX:0,scaleY:0,opacity:0},0.3, function(o) {
                o.visible = false;
            })
            if (this.panel && this.panel.home) {
                this.panel.home.animate({opacity: 0}, 0.3);
                this.panel.settings.animate({opacity: 0}, 0.6);
                this.panel.info.animate({opacity: 0}, 0.9);
            }

        }
    }
    showIcons(s) {
        if (s) {
            this.info.animate({opacity:1},0.5);
            this.settings.animate({opacity:1},0.5);
            this.home.animate({opacity:1},0.5);
            winlayer.animate({scaleX:1,scaleY:1},0.5);
        } else {
            this.info.animate({opacity:0},0.5);
            this.settings.animate({opacity:0},0.5);
            this.home.animate({opacity:0},0.5);
            winlayer.animate({scaleX:10,scaleY:10},0.5);
        }
    }
    showWildStars(y) {
        this.wildstars[0].show(y);
        this.wildstars[1].show(y);
    }
    hideWildStars() {
        this.wildstars[0].hide();
        this.wildstars[1].hide();

    }
    showTitle() {
        this.title.animate({opacity:1},0.3);
    }
    hideTitle() {
        this.title.animate({opacity:0},0.3);
    }

}

class UIMOBILE extends UI {
    constructor(dat) {
        super(dat);
        this.panel = new Panel({x:X,y:H-60,width:W,height:100, scaleX:0,scaleY:0,opacity:0});
        this.add(this.panel);
    }
}

class UIDESKTOP extends UI {
    constructor(dat) {
        super(dat);
        this.panel = new DesktopPanel({x:X,y:H-60,width:W,height:100, scaleX:0,scaleY:0,opacity:0});
        this.add(this.panel);
        spinScale = 1;
        var d = this.find("double");
        merge(d, {source:"images/ui/desktop/CH_desktop_btn_double.png", x:X+360,y:this.panel.y});
        var s = this.find("spin");
        merge(s,{source:"images/ui/desktop/CH_desktop_btn_spin.png", x:X+460,y:this.panel.y, scaleX:1,scaleY:1});
        this.panel.settings.visible = false;

    }
}
