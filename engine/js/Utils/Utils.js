/**
 * generates a ranged random int (inclusive)
 * @param min
 * @param max
 * @returns {integer}
 */
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Randomly shuffles an array in place
 * @param o
 * @returns {*}
 */
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/**
 * Uppercases the first character of a string
 * @param string
 * @returns {string}
 */
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Merges one object into another in place
 */

function merge(to,from) {
    for (var k in from) {
        if (to.hasOwnProperty(k)) {
            to[k] = from[k];
        } else {
            to[k] = from[k];
        }
    }
    return to;
}
/**
 * Rotates a point around an origin
 * @param pointX
 * @param pointY
 * @param originX
 * @param originY
 * @param angle
 * @returns the rotated point {{x: *, y: *}}
 */
function rotatePoint(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}

/**
 * Tests whether we're on mobile or desktop
 * @returns {"MOBILE" or "DESKTOP"}
 */
function testPlatform() {
    //return "MOBILE";
    var a = window.screenX === 0;
    var b = window.devicePixelRatio>1 && screen.width > 1024;
    var c = window.hasOwnProperty("orientation");
    var mess = "";
    if (c) mess = "MOBILE";
    else if (a && b && c) {
        mess = "MOBILE";
    } else if (a && b && !c) {
        mess = "MOBILE";
    } else mess = "DESKTOP";
    return mess;
}

/**
 * Gets commandline parameters, fills out an object with the values, and sets Config.settings to the object
 * @returns {settings}
 */
function getCommandLine() {
    var settings = {};
    var s = window.location.search;
    if (s.length>0) {
        s = s.substr(1);
        s = s.split('&');

        s.forEach(function(keyval) {
            var k = keyval.split('=');
            if (k.length==2) {
                settings[k[0]] = k[1];
            }
        });
    }

    Config.settings = settings;
    return settings;
}

/**
 * Gets the current hosting environment
 * @returns {"MFUSE" "LOCAL", "QA", "UAT" "PROD"}
 */
function getEnv() {
    var h = window.location.hostname.toLowerCase();
    if (h.indexOf("mfuse")!=-1 || h.indexOf("localhost")!=-1) return "LOCAL";
    if (h.indexOf("qa")!=-1) return "QA";
    if (h.indexOf("uat")!=-1) return "UAT";
    return "PROD";
}

/**
 * Input a number, and this returns a 'snapped' version. pass in the snap value
 */

function snap(num, snap) {
    var r =  Math.floor(num/snap) * snap;
    return r;
}

/**
 * LocalStorage util. Maintains local storage
 */

function loadLocalStorage() {
    var s = localStorage.storage || "{}";
    return JSON.parse(s);
}

function saveLocalStorage(s) {
    localStorage.storage = JSON.stringify(s);
}

function getValueFromStorage(k) {
    var s = loadLocalStorage();
    return s[k] || null;
}

function setValueToStorage(k,v) {
    var s = loadLocalStorage();
    s[k] = v;
    saveLocalStorage(s);
}


function hasFullscreen(element = $("#container")[0]) {
    if ((self==top) && (element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen))
        return true;
    else
        return false;
}

function launchFullscreen(element = $("#container")[0]) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
function exitFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
/**
 * Creates an animdef structure from supplied data
 *
 * @param dat
 *
 * dat is an object that should contain the following:
 * name - base name
 * startFrame - starting frame
 * endFrame - last frame
 * fps - Frames per second
 * loop - loop type ('loop' or 'none')
 * addBaseFrame = Boolean. If true, a frame with the base name is added on the end
 *
 *
 * @returns {{loopType: (*|string), speed: (*|number), frames: Array}}
 */


function createAnimDef(dat) {
    var name = dat.name;
    var start = dat.startFrame || 1;
    var end = dat.endFrame;
    var loop = dat.loop || "none";
    var fps = dat.fps || 10;
    var add = dat.addBaseFrame || false;
    var f = [];
    for (var i = start;i<=end;i++) {
        var str = i.toString();
        while (str.length<5) str = "0"+str;
        f.push(name+"_"+str+":0,0");
    }
    if (add) {
        f.push(dat.name + ":0,0");
    }
    var arr = {
        loopType:loop,
        speed:fps,
        frames:f
    };
    return arr;
}

function doResize(aspectRatio, dat) {
    dat = dat || {
            vcenter:true,
            hcenter:true,
            container:"container",
        };
    var ww = window.innerWidth;
    var hh = window.innerHeight;
    var left = 0,top = 0;
    var cont = $("#"+dat.container);
    var w = ww;
    var h = ww * 1/aspectRatio;

    if (h>hh) {
        h = hh;
        w = h * aspectRatio;
        if (dat.hcenter) left = (ww-w)/2;
    } else {
        if (dat.vcenter) top = (hh-h)/2;
    }
    $(cont).width(w).height(h).css({left:left, top:top});

}

function getFilenameFromPath(path) {
    return path.replace(/^.*[\\\/]/, '');
}
