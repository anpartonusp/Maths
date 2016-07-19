class ScreenManager {
    constructor (screens) {
        this.screens = JSON.parse(JSON.stringify(screens));
        this.currScreen = null;
        this.last = null;
        this.screens.forEach(function(s) {
            this.hide(s);
        }.bind(this));
    }

    show(name) {
        var i = this.screens.indexOf(name);
        if (i!=-1 && name!=this.currScreen) {
            this.last = this.currScreen;
            if (this.currScreen) {
                $("#" + this.currScreen).fadeOut(200);
            }
            $("#"+name).fadeIn(200);
            this.currScreen = name;

        }
    }
    hide(name, speed=0) {
        var i = this.screens.indexOf(name);
        if (i != -1) {
            $("#" + name).fadeOut(speed);
            if (name == this.currScreen) this.currScreen = null;
        }
    }

    back() {
        if (this.last) {
            this.show(this.last);
        }
    }
}
