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
      { text: "BLACK FRIDAY", at: 4.0, y: 200, size: 34, weight: 700, tag: true },
      { text: "знижки", at: 4.04, y: 262, size: 156, weight: 800, tracking: "-0.035em" },
      { text: "на всі послуги", at: 4.95, y: 420, size: 70, weight: 500, tracking: "-0.02em" },
    ],
  },
  {
    from: 6.6,
    to: 11.45,
    lines: [
      { text: "27–28", at: 6.72, y: 186, size: 196, weight: 800, tracking: "-0.04em" },
      { text: "листопада", at: 8.3, y: 384, size: 78, weight: 700, tracking: "-0.02em" },
    ],
  },
  {
    from: 11.66,
    to: 16.12,
    lines: [
      { text: "консультація", at: 11.73, y: 200, size: 72, weight: 700, tracking: "-0.02em" },
      { text: "−50%", at: 14.78, y: 278, size: 236, weight: 800, tracking: "-0.045em" },
    ],
  },
  {
    from: 16.8,
    to: 19.08,
    lines: [
      { text: "таргет під ключ", at: 16.84, y: 200, size: 72, weight: 700, tracking: "-0.02em" },
      { text: "−30%", at: 17.84, y: 278, size: 220, weight: 800, tracking: "-0.045em" },
    ],
  },
  {
    from: 25.7,
    to: 31.22,
    lines: [
      { text: "−40%", at: 25.84, y: 186, size: 200, weight: 800, tracking: "-0.045em" },
      { text: "індивідуальне", at: 26.98, y: 392, size: 64, weight: 700, tracking: "-0.02em", until: 28.6 },
      { text: "менторство", at: 27.9, y: 456, size: 64, weight: 700, tracking: "-0.02em", until: 28.6 },
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

// Subtitles: script wording, phrase by phrase on the left; *word* = key word, set bigger.
export const SUBS: SubGroup[] = [
  { lines: [{ text: "І так, я теж", at: 0.0 }, { text: "вирішила влаштувати", at: 0.88 }, { text: "*Black Friday*,", at: 2.14 }], until: 3.34 },
  { lines: [{ text: "і цього разу", at: 3.34 }, { text: "*знижки* будуть", at: 4.04 }, { text: "на всі мої послуги!", at: 4.9 }], until: 6.5 },
  { lines: [{ text: "З *27* по *28* листопада", at: 6.5 }, { text: "ви можете забрати", at: 9.08 }, { text: "мої послуги зі знижками.", at: 10.16 }], until: 11.5 },
  { lines: [{ text: "На *консультацію*", at: 11.57 }, { text: "по самостійному", at: 12.47 }, { text: "налаштуванню реклами", at: 13.33 }], until: 14.77 },
  { lines: [{ text: "— мінус *50%*.", at: 14.77 }], until: 16.1 },
  { lines: [{ text: "На ведення таргету", at: 16.14 }, { text: "під ключ", at: 17.3 }, { text: "— мінус *30%*.", at: 17.82 }], until: 19.03 },
  { lines: [{ text: "А всім тим, хто хоче", at: 19.06 }, { text: "не просто *делегувати*", at: 20.5 }, { text: "налаштування таргетологу,", at: 21.58 }], until: 23.08 },
  { lines: [{ text: "а *самостійно*", at: 23.08 }, { text: "в цьому розібратися,", at: 23.82 }], until: 25.05 },
  { lines: [{ text: "я підготувала", at: 25.08 }, { text: "мінус *40%*", at: 25.8 }], until: 26.98 },
  { lines: [{ text: "на індивідуальне", at: 26.98 }, { text: "*менторство*", at: 27.9 }], until: 28.62 },
  { lines: [{ text: "з щотижневими", at: 28.62 }, { text: "*живими*", at: 29.6 }, { text: "онлайн-зустрічами.", at: 30.15 }], until: 31.25 },
  { lines: [{ text: "Тому, якщо ви", at: 31.3 }, { text: "давно планували,", at: 32.04 }], until: 33.22 },
  { lines: [{ text: "*зараз*", at: 33.22 }, { text: "саме той момент.", at: 33.5 }], until: 34.3 },
  { lines: [{ text: "Пишіть мені", at: 34.32 }, { text: "у *директ*", at: 35.06 }, { text: "зі своїм запитом,", at: 35.44 }], until: 36.66 },
  { lines: [{ text: "і я надішлю", at: 36.66 }, { text: "всі *деталі*!", at: 37.42 }], until: 39.1 },
];
