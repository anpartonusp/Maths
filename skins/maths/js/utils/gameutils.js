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
