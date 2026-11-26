import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const sec = (seconds: number, fps = 30) => Math.round(seconds * fps);

// Fade in while rising: the default entrance of every text line.
export const fadeUp = (frame: number, start: number, length = 9, distance = 34) => ({
  opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [start, start + length], [distance, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

// Fade in out of a blur: titles, prices, the old price.
export const blurIn = (frame: number, start: number, length = 8, blur = 10) => ({
  opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
  filter: `blur(${interpolate(frame, [start, start + length], [blur, 0], clamp)}px)`,
});

// Springy pop for plates, badges and buttons.
export const usePop = (start: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness: 180, mass: 0.7 } });
};

// Big accent slam ("-50%"): scale down from 2.4 with overshoot.
export const slamScale = (frame: number, start: number) =>
  interpolate(frame, [start, start + 6], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

export const flashOpacity = (frame: number, start: number) =>
  interpolate(frame, [start, start + 2, start + 9], [0, 0.8, 0], clamp);
