// My Video — Black Friday. All times in seconds on the final (cut) timeline.
// public/myvideo/main.mp4 is the graded, breath- and pause-free edit (39.7 s, last 1.3 s frozen);
// public/myvideo/soundtrack.wav is the cleaned voice + original music (scripts/myvideo_bf_audio.py).
import type { Cue } from "../../brands/my-video/components/Subtitles";

export const FPS = 30;
export const DURATION = 39.7;
export const DURATION_IN_FRAMES = Math.round(DURATION * FPS);

// Framing = crop window on the 1080×1920 source: left/top and width (height follows 9:16).
export type Framing = { x: number; y: number; w: number };
export const WIDE: Framing = { x: 0, y: 0, w: 1080 }; // head top ≈ y 456
export const MED: Framing = { x: 55, y: 0, w: 830 }; // ×1.30, head top ≈ y 593
export const CLOSE: Framing = { x: 150, y: 80, w: 635 }; // ×1.70, head top ≈ y 640, laptop out of frame

// Shots: every source cut gets a framing change, plus two punch-ins on a continuous take.
export const SHOTS: { from: number; framing: Framing }[] = [
  { from: 0, framing: WIDE }, // «І так, я теж вирішила… Black Friday»
  { from: 3.3, framing: MED }, // punch-in: «і цього разу знижки…»
  { from: 6.5333, framing: CLOSE }, // dates
  { from: 11.5333, framing: MED }, // consultation
  { from: 14.72, framing: CLOSE }, // punch-in on «мінус 50%»
  { from: 16.2, framing: MED }, // targeting −30%
  { from: 19.1667, framing: WIDE }, // «А всім тим…»
  { from: 23.0333, framing: MED }, // «а самостійно…»
  { from: 24.9333, framing: CLOSE }, // mentoring −40%
  { from: 31.3, framing: MED }, // «зараз саме той момент»
  { from: 34.3, framing: WIDE }, // CTA to the end
];

export const ACCENTS = {
  blackFriday: { from: 2.1, to: 6.48 },
  allServices: { from: 4.0, to: 6.48 },
  dates: { from: 6.62, to: 11.45 },
  consult: { from: 11.66, to: 16.12, number: 14.78 },
  target: { from: 16.8, to: 19.08, number: 17.84 },
  mentor: { from: 25.68, to: 31.22, number: 25.86, meetings: 28.66 },
  now: { from: 33.2, to: 34.26 },
  cta: { from: 35.18, to: DURATION },
};

// Script wording (correct Ukrainian), timed to the speech.
export const CUES: Cue[] = [
  { text: "І так, я теж", from: 0.0, to: 0.88 },
  { text: "вирішила влаштувати", from: 0.88, to: 2.14 },
  { text: "Black Friday,", from: 2.14, to: 3.34 },
  { text: "і цього разу", from: 3.34, to: 4.04 },
  { text: "знижки будуть", from: 4.04, to: 4.9 },
  { text: "на всі мої послуги!", from: 4.9, to: 6.5 },
  { text: "З 27 по 28 листопада", from: 6.5, to: 9.08 },
  { text: "ви можете забрати", from: 9.08, to: 10.16 },
  { text: "мої послуги зі знижками.", from: 10.16, to: 11.5 },
  { text: "На консультацію", from: 11.57, to: 12.47 },
  { text: "по самостійному", from: 12.47, to: 13.33 },
  { text: "налаштуванню реклами", from: 13.33, to: 14.77 },
  { text: "— мінус 50%.", from: 14.77, to: 16.1 },
  { text: "На ведення таргету", from: 16.14, to: 17.3 },
  { text: "під ключ", from: 17.3, to: 17.82 },
  { text: "— мінус 30%.", from: 17.82, to: 19.03 },
  { text: "А всім тим, хто хоче", from: 19.06, to: 20.5 },
  { text: "не просто делегувати", from: 20.5, to: 21.58 },
  { text: "налаштування таргетологу,", from: 21.58, to: 23.08 },
  { text: "а самостійно", from: 23.08, to: 23.82 },
  { text: "в цьому розібратися,", from: 23.82, to: 25.05 },
  { text: "я підготувала", from: 25.08, to: 25.8 },
  { text: "мінус 40%", from: 25.8, to: 26.98 },
  { text: "на індивідуальне менторство", from: 26.98, to: 28.62 },
  { text: "з щотижневими", from: 28.62, to: 29.6 },
  { text: "живими онлайн-зустрічами.", from: 29.6, to: 31.25 },
  { text: "Тому, якщо ви", from: 31.3, to: 32.04 },
  { text: "давно планували,", from: 32.04, to: 33.22 },
  { text: "зараз саме той момент.", from: 33.22, to: 34.3 },
  { text: "Пишіть мені у директ", from: 34.32, to: 35.44 },
  { text: "зі своїм запитом,", from: 35.44, to: 36.66 },
  { text: "і я надішлю", from: 36.66, to: 37.42 },
  { text: "всі деталі!", from: 37.42, to: 38.5 },
];
