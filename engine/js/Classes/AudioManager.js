/**
 * The Audio Manager.
 * To create the sound sprite used by the system, you should
 * put all the wav files into the audiosource directory, and run the audio task
 * in the grunt file - e.g. grunt audio --skin=CatHotel
 * This will create the sound sprite data. The normal build
 * will copy these to the target. You will need to install FFMpeg on your Mac
 * with HomeBrew:
 * brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools
 * You cannot automate this process in Jenkins
 */


class AudioManager {
    constructor(dat) {
        this.readycallback = dat.ready || function() {};

        this.baseDir = "audio";
        this.growl = new Growler();
        this.growl.loadBank("audio/audio", function(g) {
            this.readycallback();
        }.bind(this));
        this.screenWidth = dat.screenWidth || 1280;
        this._enabled = true;

        this.ready = false;
    }

    get enabled() {
        return this._enabled;
    }
    set enabled(e) {
        this.growl.setVolume("master", e ? 1 : 0)
        this._enabled = e;
        localStorage.sound = e ? "true" : "false";
    }

    init(dat) {
     //   this.setAliases(aliases);
    }

    setAliases(a) {
        this.growl.setAliases(a);
    }

    /**
     * Plays an alias sound
     * @param name - Name of sound definition
     * @param x
     */
    play(name,x=this.screenWidth/2, pitch = 0) {
        x/=(this.screenWidth);
        x*=2; x-=1;
        return this.growl.playSound(name,x, pitch);
    }

    /**
     * Plays a sample
     * @param name - Name of sample
     * @param x
     */
    playSample(name,x=this.screenWidth/2) {
        x/=(this.screenWidth);
        x*=2; x-=1;
        return this.growl.play(name, 1,x);
    }
    setCategoryVolume(cat, vol) {
        this.growl.setCategoryVolume(cat, vol);
    }
    duck(id,val, duration) {
        this.growl.duck(id,val,duration);
    }


}




