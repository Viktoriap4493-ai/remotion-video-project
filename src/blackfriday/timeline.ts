export const FPS = 30;

export const s = (seconds: number) => Math.round(seconds * FPS);

export const BRAND_BLUE = "#051D5E";
export const LIGHT_BG = "#EEF1F8";

// The processed voiceover starts 0.5s in, after the opening impact.
// All scene times below follow the voiceover's word timings
// (scripts/blackfriday_audio.py uses the same event times for SFX).
export const DURATION_IN_FRAMES = s(41.7);

export const SCENES = {
  sale: { from: 0, to: 3.4 }, // "Чорна п'ятниця у LAZERHALL вже стартувала"
  clock: { from: 3.4, to: 5.95 }, // "і ми підготували для вас особливу пропозицію"
  discount: { from: 5.95, to: 9.25 }, // "мінус 50% на мікроголковий RF-ліфтинг"
  procedure: { from: 9.25, to: 22.2 },
  results: { from: 22.2, to: 31.2 },
  price: { from: 31.2, to: 35.55 }, // "…за все обличчя — 4 400 гривень"
  final: { from: 35.55, to: 41.7 },
} as const;

export type SceneName = keyof typeof SCENES;

export const sceneFrames = (name: SceneName) => ({
  from: s(SCENES[name].from),
  durationInFrames: s(SCENES[name].to) - s(SCENES[name].from),
});

// Procedure footage, in timeline seconds; sourceStart is seconds into the clip.
// Each shot matches the words spoken over it.
export const PROCEDURE_CLIPS = [
  { src: "device-wide", from: 9.25, to: 10.4, sourceStart: 0.3 }, // "Це сучасна апаратна процедура"
  { src: "device-wide", from: 10.4, to: 12.2, sourceStart: 6.0 }, // "омолодження, яка поєднує"
  { src: "face-procedure", from: 12.2, to: 13.3, sourceStart: 0.4 }, // "мікроголковий вплив"
  { src: "hand-handpiece", from: 13.3, to: 15.2, sourceStart: 0.0 }, // "із радіочастотною енергією"
  { src: "face-procedure", from: 15.2, to: 17.3, sourceStart: 3.6 }, // "Спеціальні мікроголки доставляють RF-енергію"
  { src: "hand-handpiece", from: 17.3, to: 18.55, sourceStart: 4.25 }, // "в шари шкіри"
  { src: "face-procedure", from: 18.55, to: 22.2, sourceStart: 7.1 }, // "стимулюючи … оновлення"
];

export const PROCEDURE_CAPTIONS = [
  { text: "МІКРОГОЛКОВИЙ RF-ЛІФТИНГ", from: 9.4, to: 12.1 },
  { text: "МІКРОГОЛКОВИЙ ВПЛИВ\n+ RF-ЕНЕРГІЯ", from: 12.15, to: 15.2 },
  { text: "СТИМУЛЯЦІЯ\nВИРОБЛЕННЯ КОЛАГЕНУ", from: 18.55, to: 20.9 },
];

// Each pair: "before" alone, then a vertical wipe reveals "after" (WIPE_DELAY in).
export const WIPE_DELAY = 0.75;
export const WIPE_LENGTH = 0.7;
export const RESULT_PAIRS = [
  { name: "pair1", from: 22.2, to: 25.0 },
  { name: "pair2", from: 25.0, to: 28.2 },
  { name: "pair3", from: 28.2, to: 31.2 }, // "Без ін'єкцій…" from 28.34s
];

export const RESULT_CAPTIONS = [
  { text: "ПОКРАЩЕННЯ ЯКОСТІ ШКІРИ", from: 22.3, to: 26.05 },
  { text: "БЕЗ ІН’ЄКЦІЙ\nТА ХІРУРГІЧНОЇ ПІДТЯЖКИ", from: 28.3, to: 31.2 },
];

// Small subtitles for the spoken lines that have no headline or caption on screen.
export const SUBTITLES = [
  { text: "Спеціальні мікроголки доставляють", from: 15.3, to: 17.0 },
  { text: "RF-енергію в шари шкіри,", from: 17.0, to: 18.5 },
  { text: "та природне оновлення.", from: 20.95, to: 22.15 },
  { text: "зробити контури обличчя більш чіткими,", from: 26.1, to: 28.3 },
];

export const PRICE_BEATS = {
  faceLabel: 32.85, // "за все обличчя"
  amount: 33.7, // "чотири тисячі чотириста гривень"
};

export const FINAL_BEATS = {
  button: 37.85, // "тисніть нижче, щоб записатися"
};
