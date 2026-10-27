export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// The Ukrainian VO runs 32.9s (target was ~53s); scenes follow the speech.
// Speech segments (silence-detected at -38dB / 0.12s), aligned to the script
// by syllable count:
//   0.00  «Втратили CDL,»   1.25 «але хочете продовжити працювати в тракінгу?»
//   3.50  «У Drive4USA є рішення!»
//   5.84  «Ми пропонуємо в оренду трейлер, який ми модернізували,»
//   8.48  «пропрацювавши технічні рішення, щоб зменшити його власну вагу без
//          зайвих компромісів у конструкції.»
//  13.62  «Результат —»   14.32 «трейлер вагою лише 5 100 фунтів.»
//  16.27  «Для порівняння, стандартний Kaufman Dually важить 7 600 фунтів.»
//  19.92  «Різниця — 2 500 фунтів!»
//  21.91  «Менша вага трейлера означає більший ваговий запас для вашого вантажу»
//  25.01  «та більше гнучкості у виборі setup для вашого трака.»
//  (OPTIONS_LEN frames inserted at 21.75 — everything below shifts by it)
//  27.36  «Не маєте власного трейлера?»   28.59 «Орендуйте його в Drive4USA!»
//  30.07  «Телефонуйте або пишіть нам уже зараз, щоб дізнатися умови оренди.»
// The 12 load-variants scene sits between «Різниця — 2 840 фунтів» and
// «Менша вага трейлера…», with its own voiceover (voiceover-12-variants.wav,
// 5.88s) starting OPTIONS_VO_AT frames in.
const OPTIONS_LEN = 198;
const INSERT_AT = s(21.75);
// Where the original voiceover picks up again («Менша вага трейлера…»).
export const ORIGINAL_VO_RESUME = INSERT_AT;
const after = (seconds: number) => s(seconds) + OPTIONS_LEN;

// The 4 760 / 2 840 voiceover (voiceover-weight-4760.wav: 13.80–22.95 of the
// supplied full take 222.mp3, cut only, original speed; speech 0.10–9.02)
// replaces the original «Результат — … 2 500 фунтів!». It is longer, so
// reveal and compare are retimed and the 12-variants scene starts later; it
// still ends where it did, so CAT Scale and everything after keep their
// timecodes.
export const WEIGHT_VO_AT = 401; // speech from 13.47s, after the production line
export const ORIGINAL_VO_CUT = 404; // original VO stops in its pause before «Результат»
export const OPTIONS_VO_AT = 3;
const REVEAL_FROM = s(12.8);
const COMPARE_FROM = REVEAL_FROM + 122;
const OPTIONS_FROM = COMPARE_FROM + 168;

export const SCENES = {
  hook: { from: s(0), to: s(5.6) },
  modification: { from: s(5.6), to: s(12.8) },
  reveal: { from: REVEAL_FROM, to: COMPARE_FROM },
  compare: { from: COMPARE_FROM, to: OPTIONS_FROM },
  options: { from: OPTIONS_FROM, to: after(21.75) },
  capacity: { from: after(21.75), to: after(27.2) },
  cta: { from: after(27.2), to: after(35.3) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) => SCENES[scene].to - SCENES[scene].from;
