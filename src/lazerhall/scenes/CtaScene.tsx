import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clip, SlideIn, TEXT_SHADOW, Yellow, plaqueStyle, textBase } from "../components";
import { COLORS, EASE_OUT, beat, bounce, mix, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("cta");
const LEN = sceneLength("cta");

const BODY_LINES = ["ЩОБ ЗАПИСАТИСЯ", "НА ПРОЦЕДУРУ ТА ОТРИМАТИ", "КОНСУЛЬТАЦІЮ, ПИШІТЬ"];

// 0:24–0:27 — call to action: write "SMAS" in Direct.
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 7, EASE_OUT);
  const bodyAt = beat("ctaBody") - S;
  const smasAt = beat("ctaSmas") - S;
  const plaque = progress(frame, bodyAt - 2, 10, EASE_OUT);
  const smas = bounce(frame, smasAt);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill style={{ translate: `0px ${(1 - enter) * -200}px`, filter: `blur(${(1 - enter) * 16}px)` }}>
        <Clip name="1197" from={0} to={LEN} trim={0.4} zoom={[1.05, 1.14]} origin="50% 40%" blur={3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.72)" }} />

      <AbsoluteFill style={{ alignItems: "center", ...textBase, textAlign: "center" }}>
        <SlideIn at={beat("ctaTitle") - S} direction="up" distance={120} frames={12} style={{ marginTop: 360, textShadow: TEXT_SHADOW }}>
          <div style={{ fontSize: 80, fontWeight: 800 }}>ХОЧЕТЕ ДІЗНАТИСЯ</div>
          <div style={{ fontSize: 80, fontWeight: 800, marginTop: 8 }}>БІЛЬШЕ?</div>
        </SlideIn>

        <div
          style={{
            ...plaqueStyle,
            marginTop: 70,
            width: 960,
            padding: "50px 40px 56px",
            border: `3px solid ${COLORS.yellow}`,
            borderRadius: 22,
            opacity: plaque,
            translate: `0px ${(1 - plaque) * 60}px`,
          }}
        >
          {BODY_LINES.map((line, i) => (
            <SlideIn key={line} at={bodyAt + i * 3} direction="up" distance={36} frames={9}>
              <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.18 }}>{line}</div>
            </SlideIn>
          ))}
          <SlideIn at={bodyAt + 9} direction="up" distance={36} frames={9} style={{ marginTop: 18 }}>
            <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>
              <Yellow>«</Yellow>
              <Yellow
                style={{
                  display: "inline-block",
                  scale: String(frame >= smasAt ? mix(smas, 1.0, 1.12) : 1),
                  textShadow: "0 0 34px rgba(255,216,77,0.5)",
                }}
              >
                SMAS
              </Yellow>
              <Yellow>»</Yellow> У DIRECT
            </div>
          </SlideIn>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
