export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// The Russian voiceover runs 45.2s, so the storyboard's 40s structure is
// stretched to the speech. Cuts sit in its breaths (silence-detected at
// -35dB / 0.18s):
//   0.00  «Три машины на загрузке. Реально остаться в пределах 26 000?»
//   4.44  «Начинаем с лёгкого сетапа — около 12,5 тысяч фунтов.»
//   8.25  «Два Rivian Amazon Van — общий вес 25 732. До лимита — 268 фунтов.»
//  14.82  «Rivian, Tesla и Chevy Equinox — 24 348. Запас до лимита — 1 652.»
//  22.64  «Два F-150 и Toyota Corolla — 25 337. До лимита остаётся 663.»
//  30.22  «И главное — все три комбинации остаются ниже 26 000.»
//  34.09  «Чем легче твой сетап — тем больше загрузок ты можешь брать.»
//  36.89  «И это только двенадцать примеров из множества комбинаций.»
//  40.25  «Легче сетап. Больше вариантов. Drive4USA. Присоединяйся сегодня.»
export const SCENES = {
  hook: { from: s(0), to: s(4.2) },
  setup: { from: s(4.2), to: s(8.0) },
  load2: { from: s(8.0), to: s(14.65) },
  load3: { from: s(14.65), to: s(22.4) },
  load1: { from: s(22.4), to: s(29.95) },
  limit: { from: s(29.95), to: s(33.65) },
  point: { from: s(33.65), to: s(36.75) },
  allLoads: { from: s(36.75), to: s(40.1) },
  cta: { from: s(40.1), to: s(46.5) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) =>
  SCENES[scene].to - SCENES[scene].from;
