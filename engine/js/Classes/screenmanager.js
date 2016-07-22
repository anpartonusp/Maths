class ScreenManager {
    constructor (screens) {
        this.screens = JSON.parse(JSON.stringify(screens));
        this.currScreens = [];
        this.last = [];
        this.screens.forEach(function(s) {
            this.hide(s);
        }.bind(this));
    }




    show(names, hideOthers = true) {
        if (typeof(names)==="string") names = [names];
        if (this.currScreens.length>0 && hideOthers) {
            this.hide(this.currScreens);
        }
        names.forEach(function(name) {
            var i = this.screens.indexOf(name);
            if (i!=-1) {
                $("#"+name).fadeIn(200);
            }

        }.bind(this))
        this.currScreens = JSON.parse(JSON.stringify(names));
    }


    hide(names, speed=0) {
        if (typeof(names)==="string") names = [names];
        names.forEach(function(name) {
            var i = this.screens.indexOf(name);
            if (i != -1) {
                $("#" + name).fadeOut(speed);
            }
        }.bind(this));
        this.currScreens = [];
    }

    back() {
    }
}
