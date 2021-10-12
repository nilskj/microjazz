"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModPlayer = void 0;
// @ts-ignore
var ft2_1 = require("./players/ft2");
// @ts-ignore
var st3_1 = require("./players/st3");
// @ts-ignore
var pt_1 = require("./players/pt");
var ModPlayer = /** @class */ (function () {
    function ModPlayer() {
        this.supportedformats = ["mod", "s3m", "xm"];
        this.url = "";
        this.format = "s3m";
        this.state = "initializing..";
        this.loading = false;
        this.playing = false;
        this.paused = false;
        this.repeat = false;
        this.separation = 1;
        this.mixval = 8.0;
        this.amiga500 = false;
        this.filter = false;
        this.endofsong = false;
        this.autostart = false;
        this.bufferstodelay = 4; // adjust this if you get stutter after loading new song
        this.delayfirst = 0;
        this.onReady = function () { };
        this.onPlay = function () { };
        this.onStop = function () { };
        this.buffer = 0;
        this.mixerNode = null;
        this.context = null;
        this.samplerate = 44100;
        this.bufferlen = 4096;
        this.chvu = new Float32Array(32);
        // format-specific player
        this.player = null;
        // read-only data from player class
        this.title = "";
        this.signature = "....";
        this.songlen = 0;
        this.channels = 0;
        this.patterns = 0;
        this.samplenames = [];
    }
    ModPlayer.prototype.load = function (url) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        // try to identify file format from url and create a new
        // player class for it
        this.url = url;
        try {
            var ext = (_b = (_a = url === null || url === void 0 ? void 0 : url.split(".")) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim();
            if (ext && this.supportedformats.indexOf(ext) === -1) {
                // unknown extension, maybe amiga-style prefix?
                ext = (_f = (_e = (_d = (_c = url === null || url === void 0 ? void 0 : url.split("/")) === null || _c === void 0 ? void 0 : _c.pop()) === null || _d === void 0 ? void 0 : _d.split(".")) === null || _e === void 0 ? void 0 : _e.shift()) === null || _f === void 0 ? void 0 : _f.toLowerCase().trim();
                if (ext && this.supportedformats.indexOf(ext) === -1) {
                    // ok, give up
                    console.error("File " + url + " not supported");
                    return false;
                }
            }
            this.format = ext || "";
            switch (ext) {
                case "mod":
                    this.player = new pt_1.default();
                    break;
                case "s3m":
                    this.player = new st3_1.default();
                    break;
                case "xm":
                    this.player = new ft2_1.default();
                    break;
            }
            if (this.player)
                this.player.onReady = this.loadSuccess;
            this.state = "loading..";
            var request_1 = new XMLHttpRequest();
            request_1.open("GET", this.url, true);
            request_1.responseType = "arraybuffer";
            this.loading = true;
            var asset_1 = this;
            request_1.onprogress = function (oe) {
                asset_1.state = "loading (" + Math.floor((100 * oe.loaded) / oe.total) + "%)..";
            };
            request_1.onload = function () {
                var buffer = new Uint8Array(request_1.response);
                _this.state = "parsing..";
                if (asset_1.player.parse(buffer)) {
                    // copy static data from player
                    asset_1.title = asset_1.player.title;
                    asset_1.signature = asset_1.player.signature;
                    asset_1.songlen = asset_1.player.songlen;
                    asset_1.channels = asset_1.player.channels;
                    asset_1.patterns = asset_1.player.patterns;
                    asset_1.filter = asset_1.player.filter;
                    if (asset_1.context)
                        asset_1.setfilter(asset_1.filter);
                    asset_1.mixval = asset_1.player.mixval; // usually 8.0, though
                    asset_1.samplenames = new Array(32);
                    for (var i = 0; i < 32; i++)
                        asset_1.samplenames[i] = "";
                    if (asset_1.format === "xm" || asset_1.format === "it") {
                        for (var i = 0; i < asset_1.player.instrument.length; i++)
                            asset_1.samplenames[i] = asset_1.player.instrument[i].name;
                    }
                    else {
                        for (var i = 0; i < asset_1.player.sample.length; i++)
                            asset_1.samplenames[i] = asset_1.player.sample[i].name;
                    }
                    asset_1.state = "ready.";
                    asset_1.loading = false;
                    asset_1.onReady();
                    if (asset_1.autostart)
                        asset_1.play();
                }
                else {
                    asset_1.state = "error!";
                    asset_1.loading = false;
                }
            };
            request_1.send();
            return true;
        }
        catch (error) {
            console.error(error);
        }
    };
    // play loaded and parsed module with webaudio context
    ModPlayer.prototype.play = function () {
        if (this.loading)
            return false;
        if (this.player) {
            if (this.context == null)
                this.createContext();
            this.player.samplerate = this.samplerate;
            if (this.context)
                this.setfilter(this.player.filter);
            if (this.player.paused) {
                this.player.paused = false;
                return true;
            }
            this.endofsong = false;
            this.player.endofsong = false;
            this.player.paused = false;
            this.player.initialize();
            this.player.flags = 1 + 2;
            this.player.playing = true;
            this.playing = true;
            this.chvu = new Float32Array(this.player.channels);
            for (var i = 0; i < this.player.channels; i++)
                this.chvu[i] = 0.0;
            this.onPlay();
            this.player.delayfirst = this.bufferstodelay;
            return true;
        }
        else {
            return false;
        }
    };
    ModPlayer.prototype.pause = function () {
        {
            if (this.player) {
                this.player.paused = !this.player.paused;
            }
        }
    };
    ModPlayer.prototype.stop = function () {
        this.paused = false;
        this.playing = false;
        if (this.player) {
            this.player.paused = false;
            this.player.playing = false;
            this.player.delayload = 1;
        }
        this.onStop();
    };
    // stop playing but don't call callbacks
    ModPlayer.prototype.stopaudio = function (st) {
        if (this.player) {
            this.player.playing = st;
        }
    };
    // jump positions forward/back
    ModPlayer.prototype.jump = function (step) {
        {
            if (this.player) {
                this.player.tick = 0;
                this.player.row = 0;
                this.player.position += step;
                this.player.flags = 1 + 2;
                if (this.player.position < 0)
                    this.player.position = 0;
                if (this.player.position >= this.player.songlen)
                    this.stop();
            }
            this.position = this.player.position;
            this.row = this.player.row;
        }
    };
    // set whether module repeats after songlength
    ModPlayer.prototype.setrepeat = function (rep) {
        this.repeat = rep;
        if (this.player)
            this.player.repeat = rep;
    };
    // set stereo separation mode (0=standard, 1=65/35 mix, 2=mono)
    ModPlayer.prototype.setseparation = function (sep) {
        this.separation = sep;
        if (this.player)
            this.player.separation = sep;
    };
    // set autostart to play immediately after loading
    ModPlayer.prototype.setautostart = function (st) {
        this.autostart = st;
    };
    // set amiga model - changes lowpass filter state
    ModPlayer.prototype.setamigamodel = function (amiga) {
        if (amiga == "600" || amiga == "1200" || amiga == "4000") {
            this.amiga500 = false;
            if (this.filterNode)
                this.filterNode.frequency.value = 22050;
        }
        else {
            this.amiga500 = true;
            if (this.filterNode)
                this.filterNode.frequency.value = 6000;
        }
    };
    // amiga "LED" filter
    ModPlayer.prototype.setfilter = function (f) {
        if (f) {
            this.lowpassNode.frequency.value = 3275;
        }
        else {
            this.lowpassNode.frequency.value = 28867;
        }
        this.filter = f;
        if (this.player)
            this.player.filter = f;
    };
    // are there E8x sync events queued?
    ModPlayer.prototype.hassyncevents = function () {
        if (this.player)
            return (this.player.syncqueue.length != 0);
        return false;
    };
    // pop oldest sync event nybble from the FIFO queue
    ModPlayer.prototype.popsyncevent = function () {
        if (this.player)
            return this.player.syncqueue.pop();
    };
    // ger current pattern number
    ModPlayer.prototype.currentpattern = function () {
        if (this.player)
            return this.player.patterntable[this.player.position];
    };
    /** get current pattern in standard unpacked format (note, sample, volume, command, data)
      note: 254=noteoff, 255=no note
      sample: 0=no instrument, 1..255=sample number
      volume: 255=no volume set, 0..64=set volume, 65..239=ft2 volume commands
      command: 0x2e=no command, 0..0x24=effect command
      data: 0..255
     **/
    ModPlayer.prototype.patterndata = function (pn) {
        var i, c, patt;
        if (this.format == 'mod') {
            patt = new Uint8Array(this.player.pattern_unpack[pn]);
            for (var i_1 = 0; i_1 < 64; i_1++)
                for (c = 0; c < this.player.channels; c++) {
                    if (patt[i_1 * 5 * this.channels + c * 5 + 3] == 0 && patt[i_1 * 5 * this.channels + c * 5 + 4] == 0) {
                        patt[i_1 * 5 * this.channels + c * 5 + 3] = 0x2e;
                    }
                    else {
                        patt[i_1 * 5 * this.channels + c * 5 + 3] += 0x37;
                        if (patt[i_1 * 5 * this.channels + c * 5 + 3] < 0x41)
                            patt[i_1 * 5 * this.channels + c * 5 + 3] -= 0x07;
                    }
                }
        }
        else if (this.format == 's3m') {
            patt = new Uint8Array(this.player.pattern[pn]);
            for (i = 0; i < 64; i++)
                for (c = 0; c < this.player.channels; c++) {
                    if (patt[i * 5 * this.channels + c * 5 + 3] == 255)
                        patt[i * 5 * this.channels + c * 5 + 3] = 0x2e;
                    else
                        patt[i * 5 * this.channels + c * 5 + 3] += 0x40;
                }
        }
        else if (this.format == 'xm') {
            patt = new Uint8Array(this.player.pattern[pn]);
            for (i = 0; i < this.player.patternlen[pn]; i++)
                for (c = 0; c < this.player.channels; c++) {
                    if (patt[i * 5 * this.channels + c * 5 + 0] < 97)
                        patt[i * 5 * this.channels + c * 5 + 0] = (patt[i * 5 * this.channels + c * 5 + 0] % 12) | (Math.floor(patt[i * 5 * this.channels + c * 5 + 0] / 12) << 4);
                    if (patt[i * 5 * this.channels + c * 5 + 3] == 255)
                        patt[i * 5 * this.channels + c * 5 + 3] = 0x2e;
                    else {
                        if (patt[i * 5 * this.channels + c * 5 + 3] < 0x0a) {
                            patt[i * 5 * this.channels + c * 5 + 3] += 0x30;
                        }
                        else {
                            patt[i * 5 * this.channels + c * 5 + 3] += 0x41 - 0x0a;
                        }
                    }
                }
        }
        return patt;
    };
    // check if a channel has a note on
    ModPlayer.prototype.noteon = function (ch) {
        if (ch >= this.channels)
            return 0;
        return this.player.channel[ch].noteon;
    };
    // get currently active sample on channel
    ModPlayer.prototype.currentsample = function (ch) {
        if (ch >= this.channels)
            return 0;
        if (this.format == "xm" || this.format == "it")
            return this.player.channel[ch].instrument;
        return this.player.channel[ch].sample;
    };
    // get length of currently playing pattern
    ModPlayer.prototype.currentpattlen = function () {
        if (this.format == "mod" || this.format == "s3m")
            return 64;
        return this.player.patternlen[this.player.patterntable[this.player.position]];
    };
    // create the web audio context
    ModPlayer.prototype.createContext = function () {
        if (typeof AudioContext !== 'undefined') {
            this.context = new AudioContext();
        }
        else {
            //this.context = new webkitAudioContext();
        }
        if (this.context) {
            this.samplerate = this.context.sampleRate;
            this.bufferlen = (this.samplerate > 44100) ? 4096 : 2048;
            // Amiga 500 fixed filter at 6kHz. WebAudio lowpass is 12dB/oct, whereas
            // older Amigas had a 6dB/oct filter at 4900Hz.
            this.filterNode = this.context.createBiquadFilter();
            if (this.amiga500) {
                this.filterNode.frequency.value = 6000;
            }
            else {
                this.filterNode.frequency.value = 22050;
            }
            // "LED filter" at 3275kHz - off by default
            this.lowpassNode = this.context.createBiquadFilter();
            this.setfilter(this.filter);
            // mixer - to be converted into audio worklet?
            /*      if ( typeof this.context.createJavaScriptNode === 'function') {
                    this.mixerNode=this.context.createJavaScriptNode(this.bufferlen, 1, 2);
                  } else {
                    this.mixerNode=this.context.createScriptProcessor(this.bufferlen, 1, 2);
                  }*/
            this.mixerNode = this.context.createScriptProcessor(this.bufferlen, 1, 2);
            // @ts-ignore
            this.mixerNode.module = this;
            // @ts-ignore
            this.mixerNode.onaudioprocess = this.mix;
            // patch up some cables :)
            this.mixerNode.connect(this.filterNode);
            this.filterNode.connect(this.lowpassNode);
            this.lowpassNode.connect(this.context.destination);
        }
    };
    // scriptnode callback - pass through to player class
    ModPlayer.prototype.mix = function (ape) {
        var mod;
        if (ape.srcElement) {
            mod = ape.srcElement.module;
        }
        else {
            mod = this.module;
        }
        if (mod.player && mod.delayfirst === 0) {
            mod.player.repeat = mod.repeat;
            var bufs = [ape.outputBuffer.getChannelData(0), ape.outputBuffer.getChannelData(1)];
            var buflen = ape.outputBuffer.length;
            mod.player.mix(mod.player, bufs, buflen);
            // apply stereo separation and soft clipping
            var outp = new Float32Array(2);
            for (var s = 0; s < buflen; s++) {
                outp[0] = bufs[0][s];
                outp[1] = bufs[1][s];
                // a more headphone-friendly stereo separation
                if (mod.separation) {
                    var t = outp[0];
                    if (mod.separation === 2) { // mono
                        outp[0] = outp[0] * 0.5 + outp[1] * 0.5;
                        outp[1] = outp[1] * 0.5 + t * 0.5;
                    }
                    else { // narrow stereo
                        outp[0] = outp[0] * 0.65 + outp[1] * 0.35;
                        outp[1] = outp[1] * 0.65 + t * 0.35;
                    }
                }
                // scale down and soft clip
                outp[0] /= mod.mixval;
                outp[0] = 0.5 * (Math.abs(outp[0] + 0.975) - Math.abs(outp[0] - 0.975));
                outp[1] /= mod.mixval;
                outp[1] = 0.5 * (Math.abs(outp[1] + 0.975) - Math.abs(outp[1] - 0.975));
                bufs[0][s] = outp[0];
                bufs[1][s] = outp[1];
            }
            mod.row = mod.player.row;
            mod.position = mod.player.position;
            mod.speed = mod.player.speed;
            mod.bpm = mod.player.bpm;
            mod.endofsong = mod.player.endofsong;
            if (mod.player.filter !== mod.filter) {
                mod.setfilter(mod.player.filter);
            }
            if (mod.endofsong && mod.playing)
                mod.stop();
            if (mod.delayfirst > 0)
                mod.delayfirst--;
            mod.delayload = 0;
            // update this.chvu from player channel vu
            for (var i = 0; i < mod.player.channels; i++) {
                mod.chvu[i] = mod.chvu[i] * 0.25 + mod.player.chvu[i] * 0.75;
                mod.player.chvu[i] = 0.0;
            }
        }
    };
    return ModPlayer;
}());
exports.ModPlayer = ModPlayer;
