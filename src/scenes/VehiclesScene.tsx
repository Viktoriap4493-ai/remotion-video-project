import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { PopCard } from "../components/PopCard";
import { bodyFont } from "../fonts";
import { COLORS } from "../theme";

type VehicleCard = {
  src: string;
  x: number; // percentage from left, card-center anchored
  y: number;
  width: number;
  from: "left" | "right" | "bottom";
  startFrame: number;
  emphasize?: boolean;
};

const WAVE_1_END = 100;

const CARDS: VehicleCard[] = [
  { src: "images/vehicles/prius.png", x: 27, y: 30, width: 460, from: "left", startFrame: 6, emphasize: true },
  { src: "images/vehicles/accord.png", x: 73, y: 42, width: 460, from: "right", startFrame: 18 },
  { src: "images/vehicles/camry.png", x: 27, y: 54, width: 460, from: "left", startFrame: 30 },
  { src: "images/vehicles/sonata.png", x: 73, y: 66, width: 460, from: "right", startFrame: 42, emphasize: true },
  { src: "images/vehicles/glk.png", x: 50, y: 80, width: 480, from: "bottom", startFrame: 54 },
];

const EmphasisPulse: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > 26) return null;
  const scale = interpolate(local, [0, 13, 26], [0.6, 1.6, 2.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(local, [0, 5, 26], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 32,
        border: `6px solid ${COLORS.red}`,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

export const VehiclesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const wave1Exit = interpolate(frame, [WAVE_1_END, WAVE_1_END + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave1Scale = interpolate(frame, [WAVE_1_END, WAVE_1_END + 10], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wave2Start = WAVE_1_END + 14;
  const wave2Local = frame - wave2Start;
  const wave2Opacity = interpolate(wave2Local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave2Scale = interpolate(wave2Local, [0, 18], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
    output: "perceptual-scale",
  });
  const wave2Breathe = 1 + Math.sin(Math.max(wave2Local, 0) / 20) * 0.012;

  const badgeOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <Video
        src={staticFile("video/clip-fleet-wide-b.mov")}
        trimBefore={30}
        style={{ width: "100%", height: "100%", opacity: 0.55 }}
        objectFit="cover"
        muted
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(7,23,48,0.4)" }} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
        <Img
          src={staticFile("images/cards/badge-what-can-you-haul.png")}
          style={{ width: 620, opacity: badgeOpacity }}
        />
      </AbsoluteFill>

      {frame < WAVE_1_END + 10 ? (
        <AbsoluteFill
          style={{ opacity: wave1Exit, transform: `scale(${wave1Scale})` }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${card.x}%`,
                top: `${card.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{ position: "relative" }}>
                <PopCard
                  src={staticFile(card.src)}
                  startFrame={card.startFrame}
                  durationInFrames={14}
                  from={card.from}
                  style={{ width: card.width, borderRadius: 20 }}
                />
                {card.emphasize ? (
                  <EmphasisPulse startFrame={card.startFrame + 6} />
                ) : null}
              </div>
            </div>
          ))}
        </AbsoluteFill>
      ) : null}

      {frame >= wave2Start ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Img
            src={staticFile("images/vehicles/more-examples-list.png")}
            style={{
              width: 760,
              opacity: wave2Opacity,
              transform: `scale(${wave2Scale * wave2Breathe})`,
              filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.55))",
            }}
          />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 70,
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 40,
            color: COLORS.white,
            textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            opacity: frame >= wave2Start ? wave2Opacity : 0,
          }}
        >
          PLENTY OF CAPACITY FOR ANY OF THESE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
