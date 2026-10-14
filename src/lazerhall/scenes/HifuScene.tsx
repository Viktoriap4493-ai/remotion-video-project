import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AccentLine, Clip, Shade, SlideIn, TEXT_SHADOW, Yellow, plaqueStyle, textBase } from "../components";
import { COLORS, EASE_IN, beat, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("hifu");
const LEN = sceneLength("hifu");

// 0:06–0:09.5 — the device screen, the handpiece close-up, then the procedure itself.
export const HifuScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cut2 = beat("hifuCut2") - S;
  const cut3 = beat("hifuCut3") - S;
  // Smooth zoom transition out into the benefits block.
  const exit = progress(frame, LEN - 6, 6, EASE_IN);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <AbsoluteFill style={{ scale: String(1 + exit * 0.25), filter: `blur(${exit * 10}px)` }}>
        {/* Push-in on the device screen with the 3D handpiece model. */}
        <Clip name="1188" from={0} to={cut2 + 4} trim={5.5} zoom={[1.08, 1.28]} origin="60% 30%" />
        {/* Close-up of the handpiece cartridge, slow pull-back. */}
        <Clip name="1211" from={cut2} to={cut3 + 4} trim={0.2} zoom={[1.18, 1.04]} origin="35% 30%" fadeIn={4} />
        {/* The procedure under the chin. */}
        <Clip name="1176" from={cut3} to={LEN} trim={0.8} zoom={[1.0, 1.08]} origin="40% 45%" fadeIn={4} />
      </AbsoluteFill>
      <Shade from="bottom" height={1080} strength={0.92} />

      <AbsoluteFill
        style={{
          top: 1010,
          left: 60,
          right: 60,
          width: "auto",
          ...textBase,
          textShadow: TEXT_SHADOW,
        }}
      >
        <SlideIn at={beat("hifuTitle") - S}>
          <div style={{ fontSize: 88, fontWeight: 800 }}>ЛІФТИНГ</div>
          <div style={{ fontSize: 88, fontWeight: 800 }}>БЕЗ ОПЕРАЦІЇ</div>
        </SlideIn>
        <AccentLine at={beat("hifuLine") - S} width={240} style={{ marginTop: 20, marginBottom: 24 }} />
        <SlideIn at={beat("hifuPlaque") - S} distance={60}>
          <div style={{ ...plaqueStyle, fontSize: 44, fontWeight: 700, lineHeight: 1.22, textShadow: "none" }}>
            Працюємо на ультрасучасному апараті з технологією{" "}
            <Yellow style={{ fontWeight: 800 }}>HIFU 7D</Yellow>
          </div>
        </SlideIn>
        <SlideIn at={beat("hifuInfo") - S} distance={40} style={{ marginTop: 22 }}>
          <div style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.3, opacity: 0.94, paddingLeft: 4 }}>
            Сфокусований ультразвук для роботи з тканинами на заданій глибині
          </div>
        </SlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
