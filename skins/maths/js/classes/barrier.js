class Barrier {
    constructor(name, layer, x, y, char) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.char = char;
    }
    get pos() {
        return to3({x:this.x, y:this.y});
    }

    setItem(char, collide = false, delay = 0) {
        setTimeout(function() {
            map.map.map[this.x][this.y].tiles[this.layer] = char;
            map.map.map[this.x][this.y].collide = collide;
            this.char = char;
        }.bind(this), delay)
    }

}
