class Player extends Character {
    constructor(path, map, dat) {
        super(path, map, dat);
        this.type = "player";
        this.handle = {x: 0.5, y: 0.6};

    }
    onCollide(other) {
        if (other.type=="npc") {
            other.highlighted = false;
            this.targets = [];
            showConversation(this.map.filename + "/" + other.data.name);
        }
    }
}

