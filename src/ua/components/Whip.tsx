import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_OUT } from "../../loadcombos/anim";

// Whip-pan halves: a scene whips OUT to the left over its last frames and
// the next one whips IN from the right, both with horizontal smear.
export const Whip: React.FC<{
  inFrames?: number;
  outAt?: number;
  children: React.ReactNode;
}> = ({ inFrames = 0, outAt, children }) => {
  const frame = useCurrentFrame();
  const pin = inFrames ? interpolate(frame, [0, inFrames], [1, 0], { ...CLAMP, easing: EASE_OUT }) : 0;
  const pout = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 6], [0, 1], { ...CLAMP, easing: EASE_IN });
  const x = pin * 700 - pout * 700;
  const blur = (pin + pout) * 30;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={`whip-${inFrames}-${outAt ?? "x"}`}>
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill
        style={{
          translate: `${x}px 0`,
          filter: blur > 0.5 ? `url(#whip-${inFrames}-${outAt ?? "x"})` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
