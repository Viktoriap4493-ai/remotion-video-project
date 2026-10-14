import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AccentLine, Clip, PopIn, SAFE, Shade, TEXT_SHADOW, textBase } from "../components";
import { COLORS, EASE_IN, beat, progress, sceneLength, sceneStart, sec } from "../theme";

const S = sceneStart("hook");
const LEN = sceneLength("hook");

// 0:00–0:03 — open straight on the push-in toward the face with the handpiece working.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Fast push-in on the first half second, then a slow drift; zoom-blur into the flash at the end.
  const push = progress(frame, 0, sec(0.5));
  const exit = progress(frame, LEN - 5, 5, EASE_IN);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill
        style={{
          scale: String(1 + push * 0.1 + exit * 0.12),
          filter: `blur(${exit * 6}px)`,
        }}
      >
        <Clip name="1197" from={0} to={LEN} trim={8.6} zoom={[1.0, 1.08]} origin="45% 60%" />
      </AbsoluteFill>
      <Shade from="top" height={1050} strength={0.82} />

      <AbsoluteFill
        style={{
          top: SAFE.top + 30,
          alignItems: "center",
          ...textBase,
          fontWeight: 800,
          textAlign: "center",
          textShadow: TEXT_SHADOW,
        }}
      >
        <PopIn at={beat("hookLine1") - S} style={{ fontSize: 92, letterSpacing: "0.01em" }}>
          БЕЗОПЕРАЦІЙНА
        </PopIn>
        <PopIn at={beat("hookLine2") - S} style={{ fontSize: 148, color: COLORS.yellow, marginTop: 6 }}>
          ПІДТЯЖКА
        </PopIn>
        <AccentLine
          at={beat("hookUnderline") - S}
          width={560}
          thickness={8}
          align="center"
          style={{ marginTop: 10, marginBottom: 18 }}
        />
        <PopIn at={beat("hookLine3") - S} style={{ fontSize: 124 }}>
          ОБЛИЧЧЯ
        </PopIn>
      </AbsoluteFill>

      {/* Subtle brightening as the rising sweep builds toward the flash. */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.white,
          opacity: interpolate(frame, [beat("hookRiserStart") - S, LEN], [0, 0.12], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
