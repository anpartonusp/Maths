/**
 * balance indicator - updates balance in Panel and HTML
 */
const RAM = "Rammetto One";

class BALANCE extends Text {
    constructor(txt,dat) {
        super(txt, dat);
        this.lastbal = -1;
    }
    _update(delta) {
        super._update(delta);
        Config.balance += (Config.balanceTarget-Config.balance) * (10*delta);
        if (Math.abs(Config.balance-Config.balanceTarget)<0.1) {
            Config.balance = Config.balanceTarget;
        }

        if (Config.balance!=this.lastbal) {
            this.lastbal = Config.balance;
            this.text = `Balance ${Config.balance.toFixed(2)}`;
            mobile.setBalance(Config.balanceTarget);
        }
    }
}

/**
 * Win indicator. Updates WIN in Panel and HTML UI
 */
class PANELWIN extends Text {
    constructor(txt, dat) {
        super(txt, dat);
        this._win = 0;
        this.fontSize = 60;
        this.color = "transparent";
        this.strokeColor = "#f9daa1";
        this.strokeWidth = 4;
        this.fading = false;
    }
    set win(amount) {
        this._win = amount;
    }

    get win() {
        return this._win;
    }
    _update(delta) {
        this.win = Config.winAmount;
        super._update(delta);
        var w = Math.abs(this.win).toFixed(2);
        this.text = `WIN: ${w}`;
        var wid = this.textWidth;
        var xx = (W-wid)/2;
        this.x += (xx-this.x)*2*delta;
        if (!this.fading) {
            if (this.win < 0.001 && this.opacity > 0) {
                this.fading = true;
                mobile.hideWin();
                this.stop().animate({scaleY:0,opacity:0}, 0.3, function (o) {
                    o.win = 0;
                    o.fading = false;
                })
            } else if (this.win > 0.001 && this.opacity == 0) {
                this.fading = true;
                mobile.showWin();
                this.stop().animate({scaleY:1.1,opacity:1}, 0.3, function(o) {
                    o.animate({scaleY:1},0.1);
                    o.fading = false;
                });

            }
        }
        mobile.setWin(`WIN ${w}`);

    }
}


/**
 * The UI panel class
 */

class Panel extends View {
    constructor(dat) {

        super(dat);
        this.backgroundColor = "transparent";
        this.back = new Sprite("images/ui/CH_mobile_base_landscape.png");
        this.back.x = X;
        this.back.y = this.height/2;
        this.add(this.back);
        this.name = "panel";
        this.clip = false;
        this.originalY = this.y;
        this.lastbet = -1;

        class Home extends Sprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.sb = 1;
                this.s = 0.9;
                this.scale = this.s;
            }
            onMouseUp() {
                error.showDialog("Return to the Lobby", function() {
                    error.hideDialog();
                    window.top.location.assign(Config.lobbyURL);
                }, function() {
                    error.hideDialog();
                })
            }
            onMouseEnter() {
                this.animate({scaleX:this.sb, scaleY:this.sb},0.2, function(o) {
                    o.animate({scaleX:o.s, scaleY:o.s}, 0.1);
                })
            }

        }


        class Info extends Sprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.sb = 1;
                this.s = 0.9;
                this.scale = this.s;
                this.infoshowing = false;
                var imageUrl = "images/ui/CH_mobile_info.png";
                $('#deskinfo').css('background-image', 'url(' + imageUrl + ')');
            }
            onMouseUp() {
                mobile.showInfo();
            }
            onMouseEnter() {
                this.animate({scaleX:this.sb, scaleY:this.sb},0.2, function(o) {
                    o.animate({scaleX:o.s, scaleY:o.s}, 0.1);
                })
            }

            hide() {
                this.info.fadeOut(200);
                this.index = 0;
                this.infoshowing = false;

            }
            showInfo() {
                if (this.infoshowing) {
                    this.hide();
                    return;
                }
                this.info = $("#deskinfo");
                this.scrollwindow = $("#deskinnerscrollwindow");
                this.infoshowing = true;
                $("#deskclose").off().click(function() {
                    this.hide();
                }.bind(this));
                $("#leftarrow").off().click(function() {
                    if (this.index>0) {
                        this.index--;
                        this.scrollwindow.stop().animate({left:(this.index*-100)+"%"},300);
                    }
                }.bind(this));
                $("#rightarrow").off().click(function() {
                    if (this.index<2) {
                        this.index++;
                        this.scrollwindow.stop().animate({left:(this.index*-100)+"%"},300);
                    }
                }.bind(this));

                this.index = 0;
                this.scrollwindow.stop().css({left:"0%"});
                this.info.fadeIn(200);  //show(300);
            }


        }

        class Settings extends Sprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.sb = 1;
                this.s = 0.9;
                this.scale = this.s;
            }
            onMouseUp() {
                mobile.showSettings();
            }
            onMouseEnter() {
                this.animate({scaleX:this.sb, scaleY:this.sb},0.2, function(o) {
                    o.animate({scaleX:o.s, scaleY:o.s}, 0.1);
                })
            }

        }

        /**
         * Home icon
         */

        this.home = new Home("home ICON", {x:75,y:-500,opacity:0.7});
        this.add(this.home);

        /**
         * Settings icon
         */

        this.settings = new Settings("settings ICON", {x:75,y:-(420-150),opacity:0.7});
        this.add(this.settings);


        /**
         * Info icon
         */

        this.info = new Info("inf ICON", {x:75,y:-(420-250),opacity:0.7});
        this.add(this.info);









        /**
         * Win field
         */
        this.win = new PANELWIN("WIN",{align:"left", x:X, y:this.height/2-16, font:RAM, fontSize:32, color:"black", opacity:1});
        this.add(this.win);


        /**
         * Game Timer
         * @type {Text}
         */
        this.gameTime = new Text("",{align:"right", x:1280-8,y:this.height-8,font:RAM,fontSize:20, color:"white", visible:true, opacity:1});
        this.add(this.gameTime);

        /**
         * Balance setup
         */
        this.balance = new BALANCE(Config.balance.toFixed(2),{align:"left", x:1280*.20, y:this.height-8, font:RAM, fontSize:20, color:"white", opacity:1})
        this.add(this.balance);

        /**
         * Bet
         */
        this.bet = new Text("Bet",{align:"left", x:1280*.66,y:this.height-8,font:RAM,fontSize:20, color:"white", visible:true, opacity:1});
        this.add(this.bet);

    }


    /**
     * shows or hides the panel
     * @param s true or false
     */
    show(s=true) {
        if (s) {
            this.visible = true;
            this.animate({scaleX:1.1,scaleY:1.1,opacity:1},0.5, function(o) {
                o.animate({scaleX:1,scaleY:1},0.2);
            });
        } else {
            this.animate({scaleX:0,scaleY:0,opacity:0},0.3, function(o) {
                o.visible = false;
            });
        }
    }

    /**
     * Hides/shows panel in landscape/portrait modes
     * @param delta
     * @private
     */

    _update(delta) {
        super._update(delta);
        //Animate the panel off the screen if the HTML UI is visible
        if (window.innerWidth < window.innerHeight && !this.animating) {
            this.animate({y:this.originalY+150},0.5);
        } else {
            if (!this.animating) {
                this.animate({y: this.originalY}, 0.5);
            }
        }
        var c = (Config.numLines*Config.stakePerLine).toFixed(2);
        if (c!=this.lastbet) {
            this.lastbet = c;
            this.bet.text = "Bet "+c;
        }

    }
}


