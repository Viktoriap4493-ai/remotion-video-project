import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT } from "../../loadcombos/anim";

const BANDS = 6;

// Horizontal shutter: navy bands close from alternating sides over the cut
// and open again on the other side. `at` is the cut frame.
export const Slices: React.FC<{ at: number; duration?: number }> = ({ at, duration = 12 }) => {
  const frame = useCurrentFrame();
  const half = duration / 2;
  if (frame < at - half - 3 || frame > at + half + 3) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: BANDS }).map((_, i) => {
        const delay = i * 0.6;
        const close = interpolate(frame, [at - half + delay - 2, at - 1 + delay * 0.3], [0, 1], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        });
        const open = interpolate(frame, [at + delay * 0.3, at + half + delay], [0, 1], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        });
        const fromLeft = i % 2 === 0;
        const cover = close - open;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${(i * 100) / BANDS}%`,
              height: `${100 / BANDS + 0.3}%`,
              left: 0,
              right: 0,
              background: i === 2 ? COLORS.red : COLORS.navyDeep,
              transformOrigin: (open > 0 ? !fromLeft : fromLeft) ? "left" : "right",
              scale: `${Math.max(0, cover)} 1`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
