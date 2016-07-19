class MapContainer extends View {
    constructor(tilemaps, dat) {
        super(dat);
        this.map = new Map(tilemaps, {handle:{x:0,y:0}, x:0, y:0, backroundColor:"black"});
        this.add(this.map);
    }
    load(filename) {
        this.map.load(filename);
    }

    onMouseDrag(x,y,dx,dy) {
        this.map.x += dx;
        this.map.y += dy;
        //console.log(this.map.x+" "+this.map.y);
    }
}

class Map extends View {
    constructor(tilemaps, dat) {
        super(dat);
        this.tileMaps = tilemaps;
        this.ready = false;
        this.layers = null;
        this.canv = this.surf = null;
        this.canv = game.canvas.canv;
        this.surf = game.canvas.surf;
        this.clip = false;
        this.tileWidth = 64;
        this.tileHeight = 64;
        var pos = this.to3({x:1,y:1});
        this.man = new Player("man",{handle:{x:0.5,y:0.9},x:pos.x,y:pos.y});
        this.add(this.man);
        this.XX = this.YY = 1;
        this.starMap = [];
    }
    load(filename) {
        this.starMap = [];
        this.layers = null;
        this.ready = false;
        var data = TileMaps[filename];
       
        data.tilesets.forEach(function(t) {
            t.graphics = game.imageManager.get("images/tiles/"+getFilenameFromPath(t.image));
            if (t.hasOwnProperty("tilepropertytypes")) t.tilepropertytypes = undefined;

        });
        this.tiles = data.tilesets;
        this.layers = data.layers;
        this.mapWidth = data.width;
        this.mapHeight = data.height;
        this.tileWidth = data.tilewidth;
        this.tileHeight = data.tileheight;
        this.width = this.mapWidth * this.tileWidth;
        this.height = this.mapHeight * this.tileHeight;
        this.ready = true;

    }
    onMouseUp(x,y) {
        var pos = this.to2({x:x,y:y});
        this.man.setTarget(pos);
    }
    update(delta) {
        this._draw();
    }
    _draw() {

        if (!this.surf || !this.ready) return;
        for(var i = 0;i<this.layers.length;i++) {
            this._drawLayer(this.layers[i]);
        }
    }
    _drawLayer(l) {
        var xStart = 0
        var xEnd = xStart+this.mapWidth;
        for(var y = 0;y<this.mapHeight;y++) {
            var base = y*this.mapWidth;
            for(var x = xStart;x<xEnd;x++) {
                var sym = l.data[base+x];
                this._drawTile(sym,x,y);
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
        xx = Math.round(xx/this.tileWidth*2);
        yy = Math.round(yy/this.tileHeight);
        return {x:xx,y:yy};
    }

    _drawTile(sym, x, y) {
        var pos = this.to3({x:x,y:y});
        sym-=this.tiles[0].firstgid;
        var iy = Math.floor(sym / this.tiles[0].columns);
        var ix =sym % this.tiles[0].columns;
        var w = 64;
        var h = 64;
        this.surf.save();
        this.surf.translate(pos.x, pos.y);
        this.surf.drawImage(this.tiles[0].graphics, ix*w, iy*h, w, h, -w/2, -h/2, w, h);
        this.surf.restore();

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
    xx = Math.round(xx/w*2);
    yy = Math.round(yy/h);
    return {x:xx,y:yy};

}
