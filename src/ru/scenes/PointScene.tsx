import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, punch } from "../../loadcombos/anim";
import { BlueprintBackground } from "../../loadcombos/components/BlueprintBackground";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS_RU, GILROY } from "../fonts";

type Pair = {
  a: string;
  b: string;
  axis: "x" | "y";
  meet: number; // frame the two words collide
  breakAt: number; // frame they burst apart
};

const PAIRS: Pair[] = [
  { a: "РАЗНЫЕ", b: "МАШИНЫ", axis: "x", meet: 14, breakAt: 30 },
  { a: "РАЗНЫЕ", b: "ЗАГРУЗКИ", axis: "y", meet: 42, breakAt: 56 },
];
const FINAL = 58; // pushes everything out and takes the centre
const CENTER_Y = 860;

// Two words fly in from opposite sides, collide in the centre with a squash,
// then burst apart.
const Collision: React.FC<{ pair: Pair }> = ({ pair }) => {
  const frame = useCurrentFrame();
  const { a, b, axis, meet, breakAt } = pair;
  const approach = interpolate(frame, [meet - 8, meet], [1, 0], { ...CLAMP, easing: EASE_IN });
  const burst = interpolate(frame, [breakAt, breakAt + 7], [0, 1], { ...CLAMP, easing: EASE_IN });
  const squash = interpolate(frame, [meet, meet + 2, meet + 6], [1, 0.86, 1], CLAMP);
  if (frame < meet - 8 || burst >= 1) return null;

  const word = (text: string, dir: -1 | 1) => {
    const far = axis === "x" ? 900 : 700;
    const offset = dir * (approach * far + burst * 520);
    return (
      <span
        style={{
          display: "inline-block",
          translate: axis === "x" ? `${offset}px ${burst * dir * 120}px` : `${burst * dir * 260}px ${offset}px`,
          rotate: `${burst * dir * 12}deg`,
          scale: axis === "x" ? `${squash} 1` : `1 ${squash}`,
          filter: `blur(${approach * 10 + burst * 12}px)`,
          opacity: 1 - burst,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: CENTER_Y - 90,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 34,
        fontFamily: BEBAS_RU,
        fontSize: 170,
        lineHeight: 1,
        color: COLORS.navy,
      }}
    >
      {word(a, -1)}
      {word(b, 1)}
      <Sfx at={meet - 8} name="whoosh-fast" volume={0.24} />
      <Sfx at={meet} name="punch" volume={0.32} />
      <Sfx at={breakAt} name="whoosh-soft" volume={0.18} />
    </div>
  );
};

export const PointScene: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const fin = interpolate(frame, [FINAL, FINAL + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const shake = frame >= PAIRS[0].meet && frame < PAIRS[0].meet + 5 ? Math.sin(frame * 4) * 6 : 0;

  return (
    <AbsoluteFill>
      <BlueprintBackground trimBefore={60} />
      <AbsoluteFill style={{ translate: `${shake}px 0` }}>
        {/* Thin limit rule */}
        <div style={{ position: "absolute", top: 420, left: 60, width: 960 * line, height: 5, background: COLORS.red }} />
        <div
          style={{
            position: "absolute",
            top: 360,
            right: 60,
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: "0.18em",
            color: COLORS.red,
            opacity: line,
          }}
        >
          26,000 LB LIMIT
        </div>

        {PAIRS.map((p) => (
          <Collision key={p.b} pair={p} />
        ))}

        <div
          style={{
            position: "absolute",
            top: CENTER_Y - 230,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: BEBAS_RU,
            lineHeight: 0.95,
            opacity: fin,
            scale: String(interpolate(fin, [0, 1], [2.4, 1]) * punch(frame, FINAL + 8, 0.06, 2, 8)),
            filter: `blur(${(1 - fin) * 16}px)`,
          }}
        >
          <div style={{ fontSize: 200, color: COLORS.navy }}>ОДИН ЛЁГКИЙ</div>
          <div style={{ fontSize: 290, color: COLORS.red }}>СЕТАП</div>
        </div>
      </AbsoluteFill>

      <Sfx at={FINAL - 2} name="whoosh-deep" volume={0.24} />
      <Sfx at={FINAL + 4} name="bass-hit" volume={0.48} />
    </AbsoluteFill>
  );
};
