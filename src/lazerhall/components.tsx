import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { COLORS, EASE_OUT, FONT, GRADE, progress, sec } from "./theme";

export const SAFE = { top: 270, bottom: 1560, side: 60 } as const;

export const TEXT_SHADOW = "0 6px 28px rgba(3, 19, 63, 0.6)";

export type ClipName = "1174" | "1175" | "1176" | "1188" | "1197" | "1198" | "1211";

const clipSrc = (name: ClipName) => staticFile(`lazerhall/video/clip-${name}.mp4`);

/**
 * One source clip placed on the scene timeline (frames relative to the scene),
 * with a continuous zoom (push-in / pull-out) and optional fade-in at the cut.
 */
export const Clip: React.FC<{
  name: ClipName;
  from: number;
  to: number;
  trim: number; // seconds into the source clip
  zoom?: [number, number];
  origin?: string;
  fadeIn?: number; // frames
  blur?: number;
  extraFilter?: string;
}> = ({ name, from, to, trim, zoom = [1, 1.06], origin = "50% 50%", fadeIn = 0, blur = 0, extraFilter = "" }) => {
  return (
    <Sequence from={from} durationInFrames={to - from} name={`clip-${name}`}>
      <ClipInner
        name={name}
        length={to - from}
        trim={trim}
        zoom={zoom}
        origin={origin}
        fadeIn={fadeIn}
        blur={blur}
        extraFilter={extraFilter}
      />
    </Sequence>
  );
};

const ClipInner: React.FC<{
  name: ClipName;
  length: number;
  trim: number;
  zoom: [number, number];
  origin: string;
  fadeIn: number;
  blur: number;
  extraFilter: string;
}> = ({ name, length, trim, zoom, origin, fadeIn, blur, extraFilter }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, length], zoom, { extrapolateRight: "clamp" }),
          transformOrigin: origin,
          filter: `${GRADE}${blur ? ` blur(${blur}px)` : ""} ${extraFilter}`,
        }}
      >
        <Video
          src={clipSrc(name)}
          trimBefore={sec(trim)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Navy gradient that keeps text legible over footage. */
export const Shade: React.FC<{ from: "top" | "bottom"; height: number; strength?: number }> = ({
  from,
  height,
  strength = 0.85,
}) => (
  <AbsoluteFill
    style={{
      top: from === "top" ? 0 : undefined,
      bottom: from === "bottom" ? 0 : undefined,
      height,
      background: `linear-gradient(${from === "top" ? "180deg" : "0deg"}, rgba(5,29,94,${strength}) 0%, rgba(5,29,94,${strength * 0.6}) 45%, rgba(5,29,94,0) 100%)`,
    }}
  />
);

/** Text that enters by scaling 80%→100% with a short motion blur. */
export const PopIn: React.FC<{
  at: number; // frame relative to scene
  frames?: number;
  fromScale?: number;
  rise?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, frames = 9, fromScale = 0.8, rise = 0, style, children }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, frames, EASE_OUT);
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        scale: String(fromScale + (1 - fromScale) * p),
        translate: `0px ${(1 - p) * rise}px`,
        filter: `blur(${(1 - p) * 14}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Text that slides in horizontally behind a mask. */
export const SlideIn: React.FC<{
  at: number;
  frames?: number;
  distance?: number;
  direction?: "left" | "right" | "up";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, frames = 10, distance = 90, direction = "left", style, children }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, frames, EASE_OUT);
  const offset = (1 - p) * distance;
  const translate =
    direction === "up" ? `0px ${offset}px` : `${direction === "left" ? -offset : offset}px 0px`;
  return (
    <div
      style={{
        opacity: interpolate(frame, [at, at + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate,
        filter: `blur(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Thin yellow accent line drawn from left to right. */
export const AccentLine: React.FC<{
  at: number;
  width: number;
  frames?: number;
  thickness?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ at, width, frames = 10, thickness = 6, align = "left", style }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, frames, EASE_OUT);
  return (
    <div
      style={{
        width,
        height: thickness,
        borderRadius: thickness,
        background: COLORS.yellow,
        transformOrigin: align === "left" ? "left center" : "center center",
        scale: `${p} 1`,
        boxShadow: "0 0 18px rgba(255,216,77,0.45)",
        ...style,
      }}
    />
  );
};

export const plaqueStyle: React.CSSProperties = {
  background: COLORS.navy,
  borderRadius: 16,
  padding: "22px 34px",
  boxShadow: "0 18px 48px rgba(2, 10, 36, 0.45)",
};

export const textBase: React.CSSProperties = {
  fontFamily: FONT,
  color: COLORS.white,
  lineHeight: 1.05,
  letterSpacing: "-0.01em",
};

export const Yellow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ color: COLORS.yellow, ...style }}>{children}</span>
);
