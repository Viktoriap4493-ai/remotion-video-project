import React from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";

export const PopCard: React.FC<{
  src: string;
  startFrame: number;
  durationInFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  from?: "bottom" | "right" | "left" | "scale";
  exitAtFrame?: number;
}> = ({
  src,
  startFrame,
  durationInFrames = 14,
  width = "auto",
  style,
  from = "bottom",
  exitAtFrame,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const progress = interpolate(local, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const opacity = interpolate(local, [0, durationInFrames * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let transform = `scale(${interpolate(progress, [0, 1], [0.7, 1])})`;
  if (from === "bottom") {
    transform += ` translateY(${interpolate(progress, [0, 1], [60, 0])}px)`;
  } else if (from === "right") {
    transform += ` translateX(${interpolate(progress, [0, 1], [80, 0])}px)`;
  } else if (from === "left") {
    transform += ` translateX(${interpolate(progress, [0, 1], [-80, 0])}px)`;
  }

  let exitOpacity = 1;
  let exitTransform = "";
  if (exitAtFrame !== undefined) {
    const exitLocal = frame - exitAtFrame;
    exitOpacity = interpolate(exitLocal, [0, 10], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    exitTransform = ` scale(${interpolate(exitLocal, [0, 10], [1, 0.9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })})`;
  }

  return (
    <Img
      src={src}
      style={{
        width,
        opacity: opacity * exitOpacity,
        transform: transform + exitTransform,
        ...style,
      }}
    />
  );
};
