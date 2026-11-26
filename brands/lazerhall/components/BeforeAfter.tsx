import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { GILROY, WEIGHT } from "./fonts";
import { clamp } from "./motion";
import { COLORS } from "./tokens";

const Label: React.FC<{ text: string; side: "left" | "right"; opacity: number }> = ({ text, side, opacity }) => (
  <div
    style={{
      position: "absolute",
      top: 32,
      [side]: 28,
      opacity,
      padding: "10px 26px",
      borderRadius: 40,
      backgroundColor: side === "left" ? "rgba(255,255,255,0.94)" : COLORS.blue,
      color: side === "left" ? COLORS.blue : COLORS.white,
      fontFamily: GILROY,
      fontWeight: WEIGHT.extraBold,
      fontSize: 38,
      letterSpacing: "0.06em",
    }}
  >
    {text}
  </div>
);

// Real before/after photos only, never retouched: "ДО" alone, then a
// vertical edge with a soft glow wipes in "ПІСЛЯ". Photos are fitted with
// cover inside a card of their own aspect ratio, never stretched.
export const BeforeAfterWipe: React.FC<{
  before: string;
  after: string;
  aspect: number; // width / height of one photo
  lengthInFrames: number;
  wipeAt?: number;
  cardHeight?: number;
  top?: number;
}> = ({ before, after, aspect, lengthInFrames, wipeAt = 20, cardHeight = 1240, top = 300 }) => {
  const frame = useCurrentFrame();
  const cardW = Math.round(cardHeight * aspect);
  const edge = interpolate(frame, [wipeAt, wipeAt + 18], [100, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = interpolate(frame, [0, lengthInFrames], [1, 1.05]);
  const enter = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const photo: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom})`,
    transformOrigin: "50% 45%",
  };
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={after} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(44px) brightness(0.9)", transform: "scale(1.2)" }} />
        <AbsoluteFill style={{ backgroundColor: "rgba(238,241,248,0.55)" }} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1080 - cardW) / 2,
          top,
          width: cardW,
          height: cardHeight,
          borderRadius: 36,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(5,29,94,0.35)",
          transform: `translateY(${(1 - enter) * 40}px)`,
        }}
      >
        <Img src={before} style={photo} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${edge}%)` }}>
          <Img src={after} style={photo} />
        </div>
        {edge > 0 && edge < 100 ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${edge}%`,
              width: 5,
              marginLeft: -2.5,
              backgroundColor: COLORS.white,
              boxShadow: "0 0 30px 8px rgba(255,255,255,0.7)",
            }}
          />
        ) : null}
        <Label text="ДО" side="left" opacity={interpolate(frame, [3, 9], [0, 1], clamp) * interpolate(edge, [8, 22], [0, 1], clamp)} />
        <Label text="ПІСЛЯ" side="right" opacity={interpolate(edge, [40, 60], [1, 0], clamp)} />
      </div>
    </AbsoluteFill>
  );
};
