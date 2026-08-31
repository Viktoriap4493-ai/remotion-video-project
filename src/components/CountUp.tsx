import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export const CountUp: React.FC<{
  from?: number;
  to: number;
  startFrame: number;
  durationInFrames?: number;
  suffix?: string;
  fontSize?: number;
  color?: string;
  fontFamily: string;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  startFrame,
  durationInFrames = 20,
  suffix = "",
  fontSize = 140,
  color = "#ef3b3b",
  fontFamily,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const value = interpolate(local, [0, durationInFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const punchScale = interpolate(
    local,
    [0, durationInFrames * 0.6, durationInFrames],
    [0.9, 1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.4)),
      output: "perceptual-scale",
    },
  );

  const rounded = Math.round(value).toLocaleString("en-US");

  return (
    <div
      style={{
        fontFamily,
        fontWeight: 900,
        fontSize,
        color,
        transform: `scale(${punchScale})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {rounded}
      {suffix}
    </div>
  );
};
