var MOCK = true;
var FAKE = true;
const RECORD = false;

var reqID = new Date().getTime();
const TEST = true;
var layouts = [
    "3ibhcbdiaf1he4ci1gfiehiadifgcbfdehcg1iefg4acihf1higdhegbidgeh4fh4bih",
    "3ibhcbd2ab2hegc2ediehidfigcbfdehciefghacihf2higdhegbidgefhifgihfg",
    "3dbhdgd1af1he4ha4if3ehifdifgcbfde2hcg1ie1fg4acihb1high2egidg2ef2hi",
    "32dhdaieafbeca2gfiehiadifgcbidehcg2ieg2acihf2higdhegbidgefhbfdcgh",
    "34dhdaieaf1be4ca1gfiehiadifgcbid4hcg1ieg1acihf1higdhegbid4efhbfd4gh"
];
var totalWin = 0;
var line = {};
var syms = ["a","b","c","d","e","f","g","h","i"];

function getMatrix() {
    totalWin = 0;
    line = {};
    line.freeSpinsremaining = 0;
    line.reelStops = getLine();
    line.totalWin = line.totalPayout = totalWin;
    if (line.totalWin>0) {
        line.winningLines = [1];
    }
    return line;
}

function getFreeSpin() {
    totalWin = 0;
    line = {};
    line.freeSpinsremaining = randomInt(3,10);
    line.reelStops = [];
    line.reelStops.push()

}
function findSym(i,s) {
    var syms = [];
    var l = layouts[i];
    for(var i = 0;i<l.length;i++) {
        if (l[i]==s) {
            syms.push(i);
        }
    }
    if (syms.length==0) return randomInt(0,64);
    return syms[randomInt(0,syms.length-1)];
}

function getLine() {
    var r = [];
    var numsyms = 0;

    var nd = syms.length;
  //  if (randomInt(0,100)>10) {
        //Free Spins
  //      return getFreeSpin();
  //  }
    if (randomInt(0,100)>70) {
        //win
        numsyms = randomInt(3,5);
        var sym = syms[randomInt(0,nd-1)];
        for(var i = 0;i<5;i++) {
            if (i<numsyms) {
                r.push(findSym(i,sym));
            } else {
                r.push(randomInt(0,64));
            }
        }
        totalWin = randomInt(1,10)*10;
    } else {
        for(var i = 0;i<5;i++) {
            r.push(randomInt(0,64));
        }
    }

    return r;

}


class BackEnd {


    /* Supposedly new stuff

     this.gameInstance = new Date().getTime();
     var loc = ".qa.";


     //if (getEnv()!="LOCAL" && getEnv()!="MFUSE") {
     //    this.gameServerURL = window.location.host+"/";
     //}



     this.gameServerURL = `https://gameserver${loc}nektan.com`;
     //this.gameServerURL = "https://mobile-qa1.chompcasino.com/";
     //this.gameServerURL = "https://mobile-qa1.chompcasino.com/"
     //if (getEnv()!="LOCAL" && getEnv()!="MFUSE") {
     //    this.gameServerURL = window.location.host+"/";
     //}
     getCommandLine();
     Config.realityTimer = 0;

     */


    constructor() {
        if (FAKE) {
            this.fakeServer = new FakeServer();
        } else {
            this.gameInstance = new Date().getTime();

            this.gameServerURL = "https://mobile-qa1.chompcasino.com/";  //"https://mobile-qa1.chompcasino.com/";

            if (getEnv() == "LOCAL") {
                this.gameServerURL = "http://10.99.0.140:8080/";
            }
        }
        getCommandLine();
        Config.realityTimer = 0;

    }


    readFakeData() {
        console.log("Reading fake data");
        $.ajax({
            url: "json/fakeServerData.json",
            dataType:"json",
            async:false,
            success: function(data) {
                console.log("Finished reading fake json data");
                this.fakeServerData = data;
                error.show("Internal Debug Mode",`${Config.title} is running in Debug mode`);
                setTimeout(function() {
                    error.hide();
                },2000);
            }.bind(this)
        });
    }

    startDemoSession(callback, error) {
        var tag = Config.settings.gameTag;
        Config.startTime = new Date().getTime();

        if (FAKE && tag=="SLOTS") {
            var d = {};
            d.total = {amount:500, currency:"GBP"};
            callback(d);
            return;

        }



        if (MOCK) {
            this.readFakeData();
            callback(
                {total:{"amount":500,"currency":"GBP"},
                "cash":{"amount":500,"currency":"GBP"},
                "bonus":{"amount":0,"currency":"GBP"}}
            );
            return;
        }
        var timeStamp = new Date().getTime();
        var url = this.gameServerURL+"gameserver/games/demosession?timestamp="+timeStamp;

        var params = {
            externalAccountSystemTag: Config.settings.externalAccountSystemTag,
            gameTag: Config.settings.gameTag,
            platformTag: "MOB",
            demo:true
        }
        if (FAKE) {
            this.fakeServer.ajax("demosession", {
                    method: "POST",
                    data: params,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true,
                        xsrfCookieName: 'GS-XSRF-TOKEN',
                        REQUEST_ID: reqID++
                    },
                    success: callback,
                    error: error || function () {
                    }
                })
        }
        else {
            $.ajax(url, {
                method: "POST",
                data: params,
                dataType: "json",
                xhrFields: {
                    withCredentials: true,
                    xsrfCookieName: 'GS-XSRF-TOKEN',
                    REQUEST_ID: reqID++
                },
                success: callback,
                error: error || function () {
                },
                timeout: 10000
            });
        }

    }
    get(cmd, callback, error) {


        var url = this.gameServerURL+"gameserver/games/api/"+cmd;

        var params = {
            externalAccountSystemTag: Config.settings.externalAccountSystemTag,
            gameTag: Config.settings.gameTag,
            platformTag: "MOB",
            demo:true,
            GameInstance:this.gameInstance
        };

        if (FAKE) {
            this.fakeServer.get(cmd, params, callback);
            return;
        }
        $.ajax(url, {
            method:"GET",
            data:params,
            dataType:"json",
            xhrFields: {
                withCredentials: true,
                xsrfCookieName:'GS-XSRF-TOKEN',
                REQUEST_ID : reqID++
            },
            success:callback,
            error:error || function(){},
            timeout:10000

        });
    }
    post(cmd, callback, error, mergedata={}) {
        if (FAKE && Config.settings.gameTag=="SLOTS" && cmd.indexOf("spin")!=-1) {
            line = getMatrix();
            callback(line);
            return;
        }
        if (MOCK) {
            if (cmd.indexOf("spin")!=-1) {
                var l = this.fakeServerData.length;
                var r = randomInt(0,l-1);
                callback(this.fakeServerData[r]);
                return;
            }
        }
        var url = this.gameServerURL+"/gameserver/games/api/"+cmd;

        var params = {
            currency:Config.currency,
            gameTag: Config.settings.gameTag,
            numLines:Config.numLines,
            stake:Config.stakePerLine
        };

        merge(params, mergedata);
        if (FAKE) {
            this.fakeServer.ajax(cmd,{
                method:"POST",
                beforeSend: function(x,y) {
                    //x.setRequestHeader("xsrfCookieName",'X-XSRF-TOKEN');  //this used to be required, suddenly it doesn't work. Go figure.
                    x.setRequestHeader("REQUEST_ID", reqID++);
                    return true;
                },

                data:JSON.stringify(params),
                dataType:"json",
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true

                },
                timeout:10000,
                success:callback,
                error:error || function(){}
                }
            );
        } else {
            $.ajax(url, {
                method: "POST",
                beforeSend: function (x, y) {
                    //x.setRequestHeader("xsrfCookieName",'X-XSRF-TOKEN');  //this used to be required, suddenly it doesn't work. Go figure.
                    x.setRequestHeader("REQUEST_ID", reqID++);
                    return true;
                },

                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true

                },
                timeout: 10000,
                success: callback,
                error: error || function () {
                }
            });
        }
    }


}
