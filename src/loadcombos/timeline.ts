export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// Scene cuts land in the breaths of voiceover-2 (silence-detected at
// -32dB / 0.25s), so every scene opens just before its line is spoken.
//   0.43  "Here's a three-car load. Would you take it?"
//   3.59  "We start with our lightweight twelve-five setup."
//   6.37  "Two F-150s and a Toyota Corolla — still under twenty-six thousand."
//  10.70  "Two Rivian Amazon Vans — and we're still under twenty-six thousand."
//  14.70  "A Rivian, a Tesla, and a Chevy Equinox — also under twenty-six thousand."
//  21.33  "Three different combinations — all staying under twenty-six thousand pounds."
//  25.86  "The lighter your equipment, the more combinations you can work with."
//  29.56  "And these are just twelve of the many possible load combinations."
//  33.22  "Drive lighter. Load smarter. Drive4USA. Apply today."
export const SCENES = {
  hook: { from: s(0), to: s(3.4) },
  setup: { from: s(3.4), to: s(6.2) },
  load1: { from: s(6.2), to: s(10.57) },
  load2: { from: s(10.57), to: s(14.5) },
  load3: { from: s(14.5), to: s(21.0) },
  reveal: { from: s(21.0), to: s(25.6) },
  point: { from: s(25.6), to: s(29.35) },
  allLoads: { from: s(29.35), to: s(33.0) },
  cta: { from: s(33.0), to: s(40.0) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) =>
  SCENES[scene].to - SCENES[scene].from;
