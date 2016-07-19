class FakeServer {
    constructor() {
        this.mode = "";
        this.balance = 500;
    }
    ajax(url, data) {
        switch (url) {
            case "demosession" :
                this.startDemoSession(data);
                break;
            case "cascade/spin" :
                this.spinCascade(data);
                break;
        }
    }
    get(cmd, params, callback) {
        if (cmd=="initialise") {
            var d = {}
            d.accountSettings = {};
            var a = d.accountSettings;
            a.currencyUnit = "GBP";
            a.minStake = {amount: 0.1};
            a.maxStake = {amount: 30};
            callback(d);
        }
    }

    startDemoSession(data) {
        var ret = {};
        this.balance = 500;
        if (data.data.gameTag=="DEV-CATHOTEL-CASCADE") {
            this.mode = "cascade";
            ret = {
                total: {
                    amount: this.balance,
                    currency: "GBP",
                }
            };
        }
        if (data.success) {
            data.success(ret);
            return;
        }
        data.error();
    }



    spinCascade(data) {
        console.log(data);
        var numLines = data.data.numLines;
        var stakePerLine = data.data.stake;
        var gridBeforeCascade = [];
        //Get fake lines
        for(var i = 0;i<5;i++) {
            var c = [];
            c.push(randomInt(0,7));
            c.push(randomInt(0,7));
            c.push(randomInt(0,7));
            gridBeforeCascade.push(c);
        }

        //Reduce balance
        this.balance-=numLines * stakePerLine;



        var ret = {};
        ret.gameId = "2a047fe5-795b-4bf5-8d5d-4ed75bbd968c";
        ret.gameStateId =  "8f7ab9ab-cc68-4a7c-a69d-ef6755d55b52";
        ret.demoPlay= true;
        ret.stakePerLine =  {"amount": stakePerLine, "currency": "GBP"};
        ret.balance = {
            total:{amount:this.balance, currency:"GBP"},
            cash:{amount:this.balance, currency:"GBP"},
            bonus:{amount:0, currency:"GBP"},
        }
        ret.totalPayout = 0;
        ret.status = "COMPLETE";
        ret.stepResponses = [];
        var step = {
            gridBeforeCascade:gridBeforeCascade,
            winningLines:this.getWinningLines(gridBeforeCascade),
            winningsPerLine:[],
            disappearingSymbolsInWinningLines:[],
            wildsInWinningCombinations:[],
            gridAfterCascade:[],
            winnings:0
        }

        ret.stepResponses.push(step);
        data.success(ret);

    }

    getWinningLines(grid) {
        var wl = [];
        var ds = [];
        var winline = 0;
        winLines.forEach(function(wl) {
            var cnt = 0;
            var sym = -1;
            for(var i = 0;i<5;i++) {
                var row = wl[i];
                if (grid[i][row]==0) {
                    cnt++;
                } else if (grid[i][row]!=sym) {
                    break;
                } else {
                    cnt++;
                    sym = grid[i][row];
                }
            }
            if (cnt>=3) {
                wl.push(winline);
                console.log("WIN Line "+winline+" ("+cnt+" symbols)");
            }
            winline++;
        })
        return wl;


    }



}


var demoResponse = {
    gameId: "2a047fe5-795b-4bf5-8d5d-4ed75bbd968c",
    gameStateId: "8f7ab9ab-cc68-4a7c-a69d-ef6755d55b52",
    demoPlay: true,
    stakePerLine: {"amount": 0.5, "currency": "GBP"},
    balance: {
        total: {amount: 513, currency: "GBP"},
        cash: {amount: 513, currency: "GBP"},
        bonus: {amount: 0, currency: "GBP"}
    },
    totalPayout: 26.5,
    status: "COMPLETE",
    stepResponses: [
        {
            gridBeforeCascade: [[7, 6, 0], [6, 5, 6], [6, 5, 6], [7, 6, 4], [5, 2, 4]],
            winningLines: [2, 10, 11, 12],
            winningsPerLine: [2.5, 4, 6, 6],
            disappearingSymbolsInWinningLines: [
                {row: 1, column: 2}, {row: 1, column: 3}, {row: 2, column: 0}, {row: 2, column: 1}, {
                    row: 2,
                    column: 2
                }, {row: 0, column: 1}, {row: 0, column: 2}, {row: 1, column: 0}, {row: 1, column: 1}
            ],
            wildsInWinningCombinations: [{row: 2, column: 0}],
            gridAfterCascade: [[-1, -1, 7], [-1, -1, -1], [-1, -1, -1], [-1, -1, 7], [-1, 5, 2]],
            winnings: 18.5
        },
        {
            gridBeforeCascade: [[5, 7, 7], [5, 6, 5], [4, 5, 7], [0, 1, 7], [7, 5, 2]],
            winningLines: [5, 15],
            winningsPerLine: [4, 4],
            disappearingSymbolsInWinningLines: [
                {row: 1, column: 2}, {row: 0, column: 0}, {row: 0, column: 1}
            ],
            wildsInWinningCombinations: [],
            gridAfterCascade: [[-1, 7, 7], [-1, 6, 5], [-1, 4, 7], [0, 1, 7], [7, 5, 2]],
            winnings: 8
        },
        {
            gridBeforeCascade: [[7, 7, 7], [6, 6, 5], [6, 4, 7], [0, 1, 7], [7, 5, 2]],
            winningLines: [],
            winningsPerLine: [],
            winnings: 0
        }
    ]
};

var winLines = [
    [1,1,1,1,1],    //1
    [0,0,0,0,0],    //2
    [2,2,2,2,2],    //3
    [0,1,2,1,0],    //4
    [2,1,0,1,2],    //5
    [0,0,1,2,2],    //6
    [2,2,1,0,0],    //7
    [1,0,1,2,1],    //8
    [1,2,1,0,1],    //9
    [0,1,1,1,2],    //10
    [2,1,1,1,0],    //11
    [1,0,0,1,2],    //12
    [1,2,2,1,0],    //13
    [1,1,0,1,2],    //14
    [1,1,2,1,0],    //15
    [0,0,1,2,1],    //16
    [2,2,1,0,1],    //17
    [1,0,1,2,2],    //18
    [1,2,1,0,0],    //19
    [0,0,0,1,2],    //20
];
