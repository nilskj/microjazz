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
        this.mixerNode = 0;
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
    return ModPlayer;
}());
exports.ModPlayer = ModPlayer;
