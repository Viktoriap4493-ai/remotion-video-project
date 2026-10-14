import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Clip, PopIn, SAFE, Shade, SlideIn, TEXT_SHADOW, plaqueStyle, textBase } from "../components";
import { COLORS, EASE_OUT, beat, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("benefits");
const LEN = sceneLength("benefits");
// Frames the scene keeps playing underneath the before/after dissolve.
export const BENEFITS_TAIL = 12;

const BENEFITS = [
  { text: "Чіткіший овал обличчя", at: beat("benefit1") - S },
  { text: "Виразніші вилиці та контур підборіддя", at: beat("benefit2") - S },
  { text: "Робота зі зморшками й провисаннями", at: beat("benefit3") - S },
];

// 0:09.5–0:13 — benefits, one at a time, over changing shots.
export const BenefitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cut2 = beat("benefitsCut2") - S;
  // Enters from the zoom transition; the before/after block dissolves in over it at the end.
  const enter = progress(frame, 0, 7, EASE_OUT);
  const whip = progress(frame, cut2, 5, EASE_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill style={{ scale: String(1.25 - enter * 0.25), filter: `blur(${(1 - enter) * 10}px)` }}>
        <Clip name="1198" from={0} to={cut2} trim={0.3} zoom={[1.0, 1.1]} origin="55% 45%" />
      </AbsoluteFill>
      {/* Whip-pan style entry on the second shot. */}
      <AbsoluteFill style={{ translate: `${(1 - whip) * 260}px 0px`, filter: `blur(${(1 - whip) * 16}px)` }}>
        <Clip name="1174" from={cut2} to={LEN + BENEFITS_TAIL} trim={0.4} zoom={[1.12, 1.2]} origin="30% 45%" />
      </AbsoluteFill>
      <Shade from="top" height={760} strength={0.85} />
      <Shade from="bottom" height={960} strength={0.85} />

      <AbsoluteFill
        style={{ top: 300, alignItems: "center", ...textBase, fontWeight: 800, textShadow: TEXT_SHADOW }}
      >
        <PopIn at={beat("benefitsTitle1") - S} style={{ fontSize: 84 }}>
          ЧІТКІШИЙ КОНТУР.
        </PopIn>
        <PopIn at={beat("benefitsTitle2") - S} style={{ fontSize: 84, color: COLORS.yellow, marginTop: 10 }}>
          ВИРАЗНІШИЙ ОВАЛ.
        </PopIn>
      </AbsoluteFill>

      <AbsoluteFill style={{ top: 1110, left: 60, right: SAFE.right, width: "auto", gap: 22, ...textBase }}>
        {BENEFITS.map((b) => (
          <SlideIn key={b.text} at={b.at} distance={120}>
            <div
              style={{
                ...plaqueStyle,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "24px 30px",
                fontSize: 37,
                fontWeight: 700,
              }}
            >
              <Marker at={b.at} />
              {b.text}
            </div>
          </SlideIn>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Marker: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at + 3, 8, EASE_OUT);
  return (
    <div
      style={{
        flex: "0 0 auto",
        width: 18,
        height: 46,
        borderRadius: 6,
        background: COLORS.yellow,
        transformOrigin: "center bottom",
        scale: `1 ${p}`,
        boxShadow: "0 0 16px rgba(255,216,77,0.5)",
      }}
    />
  );
};
