import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { bodyFont } from "../fonts";
import { COLORS } from "../theme";

const CARDS = [
  "images/cards/combo-example-1.png",
  "images/cards/combo-example-2.png",
  "images/cards/combo-example-3.png",
];

const SLOT = 58;

export const CombosScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <Video
        src={staticFile("video/clip-fleet-wide-b.mov")}
        trimBefore={180}
        style={{ width: "100%", height: "100%", opacity: 0.4 }}
        objectFit="cover"
        muted
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(7,23,48,0.5)" }} />

      {CARDS.map((src, i) => {
        const start = i * SLOT;
        const local = frame - start;
        const isTense = i === 2;

        const scale = interpolate(
          local,
          [0, 14, SLOT - 10, SLOT],
          [0.75, isTense ? 1.06 : 1, 1, 0.94],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.3)),
            output: "perceptual-scale",
          },
        );
        const opacity = interpolate(local, [0, 12, SLOT - 12, SLOT], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        if (opacity <= 0) return null;

        return (
          <AbsoluteFill key={src} style={{ alignItems: "center", justifyContent: "center" }}>
            <Img
              src={staticFile(src)}
              style={{
                width: 640,
                opacity,
                transform: `scale(${scale})`,
                filter: isTense
                  ? "drop-shadow(0 0 60px rgba(239,59,59,0.45)) drop-shadow(0 25px 50px rgba(0,0,0,0.55))"
                  : "drop-shadow(0 25px 50px rgba(0,0,0,0.55))",
              }}
            />
          </AbsoluteFill>
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 900,
            fontSize: 34,
            color: COLORS.white,
            letterSpacing: 1,
            textShadow: "0 4px 16px rgba(0,0,0,0.6)",
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          THREE VEHICLES AT ONCE? STILL UNDER 26,000 LB
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
