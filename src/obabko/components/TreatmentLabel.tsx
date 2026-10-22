import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { clamp, progress } from "./anim";

type Props = {
  text: string;
  accent?: string; // highlighted word, appears a few frames later
  top: number;
  at: number;
  accentDelay?: number;
  exitAt?: number;
  fontSize?: number;
  weight?: number;
};

export const TreatmentLabel: React.FC<Props> = ({
  text,
  accent,
  top,
  at,
  accentDelay = 4,
  exitAt,
  fontSize = 76,
  weight = FONT.semibold,
}) => {
  const frame = useCurrentFrame();
  const main = progress(frame, at, at + 10);
  const acc = progress(frame, at + accentDelay, at + accentDelay + 10);
  const line = progress(frame, at + 10, at + 20);
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, exitAt + 6);

  const word = (p: number): React.CSSProperties => ({
    display: "inline-block",
    transform: `translateY(${interpolate(p, [0, 1], [100, 0], clamp)}%)`,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        textAlign: "center",
        fontFamily: FONT.family,
        fontWeight: weight,
        fontSize,
        lineHeight: 1.15,
        color: COLORS.graphite,
        opacity: 1 - exit,
      }}
    >
      <div style={{ overflow: "hidden", padding: "0 20px 4px" }}>
        <span style={word(main)}>{text}</span>
        {accent ? (
          <span style={{ ...word(acc), color: COLORS.brand, marginLeft: "0.25em" }}>{accent}</span>
        ) : null}
      </div>
      <div
        style={{
          margin: "18px auto 0",
          width: 140,
          height: 6,
          borderRadius: 3,
          background: COLORS.brand,
          transform: `scaleX(${line})`,
        }}
      />
    </div>
  );
};
