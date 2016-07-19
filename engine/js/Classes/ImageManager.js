class ImageManager {
    constructor() {
        this.images = [];
        this.sounds = [];
        this.names = [];
    }
    get(name, callback) {
        var n = name.toLowerCase();
        if (this.images.hasOwnProperty(n)) {
            if (callback) {
                callback(this.images[n]);
            }
            return this.images[n];
        };
        if (this.sounds.hasOwnProperty(n)) {
            if (callback) {
                callback(this.sounds[n]);
            }
            return this.sounds[n];
        }
        if (n.indexOf(".m4a")!=-1 || n.indexOf(".mp3")!=-1 || n.indexOf(".ogg")!=-1) {
            var req = new XMLHttpRequest();
            req.open("GET", name,true);
            req.responseType = "arraybuffer";
            req.onload = function() {
                this.sounds[n] = req.response;
                if (callback) {
                    callback(req.response);
                }
            }.bind(this);
            req.send();
            return null;
        }
        var image = new Image();







        image.ready = false;
        image.onload = function() {
            this.ready = true;
            if (callback) {
                callback(this);
            }
        }
        image.src = name;
        this.images[n] = image;
        return image;
    }
    remove(name) {
        if (this.images.hasOwnProperty(name.toLowerCase())) {
            delete(this.images[name.toLowerCase()]);
            return;
        }
        if (this.sounds.hasOwnProperty(name.toLowerCase())) {
            delete(this.images[name.toLowerCase()]);
            return;
        }

    }
    preLoad(names, callback, progress) {
        var cnt = names.length;
        var total = cnt;
        var counter = 0;
        for(var i = 0;i<names.length;i++) {
            this.get(names[i], function(obj) {
                cnt--;
                counter++;
                if (progress) {
                    progress(counter/total);
                }
                if (cnt==0 && callback) {
                    callback();
                }
            });
        }
    }
}
