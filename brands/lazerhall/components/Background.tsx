import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { COLORS } from "./tokens";

// White → #EEF1F8 with two soft blue glows drifting slowly (light screens).
export const LightBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #ffffff 0%, ${COLORS.lightBg} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 420 + drift,
          top: -260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(61,107,224,0.18) 0%, rgba(61,107,224,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          left: -420 - drift,
          top: 1180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(5,29,94,0.14) 0%, rgba(5,29,94,0) 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Brand-blue radial screen behind big accents ("-50%", end card).
export const BlueBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 42%, ${COLORS.blueMid} 0%, ${COLORS.blue} 62%, ${COLORS.blueDeep} 100%)`,
    }}
  />
);

type Shade = "none" | "top" | "bottom" | "both";

const SHADES: Record<Shade, string> = {
  none: "rgba(0,0,0,0)",
  top: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 34%, rgba(0,0,0,0.12) 100%)",
  bottom: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.6) 100%)",
  both: "linear-gradient(180deg, rgba(8,8,16,0.85) 0%, rgba(8,8,16,0.5) 22%, rgba(8,8,16,0) 38%, rgba(8,8,16,0) 46%, rgba(8,8,16,0.55) 60%, rgba(8,8,16,0.88) 78%, rgba(8,8,16,0.92) 100%)",
};

// Procedure footage, full frame, with the brand's slow push-in and a shade
// so white text stays readable.
export const FootageClip: React.FC<{
  src: string;
  trimBeforeFrames?: number;
  lengthInFrames: number;
  shade?: Shade;
  fadeInFrames?: number;
}> = ({ src, trimBeforeFrames = 0, lengthInFrames, shade = "both", fadeInFrames = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = fadeInFrames ? interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, lengthInFrames], [1.02, 1.08])})` }}>
        <Video src={src} trimBefore={trimBeforeFrames} style={{ width: "100%", height: "100%" }} objectFit="cover" muted />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: SHADES[shade] }} />
    </AbsoluteFill>
  );
};
