import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";

type Direction = "in" | "out";

export const KenBurnsImage: React.FC<{
  src: string;
  durationInFrames: number;
  direction?: Direction;
  startScale?: number;
  endScale?: number;
  panX?: number;
  panY?: number;
  dim?: number;
}> = ({
  src,
  durationInFrames,
  direction = "in",
  startScale = 1,
  endScale = 1.12,
  panX = 0,
  panY = 0,
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  const [from, to] =
    direction === "in" ? [startScale, endScale] : [endScale, startScale];

  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(scale),
          translate: `${x}px ${y}px`,
        }}
      />
      {dim > 0 ? (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(7,23,48,${dim})` }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
