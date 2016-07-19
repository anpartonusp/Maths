const ERR_OK = 1;

class ErrorManager {
    constructor() {
        this.errordiv = $("#errordiv");
        this.errorheading = $("#errorheading")
        this.errorbody = $("#errorbody");
    }

    show(heading, message) {
        this.errorheading.html(heading);
        this.errorbody.html(message);
        this.errordiv.fadeIn(500);
    }
    hide() {
        this.errordiv.fadeOut();
    }
    showDialog(header, yes=function(){}, no=function(){}) {
        $("#dialogheader").html(header);
        $("#dialog").off().resize(function() {
            $("#dialog").css({fontSize:$("#dialog").width()/20});
        })
        $("#dialogyes").off().click(function() {
            yes();
        });
        $("#dialogno").off().click(function() {
            no();
        });
        $("#dialog").fadeIn(300);
    }
    hideDialog() {
        $("#dialog").fadeOut(300, function() {
            $("#dialog").off();
        });
    }

}
