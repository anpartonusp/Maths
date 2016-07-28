function setButtonGraphic(buttonName, image) {
    $("#"+buttonName).attr("src",image);
}


function to3(pos, w=64, h=32) {
    return {x : (pos.x-pos.y) * w/2, y:(pos.x + pos.y) * h/2}
}

function to2(pos, w=64, h=32) {
    var x = pos.x;
    var y = pos.y;
    var xx = (2 * y + x) / 2;
    var yy = (2 * y - x) /2;
    xx = Math.floor(xx/w*2);
    yy = Math.floor(yy/h);
    return {x:xx,y:yy};

}
function to2round(pos, w=64, h=32) {
    var x = pos.x;
    var y = pos.y;
    var xx = (2 * y + x) / 2;
    var yy = (2 * y - x) /2;
    xx = Math.round(xx/w*2);
    yy = Math.round(yy/h);
    return {x:xx,y:yy};
}


function findCharByName(name) {
    var c = map.map.chars;
    name = name.toLowerCase();
    for (var i = 0;i<c.length;i++) {
        if (c[i].name && c[i].name.toLowerCase()==name) {
            return c[i];
        }
    }
    return null;
}

function loadMap(name) {
    map.load(name, function() {
        game.states.addState("SCRIPT",mapscript);
        game.states.setState("SCRIPT");
    });
}

function showConversation(name) {
    map.map.pause();
    $("#conversation").load("maps/conversations/"+name+".html", function() {

        $("#dimscreen").fadeIn(500);
        setTimeout(function() {
            $("#conversation").fadeIn(200);
        }, 400);

    })
}

function hideConversation() {
    map.map.resume();
    $("#conversation").fadeOut(500);
    setTimeout(function() {
        $("#dimscreen").fadeOut(500);
    }, 100);

    map.map.deselectAllChars();
}

function angle(c1, c2) {
    var a = Math.atan2(c1.y - c2.y, c1.x - c2.x);
    a+=3.154;
    //a = (3.154*2) / a;
    a = Math.round(a);
    console.log(a);
    return a;
}