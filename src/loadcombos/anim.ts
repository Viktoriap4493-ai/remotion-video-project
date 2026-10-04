import { Easing, interpolate } from "remotion";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);
// Controlled overshoot: lands ~6% past the target and settles back.
export const EASE_BACK = Easing.bezier(0.34, 1.4, 0.64, 1);

export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing = EASE_OUT,
) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing });

// Punch zoom: 1 → 1 + peak over `rise` frames, then back to 1 over `fall`.
export const punch = (
  frame: number,
  at: number,
  peak = 0.18,
  rise = 3,
  fall = 9,
) => {
  const up = interpolate(frame, [at, at + rise], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const down = interpolate(frame, [at + rise, at + rise + fall], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  return 1 + peak * (up - down);
};

export const COLORS = {
  navy: "#0C2E4E",
  navyDeep: "#071C33",
  red: "#E3101B",
  yellow: "#FFD21F",
  green: "#19A84A",
  white: "#FFFFFF",
} as const;
