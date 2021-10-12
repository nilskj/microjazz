// @ts-ignore
import Fasttracker from "./players/ft2";
// @ts-ignore
import Screamtracker from "./players/st3";
// @ts-ignore
import Protracker from "./players/pt";

export class ModPlayer {
  [x: string]: any;
  supportedformats = ["mod", "s3m", "xm"];

  url = "";
  format = "s3m";

  state = "initializing..";

  loading = false;
  playing = false;
  paused = false;
  repeat = false;

  separation = 1;
  mixval = 8.0;

  amiga500 = false;

  filter = false;
  endofsong = false;

  autostart = false;
  bufferstodelay = 4; // adjust this if you get stutter after loading new song
  delayfirst = 0;

  onReady = function () {};
  onPlay = function () {};
  onStop = function () {};

  buffer = 0;
  mixerNode = 0;
  context = null;
  samplerate = 44100;
  bufferlen = 4096;

  chvu = new Float32Array(32);

  // format-specific player
  player: any = null;

  // read-only data from player class
  title = "";
  signature = "....";
  songlen = 0;
  channels = 0;
  patterns = 0;
  samplenames: string[] = [];

  private loadSuccess?: () => {};

  load(url: string) {
    // try to identify file format from url and create a new
    // player class for it
    this.url = url;
    try {
      let ext = url?.split(".")?.pop()?.toLowerCase().trim();
      if (ext && this.supportedformats.indexOf(ext) === -1) {
        // unknown extension, maybe amiga-style prefix?
        ext = url?.split("/")?.pop()?.split(".")?.shift()?.toLowerCase().trim();
        if (ext && this.supportedformats.indexOf(ext) === -1) {
          // ok, give up
          console.error(`File ${url} not supported`);
          return false;
        }
      }
      this.format = ext || "";
      switch (ext) {
        case "mod":
          this.player = new Protracker();
          break;
        case "s3m":
          this.player = new Screamtracker();
          break;
        case "xm":
          this.player = new Fasttracker();
          break;
      }

      if (this.player) this.player.onReady = this.loadSuccess;

      this.state = "loading..";
      const request = new XMLHttpRequest();
      request.open("GET", this.url, true);
      request.responseType = "arraybuffer";
      this.loading = true;
      const asset = this;
      request.onprogress = function (oe) {
        asset.state = "loading (" + Math.floor((100 * oe.loaded) / oe.total) + "%)..";
      };

      request.onload = () => {
        const buffer = new Uint8Array(request.response);
        this.state = "parsing..";
        if (asset.player.parse(buffer)) {
          // copy static data from player
          asset.title = asset.player.title;
          asset.signature = asset.player.signature;
          asset.songlen = asset.player.songlen;
          asset.channels = asset.player.channels;
          asset.patterns = asset.player.patterns;
          asset.filter = asset.player.filter;
          if (asset.context) asset.setfilter(asset.filter);
          asset.mixval = asset.player.mixval; // usually 8.0, though
          asset.samplenames = new Array(32);
          for (let i = 0; i < 32; i++) asset.samplenames[i] = "";
          if (asset.format === "xm" || asset.format === "it") {
            for (let i = 0; i < asset.player.instrument.length; i++)
              asset.samplenames[i] = asset.player.instrument[i].name;
          } else {
            for (let i = 0; i < asset.player.sample.length; i++) asset.samplenames[i] = asset.player.sample[i].name;
          }

          asset.state = "ready.";
          asset.loading = false;
          asset.onReady();
          if (asset.autostart) asset.play();
        } else {
          asset.state = "error!";
          asset.loading = false;
        }
      };
      request.send();
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
