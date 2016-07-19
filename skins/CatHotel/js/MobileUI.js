class MobileUI {
    constructor() {
        this.ui = $("#ui");
        this.start = $("#ui_start");


        this.ui.off().click(function() {
            //Skip single win display
            if (game.states.state=="SHOW-SINGLE-WINS") {
                game.states.queueStates(["NOTHING:1","DOCASCADE"]);

            }
        })



        this.start.off().click(function() {
            startSpin();
        });
        this.win = $("#ui_win");
        this.double = $("#ui_double");
        this.double.off().click(function() {
            doubleBet();
        });
        this.home = $("#ui_home");
        this.home.off().click(function() {
            error.showDialog("Return to the Lobby", function() {
                error.hideDialog();
                window.top.location.assign(Config.lobbyURL);
            }, function() {
                error.hideDialog();
            })


           // window.location.assign(Config.lobbyURL);
        })
        this.settings = $("#ui_settings");
        this.settings.off().click(function() {
            this.showSettings();
        }.bind(this));
        this.info = $("#ui_info");
        this.info.off().click(function() {
            this.showInfo();
        }.bind(this));
        this.balance = $("#ui_balance");
        this.bet = $("#ui_bet");
        this.time = $("#ui_time");
        this.w = "";
        this.b = 0;
        this.c = -1;
        this.bal = -1;
        this.visible = false;

        this.settingsShowing = false;

        this.index = 0;
        this.scrollwindow = 0;
        this.infoShowing = false;

        this.screenMode = "";
        this.betInc = 0;
    }
    setTime(t) {
        if (this.time.text()!=t) {
            this.time.text(t);
        }
    }
    hideButtons() {
        this.start.hide(0);
        this.double.hide(0);
    }
    showButtons() {
        this.start.show(100);
        this.double.show(100);
    }
    setWin(w) {
        if (w!=this.w) {
            this.win.text(w);
            this.w = w;
        }
    }
    setBet(a,c=false) {
        if (a!=this.b) {
            this.bet.text("Bet " + a.toFixed(2));
            this.b = a;
        }
        if (c!=this.c) {
            this.c = c;
            this.bet.css({color:c ? "yellow" : "white"});
         }
    }
    setDouble(d) {
        $("#ui_double").get()[0].src = d ? "images/ui/mobile_double_lit.png" : "images/ui/CH_mobile_btn_double.png";
    }
    setBalance(bal) {
        if (bal!=this.bal) {
            this.balance.text("Balance "+bal.toFixed(2));
            this.bal = bal;
        }
    }
    resize() {
        var changed = false;
        var ww = window.innerWidth;
        var hh = window.innerHeight;
        if (ww>hh) {
            //landscape
            if (this.screenMode=="PORTRAIT") changed = true;
            this.screenMode="LANDSCAPE";
        } else {
            //portrait
            if (this.screenMode=="LANDSCAPE") changed = true;
            if (testPlatform()=="MOBILE") this.screenMode="PORTRAIT";
        }
        if (changed) {
            this.hideInfo();
            this.hideSettings();
        }
    }
    setSizeAndPosition(ypos, height) {
        this.ui.css({top: ypos, height: height, width: "100%"});
    }
    show() {
        if (testPlatform()=="MOBILE") {
            var ww = window.innerWidth;
            var w = ww + 30;
            var hh = window.innerHeight;
            if (ww < hh) {
                if (ui) {
                    ui.showSpin(false);
                    ui.hideTitle();
                }
                if (portraitTitleShowing) {
                    $("#titlescreen").show(10);
                }

                var h = w * (1 / Config.aspectratio);
                if (game.states.state != "TITLE") {
                    TOPSPACE = $("#topbar").height();
                    this.setSizeAndPosition(h + TOPSPACE, (hh - (h + TOPSPACE)));
                    $("#container").css({top: TOPSPACE, left: (ww - w) / 2, width: w, height: h});
                }
                if (!this.visible) {
                    this.visible = true;
                    $("#topbar").stop().fadeIn(400);
                    this.ui.stop().fadeIn(400);
                }
            }
        } else {
            if (ui) {
                ui.panel.show();
            }
        }

    }

    hide() {
        if (this.visible) {
            this.visible = false;
            $("#topbar").stop().fadeOut(400);
            this.ui.stop().fadeOut(400);
        }
    }
    hideWin() {
        this.win.hide(200);
    }
    showWin() {
        this.win.show(200);
    }


    hideSettings() {
        $("#settingsportrait").hide(0);
        $("#settingslandscape").hide(0);
        this.settingsShowing = false;
    }


    showSettings() {
        audiomanager.play("Button2");
        if (this.infoShowing) {
            this.hideInfo();
        }
        this.adjustFont();
        if (screenMode=="PORTRAIT") {
            if (this.settingsShowing) {
                this.settingsShowing = false;
                $("#settingsportrait").hide(200);
                return;
            }
            this.settingsShowing = true;

            var h = $("#ui_info").offset().top;

            //$("#settingsportrait").css({top:0, height:h});
            //$("#settingsportrait").css({fontSize:(h/100)+"px"});
            $("#settingsportrait").show(0);
            $("#settingsportraitclose").off().click(function() {
                this.hideSettings();
            }.bind(this))

            $("#betslider2").val(Config.stakePerLine.toFixed(2)).off().on("input", function() {
                Config.stakePerLine = parseFloat($("#betslider2").val());
                $("#betamount2").text((parseFloat(Config.stakePerLine)*parseFloat(Config.numLines)).toFixed(2));
                mobile.setBet(Config.stakePerLine*Config.numLines);
                localStorage.stakePerLine = Config.stakePerLine;
            });
            $("#betamount2").text((Config.stakePerLine*Config.numLines).toFixed(2));

            $("#musicslider2").val(musicVolume).off().on("input", function() {
                musicVolume = parseFloat($("#musicslider2").val());
                $("#musicvolume2").text(Math.floor(musicVolume * 100));
                localStorage.musicVolume = musicVolume;
                audiomanager.setCategoryVolume("MUSIC", musicVolume);
            });
            $("#musicvolume2").text(Math.floor(musicVolume * 100));
            $("#fxslider2").val(fxVolume).off().on("input", function() {
                fxVolume = parseFloat($("#fxslider2").val());
                $("#fxvolume2").text(Math.floor(fxVolume * 100));
                audiomanager.setCategoryVolume("GENERAL", fxVolume);
                localStorage.fxVolume = fxVolume;
            });
            $("#fxvolume2").text(Math.floor(fxVolume * 100));

        } else {
            if (this.settingsShowing) {
                this.hideSettings();
                return;
            }
            this.settingsShowing = true;
            $("#settingslandscapeclose").off().click(function() {
                this.hideSettings();
            }.bind(this));
            var h = $("#settingslandscape").height();
            $("#settingslandscape").css({fontSize:(h/40)+"px"});
            $("#settingslandscape").show(0);

            $("#betslider").val((Config.stakePerLine).toFixed(2)).off().on("input", function() {
                Config.stakePerLine = parseFloat($("#betslider").val());
                $("#betamount").text((Config.stakePerLine*Config.numLines).toFixed(2));
                localStorage.stakePerLine = Config.stakePerLine;
            });
            $("#betamount").text((Config.stakePerLine*Config.numLines).toFixed(2));
            $("#musicslider").val(musicVolume).off().on("input", function() {
                musicVolume = parseFloat($("#musicslider").val());
                $("#musicvolume").text(Math.floor(musicVolume * 100));
                localStorage.musicVolume = musicVolume;

                audiomanager.setCategoryVolume("MUSIC", musicVolume);
            });
            $("#musicvolume").text(Math.floor(musicVolume * 100));

            $("#musicminus").off().click(function() {
                var b = $("#musicslider");
                b.val(parseFloat(b.val()-0.01));
                musicVolume = parseFloat(b.val());
                $("#musicvolume").text(Math.floor(musicVolume * 100));
                localStorage.musicVolume = musicVolume;
            });
            $("#musicplus").off().click(function() {
                var b = $("#musicslider");
                b.val(parseFloat(b.val()+0.01));
                musicVolume = parseFloat(b.val());
                $("#musicvolume").text(Math.floor(musicVolume * 100));
                localStorage.musicVolume = musicVolume;
            });



            $("#fxslider").val(fxVolume).off().on("input", function() {
                fxVolume = parseFloat($("#fxslider").val());
                $("#fxvolume").text(Math.floor(fxVolume * 100));
                localStorage.fxVolume = fxVolume;
                audiomanager.setCategoryVolume("GENERAL", fxVolume);
            });
            $("#fxvolume").text(Math.floor(fxVolume * 100));

            $("#fxminus").off().click(function() {
                var b = $("#fxslider");
                b.val(parseFloat(b.val()-0.01));
                fxVolume = parseFloat(b.val());
                $("#fxvolume").text(Math.floor(fxVolume * 100));
                localStorage.fxVolume = fxVolume;
            });
            $("#fxplus").off().click(function() {
                var b = $("#fxslider");
                b.val(parseFloat(b.val()+0.01));
                fxVolume = parseFloat(b.val());
                $("#fxvolume").text(Math.floor(fxVolume * 100));
                localStorage.fxVolume = fxVolume;
            });



        }
    }

    showInfo() {
        this.adjustFont();
        audiomanager.play("Button2");
        if (this.settingsShowing) {
            this.hideSettings();
        }
        if (screenMode=="PORTRAIT") {
            if (this.infoShowing) {
                this.hideInfo();
                return;
            }
            $("#portraitleftarrow").stop().fadeOut(100);
            this.infoShowing = true;
            this.scrollwindow = $("#portraitinnerscrollwindow");
            $("#portraitclose").off().click(function() {
                this.hideInfo();
                this.index = 0;
                this.infoShowing = false;
            }.bind(this));
            $("#portraitleftarrow").off().click(function() {
                if (this.index>0) {
                    this.index--;
                    this.scrollwindow.stop().css({left:(this.index*-100)+"%"},300);
                }
                if (this.index<3) {
                    $("#portraitrightarrow").stop().fadeIn(200);
                }
                if (this.index==0) {
                    $("#portraitleftarrow").stop().fadeOut(200);
                } else {
                    $("#portraitleftarrow").stop().fadeIn(200);
                }

            }.bind(this));
            $("#portraitrightarrow").off().click(function() {
                if (this.index<3) {
                    this.index++;
                    this.scrollwindow.stop().css({left:(this.index*-100)+"%"},300);
                }
                if (this.index>0) {
                    $("#portraitleftarrow").stop().fadeIn(200);
                }
                if (this.index==3) {
                    $("#portraitrightarrow").stop().fadeOut(200);
                } else {
                    $("#portraitrightarrow").stop().fadeIn(200);
                }

            }.bind(this));

            this.index = 0;
            this.scrollwindow.stop().css({left:"0%"});

/*
            var h = $("#ui_info").offset().top;
            $("#infoportrait").css({top:0, height:h});
*/
            $("#infoportrait").show(0);


        } else {
            if (this.infoShowing) {
                this.hideInfo();
                return;
            }
            $("#leftarrow, #rightarrow").stop().fadeIn(100);
            this.info = $("#deskinfo");
            this.scrollwindow = $("#deskinnerscrollwindow");
            this.infoShowing = true;
            $("#leftarrow").stop().fadeOut(0);
            $("#deskclose").off().click(function() {
                this.hideInfo();
            }.bind(this));
            $("#leftarrow").off().click(function() {
                if (this.index>0) {
                    this.index--;
                    this.scrollwindow.stop().css({left:(this.index*-100)+"%"},300);
                }
                if (this.index<2) {
                    $("#rightarrow").stop().fadeIn(200);
                }
                if (this.index==0) {
                    $("#leftarrow").stop().fadeOut(200);
                } else {
                    $("#leftarrow").stop().fadeIn(200);
                }
            }.bind(this));
            $("#rightarrow").off().click(function() {
                if (this.index<2) {
                    this.index++;
                    this.scrollwindow.stop().css({left:(this.index*-100)+"%"},300);
                }
                if (this.index>0) {
                    $("#leftarrow").stop().fadeIn(200);
                }
                if (this.index==2) {
                    $("#rightarrow").stop().fadeOut(200);
                } else {
                    $("#rightarrow").stop().fadeIn(200);
                }

            }.bind(this));

            this.index = 0;
            this.scrollwindow.stop().css({left:"0%"});
            this.info.show(0);  //show(300);

        }
    }
    hideInfo() {
        if (screenMode=="PORTRAIT") {
            $("#infoportrait").hide(0);
        } else {
            $("#deskinfo").hide(0);
        }
        this.infoShowing = false;
    }

    adjustFont() {
        var h = $("#settingslandscape").height();
        $("#settingslandscape").css({fontSize:(h/40)+"px"});

        var h = $("#deskinfo").height();
        $("#deskinfo").css({fontSize:(h/30)+"px"});

        h = $("#ui_info").offset().top;


        $("#infoportrait").css({top:0, height:h});
        $("#infoportrait").css({fontSize:(h/100)+"px"});
       //$("#infoportrait").show(200);


        $("#settingsportrait").css({top:0, height:h});
        $("#settingsportrait").css({fontSize:(h/100)+"px"});



    }


}
