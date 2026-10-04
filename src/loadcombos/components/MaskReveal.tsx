import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_OUT } from "../anim";

// Text that rises (or slides) out of an invisible mask edge.
export const MaskReveal: React.FC<{
  start: number;
  duration?: number;
  from?: "bottom" | "left" | "right";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, duration = 10, from = "bottom", children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const offset = (1 - p) * 110;
  const translate =
    from === "bottom"
      ? `0 ${offset}%`
      : from === "left"
        ? `${-offset}% 0`
        : `${offset}% 0`;

  return (
    <div style={{ overflow: "hidden", padding: "0 0.06em", ...style }}>
      <div
        style={{
          translate,
          opacity: interpolate(frame, [start, start + 3], [0, 1], CLAMP),
          transform: from === "bottom" ? `skewY(${(1 - p) * 6}deg)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};
