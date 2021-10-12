export default function Screamtracker(): void;
export default class Screamtracker {
    onNextRow: () => void;
    playing: boolean;
    paused: boolean;
    repeat: boolean;
    filter: boolean;
    syncqueue: any[];
    samplerate: number;
    periodtable: Float32Array;
    retrigvoltab: Float32Array;
    pan_r: Float32Array;
    pan_l: Float32Array;
    vibratotable: any[];
    effects_t0: ((mod: any, ch: any) => void)[];
    effects_t0_s: ((mod: any, ch: any) => void)[];
    effects_t1: ((mod: any, ch: any) => void)[];
    effects_t1_s: ((mod: any, ch: any) => void)[];
    clearsong(): void;
    title: string | undefined;
    signature: string | undefined;
    songlen: number | undefined;
    repeatpos: number | undefined;
    patterntable: ArrayBuffer | undefined;
    channels: number | undefined;
    ordNum: number | undefined;
    insNum: number | undefined;
    patNum: number | undefined;
    globalVol: any;
    initSpeed: any;
    initBPM: any;
    fastslide: number | undefined;
    mixval: any;
    sample: any[] | undefined;
    pattern: any[] | undefined;
    looprow: number | undefined;
    loopstart: number | undefined;
    loopcount: number | undefined;
    patterndelay: number | undefined;
    patternwait: number | undefined;
    initialize(): void;
    tick: number | undefined;
    position: number | undefined;
    row: number | undefined;
    flags: number | undefined;
    volume: any;
    speed: any;
    bpm: any;
    stt: number | undefined;
    breakrow: number | undefined;
    patternjump: number | undefined;
    endofsong: boolean | undefined;
    channel: any[] | undefined;
    parse(buffer: any): boolean;
    patterns: number | undefined;
    chvu: Float32Array | undefined;
    advance(mod: any): void;
    process_note(mod: any, p: any, ch: any): void;
    process_tick(mod: any): void;
    mix(mod: any, bufs: any, buflen: any): void;
    effect_t0_a(mod: any, ch: any): void;
    effect_t0_b(mod: any, ch: any): void;
    effect_t0_c(mod: any, ch: any): void;
    effect_t0_d(mod: any, ch: any): void;
    effect_t0_e(mod: any, ch: any): void;
    effect_t0_f(mod: any, ch: any): void;
    effect_t0_g(mod: any, ch: any): void;
    effect_t0_h(mod: any, ch: any): void;
    effect_t0_i(mod: any, ch: any): void;
    effect_t0_j(mod: any, ch: any): void;
    effect_t0_k(mod: any, ch: any): void;
    effect_t0_l(mod: any, ch: any): void;
    effect_t0_m(mod: any, ch: any): void;
    effect_t0_n(mod: any, ch: any): void;
    effect_t0_o(mod: any, ch: any): void;
    effect_t0_p(mod: any, ch: any): void;
    effect_t0_q(mod: any, ch: any): void;
    effect_t0_r(mod: any, ch: any): void;
    effect_t0_s(mod: any, ch: any): void;
    effect_t0_t(mod: any, ch: any): void;
    effect_t0_u(mod: any, ch: any): void;
    effect_t0_v(mod: any, ch: any): void;
    effect_t0_w(mod: any, ch: any): void;
    effect_t0_x(mod: any, ch: any): void;
    effect_t0_y(mod: any, ch: any): void;
    effect_t0_z(mod: any, ch: any): void;
    effect_t0_s0(mod: any, ch: any): void;
    effect_t0_s1(mod: any, ch: any): void;
    effect_t0_s2(mod: any, ch: any): void;
    effect_t0_s3(mod: any, ch: any): void;
    effect_t0_s4(mod: any, ch: any): void;
    effect_t0_s5(mod: any, ch: any): void;
    effect_t0_s6(mod: any, ch: any): void;
    effect_t0_s7(mod: any, ch: any): void;
    effect_t0_s8(mod: any, ch: any): void;
    effect_t0_s9(mod: any, ch: any): void;
    effect_t0_sa(mod: any, ch: any): void;
    effect_t0_sb(mod: any, ch: any): void;
    effect_t0_sc(mod: any, ch: any): void;
    effect_t0_sd(mod: any, ch: any): void;
    effect_t0_se(mod: any, ch: any): void;
    effect_t0_sf(mod: any, ch: any): void;
    effect_t1_a(mod: any, ch: any): void;
    effect_t1_b(mod: any, ch: any): void;
    effect_t1_c(mod: any, ch: any): void;
    effect_t1_d(mod: any, ch: any): void;
    effect_t1_e(mod: any, ch: any): void;
    effect_t1_f(mod: any, ch: any): void;
    effect_t1_g(mod: any, ch: any): void;
    effect_t1_h(mod: any, ch: any): void;
    effect_t1_i(mod: any, ch: any): void;
    effect_t1_j(mod: any, ch: any): void;
    effect_t1_k(mod: any, ch: any): void;
    effect_t1_l(mod: any, ch: any): void;
    effect_t1_m(mod: any, ch: any): void;
    effect_t1_n(mod: any, ch: any): void;
    effect_t1_o(mod: any, ch: any): void;
    effect_t1_p(mod: any, ch: any): void;
    effect_t1_q(mod: any, ch: any): void;
    effect_t1_r(mod: any, ch: any): void;
    effect_t1_s(mod: any, ch: any): void;
    effect_t1_t(mod: any, ch: any): void;
    effect_t1_u(mod: any, ch: any): void;
    effect_t1_v(mod: any, ch: any): void;
    effect_t1_w(mod: any, ch: any): void;
    effect_t1_x(mod: any, ch: any): void;
    effect_t1_y(mod: any, ch: any): void;
    effect_t1_z(mod: any, ch: any): void;
    effect_t1_s0(mod: any, ch: any): void;
    effect_t1_s1(mod: any, ch: any): void;
    effect_t1_s2(mod: any, ch: any): void;
    effect_t1_s3(mod: any, ch: any): void;
    effect_t1_s4(mod: any, ch: any): void;
    effect_t1_s5(mod: any, ch: any): void;
    effect_t1_s6(mod: any, ch: any): void;
    effect_t1_s7(mod: any, ch: any): void;
    effect_t1_s8(mod: any, ch: any): void;
    effect_t1_s9(mod: any, ch: any): void;
    effect_t1_sa(mod: any, ch: any): void;
    effect_t1_sb(mod: any, ch: any): void;
    effect_t1_sc(mod: any, ch: any): void;
    effect_t1_sd(mod: any, ch: any): void;
    effect_t1_se(mod: any, ch: any): void;
    effect_t1_sf(mod: any, ch: any): void;
}
