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
// The 12 load-variants scene is inserted between «Різниця — 2 500 фунтів!»
// and «Менша вага трейлера…» (the VO pause 21.58–21.91), with its own
// voiceover (voiceover-12-variants.wav, 5.88s) starting 6 frames in.
export const OPTIONS_LEN = 198;
export const OPTIONS_VO_AT = 6;
const INSERT_AT = s(21.75);
const after = (seconds: number) => s(seconds) + OPTIONS_LEN;

export const SCENES = {
  hook: { from: s(0), to: s(5.6) },
  modification: { from: s(5.6), to: s(12.8) },
  reveal: { from: s(12.8), to: s(16.2) },
  compare: { from: s(16.2), to: INSERT_AT },
  options: { from: INSERT_AT, to: INSERT_AT + OPTIONS_LEN },
  capacity: { from: after(21.75), to: after(27.2) },
  cta: { from: after(27.2), to: after(35.3) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) => SCENES[scene].to - SCENES[scene].from;
