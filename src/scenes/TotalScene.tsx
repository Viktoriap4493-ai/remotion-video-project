import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { headlineFont } from "../fonts";
import { COLORS } from "../theme";

const MiniNumber: React.FC<{
  label: string;
  value: string;
  startFrame: number;
  side: "left" | "right";
  exitAt: number;
}> = ({ label, value, startFrame, side, exitAt }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  const enter = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });

  const exitLocal = frame - exitAt;
  const exitProgress = interpolate(exitLocal, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const dir = side === "left" ? -1 : 1;
  const x = interpolate(enter, [0, 1], [dir * 160, 0]) + exitProgress * dir * -220;
  const opacity = enter * (1 - exitProgress);
  const scale = 1 - exitProgress * 0.4;

  return (
    <div
      style={{
        position: "absolute",
        [side]: "18%",
        top: "42%",
        transform: `translate(${x}px, -50%) scale(${scale})`,
        opacity,
        textAlign: "center",
        fontFamily: headlineFont,
        color: COLORS.white,
      }}
    >
      <div style={{ fontSize: 26, letterSpacing: 3, color: COLORS.yellow, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 92 }}>{value}</div>
    </div>
  );
};

export const TotalScene: React.FC = () => {
  const frame = useCurrentFrame();

  const collideAt = 46;
  const cardPopAt = 52;

  const plusOpacity = interpolate(frame, [16, 26, collideAt, collideAt + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardLocal = frame - cardPopAt;
  const cardScale = interpolate(cardLocal, [0, 16], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
    output: "perceptual-scale",
  });
  const cardOpacity = interpolate(cardLocal, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + Math.sin(Math.max(cardLocal, 0) / 14) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <Video
        src={staticFile("video/clip-empty-rig-lot.mov")}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.35,
          filter: "brightness(0.7)",
        }}
        objectFit="cover"
        muted
        loop
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(7,23,48,0.35)" }} />

      {frame < cardPopAt + 10 ? (
        <>
          <MiniNumber
            label="TRUCK"
            value="7,240"
            startFrame={4}
            side="left"
            exitAt={collideAt}
          />
          <MiniNumber
            label="TRAILER"
            value="5,140"
            startFrame={18}
            side="right"
            exitAt={collideAt}
          />
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: headlineFont,
                fontSize: 100,
                color: COLORS.red,
                opacity: plusOpacity,
                marginTop: "-4%",
              }}
            >
              +
            </div>
          </AbsoluteFill>
        </>
      ) : null}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile("images/cards/card-total-empty-setup-12380.png")}
          style={{
            width: 780,
            opacity: cardOpacity,
            transform: `scale(${cardScale * breathe})`,
            filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.55))",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
