export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// Three voiceover sources, end to end:
// • voiceover.mp3 (original) up to the production line, and again for the CTA
//   from 27.20 («Не маєте власного трейлера?» 27.36 … «…умови оренди.» 32.63);
// • voiceover-weight-4760.wav: «Результат — трейлер вагою лише 4 760 фунтів»
//   (speech 0.10–3.45, then cut before its comparison lines);
// • voiceover-setup-middle.wav: 16.95–45.65 of the full take 51.mp3, cut only,
//   original speed. Speech in it (silence-detected):
//      0.09 «Але головна перевага — у всьому setup.»
//      2.09 «Стандартний setup із траком важить 15 800 фунтів,»
//      5.74 «тоді як нам вдалося знизити загальну вагу до 12 060 фунтів.»
//      9.39 «Це на 3 740 фунтів менше!»
//     11.58 «А отже, більше вагового запасу для вашого вантажу та можливість
//            залишатися в межах 26 000 фунтів»
//     16.64 «за умови правильного підбору трака й завантаження.»
//     18.74 «А тепер погляньте…»   21.18 «Ось лише 12 прикладів…»
//     23.36 «Менша вага трейлера…»   26.46 «…та більше гнучкості…трака.» → 28.62
export const ORIGINAL_VO_CUT = 404; // original VO stops in its pause before «Результат»
export const WEIGHT_VO_AT = 401; // «Результат» from 13.47s
const REVEAL_FROM = s(12.8);
const MIDDLE_FROM = REVEAL_FROM + 122; // 16.87s
export const MIDDLE_VO_AT = MIDDLE_FROM;
const MIDDLE_VO_LEN = 861; // 28.70s
const CTA_FROM = MIDDLE_FROM + MIDDLE_VO_LEN;
export const CTA_VO_TRIM = s(27.2); // the original VO's CTA, as in the previous cut

export const SCENES = {
  hook: { from: s(0), to: s(5.6) },
  modification: { from: s(5.6), to: s(12.8) },
  reveal: { from: REVEAL_FROM, to: MIDDLE_FROM },
  setup: { from: MIDDLE_FROM, to: MIDDLE_FROM + 345 },
  reserve: { from: MIDDLE_FROM + 345, to: MIDDLE_FROM + 559 },
  options: { from: MIDDLE_FROM + 559, to: MIDDLE_FROM + 749 },
  capacity: { from: MIDDLE_FROM + 749, to: CTA_FROM },
  cta: { from: CTA_FROM, to: CTA_FROM + 245 },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) => SCENES[scene].to - SCENES[scene].from;
