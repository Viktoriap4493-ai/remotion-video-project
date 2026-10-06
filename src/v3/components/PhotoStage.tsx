import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT } from "../../loadcombos/anim";

export type Camera = {
  start: number;
  end: number;
  from: { scale: number; x: number; y: number }; // x/y: focus point in image px
  to: { scale: number; x: number; y: number };
};

// A still photo shown full-width (never cropped at the sides), over a blurred
// copy of itself that fills the rest of the 9:16 frame. Children (outlines)
// render in the photo's own pixel space and move with the camera.
export const PhotoStage: React.FC<{
  src: string;
  width: number;
  height: number;
  camera: Camera;
  top?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ src, width, height, camera, top, children, style }) => {
  const frame = useCurrentFrame();
  const shown = (1080 * height) / width;
  const y0 = top ?? (1920 - shown) / 2;
  const t = interpolate(frame, [camera.start, camera.end], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const scale = camera.from.scale + (camera.to.scale - camera.from.scale) * t;
  const fx = camera.from.x + (camera.to.x - camera.from.x) * t;
  const fy = camera.from.y + (camera.to.y - camera.from.y) * t;
  // Keep the focus point where it sits at scale 1 → zoom "into" it.
  const k = 1080 / width;
  const originX = fx * k;
  const originY = fy * k + y0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#071C33", ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: -60,
          width: "calc(100% + 120px)",
          height: "calc(100% + 120px)",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.55)",
        }}
      />
      <AbsoluteFill style={{ scale: String(scale), transformOrigin: `${originX}px ${originY}px` }}>
        <div style={{ position: "absolute", left: 0, top: y0, width: 1080, height: shown }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
