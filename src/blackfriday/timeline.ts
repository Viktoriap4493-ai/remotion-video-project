export const FPS = 30;

export const s = (seconds: number) => Math.round(seconds * FPS);

export const BRAND_BLUE = "#051D5E";
export const LIGHT_BG = "#EEF1F8";

// The processed voiceover starts 0.5s in, after the opening impact.
// All scene times below follow the voiceover's word timings
// (scripts/blackfriday_audio.py uses the same event times for SFX).
export const DURATION_IN_FRAMES = s(44.6);

export const SCENES = {
  sale: { from: 0, to: 3.45 }, // "Чорна п'ятниця у LAZERHALL вже стартувала"
  clock: { from: 3.45, to: 5.95 }, // "і ми підготували для вас особливу пропозицію"
  discount: { from: 5.95, to: 9.5 }, // "мінус 50% на мікроголковий RF-ліфтинг"
  procedure: { from: 9.5, to: 23.3 },
  results: { from: 23.3, to: 33.0 },
  price: { from: 33.0, to: 37.85 }, // "…за все обличчя — 4 400 гривень"
  final: { from: 37.85, to: 44.6 },
} as const;

export type SceneName = keyof typeof SCENES;

export const sceneFrames = (name: SceneName) => ({
  from: s(SCENES[name].from),
  durationInFrames: s(SCENES[name].to) - s(SCENES[name].from),
});

// Procedure footage, in timeline seconds; sourceStart is seconds into the clip.
export const PROCEDURE_CLIPS = [
  { src: "device-wide", from: 9.5, to: 11.3, sourceStart: 0.2 },
  { src: "device-wide", from: 11.3, to: 13.2, sourceStart: 6.0 },
  { src: "face-procedure", from: 13.2, to: 15.0, sourceStart: 0.4 },
  { src: "hand-handpiece", from: 15.0, to: 16.5, sourceStart: 0.1 },
  { src: "face-procedure", from: 16.5, to: 18.7, sourceStart: 3.6 },
  { src: "hand-handpiece", from: 18.7, to: 20.0, sourceStart: 4.25 },
  { src: "face-procedure", from: 20.0, to: 23.3, sourceStart: 7.1 },
];

export const PROCEDURE_CAPTIONS = [
  { text: "МІКРОГОЛКОВИЙ RF-ЛІФТИНГ", from: 9.7, to: 13.0 },
  { text: "МІКРОГОЛКОВИЙ ВПЛИВ\n+ RF-ЕНЕРГІЯ", from: 13.35, to: 16.4 },
  { text: "СТИМУЛЯЦІЯ\nВИРОБЛЕННЯ КОЛАГЕНУ", from: 19.75, to: 23.2 },
];

// Each pair: "before" alone, then a vertical wipe reveals "after" (WIPE_DELAY in).
export const WIPE_DELAY = 0.75;
export const WIPE_LENGTH = 0.7;
export const RESULT_PAIRS = [
  { name: "pair1", from: 23.3, to: 26.4, caption: "ПОКРАЩЕННЯ ЯКОСТІ ШКІРИ" },
  { name: "pair2", from: 26.4, to: 29.5, caption: "ПОКРАЩЕННЯ ЯКОСТІ ШКІРИ" },
  // "Без ін'єкцій та хірургічної підтяжки" is spoken from 29.5s
  { name: "pair3", from: 29.5, to: 33.0, caption: "БЕЗ ІН’ЄКЦІЙ\nТА ХІРУРГІЧНОЇ ПІДТЯЖКИ" },
];

export const PRICE_BEATS = {
  faceLabel: 34.9, // "за все обличчя"
  amount: 35.6, // "чотири тисячі чотириста гривень"
};

export const FINAL_BEATS = {
  button: 40.45, // "тисніть нижче, щоб записатися"
};
