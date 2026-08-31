import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CountUp } from "./CountUp";
import { PopCard } from "./PopCard";
import { headlineFont, bodyFont } from "../fonts";
import { COLORS } from "../theme";

// Shared visual treatment for the truck & trailer weight reveal beats:
// badge label -> big count-up number -> a real CAT Scale ticket flash for proof.
export const WeightBeat: React.FC<{
  badgeSrc: string;
  ticketSrc: string;
  value: number;
  background: React.ReactNode;
  countUpStart?: number;
  ticketStart?: number;
  ticketEnd: number;
}> = ({ badgeSrc, ticketSrc, value, background, countUpStart = 8, ticketStart = 34, ticketEnd }) => {
  const frame = useCurrentFrame();

  const badgeOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeY = interpolate(frame, [0, 10], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {background}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,13,28,0.55) 0%, rgba(5,13,28,0.15) 35%, rgba(5,13,28,0.65) 100%)",
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <Img
          src={badgeSrc}
          style={{
            width: 640,
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 60,
        }}
      >
        <CountUp
          to={value}
          startFrame={countUpStart}
          durationInFrames={22}
          suffix=" LB"
          fontFamily={headlineFont}
          fontSize={168}
          color={COLORS.white}
          style={{ textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
        />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 34,
            color: COLORS.yellow,
            letterSpacing: 2,
            marginTop: 8,
            opacity: interpolate(frame, [22, 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          CERTIFIED AT THE CAT SCALE
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-end", padding: 50 }}>
        <PopCard
          src={ticketSrc}
          startFrame={ticketStart}
          durationInFrames={12}
          from="right"
          exitAtFrame={ticketEnd}
          style={{
            width: 300,
            borderRadius: 14,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            border: "4px solid white",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
