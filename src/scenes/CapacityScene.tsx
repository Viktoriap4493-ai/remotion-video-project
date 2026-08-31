import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CountUp } from "../components/CountUp";
import { headlineFont, bodyFont } from "../fonts";
import { COLORS } from "../theme";

const TOTAL_SCALE = 26000;
const SETUP = 12380;
const AVAILABLE = 13620;

export const CapacityScene: React.FC = () => {
  const frame = useCurrentFrame();

  const badgeOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const setupFill = interpolate(frame, [16, 42], [0, (SETUP / TOTAL_SCALE) * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const availableFill = interpolate(
    frame,
    [46, 78],
    [0, (AVAILABLE / TOTAL_SCALE) * 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const payoffOpacity = interpolate(frame, [80, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const payoffY = interpolate(frame, [80, 94], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <Video
        src={staticFile("video/clip-pov-driving-c.mov")}
        style={{ width: "100%", height: "100%", opacity: 0.3 }}
        objectFit="cover"
        muted
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(7,23,48,0.55)" }} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <Img
          src={staticFile("images/cards/badge-weight-capacity.png")}
          style={{ width: 560, opacity: badgeOpacity }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 30,
            color: "#a9b8d6",
            letterSpacing: 2,
            marginBottom: -6,
          }}
        >
          STAYING UNDER
        </div>
        <div style={{ fontFamily: headlineFont, fontSize: 96, color: COLORS.white, marginBottom: 34 }}>
          26,000 LB
        </div>

        <div
          style={{
            width: "100%",
            height: 56,
            borderRadius: 28,
            backgroundColor: "rgba(255,255,255,0.15)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${setupFill}%`,
              backgroundColor: COLORS.navy,
              border: `2px solid rgba(255,255,255,0.4)`,
              borderRadius: 28,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${setupFill}%`,
              top: 0,
              height: "100%",
              width: `${availableFill}%`,
              backgroundColor: COLORS.yellow,
              borderRadius: 28,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.white,
          }}
        >
          <span>12,380 SETUP</span>
          <span style={{ color: COLORS.yellow }}>13,620 AVAILABLE</span>
        </div>

        <div
          style={{
            marginTop: 60,
            opacity: payoffOpacity,
            transform: `translateY(${payoffY}px)`,
            textAlign: "center",
          }}
        >
          <CountUp
            to={AVAILABLE}
            startFrame={80}
            durationInFrames={16}
            suffix=" LB"
            fontFamily={headlineFont}
            fontSize={150}
            color={COLORS.red}
          />
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 800,
              fontSize: 32,
              color: COLORS.white,
              letterSpacing: 1,
              marginTop: -6,
            }}
          >
            AVAILABLE CARGO WEIGHT
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
