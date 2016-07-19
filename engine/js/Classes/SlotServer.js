var syms = ["a","b","c","d","e","f","g","h","i"];

var layouts = [
    "3ibhcbdiaf1he4ci1gfiehiadifgcbfdehcg1iefg4acihf1higdhegbidgeh4fh4bih",
    "3ibhcbd2ab2hegc2ediehidfigcbfdehciefghacihf2higdhegbidgefhifgihfg",
    "3dbhdgd1af1he4ha4if3ehifdifgcbfde2hcg1ie1fg4acihb1high2egidg2ef2hi",
    "32dhdaieafbeca2gfiehiadifgcbidehcg2ieg2acihf2higdhegbidgefhbfdcgh",
    "34dhdaieaf1be4ca1gfiehiadifgcbid4hcg1ieg1acihf1higdhegbid4efhbfd4gh"
];

var SlotServer = {
    line:{},
    totalWin : 0,
    matrix : [],
    stops : [],

    initLine: function() {
        this.line = {};         
        this.line.freeSpinsRemaining = 0;
        this.line.reelStops = [];
        this.matrix = [[],[],[],[],[]];
        this.stops = [];
        this.line.totalWin = 0;

    },
    findSym : function (i,s) {
        var syms = [];
        var l = layouts[i];
        for(var i = 0;i<l.length;i++) {
            if (l[i]==s) {
                syms.push(i);
            }
        }
        if (syms.length==0) return randomInt(0,64);
        return syms[randomInt(0,syms.length-1)];
    },
    inRange(reel, num) {
        var l = layouts[reel].length;
        if (num>=l) num-=l;
        if (num<0) num+=l;
        return num;
    },
    getNonWin: function() {
        this.initLine();
        for(var i = 0;i<5;i++) {
            this.stops.push(randomInt(0,layouts[i].length-1));
        }
        this.fillMatrix();

    },
}

