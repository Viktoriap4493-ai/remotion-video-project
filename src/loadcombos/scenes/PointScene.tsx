import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_BACK, EASE_OUT, punch } from "../anim";
import { BEBAS } from "../fonts";
import { BlueprintBackground } from "../components/BlueprintBackground";
import { MaskReveal } from "../components/MaskReveal";
import { Sfx } from "../components/Sfx";

const BANNER = 3;
const LINES = [
  { text: "DIFFERENT VEHICLES.", at: 26 },
  { text: "DIFFERENT LOADS.", at: 46 },
];
const FINAL_LINE = 68;

export const PointScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [BANNER, BANNER + 9], [-420, 0], { ...CLAMP, easing: EASE_BACK });
  const shake = frame >= BANNER + 8 && frame < BANNER + 14 ? Math.sin(frame * 3.1) * (BANNER + 14 - frame) * 1.6 : 0;
  const finalIn = interpolate(frame, [FINAL_LINE, FINAL_LINE + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <BlueprintBackground trimBefore={30} />
      <AbsoluteFill style={{ translate: `0 ${shake}px` }}>
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 60,
            right: 60,
            height: 230,
            translate: `0 ${drop}px`,
            background: `linear-gradient(180deg, #F0262E 0%, ${COLORS.red} 60%, #BF0912 100%)`,
            borderRadius: 18,
            boxShadow: "0 22px 50px rgba(150,0,10,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: BEBAS,
            fontSize: 210,
            lineHeight: 1,
            paddingTop: 16,
            color: COLORS.white,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ display: "inline-block", scale: String(punch(frame, BANNER + 9, 0.08, 2, 8)) }}>
            UNDER 26K
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 640,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 34,
            fontFamily: BEBAS,
            color: COLORS.navy,
            lineHeight: 1,
          }}
        >
          {LINES.map((l) => (
            <MaskReveal key={l.text} start={l.at} duration={9} from="left">
              <div style={{ fontSize: 138 }}>{l.text}</div>
            </MaskReveal>
          ))}
          <div
            style={{
              marginTop: 40,
              fontSize: 160,
              color: COLORS.red,
              opacity: finalIn,
              scale: String(interpolate(finalIn, [0, 1], [1.5, 1]) * punch(frame, FINAL_LINE + 7, 0.1, 2, 8)),
              filter: `blur(${(1 - finalIn) * 10}px)`,
            }}
          >
            ONE LIGHTER SETUP.
          </div>
          <div
            style={{
              width: interpolate(frame, [FINAL_LINE + 6, FINAL_LINE + 18], [0, 640], { ...CLAMP, easing: EASE_OUT }),
              height: 10,
              marginTop: -18,
              background: COLORS.navy,
            }}
          />
        </div>
      </AbsoluteFill>

      <Sfx at={BANNER + 7} name="impact-strong" volume={0.42} />
      {LINES.map((l) => (
        <Sfx key={l.text} at={l.at - 2} name="whoosh-fast" volume={0.26} />
      ))}
      <Sfx at={FINAL_LINE + 2} name="bass-hit" volume={0.46} />
    </AbsoluteFill>
  );
};
