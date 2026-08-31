export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// Scene boundaries derived from the final voiceover's exact pause map
// (silence-detected at -32dB/0.12s minimum) so every cut lands on a
// natural breath or sentence break instead of an arbitrary time.
export const SCENES = {
  hook: { from: s(0), to: s(3.09) },
  truck: { from: s(3.09), to: s(6.67) },
  trailer: { from: s(6.67), to: s(10.47) },
  total: { from: s(10.47), to: s(15.75) },
  capacity: { from: s(15.75), to: s(20.56) },
  vehicles: { from: s(20.56), to: s(27.88) },
  combos: { from: s(27.88), to: s(33.93) },
  outro: { from: s(33.93), to: s(49.17) },
} as const;

export const DURATION_IN_FRAMES = SCENES.outro.to;

export const sceneDuration = (scene: keyof typeof SCENES) =>
  SCENES[scene].to - SCENES[scene].from;

// Sub-beats inside the outro, also anchored to detected pauses.
export const OUTRO_BEATS = {
  logo: { from: s(33.93), to: s(35.54) },
  tagline: { from: s(36.19), to: s(40.99) },
  callToAction: { from: s(41.58), to: s(49.17) },
};

export const relativeFrame = (
  scene: keyof typeof SCENES,
  currentFrame: number,
) => currentFrame - SCENES[scene].from;
