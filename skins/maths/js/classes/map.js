class MapContainer extends View {
    constructor(tilemaps, dat) {
        super(dat);
        this.map = new Map(tilemaps, {handle:{x:0,y:0}, x:0, y:0, backgroundColor:"black"});
        this.add(this.map);

    }
    load(filename) {
        this.map.load(filename);
    }

    onMouseDrag(x,y,dx,dy) {
        this.map.x += dx;
        this.map.y += dy;
        this.map.centerTarget = null;
    }
    setTarget() {
        this.map.centerTarget = this.map.player;
    }
}

class Map extends View {
    constructor(tilemaps, dat) {
        super(dat);
        this.handle = {x:0,y:0};
        this.ready = false;
        this.layers = null;
        this.canv = this.surf = null;
        this.canv = game.canvas.canv;
        this.surf = game.canvas.surf;
        this.clip = false;
        this.tileWidth = 64;
        this.tileHeight = 64;
        this.chars = [];
        var pos = this.to3({x:1,y:1});
        this.player = new Player(people,this, {scaleX:1.6,scaleY:1.6,handle:{x:0.5,y:1.0},x:pos.x,y:pos.y});
        this.player.character = 4;
        this.chars.push(this.player);
        this.centerTarget = this.player;
        this.target = new TARGET("targettile",this, {flipX:true, x:100,y:100, opacity:0.0});
        this.lessons = [];
    }

    load(filename) {
        var self = this;
        TileMaps = [];
        this.layers = null;
        this.ready = false;

        $.getScript("maps/"+filename+".js", function(d) {
            var data = TileMaps[filename];
            this._convert(data);
            TileMaps = [];
            this.ready = true;

        }.bind(this));
    }
    _getProperty(tile) {
        var index = tile.toString();
        if (this.tiles[0].tileproperties.hasOwnProperty(index))
            return this.tiles[0].tileproperties[index];
        return null;

    }
    _convert(data) {
        this.mapWidth = data.width;
        this.mapHeight = data.height;
        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;
        this.width = this.mapWidth * this.tileWidth;
        this.height = this.mapHeight * this.tileHeight;
        this.tiles = data.tilesets;
        this.lessons = [];
        var objectLayers = [];
        data.tilesets.forEach(function(t) {
            t.graphics = game.imageManager.get("images/tiles/" + getFilenameFromPath(t.image));
            if (t.hasOwnProperty("tilepropertytypes")) t.tilepropertytypes = undefined;
        });
        this.map = [];



        for(var x = 0;x<this.mapWidth;x++) {
            var col = [];
            for(var y = 0;y<this.mapHeight;y++) {
                var t = {
                    tiles:[],
                    x:x,
                    y:y,
                    f:0,
                    g:0,
                    h:0,
                    cost:1,
                    visited:false,
                    closed:false,
                    parent:null,
                    collide: false,
                    character : null
                }
                data.layers.forEach(function(tiles) {
                    if (tiles.type!="objectgroup") {
                        var tt = tiles.data[y * this.mapWidth + x];
                        t.tiles.push(tt);
                    }
                }.bind(this));
                var tile = this._getProperty(t.tiles[0]);


                var index = (t.tiles[1]).toString();
                if (this.tiles[0].tileproperties.hasOwnProperty(index))
                    t.collide = this.tiles[0].tileproperties[index].collide;
                col.push(t);
            }
            this.map.push(col);
        }
        data.layers.forEach(function(layer) {
            if (layer.type=="objectgroup") {
                layer.objects.forEach(function(obj) {
                    if (obj.name=="playerstart") {
                        var pos = {x:Math.floor(obj.x/32),y:Math.floor(obj.y/32)};
                        pos = to3(pos);
                        this.player.x = pos.x;
                        this.player.y = pos.y;
                    }
                    if (obj.type=="lesson") {
                        this.lessons.push({
                            id : obj.id,
                            x : Math.floor(obj.x/32),
                            y : Math.floor(obj.y/32),
                        });
                        console.log("Lesson "+obj.id);
                    }
                    if (obj.type=="npc") {
                        var data = {};
                        var items = obj.name.split(";");
                        items.forEach(function(i) {
                            var i2 = i.split("=");
                            data[i2[0]] = i2[1];
                        });


                        console.log(data);
                    }
                }.bind(this));

            }
        }.bind(this));

    }

    onMouseClick(x,y) {
        var pos = this.to2({x:x,y:y});
        var currPos = this.to2({x:this.player.x,y:this.player.y});
        var res = astar.search(this.map, this.map[currPos.x][currPos.y], this.map[pos.x][pos.y], false);
        this.player.setTargets(res);
        var tpos = this.to3(pos);
        this.target.x = tpos.x;
        this.target.y = tpos.y;
        this.target.active = true;
        return CANCEL;
    }
    onMouseUp() {
        return CANCEL;
    }
    onMouseMove(x,y) {

    }
    update(delta) {
        if (this.centerTarget) {
            var tx = this.centerTarget.x - (WIDTH/2);
            var ty = this.centerTarget.y - (HEIGHT/2);
            tx = -tx;
            ty = -ty;
            this.x += (tx - this.x) * 2 * delta;
            this.y += (ty - this.y) * 2 * delta;
        }
        this.chars.forEach(function(c) {
            c._update(delta);
            c.update(delta);
        });

        this.chars.forEach(function(c) {
            c.placeInMap();
            //c.draw();
        });

        this._draw();


    }

    _draw() {
        if (!this.surf || !this.ready) return;

        for (var x = 0;x<this.mapWidth;x++) {
            for(var y = 0;y<this.mapHeight;y++) {
                this._drawFloor(this.map[x][y], x, y);
            }
        }

        for (var x = 0;x<this.mapWidth;x++) {
            for(var y = 0;y<this.mapHeight;y++) {
                this._drawTile(this.map[x][y], x, y);
            }
        }

    }


    to3(pos) {
        return {x : (pos.x-pos.y) * this.tileWidth/2, y:(pos.x + pos.y) * this.tileHeight/2}
    }

    to2(pos) {
        var x = pos.x;
        var y = pos.y;
        var xx = (2 * y + x) / 2;
        var yy = (2 * y - x) /2;
        xx = Math.floor(xx/this.tileWidth*2);
        yy = Math.floor(yy/this.tileHeight);
        return {x:xx,y:yy};
    }


    _drawTile(sym, x, y) {
        var pos = this.to3({x:x,y:y});
        if (pos.x+64<-this.x || pos.x-64 > -this.x+WIDTH) return;
        if (pos.y+64<-this.y || pos.y-64 > -this.y+HEIGHT) return;
        var w = 64;
        var h = 64;

        var l = sym.tiles.length;
        for (var i = 1;i<l;i++) {
            if (i==1 && sym.character) {
                //sym.character.forEach(function(c) {
                //    c.draw();
                //});
                sym.character.draw();
                sym.character = null;
            }

            var s = sym.tiles[i] - this.tiles[0].firstgid;
            var iy = Math.floor(s / this.tiles[0].columns);
            var ix = s % this.tiles[0].columns;

            this.surf.drawImage(this.tiles[0].graphics, ix*w, iy*h, w, h, pos.x-w/2, pos.y-h/2, w, h);

        }




    }
    _drawFloor(sym, x, y) {
        var pos = this.to3({x:x,y:y});
        if (pos.x+64<-this.x || pos.x-64 > -this.x+WIDTH) return;
        if (pos.y+64<-this.y || pos.y-64 > -this.y+HEIGHT) return;
        var w = 64;
        var h = 64;
        var l = sym.tiles.length;
        var i = 0;
        var s = sym.tiles[i] - this.tiles[0].firstgid;
        var iy = Math.floor(s / this.tiles[0].columns);
        var ix = s % this.tiles[0].columns;
        this.surf.drawImage(this.tiles[0].graphics, ix*w, iy*h, w, h, pos.x-w/2, pos.y-h/2, w, h);
    }

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



