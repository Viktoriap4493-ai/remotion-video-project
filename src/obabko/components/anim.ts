import { Easing, interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.inOut(Easing.cubic);

// 0 → 1 progress between two frames.
export const progress = (frame: number, from: number, to: number, easing = ease) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing });
