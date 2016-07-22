class Player extends Character {
    constructor(path, map, dat) {
        super(path, map, dat);
        this.handle = {x: 0.5, y: 0.6};
    }
}

class RandomCharacter extends Character {
    constructor(path, map, dat) {
        super(path, map, dat);
        this.handle = {x: 0.5, y: 0.6};
        this.pickRandomLocation();
    }

    pickRandomLocation() {
        var x,y, res;
        do {
            do {
                x = randomInt(1, 98);
                y = randomInt(1, 98);

            } while (this.map[x][y].tiles[1] != 0)
            var currPos = this.to2({x: this.x, y: this.y});
            res = astar.search(this.map, this.map[currPos.x][currPos.y], this.map[x][y], true);

        } while (res==[])
        this.setTargets(res);
    }

}

function placeRandomCharacter() {
    var x,y;
    do {
        x = randomInt(1, 98);
        y = randomInt(1, 98);

    } while (this.map[x][y].tiles[1] != 0)
    var c = new RandomCharacter("man",{})
}