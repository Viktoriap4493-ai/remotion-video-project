import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP } from "../../loadcombos/anim";

// Hard impact cut: a white flash peaking on the cut frame, with a thin red
// light streak sweeping across.
export const Flash: React.FC<{ at: number; strength?: number }> = ({ at, strength = 0.85 }) => {
  const frame = useCurrentFrame();
  if (frame < at - 3 || frame > at + 8) return null;
  const o = interpolate(frame, [at - 3, at, at + 8], [0, strength, 0], CLAMP);
  const streak = interpolate(frame, [at - 3, at + 5], [-30, 130], CLAMP);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "white", opacity: o }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${streak}%`,
          width: 60,
          background: "linear-gradient(90deg, transparent, rgba(227,16,27,0.8), transparent)",
          transform: "skewX(-12deg)",
        }}
      />
    </AbsoluteFill>
  );
};
