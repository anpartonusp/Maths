/**
 * balance indicator - updates balance in Panel and HTML
 */

const MONT = "Montserrat";

class DESKTOPBALANCE extends Text {
    constructor(txt,dat) {
        super(txt, dat);
        this.uibalance = null;
        this.uiwin = $("#win");
        this.fontSize = 18;
        this.x = X-290;
        this.y = this.height+48;
    }
    _update(delta) {
        super._update(delta);
        Config.balance += (Config.balanceTarget-Config.balance) * (10*delta);
        if (Math.abs(Config.balance-Config.balanceTarget)<0.1) {
            Config.balance = Config.balanceTarget;
        }

        this.text = `Balance ${Config.balance.toFixed(2)}`;
        mobile.setBalance(Config.balance);
        //$(this.uibalance).text(`Balance ${Config.balance.toFixed(2)}`);
    }
}

/**
 * Win indicator. Updates WIN in Panel and HTML UI
 */
class DESKTOPPANELWIN extends Text {
    constructor(txt, dat) {
        super(txt, dat);
        this.win = 0;
        this.uiwin = null;
        this.fontSize = 30;
        this.color = "transparent";
        this.strokeColor = "#f9daa1";
        this.strokeSize = 4;
        this.lastw = -1;
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

        this.lastw = w;
        var wid = this.textWidth;
        var xx = (W-wid)/2;
        this.x += (xx-this.x)*2*delta;

        mobile.setWin(`WIN ${w}`);
        //$(this.uiwin).text(`WIN ${w}`)
    }
}


/**
 * The UI panel class
 */

class DesktopPanel extends View {
    constructor(dat) {
        super(dat);
        this.backgroundColor = "transparent";
        this.back = new Sprite("images/ui/desktop/CH_desktop_base.png");
        this.back.x = X;
        this.back.y = this.height/2;
        this.add(this.back);
        this.name = "panel";
        this.clip = false;
        this.originalY = this.y;


        class Home extends Sprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.sb = 1;
                this.s = 0.9;
                this.scale = this.s;
            }
            onMouseUp() {
                window.top.location.assign(Config.lobbyURL);
            }
            onMouseEnter() {
                this.animate({scaleX:this.sb, scaleY:this.sb},0.2, function(o) {
                    o.animate({scaleX:o.s, scaleY:o.s}, 0.1);
                })
            }

        }

        class PanelSprite extends Sprite {
            constructor(src, dat) {
                super(src, dat);
            }
            onMouseEnter() {
                this.scale = 1.1;
                this.stop().animate({scaleX:1,scaleY:1},0.2);
                $(window).css({cursor:"pointer"});
            }
            onMouseLeave() {
                $(window).css({cursor:"auto"});
            }
        }

        class Info extends PanelSprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.source = "images/ui/desktop/CH_desktop_btn_info.png";
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
        class Sound extends PanelSprite {
            constructor(src, dat) {
                super(src, dat);
                this.scale = 1;
                this.sb = 1.1;
                this.s = 1;
                this.scale = this.s;
                this.source = "images/ui/desktop/CH_desktop_btn_sound.png";
            }
            onMouseUp() {
                audiomanager.enabled = !audiomanager.enabled;
                if (!audiomanager.enabled) {
                    this.animate({opacity:0.3},0.3);
                } else {
                    this.animate({opacity:1},0.3);
                }
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


        /**
         * Settings icon
         */
        this.settings = new Settings("settings ICON", {x:1280-64,y:this.height/2-16,opacity:0.7});
        this.add(this.settings);



        this.sound = new Sound("", {x:X-345,y:this.height/2,opacity:0.7});
        this.add(this.sound);

        /**
         * Info icon
         */
        this.info = new Info("inf ICON", {name:"info",x:this.sound.x-46,y:this.height/2,opacity:0.7});
        this.add(this.info);

        /**
         * Win field
         */
        this.win = new DESKTOPPANELWIN("WIN",{align:"left", x:X, y:this.height/2, font:MONT, fontSize:32, color:"black", opacity:1});
        this.add(this.win);


        /**
         * Game Timer
         * @type {Text}
         */
        this.gameTime = new Text("",{align:"right", x:1280-8,y:this.height-8,font:MONT,fontSize:14, color:"white", visible:true, opacity:1});
        this.add(this.gameTime);

        /**
         * Balance setup
         */
        this.balance = new DESKTOPBALANCE(Config.balance.toFixed(2),{align:"left", x:1280*.20, y:this.height-8, font:MONT, fontSize:18, color:"white", opacity:1})
        this.add(this.balance);

        /**
         * Bet
         */
        this.bet = new Text("Bet",{align:"center", x:X+218,y:this.height/2,font:MONT,fontSize:18, color:"white", visible:true, opacity:1});
        this.add(this.bet);
        var amounts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

        /**
         * Minus
         */
        this.minus = new PanelSprite("images/ui/desktop/CH_desktop_btn_minus.png",{x:X+150,y:this.height/2});
        this.add(this.minus);
        this.minus.onMouseDown = function() {
            if (this.opacity==1) {
                for(var i = amounts.length-1;i>=0;i--) {
                    if (amounts[i]<(Config.stakePerLine*Config.numLines)) {
                        Config.stakePerLine = parseFloat((amounts[i]/Config.numLines).toFixed(2));
                        break;
                    }
                }
                this.scale = 1.2;
                this.animate({scaleX:1,scaleY:1},0.2);
                localStorage.stakePerLine = Config.stakePerLine;
                audiomanager.play("Button2", this.x);

            }
        }

        /**
         * Plus
         */
        this.plus = new PanelSprite("images/ui/desktop/CH_desktop_btn_plus.png",{x:X+280,y:this.height/2});
        this.add(this.plus);
        this.plus.onMouseDown = function() {
            if (this.opacity==1) {
                for(var i = 0;i<amounts.length;i++) {
                    if (amounts[i]>(Config.stakePerLine*Config.numLines)) {
                        Config.stakePerLine = parseFloat((amounts[i]/Config.numLines).toFixed(2));
                        break;
                    }
                }
                this.scale = 1.2;
                this.animate({scaleX:1,scaleY:1},0.2);
                audiomanager.play("Button2", this.x);
            }
            localStorage.stakePerLine = Config.stakePerLine;
        }


    }


    /**
     * shows or hides the panel
     * @param s true or false
     */
    show(s=true) {
        if (s) {
            this.animate({scaleX:1.0,scaleY:1.0,opacity:1},0.3, function(o) {
                o.animate({scaleX:1,scaleY:1},0.2);
            });
        } else {
            this.animate({scaleX:0,scaleY:0,opacity:0},0.3);
        }
    }

    /**
     * Hides/shows panel in landscape/portrait modes
     * @param delta
     * @private
     */

    _update(delta) {
        super._update(delta);
        this.bet.text = "Bet "+(Config.numLines*Config.stakePerLine).toFixed(2);
    }
}



