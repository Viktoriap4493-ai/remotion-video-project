import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, riseIn } from "./motion";

// Square plate (sharp corners — never rounded). It "opens" left→right, then its text rises out of a blur.
export const Plate: React.FC<{
  start: number; // local frame the plate starts opening
  bg: string;
  color: string;
  padding?: string;
  open?: number; // frames the plate takes to open
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, bg, color, padding = "0.16em 0.34em 0.2em", open = 11, children, style }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, open);
  const t = enter(frame, start + 4, 13);
  return (
    <div
      style={{
        display: "inline-block",
        background: bg,
        color,
        padding,
        borderRadius: 0,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        ...style,
      }}
    >
      <div style={riseIn(t, 18, 6)}>{children}</div>
    </div>
  );
};
