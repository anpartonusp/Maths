/**
/**
 * This is the game proper. Sets up all the game states & plays the game, essentially the main game loop
 */

const RECORD = false;
var TOPSPACE = 30;


var spinScale = 1.7;  //Scale of spin button
var screenMode = "PORTRAIT"

var game;
var error;
var backLayer, boxLayer, overlay, outer, winLayer, toplayer, catcombolayer, lowerui;
var ui;
const X = 1280/2; //Center of the screen
const Y = 720/2;
const W = 1280; //Width of screen
const H = 720;  //Height of screen
const BOXESPOSITION = {x:860,y:485};
const DUCKAMOUNT = 0.3;

var recordBuffer = [];
var music, musicVolume=1, fxVolume = 1;

var gameStartTime, gamePlayTime;
var winLineShown = 0, singleWins, winnings;
var autoSpin = 0;

var oldBet = 0;

var audiomanager;

var mobile;
/**
 * Nasty global stuff returned from the server
 */

var steps = null, currentStep = null, winningLines = null;
var totalPayout = 0;
var winAmountText;

var loadingScreen = null;

function startGame() {
    /**
     * Game Prep  - preload graphics & sound
     */

    mobile = new MobileUI();
    error = new ErrorManager();
    Config.balance = Config.balanceTarget = 500;   //default, in case login doesn't work
    game = new GameManager({width:1280,height:720});



    //this pre-loads the logo graphics. When loaded, show the loading screen and start preloading the main graphics
    game.imageManager.preLoad(["sprites/logo.png"], function() {
        initSprites("logo");
        doresize();
        mobile.hide();
        var w = window.innerWidth;
        var h = w * (1/Config.aspectratio);
        var y = (window.innerHeight-h)/2;
        var cont = $("#container");
        cont.width(w).height(h);
        cont.css({top:y,left:(w-cont.width())/2});

        loadingScreen = new LoadingScreen({x:X,y:Y,width:W,height:H, clearScreen:false}, startGame2);
        game.add(loadingScreen);
    })
 }

function startGame2() {

    game.imageManager.preLoad(fileList, function() {
        game.backEnd.startDemoSession(function(data) {
            Config.account = data;
            Config.balance = Config.balanceTarget = parseFloat(data.total.amount);
            Config.currency = data.total.currency;
            tapToStart();
        }, function(x,status) {
            error.show("Connection Error", "I'm having some trouble phoning home. Please refresh your browser, or try again later");
        });
    }, function(p) { //progress
        loadingScreen.value = p;
    });

}


function tapToStart() {
    loadingScreen.showTapMessage(startGame3);
}

function startGame3() {

    audiomanager = new AudioManager(
        {
            screenWidth: 1280,
            baseDir: "audio",
            ready: function () {
                this.setAliases(aliases);
                musicVolume = parseFloat(localStorage.musicVolume || "0.5");
                fxVolume = parseFloat(localStorage.fxVolume || "0.8");
                audiomanager.setCategoryVolume("MUSIC", musicVolume);
                audiomanager.setCategoryVolume("GENERAL", fxVolume);
                music = this.play("Music",1280/2);
                this.play("Cat3",100);
                this.play("Cat3",1280-100);
                startGameProper();
            }
        }
    );

}

function startGameProper() {
    loadingScreen.animate({scaleX:0,scaleY:0,opacity:0},0.5, function() {
        game.remove(loadingScreen);
        game.imageManager.remove("sprites/logo.png");
        gameStartTime = new Date().getTime();
        Config.currencySymbol = Config.currency=="GBP" ? "£" : Config.currency=="EUR" ? "€" : "";
        Config.stakePerLine = localStorage.stakePerLine ? parseFloat(localStorage.stakePerLine) : 0.05;
        addSprites(["sprites","sprites2"]);
        doGame();
        doresize();
    })
}



function doGame() {
    window.scrollTo(0, 1);
    winAmountText = new Text("",{x:X,y:Y,font:"Rammetto One", fontSize:50, color:"#242140", strokeColor:"#f9daa1", strokeWidth:2, opacity:0, scaleX:0, scaleY:0, shadowColor:"black"});
    outer = new Outer({name:"foreground",width:W,height:H,x:X,y:Y, clearScreen:false});   //the outermost view
    if (testPlatform()=="MOBILE") {
        ui = new UIMOBILE({width:W,height:H,x:X,y:Y,clearScreen:false});  //The UI viewport - contains all the text readouts etc
    } else {
        ui = new UIDESKTOP({width: W, height: H, x: X, y: Y, clearScreen: false});  //The UI viewport - contains all the text readouts etc
    }
    backLayer = new Background({name:"background",width:W,height:H,x:X,y:Y, clearScreen:false, opacity:1});   //the background
    boxLayer = new BoxLayer({width:W,height:H,x:BOXESPOSITION.x,y:BOXESPOSITION.y, clearScreen:false, clip:false}); //Boxlayer contains all the 'reels'
    overlay = new Foreground({width:W,height:H,x:X,y:Y, clearScreen:false,opacity:1}); //The overlay graphic
    winLayer = new WinLayer({width:W,height:H,x:X,y:Y,clearScreen:false});  //Contains the winline indicators
    catcombolayer = new CatComboLayer({width:W,height:H,x:X,y:Y,clearScreen:false});  //Contains the winline indicators
    toplayer = new TopLayer({width:W,height:H,x:X,y:Y, clearScreen:false});


    //Add them all to each other, and to the main canvas

    backLayer.add(boxLayer);
    outer.add(backLayer);
    outer.add(winLayer);
    outer.add(ui);
    game.add(outer);
    game.add(catcombolayer);
    game.add(toplayer);

    ui.add(winAmountText);
    var comboCount = 0;
    catcombolayer.clear();
    /**
     * Updates the game clock
     */
    function updateGameTime() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if (hours<10) hours = "0"+hours;
        if (minutes<10) minutes = "0"+minutes;
        ui.panel.gameTime.text = `${hours}:${minutes}`;
        mobile.setTime(`${hours}:${minutes}`);
    }

    /**
     * Start a 1 second interval timer to update the game clock
     */
    setInterval(updateGameTime, 10000);
    updateGameTime();

    function sortOutUI() {
        mobile.showButtons();
        mobile.setBet(Config.numLines * Config.stakePerLine);
    }

    /**
     * Idle state - waiting for user action
     */
    game.states.addState("IDLE", {
        init : function() {
            if (Config.realityTimer>0) {
                if ((new Date().getTime() - Config.startTime) >= Config.realityTimer) {
                    showReality(new Date().getTime() - Config.startTime);
                }
            }
            audiomanager.duck(music, 1,0);
            catcombolayer.clear();
            ui.combo.hide();
            ui.double.active = false;
            if (oldBet!=0) {
                Config.stakePerLine = oldBet;
                oldBet = 0;
                mobile.setBet(Config.numLines * Config.stakePerLine);
                mobile.setDouble(false);
                audiomanager.play("Button2");
            }
            winLayer.show(true);

            sortOutUI();
            ui.showSpin(true);

            ui.win.animate({scaleX:0,scaleY:0,opacity:0},0.5, function(o) {
                o.visible = false;
            });
            if (autoSpin>0) {
                setTimeout(function() {
                    autoSpin--;
                    game.states.setState("STARTSPIN");
                }, 500);
            }
            mobile.show();
        },
        update : function(delta) {

        },
        shutDown : function() {
            ui.showSpin(false);
        }
    });

    //called when the spin data has been received
    function onSpinReceived(data) {
        //debug. records a copy of the data for offline use
        //set MOCK to true in the BackEnd class to enable offline mode
        if (RECORD) {
            recordBuffer.push(JSON.stringify(data));
            localStorage.storedData = recordBuffer;

        } else {
            //console.log(JSON.stringify(data));
        }
        steps = JSON.parse(JSON.stringify(data.stepResponses || []));
        if (steps.length>0) {
            game.states.setState("DOSPIN");
        }

    }

    /**
     * Set when the spin button is pressed
     */
    game.states.addState("STARTSPIN", {
        init() {

            game.backEnd.post("cascade/spin",
                onSpinReceived,
            function(err) {
                error.show("Oops", "I seem to have lost contact with the server. <br />Don't worry - you haven't lost anything. <br /><br />Try again in a few moments.", ERR_OK)
            });
            sortOutUI();


        }
    })

    /**
     * initiates the spin
     */
    game.states.addState("DOSPIN", {
        timer : 0,
        init : function() {
            var cost = Config.stakePerLine * Config.numLines;
            Config.balanceTarget-=cost;
            this.timer = 1;
            boxLayer.clearGrid();
            game.states.setState("DOCASCADE");
            comboCount = 0;
            ui.combo.hide();
            catcombolayer.clear();
        },
        shutDown : function() {
            ui.win.scale = 0;
            Config.winAmountTarget = 0;
        }
    });

    /**
     * Performs the cascade. Displays wins, then loops round until no more wins left
     */
    game.states.addState("DOCASCADE", {
        timer:0,
        init:function() {
            boxLayer.resetStartPositions();
            if (steps.length==0) {
                catcombolayer.clear();
                game.states.setState("IDLE");
            } else {
                currentStep = steps.shift();
                for (var i = 0; i < 5; i++) {
                    reels[i] = currentStep.gridBeforeCascade[i];
                }
                this.timer = 2.1;
            }
            winAmountText.stop().animate({scaleX:0,scaleY:0,opacity:0},0.3);
        },
        update:function(delta) {
            this.timer-=delta;
            if (this.timer<=0) {
                if (!boxLayer.animating) {
                    if (currentStep.winningLines.length==0) {
                        Config.balanceTarget += Config.winAmountTarget;
                        if (Config.winAmountTarget>0) {
                            game.states.queueStates(["WINDISPLAY:3", "IDLE"]);
                        } else {
                            catcombolayer.clear();
                            game.states.setState("IDLE");
                        }

                    } else {
                        comboCount++;
                        if (comboCount>1) {
                            catcombolayer.addCat();
                            ui.combo.show();
                            ui.combo.value = comboCount
                        }
                        Config.winAmountTarget += currentStep.winnings;
                        winningLines = currentStep.winningLines;
                        game.states.setState("SHOWWIN");
                    }
                }
            }
        },
        shutDown:function() {
        }
    });

    game.states.addState("NOTHING",{});
    /**
     * Shows the winning symbols, then goes back to the Cascade processing
     */
    game.states.addState("SHOWWIN", {
       timer:0,
       init:function() {
           if (currentStep.winningLines.length==1) {
               game.states.setState("SHOW-SINGLE-WINS");
               return;
           }
           audiomanager.duck(music,0.7,0.5);
           audiomanager.play("AllWins");
           var diss = currentStep.disappearingSymbolsInWinningLines;
           var wilds = currentStep.wildsInWinningCombinations;
            darkenNonWinningBoxes(diss, wilds);
            if (!diss) {
                game.states.queueStates(["NOTHING:1","DOCASCADE"]);
            } else {
                winLayer.fadeAll();
                currentStep.winningLines.forEach(function(wl) {
                    winLayer.unfade(wl+1);
                    glowWinLine(wl);
                })
                this.timer = 1.5;

            }
       },
       update(delta) {
           this.timer-=delta;
           if (this.timer<0) {
               winLineShown = 0;
               //this.timer = 1000;
               game.states.setState("SHOW-SINGLE-WINS");
           }
       },
        shutDown() {
            winAmountText.stop().animate({scaleX:0,scaleY:0,opacity:0},0.3);
            unGlowAllBoxes();
        }
    });
    const SHOWING_WIN_LINE = 1;
    const NEXT = 0;
    const WILDS = 10;
    const WINS = 11;

    game.states.addState("SHOW-SINGLE-WINS", {
        timer:0,
        darkenedTimer:0,
        mode:NEXT,
        outerMode:WINS,
        wildRows:[],
        wildCounter:0,
        winCounter:0,

        init: function() {
            winLineShown = -1;
            singleWins = currentStep.winningLines;
            winnings = currentStep.winningsPerLine;
            darkenedBoxes = null;

            this.mode = NEXT;
            this.timer = 0;
            this.wildRows = [];
            this.wildCounter = -1;
            //Build a list of rows affected by wilds
            var wr = [false, false, false];
            var wilds = currentStep.wildsInWinningCombinations;
            wilds.forEach(function(w) {
                wr[w.row] = true;
            }.bind(this));
            for(var i = 0;i<3;i++) {
                if (wr[i]) this.wildRows.push(i);
            }

            this.winCounter = 0;
            this.outerMode = WINS;
        },
        update:function (delta) {
            if (game.states.state=="SHOW-SINGLE-WINS") {
                if (this.outerMode==WINS) {
                    if (this.mode == NEXT) {
                        this.timer -= delta;
                        if (this.timer <= 0) {
                            unGlowAllBoxes(singleWins[winLineShown]);
                            winLineShown++;
                            if (winLineShown == singleWins.length) {
                                winAmountText.stop().animate({scaleX: 0, scaleY: 0, opacity: 0}, 0.3);
                                winLayer.fadeAll();
                                this.outerMode=WILDS;
                                this.timer = 0.1;
                            } else {
                                this.winCounter++;
                                audiomanager.duck(music,DUCKAMOUNT,1.0);
                                var pitch = this.winCounter-5;
                                if (pitch<0) pitch = 0;
                                var wc = this.winCounter;
                                if (wc>5) wc = 5;
                                audiomanager.play("LineWin"+wc, 1280/2,pitch*100);   //this plays the 5 win sounds. If more than 5th, it plays the 5th but increasing pitch by 1 semitone
                                darkenNonWinLine(singleWins[winLineShown]);
                                winLayer.fadeAll();
                                winLayer.unfade(singleWins[winLineShown] + 1);
                                glowWinLine(singleWins[winLineShown]);
                                var w = openWinLineBoxes(singleWins[winLineShown]);
                                winAmountText.text = winnings[winLineShown].toFixed(2);
                                winAmountText.x = X;
                                var wl = Config.winLines[singleWins[winLineShown]].line;
                                winAmountText.y = boxLayer.columns[0].yposes[wl[2]]+boxLayer.top+30;    //winLayer.getWinPosition(singleWins[winLineShown]).y; //w.y + boxLayer.top;
                                winAmountText.stop().animate({scaleX: 1.2, scaleY: 1.2, opacity: 1}, 0.3, function (o) {
                                    o.animate({scaleX: 1, scaleY: 1}, 0.15);
                                });
                                this.timer = 1.5;
                                this.mode = SHOWING_WIN_LINE;
                            }
                        }
                    } else if (this.mode == SHOWING_WIN_LINE) {
                        this.timer -= delta;
                        if (this.timer <= 0) {
                            this.mode = NEXT;
                            this.timer = 0;
                        }
                    }
                } else if (this.outerMode==WILDS) {
                    this.timer-=delta;
                    if (this.timer<=0) {
                        darkenAllboxes();
                        this.wildCounter++;
                        if (this.wildCounter==this.wildRows.length) {   //End of the wild display
                            ui.hideWildStars();
                            game.states.queueStates(["NOTHING:1", "DOCASCADE"]);

                            return;
                        }
                        //We have a wild row to display
                        audiomanager.duck(music,DUCKAMOUNT,1.5);
                        audiomanager.play("WildWin");
                        unGlowAllBoxes(false);
                        var r = this.wildRows[this.wildCounter];
                        glowLine(r, true);
                        lightenLine(r);
                        var y = boxLayer.columns[0].yposes[r]+boxLayer.top+40;
                        ui.showWildStars(y);
                        this.timer = 2;   //anp
                    }
                }
            }
        },
        shutDown:function() {
            lightenAllboxes();
            backLayer.scatterButterflies();
            ui.snail.scatter();
            winLayer.show(false);
            setTimeout(function() {
                winLayer.show(true);
            },2000);
            currentStep.disappearingSymbolsInWinningLines.forEach(function (d) {
                var box = boxLayer.getBox(d.column, d.row);
                if (box) {
                    box.jump(200+(d.column * 300 + d.row*50));
                }
                boxLayer.moveBoxToBackup(d.column, d.row);
            });

            currentStep.wildsInWinningCombinations.forEach(function(w) {
                for(var x = 0;x<5;x++) {
                    var box = boxLayer.getBox(x, w.row);
                    if (box) {
                        box.jump(200+(w.column * 350));
                        boxLayer.moveBoxToBackup(x, w.row);
                    }

                }
            });
        }
    })

    game.states.addState("WINDISPLAY", {
        init() {
            var res = toplayer.winscreen.show(Config.winAmountTarget);
            if (!res) {
                game.states.exitState();
            }
        },
        update(delta) {

        },
        shutDown() {
            toplayer.winscreen.hide();
        }
    })

    var darkenedBoxes = null;

    /**
     * These 3 functions darken and open the boxes for the specified winline
     * @param wl - winline number (0-19)
     */
    function darkenNonWinLine(wl) {
        var wins = [];
        var sym = findWinningSymbol(wl);
        var w = Config.winLines[wl].line;
        for(var x = 0;x<w.length;x++) {
            var y = w[x];
            var box = boxLayer.getBox(x, y);
            if (box.symbol!="1" && box.symbol != sym) break;
            wins.push(box);
        }
        for(var x = 0;x<5;x++) {
            for(var y = 0;y<3;y++) {
                if (wins.indexOf(boxLayer.getBox(x,y))==-1) {
                    boxLayer.getBox(x,y).darken(true);
                    //boxLayer.getBox(x,y).closeBox();
                } else {
                    boxLayer.getBox(x,y).darken(false);
                }
            }
        }
    }
    function findWinningSymbol(wl) {
        var w = Config.winLines[wl].line;
        for(var x = 0;x<5;x++) {
            var box = boxLayer.getBox(x,w[x]);
            if (box.symbol=="1") {
                continue;
            }
            return box.symbol;
        }
    }

    /**
     * As well as opening the boxes of the specified winline, this also calculates and returns how much the line has won
     * @param wl
     * @returns {win: win amount for this line, x & y: center position of the win line}
     */
    function openWinLineBoxes(wl) {
        var sym = findWinningSymbol(wl);
        var win = 0;
        var cnt = 0;
        var x1, y1, x2, y2;
        var w = Config.winLines[wl].line;
        var box;
        for(var x = 0;x<w.length;x++) {
            var y = w[x];
            box = boxLayer.getBox(x,y);

            if (x==0) {
                x1 = boxLayer.columns[x].x;
                y1 = box.y;
            }
            if (box.symbol!="1" && box.symbol!=sym) {
                boxLayer.wins = [];
                for(var xx = x-1;xx<5;xx++) {
                    var y = w[xx];
                    var box = boxLayer.getBox(xx,y);
                    boxLayer.wins.push(box);

                }
                win = Config.winMatrix[sym][cnt-3];
                x2 = boxLayer.columns[x-1].left;   //Use previous column's x pos
                y2 = box.y;
                return {
                    win:win*Config.stakePerLine,
                    x:(x1+x2)/2,
                    y:(y1+y2)/2
                };
            }
            cnt++;
            box.openBox();
        }
        win = Config.winMatrix[sym][cnt-3];
        x2 = boxLayer.columns[4].left;
        y2 = box.y;
        return {
            win:win*Config.stakePerLine,
            x:(x1+x2)/2,
            y:(y1+y2)/2
        };
    }


    /**
     * the next two functions darken and lighten the boxes for combined wins
     * @param wins - a list of objects containing column&row of each winning symbol
     * @param wilds - a list of wilds involved in a win - used to take out the whole line
     */
    function darkenNonWinningBoxes(wins, wilds) {
        var boxes = [];
        if (wins) {
            //Add all boxes to array
            for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 3; y++) {
                    var box = boxLayer.getBox(x, y);
                    if (box) {
                        boxes.push(box);
                    }
                }
            }
            //Now go through all the winlines, removing boxes that are involved
            for (var i = 0; i < wins.length; i++) {
                var x = wins[i].column;
                var y = wins[i].row;
                var box = boxLayer.getBox(x, y);
                if (box) {
                    var index = boxes.indexOf(box);
                    if (index != -1) {
                        boxes.splice(index, 1);
                    }
                }
            }
            for (i = 0; i < wilds.length; i++) {
                var y = wilds[i].row;
                for (var x = 0; x < 5; x++) {
                    var box = boxLayer.getBox(x, y);
                    if (box) {
                        var index = boxes.indexOf(box);
                        if (index != -1) {
                            boxes.splice(index, 1);
                        }
                    }
                }
            }

            //now darken all the boxes that are left
            darkenedBoxes = boxes;
            for (var i = 0; i < darkenedBoxes.length; i++) {
                darkenedBoxes[i].darken(true);
            }
        }
    }

    function lightenLine(y) {
        for(var x = 0;x<5;x++) {
            var box = boxLayer.getBox(x,y);
            if (box) {
                box.darken(false);
            }
        }
    }
    function lightenNonWinningBoxes() {
        if (darkenedBoxes) {
            for(var i = 0;i<darkenedBoxes.length;i++) {
                darkenedBoxes[i].darken(false);
            }
            darkenedBoxes = null;
        }
    }

    game.states.addState("TITLE", {
        orig : {},
        txt:null,
        splash:null,
        init:function() {
            this.splash = new Sprite("images/CH_splash.jpg",{x:X,y:Y});
            ui.unshift(this.splash);
            ui.panel.show(false);
            winLayer.visible = false;
            ui.title.visible = false;
            ui.isTitle = true;
            ui.showSpin(false);
            //overlay.opacity = 0;
            if (screenMode=="PORTRAIT") {
                $("#titlescreen").show(10);
                $("#titlescreen").off().click(function() {
                    ui.isTitle = false;
                    game.states.setState("IDLE");
                });
                portraitTitleShowing = true;
            }
        },
        shutDown:function() {
            this.splash.animate({opacity:0},0.2, function(o) {
                o.destroyMe = true;
                $("#titlescreen").fadeOut(400);
                portraitTitleShowing = false;
            });
            ui.title.visible = true;
            winLayer.visible = true;
            this.splash = null;
            //overlay.animate({opacity:1},2);
            ui.panel.show(true);
        }
    });

    game.states.setState("TITLE");
}
function startSpin() {
    if (game.states.state=="IDLE" && !boxLayer.disabledTimer) {
        if (Config.balanceTarget>=(Config.stakePerLine*Config.numLines)) {
            game.states.setState("STARTSPIN");
            mobile.hideButtons();
            audiomanager.play("Button");
        } else {
            error.show("Not Enough Funds", "You do not have enough funds to spin. Please make a deposit or reduce your stake.");
            setTimeout(function() {
                error.hide();
            }, 5000);
        }
    }
}

function doubleBet() {
    if (game.states.state=="IDLE") {
        if (oldBet!=0) {
            Config.stakePerLine = oldBet;
            mobile.setBet(Config.numLines * Config.stakePerLine, false);
            audiomanager.play("Button2");
            mobile.setDouble(false);
            oldBet = 0;
            return;
        }
        oldBet = Config.stakePerLine;
        if ((Config.stakePerLine*2) <= Config.maxStakePerLine) {
            Config.stakePerLine *= 2;
        } else {
            Config.stakePerLine = Config.maxStakePerLine;
        }
        mobile.setDouble(true);
        mobile.setBet(Config.numLines * Config.stakePerLine, oldBet>0 ? true : false);
        audiomanager.play("Button2");
    }
}

function showCompleteWinLine(wl) {
    var wins = [];
    var w = Config.winLines[wl].line;
    for(var x = 0;x<w.length;x++) {
        var y = w[x];
        var box = boxLayer.getBox(x,y);
        if (box) {
            wins.push(box);
        }
    }
    for(var x = 0;x<5;x++) {
        for(var y = 0;y<3;y++) {
            var box = boxLayer.getBox(x,y);
            if (wins.indexOf(box)==-1) {
                box.darken(true);
            } else {
                box.darken(false);
            }
        }
    }
}
function glowLine(l, delay=true) {
    var box;
    for(var x = 0;x<5;x++) {
        var y = l;
        box = boxLayer.getBox(x, y);
        box.openBox();
        box.setGlow(true, delay ? 100+x*50 : 0,true);
    }

}

function glowWinLine(wl, delay=true) {
    var box;
    wl = Config.winLines[wl].line;
    for(var x = 0;x<wl.length;x++) {
        var y = wl[x];
        box = boxLayer.getBox(x, y);
        box.setGlow(true, delay ? x*50 : 0);
    }

}
function unGlowAllBoxes(delay=true) {
    for(var x = 0;x<5;x++) {
        for(var y = 0;y<3;y++) {
            var box = boxLayer.getBox(x, y);
            if (box) box.setGlow(false, delay ? x*50 : 0);
        }
    }

}

function lightenAllboxes() {
    for(var x = 0;x<5;x++) {
        for(var y=0;y<3;y++) {
            var box = boxLayer.getBox(x,y);
            if (box) {
                box.darken(false);
            }
        }
    }
}

function darkenAllboxes() {
    for(var x = 0;x<5;x++) {
        for(var y=0;y<3;y++) {
            var box = boxLayer.getBox(x,y);
            if (box) {
                box.darken(true);
            }
        }
    }
}

$(window).resize(function () {
    doresize();
});


var portraitTitleShowing = false;


function doresize() {

    mobile.resize();
    mobile.adjustFont();

    var p = testPlatform();
    var cont = $("#container");
    var ww = window.innerWidth;
    var hh = window.innerHeight;
    if (ww>=hh) {
        screenMode = "LANDSCAPE";

        $("#titlescreen").hide(10);
        Config.aspectRatio = 16/9;
        var w = window.innerWidth;
        var h = w * (1 / Config.aspectratio);
        if (h > window.innerHeight) {
            h = window.innerHeight;
            w = h * Config.aspectratio;
        }
        cont.width(w).height(h);
        cont.stop().css({left:(ww-w)/2,top:(hh-h)/2});
        if (ui) {
            ui.showSpin(true);
            ui.showTitle();
        }
        mobile.hide();

    } else {
        //Portrait
        var w = window.innerWidth+80;
        var l = (window.innerWidth-w)/2;
        var h = w * (1 / Config.aspectRatio);

        mobile.show();
        if (p=="MOBILE") {
            screenMode = "PORTRAIT";
            if (ui)
                ui.fs.exitFullScreen();
            cont.stop().css({top: $("#topbar").height(), left:l});
            cont.width(w).height(h);
            if (ui) {
                ui.showSpin(false);
                ui.hideTitle();
            }
            if (portraitTitleShowing) {
                $("#titlescreen").show(10);
            }
            mobile.show();
        } else {
            cont.css({top:(hh-h)/2, height:h,width:"100%"});
        }
    }


    //$(canvas.canvas).width(w).height(h);

}


