export declare class ModPlayer {
    [x: string]: any;
    supportedformats: string[];
    url: string;
    format: string;
    state: string;
    loading: boolean;
    playing: boolean;
    paused: boolean;
    repeat: boolean;
    separation: number;
    mixval: number;
    amiga500: boolean;
    filter: boolean;
    endofsong: boolean;
    autostart: boolean;
    bufferstodelay: number;
    delayfirst: number;
    onReady: () => void;
    onPlay: () => void;
    onStop: () => void;
    buffer: number;
    mixerNode: ScriptProcessorNode | null;
    context: AudioContext | null;
    samplerate: number;
    bufferlen: number;
    chvu: Float32Array;
    player: any;
    title: string;
    signature: string;
    songlen: number;
    channels: number;
    patterns: number;
    samplenames: string[];
    private loadSuccess?;
    load(url: string): boolean | undefined;
    play(): boolean;
    pause(): void;
    stop(): void;
    stopaudio(st: boolean): void;
    jump(step: number): void;
    setrepeat(rep: boolean): void;
    setseparation(sep: 0 | 1 | 2): void;
    setautostart(st: boolean): void;
    setamigamodel(amiga: "600" | "1200" | "4000"): void;
    setfilter(f: boolean): void;
    hassyncevents(): boolean;
    popsyncevent(): any;
    currentpattern(): any;
    /** get current pattern in standard unpacked format (note, sample, volume, command, data)
      note: 254=noteoff, 255=no note
      sample: 0=no instrument, 1..255=sample number
      volume: 255=no volume set, 0..64=set volume, 65..239=ft2 volume commands
      command: 0x2e=no command, 0..0x24=effect command
      data: 0..255
     **/
    patterndata(pn: any): Uint8Array | undefined;
    noteon(ch: number): any;
    currentsample(ch: number): any;
    currentpattlen(): any;
    createContext(): void;
    mix(ape: {
        srcElement: {
            module: any;
        };
        outputBuffer: {
            getChannelData: (arg0: number) => any;
            length: any;
        };
    }): void;
}
