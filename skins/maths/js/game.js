var WIDTH = 1280;
var HEIGHT = 720;
var X = WIDTH/2;
var Y = HEIGHT/2;

var game;
var video;
var screens;
var map, ui;

var TileMaps;
var gameConfig = {};



function startGame() {
    game = new GameManager({width:WIDTH, height:HEIGHT});
    screens = new ScreenManager([ "login", "dashboard", "profile","shop","canvas", "leftcontrols","rightcontrols"]);
    initSprites("sprites");
    video = new Video();
    $(window).resize(function() {
        doResize(16/9);
    });
    doResize(16/9);
    
    screens.show(["login","rightcontrols"]);

    map  = new MapContainer(TileMaps, {width:WIDTH, height:HEIGHT, x:X, y:Y, clearScreen:true, backgroundColor:"black"});
    game.add(map);

    ui = new UI({x:X,y:Y,width:WIDTH, height:HEIGHT});
    game.add(ui);

    game.states.addState("IDLE", idleState);
    
}


function login() {
    screens.show("dashboard");

}

function logout() {
    screens.show("login");
}

function showMap() {
    game.states.setState("IDLE");
    screens.show(["canvas","leftcontrols","rightcontrols"]);
}

function centerView() {
    map.setTarget()
}

var fs = false;
function toggleFullScreen() {
    if (!fs) {
        setButtonGraphic("fullscreen","images/controls/full_screen_state.png")
        launchFullscreen();
    } else {
        setButtonGraphic("fullscreen","images/controls/full_screen.png")
        exitFullscreen();
    }
    fs = !fs;
}



