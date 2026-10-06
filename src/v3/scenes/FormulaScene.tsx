import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS } from "../../loadcombos/fonts";

const S1 = 4; // enters from the side
const A1 = 24;
const S2 = 32; // builds upward, letter by letter
const A2 = 54;
const S3 = 62; // punches in

const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <svg width="80" height="110" viewBox="0 0 80 110" style={{ margin: "14px 0" }}>
      <path
        d="M40 4 V96 M14 70 L40 98 L66 70"
        stroke={COLORS.red}
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        strokeDashoffset={200 * (1 - p)}
      />
    </svg>
  );
};

export const FormulaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s1 = interpolate(frame, [S1, S1 + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const s3 = interpolate(frame, [S3, S3 + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const s2Text = "MORE WEIGHT FOR CARS";

  return (
    <AbsoluteFill>
      <TechBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: BEBAS, lineHeight: 1, color: COLORS.white }}>
        <div style={{ fontSize: 140, opacity: s1, translate: `${(1 - s1) * -700}px 0`, filter: `blur(${(1 - s1) * 10}px)` }}>
          LESS SETUP WEIGHT
        </div>
        <Arrow at={A1} />
        <div style={{ fontSize: 124, display: "flex", whiteSpace: "pre" }}>
          {s2Text.split("").map((ch, i) => {
            const p = interpolate(frame, [S2 + i * 0.8, S2 + i * 0.8 + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, translate: `0 ${(1 - p) * 90}px` }}>
                {ch}
              </span>
            );
          })}
        </div>
        <Arrow at={A2} />
        <div
          style={{
            fontSize: 148,
            color: COLORS.red,
            opacity: s3,
            scale: String(interpolate(s3, [0, 1], [2, 1]) * punch(frame, S3 + 7, 0.08, 2, 8)),
            filter: `blur(${(1 - s3) * 12}px)`,
            textShadow: "0 0 40px rgba(227,16,27,0.45)",
          }}
        >
          MORE LOAD OPTIONS
        </div>
      </AbsoluteFill>

      <Sfx at={S1 - 2} name="whoosh-fast" volume={0.26} />
      <Sfx at={A1} name="tick" volume={0.22} />
      <Sfx at={S2} name="whoosh-soft" volume={0.22} />
      <Sfx at={A2} name="tick" volume={0.22} />
      <Sfx at={S3 + 3} name="bass-hit" volume={0.42} />
    </AbsoluteFill>
  );
};
