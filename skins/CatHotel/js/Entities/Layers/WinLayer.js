const COL1X = 20;
const COL2X = 1280-20;
const COL1Y = 10;
var cols = [2,1,5,7,6,5,4,3,8,2,6,5,3,8,1,8,5,2,6,4];
//var ys = [5,1,8,0,9,2,7,6,4,3, 2,8,3,9,1,4,5,7,0,6];
//var nums = [4,2,6,10,9,1,8,7,3,5, 19,15,11,13,16,17,20,18,12,14];

var ys = [0,1,2,3,5,6,7,9,10,11, 0+0.15,1+0.15,2+0.15,3+0.15,5+0.2,6+0.2,9-0.4,10-0.4,11-0.4,12-0.4]
var nums = [10,4,2,6,8,1,9,7,3,5, 11,15,13,19,17,16,14,12,18,20];

var topmargin = 90;
var leftmargin = 160;
var rightmargin = 190;
var spacebetweensymbols = 40;

class WinLayer extends View {
    constructor(dat) {
        super(dat);
        var self = this;
        for (var i = 0;i<20;i++) {
            var s = new Sprite("linebox_"+cols[i], {winline:nums[i]-1,name:"box"+nums[i],x: i<10?leftmargin : 1280-rightmargin,y:topmargin+ys[i]*spacebetweensymbols});
            s.onMouseEnter = function() {
                if (game.states.state=="IDLE") {
                    showCompleteWinLine(this.winline);
                    glowWinLine(this.winline, false);
                    self.unfadesmall(this.winline + 1);
                    audiomanager.play("Button2",this.x);
                }
            }
            s.onMouseLeave = function() {
                if (game.states.state=="IDLE") {
                    lightenAllboxes();
                    unGlowAllBoxes(false);
                    self.fadeAll();
                }
            }
            var t = new Text(nums[i],{name:"text"+nums[i], x:s.x+5,y:s.y, color:"black" ,font:"Rammetto One", fontSize:18, autoDraw:true});
            this.add(s);
            this.add(t);
        }
        this.fadeAll();

    }

    fadeAll() {
        this.children.forEach(function(o) {
            o.animate({opacity:0.5, scaleX:1, scaleY:1},0.3);
        })
    }
    unfade(name) {
        var s = this.find("box"+name);
        var t = this.find("text"+name);
        if (s) s.stop().animate({opacity:1,scaleX:2.2, scaleY:2.2},0.3, function(o) {
            o.animate({scaleX:1.6, scaleY:1.6}, 0.1);
        })
        if (t) t.stop().animate({opacity:1,scaleX:2.2, scaleY:2.2},0.3, function(o) {
            o.animate({scaleX:1.6, scaleY:1.6}, 0.1);
        })

    }
    unfadesmall(name) {
        var s = this.find("box"+name);
        var t = this.find("text"+name);
        if (s) s.stop().animate({opacity:1,scaleX:1.3, scaleY:1.3},0.1, function(o) {

        })
        if (t) t.stop().animate({opacity:1,scaleX:1.3, scaleY:1.3},0.1, function(o) {

        })
    }
    getWinPosition(wl) {
        wl+=1;
        var s = this.find("box"+wl);
        var x = s.x;
        var y = s.y;
        return {x:x,y:y};
    }
    show(s) {
        if (!s) {
            //this.stop().animate({scaleX:2,scaleY:2},0.5);
            this.children.forEach(function(o) {
                o.stop().animate({opacity:0.0, scaleX:0, scaleY:0},0.3);
            })



//            this.stop().fadeOut(0.2, function(o) {
//                o.visible = false;
//            })

        } else {
            this.children.forEach(function(o) {
                o.stop().animate({opacity:0.5, scaleX:1, scaleY:1},0.3);
            })

            //this.stop().animate({scaleX:1,scaleY:1},0.5);
  //          this.visible = true;
  //          this.stop().fadeIn(0.2);
        }
    }
}

