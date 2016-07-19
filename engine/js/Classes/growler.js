/**
 * Growler - The audio library
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audiocontext = new AudioContext();



class Growler {
    constructor(dat) {
        dat = dat || {};
        this._ready = false;
        this.buffer = null;
        this.ready = dat.ready || function() {};
        this.sprites = {};
        this.mainVolume = audiocontext.createGain();
        this.mainVolume.gain.value = 1;
        this.mainVolume.connect(audiocontext.destination);
        this.soundsPlaying = [];
        this.id = 1000;
        this.aliases = {};
        this.listener = audiocontext.listener;
        this.listener.setOrientation(0,0,-1,0,1,0);
        this.catvols = {};
        this.safari = (navigator.userAgent.toLowerCase().indexOf("safari")!=-1);

        this.ext = "mp3";
        var a = new Audio();
        if (a.canPlayType("audio/x-m4a")) {
            console.log("Can play m4a");
            this.ext = "m4a";
        } else if (a.canPlayType("audio/mpeg")) {
            console.log("Can play mp3");
            this.ext = "mp3";
        } else if (a.canPlayType('audio/audio/ogg; codecs="vorbis"')) {
            console.log("Can play Vorbis");
            this.ext = "ogg";
        }
    }
    loadBank(path, callback) {
        var self = this;
        callback = callback || function() {};
        $.getJSON(path+".json", function(data) {
            var a = data;
            self.sprites = {};
            for (var n in a.spritemap) {
                self.sprites[n] = [a.spritemap[n].start, a.spritemap[n].end];
            }
            var req = game.imageManager.get("audio/audio."+this.ext);
            audiocontext.decodeAudioData(req, function(buffer) {
                self.buffer = buffer;
                self.ready(self);
                self._ready = true;
                callback(self);
                game.imageManager.remove("audio/audio."+self.ext);
            })
        }.bind(this));
    }

    play(name, pan = 0, def={}, originalsound = "", data = {}) {
        originalsound = originalsound=="" ? name : originalsound;
        var catvol = parseFloat(this.catvols[def.category || "GENERAL"].volume);
        if (this._ready && this.sprites.hasOwnProperty(name)) {
            var s = this.sprites[name];
            var source = audiocontext.createBufferSource();

            var self = this;
            var gain = audiocontext.createGain();
            var panner = audiocontext.createPanner();
            panner.panningModel = "HRTF";
            panner.distanceMode = "inverse";
            panner.refDistance = 1;
            panner.maxDistance = 100;
            panner.rolloffFactor = 0.0;
            panner.coneInnerAngle = 360;
            panner.coneOuterAngle = panner.coneOuterGain = 0;


            gain.gain.value = def.volume*catvol;

            panner.setPosition(400 * pan,0,10);


            //source.detune.value = data.detune;

            source.buffer = this.buffer;
            source.connect(gain);
            gain.connect(panner);
            panner.connect(this.mainVolume);
            this.mainVolume.connect(audiocontext.destination);

            source.start(0, s[0], s[1] - s[0]);
            var id = data.forceId ? data.forceId : this.id;
            this.soundsPlaying["A"+id] = {source:source, gain:gain, panner:panner, soundname:originalsound, def:def};


            setTimeout(function() {
                delete this.soundsPlaying["A"+id];
                if (def.loop) {
                    this.play(name, pan, def, originalsound,{detune:data.detune, forceId:id});
                    this.setVolume("A"+id, def.volume);
                }
            }.bind(this), ((s[1]-s[0])*1000)-(def.crossfade*1000));
            this.id++;
            return "A"+id;
        }
    }

    playSound(name, pan=0, detune=0) {
        if (this.aliases.hasOwnProperty(name)) {
            var s = this.aliases[name];
            s.max = s.max || 20;
            var cnt = this.numSoundsPlayingByName(name);
            if (cnt>=s.max) {
                return null;
            }
            var i = randomInt(0,s.sounds.length-1);
            var snd = s.sounds[i];
            return this.play(snd,pan, s, name,{detune:detune});
        }
    }
    numSoundsPlayingByName(name) {
        var cnt = 0;
        for (var k in this.soundsPlaying) {
            if (this.soundsPlaying[k].soundname==name)
            cnt++;
        }
        return cnt;
    }
    setAliases(a) {
        this.aliases = a.sounds;
        this.catvols = a.categories;
        for (var k in this.aliases) {
            this.aliases[k].category = this.aliases[k].category || "GENERAL";
        };
    }
    setVolume(id, vol) {
        if (id=="master") {
            this.mainVolume.gain.value = vol;
            return;
        }
        if (this.soundsPlaying.hasOwnProperty(id)) {
            var snd = this.soundsPlaying[id];
            var catvol = this.catvols[snd.def.category].volume;
            var gain = snd.gain.gain;
            gain.cancelScheduledValues(0);
            gain.setTargetAtTime(vol*catvol,audiocontext.currentTime,0.01);
        }
    }
    getVolume(id) {
        var val = 0;
        if (id=="master") {
            return this.mainVolume.gain.value;
        }

        if (this.soundsPlaying.hasOwnProperty(id)) {
            var snd = this.soundsPlaying[id];
            val = snd.def.volume;
        }
        return val;
    }
    setCategoryVolume(cat, vol) {
        if (this.catvols.hasOwnProperty(cat)) {
            this.catvols[cat].volume = vol;
            var sp = this.soundsPlaying;
            for(var k in this.soundsPlaying) {
                if (sp[k].def.category==cat) {
                    this.setVolume(k, sp[k].def.volume);
                }
            }
        }
    }
    getCategoryVolume(cat) {
        if (this.catvols.hasOwnProperty(cat)) {
            return this.catvols[cat].volume;
        } else {
            return 1;
        }
    }
    duck(id,val, duration) {
        if (this.soundsPlaying.hasOwnProperty(id)) {
            var snd = this.soundsPlaying[id];
            var gain = snd.gain.gain;
            var catvol = this.catvols[snd.def.category].volume;
            var vol = snd.def.volume;
            gain.cancelScheduledValues(0);
            gain.setTargetAtTime((vol*catvol)*val,audiocontext.currentTime,0.2);
            gain.setTargetAtTime(vol*catvol,audiocontext.currentTime+duration,0.3);

        }
    }
}

