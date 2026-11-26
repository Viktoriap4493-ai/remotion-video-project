import { Easing, interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const sec = (seconds: number, fps = 30) => Math.round(seconds * fps);

// Calm "expensive" ease: fast start, long soft landing. No bounce, no overshoot.
export const silk = Easing.bezier(0.2, 0.8, 0.2, 1);

// 0→1 progress of an entrance that starts at `start` and lasts `length` frames.
export const enter = (frame: number, start: number, length = 12) =>
  interpolate(frame, [start, start + length], [0, 1], { ...clamp, easing: silk });

// 1→0 progress of an exit.
export const exit = (frame: number, end: number, length = 8) =>
  interpolate(frame, [end - length, end], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });

// Text rising out of a light blur.
export const riseIn = (p: number, distance = 22, blur = 8) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
  filter: `blur(${(1 - p) * blur}px)`,
});
