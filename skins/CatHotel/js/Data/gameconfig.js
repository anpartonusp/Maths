var gameConfig = {
    lobbyURL: "https://www.chompcasino.com/lobby/chomp-casino/",
    gameTag: "CHOMP-TROLLS-TALE-SLOTS",
    title: "Cat Hotel",


    aspectratio: 16/9,


    landscape: {

    },
    portrait: {

    },


    ori: {},


    symbols:["1","3","A","B","C","D","E","F","G","H","I","J"],
    reels : [
        ["1","3","A","B","C","D","E","1","3","F","G","H","I","J"],
        ["1","3","A","B","C","D","E","1","3","F","G","H","I","J"],
        ["1","3","A","B","C","D","E","1","3","F","G","H","I","J"],
        ["1","3","A","B","C","D","E","1","3","F","G","H","I","J"],
        ["1","3","A","B","C","D","E","1","3","F","G","H","I","J"],
    ],
    winLines : [
        {line:[1,1,1,1,1],color:"#9ed0bf"},    //1
        {line:[0,0,0,0,0],color:"#b2c15a"},    //2
        {line:[2,2,2,2,2],color:"#d9a345"},    //3
        {line:[0,1,2,1,0],color:"#d5814d"},    //4
        {line:[2,1,0,1,2],color:"#e17471"},    //5
        {line:[0,0,1,2,2],color:"#e475b5"},    //6
        {line:[2,2,1,0,0],color:"#a97dda"},    //7
        {line:[1,0,1,2,1],color:"#93a4e2"},    //8
        {line:[1,2,1,0,1],color:"#b2c159"},    //9
        {line:[0,1,1,1,2],color:"#9ed0bf"},    //10
        {line:[2,1,1,1,0],color:"#d5814d"},    //11
        {line:[1,0,0,1,2],color:"#e17471"},    //12
        {line:[1,2,2,1,0],color:"#93a4e2"},    //13
        {line:[1,1,0,1,2],color:"#d9a345"},    //14
        {line:[1,1,2,1,0],color:"#b2c159"},    //15
        {line:[0,0,1,2,1],color:"#d9a345"},    //16
        {line:[2,2,1,0,1],color:"#e475b5"},    //17
        {line:[1,0,1,2,2],color:"#9ed0bf"},    //18
        {line:[1,2,1,0,0],color:"#d5814d"},    //19
        {line:[0,0,0,1,2],color:"#a97dda"}     //20
    ],
    winAmount : 0,
    winAmountTarget : 0,
    balanceTarget:0,
    numLines : 20,
    stakePerLine : 0.05,
    maxStakePerLine : 1.00,
    minStakePerLine : 0.01,
    runningTotal:0,
    winMatrix:[],

    fonts : [
        "Montserrat",
        "Rammetto One",
    ],
};

gameConfig.winMatrix["2"] = [40,80,500];
gameConfig.winMatrix["3"] = [20,40,150];
gameConfig.winMatrix["4"] = [15,30,80];
gameConfig.winMatrix["5"] = [10,20,40];
gameConfig.winMatrix["6"] = [8,15,30];
gameConfig.winMatrix["7"] = [5,12,20];
gameConfig.winMatrix["8"] = [3,8,15];

