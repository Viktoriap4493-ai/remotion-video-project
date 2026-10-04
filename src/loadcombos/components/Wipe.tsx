import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT } from "../anim";

// Diagonal red + navy slabs that sweep across a hard cut. `at` is the cut
// frame; the slabs fully cover the screen there.
export const Wipe: React.FC<{ at: number; duration?: number }> = ({
  at,
  duration = 14,
}) => {
  const frame = useCurrentFrame();
  const half = duration / 2;
  if (frame < at - half || frame > at + half) return null;

  const slab = (delay: number, color: string) => {
    const x = interpolate(
      frame,
      [at - half + delay, at + half - 3 + delay],
      [130, -130],
      { ...CLAMP, easing: EASE_IN_OUT },
    );
    return (
      <div
        style={{
          position: "absolute",
          top: "-20%",
          bottom: "-20%",
          left: "-40%",
          width: "180%",
          background: color,
          translate: `${x}% 0`,
          transform: "skewX(-14deg)",
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {slab(0, COLORS.red)}
      {slab(2, COLORS.navyDeep)}
    </AbsoluteFill>
  );
};
