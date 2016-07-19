class Canvas {

    constructor(containerName) {
        //this.viewportManager = new ViewportManager(this);
        this.canv = document.createElement("canvas");
        this.canv.id = "canvas";
        var cont = $("#"+containerName);    //.get(0);
        cont.prepend(this.canv);
        this.surf = this.canv.getContext("2d");
    }

    clear(col) {
        if (typeof(col) === 'undefined') {
            this.surf.clearRect(0, 0, this.canv.width, this.canv.height);
        } else {
            this.surf.fillStyle = col;
            this.surf.fillRect(0, 0, this.canv.width, this.canv.height);
        }
    }
    set x(x) {
        this.canv.style.left = x+"px";
    }
    set y(y) {
        this.canv.style.top = y+"px";
    }

    get surface() {
        return this.surf;
    }
    get canvas() {
        return this.canv;
    }

    get size() {
        return {width: this.canv.width, height: this.canv.height};
    }
    set size(s) {
        this.canv.width = s.width;
        this.canv.height = s.height;
    }
    get width() {
        return this.canv.width;
    }
    set width(w) {
        this.canv.width = w;
    }
    get height() {
        return this.canv.height;
    }
    set height(h) {
        this.canv.height = h;
    }
    get displaySize() {
        return {w: $(this.canv).width(), h: $(this.canv).height()};
    }
    set displaySize(s) {
        //this.canv.style.width = s.w+"px";
        //this.canv.style.width = s.h+"px";
        $(this.canv).width(s.width).height(s.height);
    }
    get displayWidth() {
        return $(this.canv).width();
    }
    set displayWidth(w) {
        return $(this.canv).width(w);
    }
    get displayHeight() {
        return $(this.canv).height();
    }
    set displayHeight(h) {
        return $(this.canv).height(h);
    }

    set backgroundColor(c) {
        $(this.canv).css({backgroundColor: c});
    }
    get backgroundColor() {
        return $(this.canv).css("backgroundColor");
    }
}
