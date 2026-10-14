import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clip, SAFE, SlideIn, Yellow, textBase } from "../components";
import { COLORS, EASE_OUT, beat, bounce, mix, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("cta");
const LEN = sceneLength("cta");

const CTA_SHADOW = "0 3px 16px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.6)";

// 0:24–0:27 — call to action set directly over a clear, full-screen shot of the procedure.
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 7, EASE_OUT);
  const bodyAt = beat("ctaBody") - S;
  const smasAt = beat("ctaSmas") - S;
  const smas = bounce(frame, smasAt);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill style={{ translate: `0px ${(1 - enter) * -200}px`, filter: `blur(${(1 - enter) * 16}px)` }}>
        <Clip name="1197" from={0} to={LEN} trim={0.4} zoom={[1.0, 1.06]} origin="50% 40%" />
      </AbsoluteFill>
      {/* Gentle neutral darkening behind the text band only; the footage stays clear and full-frame. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.1) 85%)",
        }}
      />

      <AbsoluteFill
        style={{
          top: 560,
          left: SAFE.right,
          right: SAFE.right,
          width: "auto",
          alignItems: "center",
          ...textBase,
          textAlign: "center",
          textShadow: CTA_SHADOW,
        }}
      >
        <SlideIn at={beat("ctaTitle") - S} direction="up" distance={100} frames={12}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.12 }}>ХОЧЕТЕ ДІЗНАТИСЯ</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.12 }}>БІЛЬШЕ?</div>
        </SlideIn>

        <div style={{ marginTop: 70 }}>
          {["Щоб записатися на процедуру", "та отримати консультацію,"].map((line, i) => (
            <SlideIn key={line} at={bodyAt + i * 3} direction="up" distance={30} frames={9}>
              <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.3 }}>{line}</div>
            </SlideIn>
          ))}
          <SlideIn at={bodyAt + 6} direction="up" distance={30} frames={9} style={{ marginTop: 10 }}>
            <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.25, whiteSpace: "nowrap" }}>
              пишіть <Yellow>«</Yellow>
              <Yellow
                style={{
                  display: "inline-block",
                  scale: String(frame >= smasAt ? mix(smas, 1.0, 1.1) : 1),
                  textShadow: `0 0 26px rgba(255,216,77,0.45), ${CTA_SHADOW}`,
                }}
              >
                SMAS
              </Yellow>
              <Yellow>»</Yellow> у Direct
            </div>
          </SlideIn>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
