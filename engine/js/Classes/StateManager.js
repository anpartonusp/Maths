class State {
    constructor(name, actions) {
        this.actions = actions;
        this.name = name;
        this.type = "STATE";
    }
}



class StateManager {
    constructor(obj) {
        this.stateManager = [];
        this.currStateName = "";
        this.currState = null;
        this.obj = obj;
        this.savedStates = [];
        this.timer = 0;

    }

    setState(name) {
        var force = false;
        var n = name.split(':');
        this.timer = 0;
        if (n.length>1) {
            if (n[1].toLowerCase()=="force") {
                force = true;
            } else {
                this.timer = parseFloat(n[1]);
            }
        }
        name = n[0];
        if (force && name in this.stateManager) this.currStateName = "";    //Forces state even if same as current state
        if (name !== this.currStateName && name in this.stateManager) {
            if (this.currState && this.currState.shutDown) {
                this.currState.shutDown(this.obj);
            }
            this.currStateName = name;
            this.currState = this.stateManager[name];

            if (this.currState && this.currState.init) {
                this.currState.init(this.obj);
            }
        }
    }
    get state() {
        return this.currStateName;
    }
    set state(s) {
        this.setState(s);
    }

    add (name, actions) {
        this.stateManager[name] = actions;
    }
    addState(name, funcs) {
        this.stateManager[name] = funcs;
    }
    callState(name, data) {

        if (name !== this.currStateName && name in this.stateManager) {
            this.savedStates.push(this.state);
            this.currStateName = name;
            this.currState = this.stateManager[name];
            if (this.currState.hasOwnProperty("init")) {
                this.currState.init(data);
            }
        }
    }
    queueStates(states) {

        for (var i = states.length-1;i>=0;i--) {
            this.savedStates.push(states[i]);
        }
        this.setState(this.savedStates.pop());
    }
    exitState(opts) {
        opts = opts || {noInit:false};

        if (this.savedStates.length>0) {
            if (opts.noInit) {
                this.currStateName = this.savedStates.pop();
                this.currState = this.stateManager[name];
            } else {
                this.setState(this.savedStates.pop());
            }
        }
    }
    clearStateQueue() {
        this.savedStates = [];
        this.timer = 0;
    }
    update (delta) {
        if (this.currState) {
            if (this.currState.hasOwnProperty("update")) {
                this.currState.update(delta, this.obj);
            }
            if (this.timer>0) {
                this.timer-=delta;
                if (this.timer<=0) {
                    if (this.savedStates.length > 0) {
                        this.setState(this.savedStates.pop());
                    } else {
                        console.error("Trying to pop a state from empty list")
                    }
                }
            }
        }
    }
};