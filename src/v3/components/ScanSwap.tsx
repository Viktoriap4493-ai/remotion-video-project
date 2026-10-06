import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT } from "../../loadcombos/anim";

// Before/after swap: a bright scan bar sweeps left → right and the "after"
// layer is revealed behind it, with a short chromatic jitter on the edge.
export const ScanSwap: React.FC<{
  at: number;
  duration?: number;
  before: React.ReactNode;
  after: React.ReactNode;
}> = ({ at, duration = 12, before, after }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + duration], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const scanning = p > 0 && p < 1;
  const x = p * 1080;

  return (
    <AbsoluteFill>
      {p < 1 ? <AbsoluteFill>{before}</AbsoluteFill> : null}
      {p > 0 ? <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{after}</AbsoluteFill> : null}
      {scanning ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: x - 3,
              width: 6,
              background: "white",
              boxShadow: `0 0 30px 10px rgba(255,255,255,0.6), 0 0 80px 20px ${COLORS.red}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: x - 140,
              width: 140,
              background: "linear-gradient(90deg, transparent, rgba(127,211,255,0.25))",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
