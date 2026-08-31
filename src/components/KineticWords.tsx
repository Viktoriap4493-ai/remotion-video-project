import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

type Word = {
  text: string;
  emphasis?: boolean;
};

export const KineticWords: React.FC<{
  words: Word[];
  startFrame: number;
  perWordFrames?: number;
  fontSize?: number;
  emphasisColor?: string;
  color?: string;
  fontFamily: string;
  align?: "left" | "center";
}> = ({
  words,
  startFrame,
  perWordFrames = 6,
  fontSize = 72,
  emphasisColor = "#ef3b3b",
  color = "#ffffff",
  fontFamily,
  align = "center",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "0 0.28em",
        fontFamily,
        fontSize,
        lineHeight: 1.08,
        textAlign: align,
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * perWordFrames;
        const local = frame - wordStart;
        const opacity = interpolate(local, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(local, [0, 8], [24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const scale = interpolate(local, [0, 8, 16], [0.85, word.emphasis ? 1.12 : 1.02, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.6)),
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              color: word.emphasis ? emphasisColor : color,
              fontWeight: 900,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
