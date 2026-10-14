import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, spring, staticFile } from "remotion";
import cues from "./cues.json";

export const FPS = cues.fps;
export const DURATION_IN_FRAMES = Math.round(cues.duration * FPS);

export const COLORS = {
  navy: "#051d5e",
  navyDeep: "#03133f",
  white: "#FFFFFF",
  yellow: "#FFD84D",
  red: "#E5262B",
} as const;

export const FONT = "LH Inter";

export const fontsLoaded = Promise.all(
  (
    [
      ["Inter-Regular.otf", "400"],
      ["Inter-Medium.otf", "500"],
      ["Inter-Bold.otf", "700"],
      ["Inter-ExtraBold.otf", "800"],
    ] as const
  ).map(([file, weight]) =>
    loadFont({
      family: FONT,
      url: staticFile(`lazerhall/fonts/${file}`),
      weight,
    }),
  ),
);

export type SceneKey = keyof typeof cues.scenes;
export type BeatKey = keyof typeof cues.beats;

export const sec = (seconds: number) => Math.round(seconds * FPS);
export const beat = (key: BeatKey) => sec(cues.beats[key]);
export const sceneStart = (key: SceneKey) => sec(cues.scenes[key][0]);
export const sceneEnd = (key: SceneKey) => sec(cues.scenes[key][1]);
export const sceneLength = (key: SceneKey) => sceneEnd(key) - sceneStart(key);
export const WIPE_FRAMES = sec(cues.beats.wipeDuration);
export const STRIKE_FRAMES = sec(cues.beats.strikeDuration);

// Mild grade so the clinic footage reads brighter and crisper under the navy overlays.
export const GRADE = "brightness(1.1) contrast(1.08) saturate(1.06)";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0→1 progress of an animation that starts at `start` (frame) and lasts `length` frames. */
export const progress = (
  frame: number,
  start: number,
  length: number,
  easing = EASE_OUT,
) => interpolate(frame, [start, start + length], [0, 1], { ...clamp, easing });

/** Spring with a short overshoot — used for the bounce on the discount and new prices. */
export const bounce = (frame: number, start: number) =>
  spring({
    frame: frame - start,
    fps: FPS,
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });

export const mix = (p: number, from: number, to: number) => from + (to - from) * p;
