

class View extends Entity {
    constructor(dat) {
        super();
        this.mouseX = 0;
        this.mouseY = 0;
        this.clip = true;
        this.type = "VIEW";
        this.zoom = 1;
        this.zoomX = this.width/2;
        this.zoomY = this.width/2;
        this.clearScreen = true;
        dat = dat || {};
        merge(this, dat);
    }

    set backgroundImage(im) {
        this._backgroundImage = new Sprite(im);
    }
    get backgroundImage() {
        return this._backgroundImage;
    }
    _update(delta) {
        super._update(delta);

        if (this.visible) {
            var surf = this.surf;
            surf.save();
            {
                surf.translate(Math.round(this.x+this.zoomX), Math.round(this.y+this.zoomY));
                surf.rotate(this.rotation);
                surf.scale(this.scaleX*this.zoom, this.scaleY*this.zoom);
                if (this.clip) {
                    surf.beginPath();
                    surf.rect(-this.width * this.handle.x, -this.height * this.handle.y, this.width, this.height);
                    surf.clip();
                }
                surf.translate(-this.width * this.handle.x, -this.height * this.handle.y);
                surf.globalAlpha = this.opacity;
                if (this.clearScreen) {
                    if (this._backgroundImage) {
                        this._backgroundImage.scaleX = this.width / this._backgroundImage.image.width;
                        this._backgroundImage.scaleY = this.height / this._backgroundImage.image.height;
                        this._backgroundImage.draw(this.width/2,this.height/2);
                    } else if (this.hasOwnProperty("backgroundColor")) {
                        surf.fillStyle = this.backgroundColor;
                        surf.fillRect(0, 0, this.width, this.height);
                    } else {
                        surf.clearRect(0, 0, this.width, this.height);
                    }
                }

                this.update(delta);
                var destroy = [];
                this.children.forEach(function(ch) {
                    if (ch.destroyMe) destroy.push(ch);
                    if (ch.enabled) {
                        ch._update(delta);
                        if (ch.autoDraw) {
                            ch.draw();
                        }
                    }
                }.bind(this));
                destroy.forEach(function(d) {
                    var i = this.children.indexOf(d);
                    if (i!=-1) {
                        this.children.splice(i,1);
                    }
                }.bind(this))
            }
            this.postDraw(delta);
            surf.restore();
        }

    }
}



