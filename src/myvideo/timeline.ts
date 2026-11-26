// My Video — Black Friday. All times in seconds on the final (cut) timeline.
// public/myvideo/main.mp4 is the breath- and pause-free edit with near-original colour (39.7 s, last 1.3 s frozen);
// public/myvideo/soundtrack.wav is the cleaned voice + original music (scripts/myvideo_bf_audio.py).
import type { SubGroup } from "../../brands/my-video/components/Subtitles";

export const FPS = 30;
export const DURATION = 39.7;
export const DURATION_IN_FRAMES = Math.round(DURATION * FPS);

// Framing = crop window on the 1080×1920 source: left/top and width (height follows 9:16).
// Only wide → medium-wide: the chair, the pose and the laptop stay in frame. No close-ups.
export type Framing = { x: number; y: number; w: number };
export const WIDE: Framing = { x: 0, y: 0, w: 1080 }; // original shot, head top ≈ y 456
export const MW: Framing = { x: 30, y: 0, w: 964 }; // ×1.12, head top ≈ y 511
export const MED: Framing = { x: 100, y: 0, w: 880 }; // ×1.23, head top ≈ y 560, laptop still in frame

export const SHOTS: { from: number; framing: Framing }[] = [
  { from: 0, framing: WIDE },
  { from: 2.1, framing: MW }, // punch-in on «Black Friday»
  { from: 3.3, framing: MED }, // «знижки на всі послуги»
  { from: 6.5333, framing: MW }, // dates
  { from: 11.5333, framing: MED }, // consultation −50%
  { from: 16.2, framing: MW }, // targeting −30%
  { from: 19.1667, framing: WIDE }, // «А всім тим…»
  { from: 23.0333, framing: MW },
  { from: 24.9333, framing: MED }, // mentoring −40%
  { from: 31.3, framing: MW }, // «зараз саме той момент»
  { from: 34.3, framing: WIDE }, // CTA to the end
];

// Big left-aligned typography in the free wall above the head. Each line rises in on its spoken word.
export type TypeLine = {
  text: string;
  at: number;
  x?: number;
  y: number;
  size: number;
  weight?: 500 | 700 | 800;
  until?: number; // fades out before the beat ends
  tag?: boolean; // small butter tag (the only plate left, like «серія 1» in the reference)
  tracking?: string;
};
export type Beat = { from: number; to: number; lines: TypeLine[] };

export const BEATS: Beat[] = [
  {
    from: 2.1,
    to: 4.0,
    lines: [
      { text: "BLACK", at: 2.14, y: 190, size: 172, weight: 800, tracking: "-0.035em" },
      { text: "FRIDAY", at: 2.5, y: 342, size: 172, weight: 800, tracking: "-0.035em" },
    ],
  },
  {
    from: 4.0,
    to: 6.48,
    lines: [
      { text: "BLACK FRIDAY", at: 4.0, y: 196, size: 34, weight: 700, tag: true },
      { text: "знижки", at: 4.04, y: 262, size: 156, weight: 800, tracking: "-0.035em" },
      { text: "на всі послуги", at: 4.95, y: 420, size: 70, weight: 500, tracking: "-0.02em" },
    ],
  },
  {
    from: 6.6,
    to: 11.45,
    lines: [
      { text: "27–28", at: 6.72, y: 186, size: 196, weight: 800, tracking: "-0.04em" },
      { text: "листопада", at: 8.3, y: 396, size: 66, weight: 700, tracking: "-0.02em", tag: true },
    ],
  },
  {
    from: 11.66,
    to: 16.12,
    lines: [
      { text: "консультація", at: 11.73, y: 196, size: 60, weight: 700, tracking: "-0.02em", tag: true },
      { text: "−50%", at: 14.78, y: 300, size: 236, weight: 800, tracking: "-0.045em" },
    ],
  },
  {
    from: 16.8,
    to: 19.08,
    lines: [
      { text: "таргет під ключ", at: 16.84, y: 196, size: 60, weight: 700, tracking: "-0.02em", tag: true },
      { text: "−30%", at: 17.84, y: 300, size: 220, weight: 800, tracking: "-0.045em" },
    ],
  },
  {
    from: 25.7,
    to: 31.22,
    lines: [
      { text: "−40%", at: 25.84, y: 186, size: 200, weight: 800, tracking: "-0.045em" },
      { text: "індивідуальне менторство", at: 26.98, y: 394, size: 50, weight: 700, tracking: "-0.02em", tag: true, until: 28.6 },
      { text: "щотижневі живі", at: 28.66, y: 392, size: 64, weight: 500, tracking: "-0.02em" },
      { text: "онлайн-зустрічі", at: 29.6, y: 456, size: 64, weight: 700, tracking: "-0.02em" },
    ],
  },
  {
    from: 33.2,
    to: 34.26,
    lines: [
      { text: "зараз", at: 33.22, y: 190, size: 168, weight: 800, tracking: "-0.035em" },
      { text: "саме той момент", at: 33.5, y: 360, size: 66, weight: 500, tracking: "-0.02em" },
    ],
  },
  {
    from: 34.3,
    to: DURATION,
    lines: [
      { text: "ПИШІТЬ", at: 34.32, y: 186, size: 128, weight: 800, tracking: "-0.035em" },
      { text: "У DIRECT", at: 35.22, y: 304, size: 128, weight: 800, tracking: "-0.035em" },
    ],
  },
];

// Subtitles: script wording in 1–2-word phrases, max two lines at a time; *word* = key word, set bigger.
const g = (until: number, ...lines: [string, number][]): SubGroup => ({
  lines: lines.map(([text, at]) => ({ text, at })),
  until,
});
export const SUBS: SubGroup[] = [
  g(0.88, ["І так,", 0.0], ["я теж", 0.54]),
  g(2.14, ["вирішила", 0.88], ["влаштувати", 1.42]),
  g(3.34, ["*Black*", 2.14], ["*Friday*,", 2.54]),
  g(4.04, ["і цього", 3.34], ["разу", 3.66]),
  g(4.9, ["*знижки*", 4.04], ["будуть", 4.5]),
  g(6.5, ["на всі", 4.9], ["мої послуги!", 5.54]),
  g(8.38, ["З *27*", 6.5], ["по *28*", 7.38]),
  g(9.08, ["листопада", 8.38]),
  g(10.16, ["ви можете", 9.08], ["забрати", 9.58]),
  g(11.5, ["мої послуги", 10.16], ["зі знижками.", 10.86]),
  g(12.47, ["На *консультацію*", 11.57]),
  g(14.19, ["по самостійному", 12.47], ["налаштуванню", 13.33]),
  g(14.77, ["реклами —", 14.19]),
  g(16.1, ["мінус *50%*.", 14.77]),
  g(17.3, ["На ведення", 16.14], ["таргету", 16.84]),
  g(19.03, ["під ключ —", 17.3], ["мінус *30%*.", 17.82]),
  g(20.5, ["А всім тим,", 19.06], ["хто хоче", 19.94]),
  g(21.58, ["не просто", 20.5], ["*делегувати*", 20.92]),
  g(23.08, ["налаштування", 21.58], ["таргетологу,", 22.28]),
  g(23.82, ["а *самостійно*", 23.08]),
  g(25.05, ["в цьому", 23.82], ["розібратися,", 24.14]),
  g(26.98, ["я підготувала", 25.08], ["мінус *40%*", 25.8]),
  g(28.62, ["на індивідуальне", 26.98], ["*менторство*", 27.96]),
  g(30.15, ["з щотижневими", 28.62], ["*живими*", 29.6]),
  g(31.25, ["онлайн-зустрічами.", 30.15]),
  g(32.3, ["Тому, якщо", 31.3], ["ви давно", 31.9]),
  g(33.22, ["планували,", 32.3]),
  g(34.3, ["*зараз*", 33.22], ["саме той момент.", 33.5]),
  g(35.44, ["Пишіть мені", 34.32], ["у *директ*", 35.06]),
  g(36.66, ["зі своїм", 35.44], ["запитом,", 36.06]),
  g(39.1, ["і я надішлю", 36.66], ["всі *деталі*!", 37.42]),
];
