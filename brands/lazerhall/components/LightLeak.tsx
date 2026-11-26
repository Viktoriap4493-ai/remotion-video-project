import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./motion";

// Warm light flash that hides a cut (frame-local `at`).
export const LightLeak: React.FC<{ at: number; peak?: number }> = ({ at, peak = 0.85 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at - 4, at, at + 9], [0, peak, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle at 35% 30%, rgba(255,214,150,1) 0%, rgba(255,150,40,0.95) 40%, rgba(230,110,20,0.7) 75%, rgba(180,70,10,0.4) 100%)",
      }}
    />
  );
};
