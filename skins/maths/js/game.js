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

var people;

function startGame() {
    game = new GameManager({width:WIDTH, height:HEIGHT});
    screens = new ScreenManager([ "login", "dashboard", "profile","shop","canvas", "leftcontrols","rightcontrols", "info"]);
    people = new SpriteSheet("images/spritesheets/people.png",32,48);
    initSprites("sprites");
    video = new Video();
    $(window).resize(function() {
        doResize(16/9);
    });
    doResize(16/9);
    
    screens.show(["login"]);

    map  = new MapContainer(TileMaps, {width:WIDTH, height:HEIGHT, x:X, y:Y, clearScreen:true, backgroundColor:"black"});
    game.add(map);

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
    screens.show(["canvas","leftcontrols","rightcontrols","info"]);
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
var zoom = 1;
function zoomIn() {
    if (zoom<3) {
        zoom *= 1.5;
        map.stop().animate({scaleX: zoom, scaleY: zoom}, 0.5)
    }
}

function zoomOut() {
    if (zoom>1) {
        zoom *= 1 / 1.5;
        map.stop().animate({scaleX: zoom, scaleY: zoom}, 0.5)
    }
}

var char = 0;

function decreasecharacter() {
    char--;
    if (char<0) char = 24;
    map.map.player.character = char;
}

function increasecharacter() {
    char++;
    if (char==25) char = 0;
    map.map.player.character = char;
}

var mainApp = angular.module("mainApp", []);
mainApp.controller('game', function($scope) {
    $scope.xp = 100;
    $scope.coins = 0;
});