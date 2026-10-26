export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// voiceover-v3: 0.02–3.92 is the ORIGINAL voiceover's «хочете продовжити
// працювати в тракінгу? У Drive4USA є рішення!» (voiceover.mp3 1.405–5.46,
// pause tightened); from 5.03 on it is voiceover-v2 (Yevhen) untouched.
// Speech segments (silence-detected at -38dB / 0.12s):
//   0.02  «(але) хочете продовжити працювати в тракінгу?»
//   1.99  «У Drive4USA є рішення!»   5.03 «Ми пропонуємо»
//   6.17  «в оренду трейлер, який ми модернізували, … без зайвих компромісів у конструкції.»
//  14.51  «Результат —»   15.23 «трейлер вагою лише 5 100 фунтів.»
//  17.48  «Для порівняння, стандартний Kaufman Dually важить 7 600 фунтів.»
//  21.34  «Різниця — 2 500 фунтів!»
//  23.35  «А тепер погляньте, які можливості відкриває полегшений setup!»
//  26.46  «Ось лише 12 прикладів варіантів завантаження.»
//  28.97  «Менша вага трейлера означає більший ваговий запас для вашого вантажу»
//  32.16  «та більшу гнучкість у виборі setup для вашого трака.»
//  34.96  «Не маєте власного трейлера?»   36.31 «Орендуйте його в Drive4USA!»
//  37.80  «Телефонуйте або пишіть нам уже зараз, щоб дізнатися умови оренди.»
export const SCENES = {
  hook: { from: s(0), to: s(4.97) },
  modification: { from: s(4.97), to: s(13.68) },
  reveal: { from: s(13.68), to: s(17.28) },
  compare: { from: s(17.28), to: s(23.19) },
  options: { from: s(23.19), to: s(28.85) },
  capacity: { from: s(28.85), to: s(34.8) },
  cta: { from: s(34.8), to: s(43.4) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) => SCENES[scene].to - SCENES[scene].from;
