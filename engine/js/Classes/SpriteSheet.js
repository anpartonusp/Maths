class SpriteSheet {
    constructor(path, width, height) {
        this._spritesheet_ = true;
        this.ready = false;
        this.image = this.originalImage = game.imageManager.get(path, function() {
            this.setupsprites(width, height);
        }.bind(this));
        this.frames = [];
    }
    setupsprites(w,h) {
        var iw = this.image.width;
        var ih = this.image.height;
        var x = 0,y = 0;
        while (y<ih) {
            while (x<iw) {
                var f = {x:x,y:y,w:w,h:h};
                this.frames.push(f);
                x+=w;
            }
            x = 0;
            y+=h;
        }
    }
    get(f) {
        return (f<this.frames.length) ? this.frames[f] : null;
    }
}
