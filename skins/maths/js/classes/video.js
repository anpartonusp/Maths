class Video {
    constructor() {
        this.v = document.getElementById("video");
        this.jv = $("#video");
        this.v.style.display = "none";
        this.v.addEventListener("ended", function() {
            this.end();
        }.bind(this), false);
        this.v.addEventListener("click", function() {
            this.v.play();
        }.bind(this), false);
        this.v.click();
        this.callback = function() {};
    }
    play(name, callback) {
        this.callback = callback || function() {};
        this.v.src = "videos/"+name;
        this.v.play();
        screens.show("video");
        //this.jv.fadeIn(500);
    }
    end() {
        //this.jv.fadeOut(500);
        screens.hide("video");
        this.callback();
    }
}
