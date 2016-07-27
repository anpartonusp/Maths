var startGameState = {
    init: function() {
        map.load("dd", function() {
            game.states.addState("SCRIPT",mapscript);
            game.states.setState("SCRIPT");
        });
    },

    update: function(delta) {
    },

    shutDown: function() {

    }
}
