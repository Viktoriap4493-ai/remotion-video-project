import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { AccentLine, Clip, PopIn, SlideIn, TEXT_SHADOW, textBase } from "../components";
import { COLORS, EASE_IN, EASE_OUT, WIPE_FRAMES, beat, bounce, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("results");
const LEN = sceneLength("results");
const CARD_WIDTH = 900;

// Both photos are the clinic's own before|after collages (before on the left, in the cap).
// They are shown untouched; the "after" half is only revealed by a vertical wipe.
const PAIRS = [
  { src: "lazerhall/images/before-after-front.png", aspect: 480 / 480, in: beat("pair1In") - S, wipe: beat("pair1Wipe") - S },
  { src: "lazerhall/images/before-after-profile.jpg", aspect: 1122 / 1195, in: beat("pair2In") - S, wipe: beat("pair2Wipe") - S },
];

// 0:13–0:18 — real before/after photos on a blurred, navy-tinted procedure shot.
export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 7, EASE_OUT);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.navy,
        translate: `${(1 - enter) * 360}px 0px`,
        filter: `blur(${(1 - enter) * 14}px)`,
      }}
    >
      <Clip name="1198" from={0} to={LEN} trim={2.5} zoom={[1.2, 1.28]} blur={26} />
      <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.74)" }} />

      <AbsoluteFill style={{ top: 280, alignItems: "center", ...textBase, textAlign: "center", textShadow: TEXT_SHADOW }}>
        <PopIn at={beat("resultsTitle") - S} style={{ fontSize: 66, fontWeight: 800 }}>
          РЕЗУЛЬТАТ, ЯКИЙ
        </PopIn>
        <PopIn at={beat("resultsTitle") - S + 4} style={{ fontSize: 66, fontWeight: 800, color: COLORS.yellow, marginTop: 6 }}>
          ВАРТО ПОБАЧИТИ
        </PopIn>
        <SlideIn at={beat("resultsSubtitle") - S} direction="up" distance={24} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 400, opacity: 0.92 }}>Фото до та після процедури</div>
        </SlideIn>
      </AbsoluteFill>

      {PAIRS.map((pair, i) => {
        const next = PAIRS[i + 1];
        return (
          <PhotoPair
            key={pair.src}
            src={pair.src}
            aspect={pair.aspect}
            inAt={pair.in}
            wipeAt={pair.wipe}
            outAt={next ? next.in - 5 : null}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const PhotoPair: React.FC<{
  src: string;
  aspect: number;
  inAt: number;
  wipeAt: number;
  outAt: number | null;
}> = ({ src, aspect, inAt, wipeAt, outAt }) => {
  const frame = useCurrentFrame();
  if (frame < inAt - 1 || (outAt !== null && frame > outAt + 6)) {
    return null;
  }
  const height = CARD_WIDTH / aspect;
  const enter = progress(frame, inAt, 9, EASE_OUT);
  const exit = outAt === null ? 0 : progress(frame, outAt, 6, EASE_IN);
  const wipe = progress(frame, wipeAt, WIPE_FRAMES, EASE_OUT);
  const afterPop = bounce(frame, wipeAt + WIPE_FRAMES - 2);
  const beforePop = bounce(frame, inAt + 4);

  return (
    <AbsoluteFill style={{ top: 560, alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: CARD_WIDTH,
          height,
          borderRadius: 22,
          overflow: "hidden",
          border: `4px solid ${COLORS.yellow}`,
          boxShadow: "0 30px 70px rgba(2,10,36,0.6)",
          translate: `${-exit * 700}px ${(1 - enter) * 160}px`,
          opacity: Math.min(enter * 1.6, 1) * (1 - exit),
          filter: `blur(${(1 - enter) * 10 + exit * 14}px)`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* Cover over the "after" half, wiped away top→bottom with a yellow leading edge. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            right: 0,
            top: `${wipe * 100}%`,
            bottom: 0,
            background: COLORS.navy,
            opacity: wipe >= 1 ? 0 : 1,
          }}
        >
          <div style={{ height: 8, background: COLORS.yellow, boxShadow: "0 0 26px rgba(255,216,77,0.8)", opacity: wipe > 0 ? 1 : 0 }} />
        </div>
        {/* Thin divider between the halves. */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, marginLeft: -1.5, background: "rgba(255,255,255,0.55)" }} />

        <Label text="ДО" side="left" scale={beforePop} />
        <Label text="ПІСЛЯ" side="right" scale={wipe > 0.6 ? afterPop : 0} highlight />
      </div>
      <AccentLine at={inAt + 6} width={180} align="center" style={{ marginTop: 26, opacity: 1 - exit }} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; side: "left" | "right"; scale: number; highlight?: boolean }> = ({
  text,
  side,
  scale,
  highlight,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 26,
      left: side === "left" ? 24 : "calc(50% + 24px)",
      ...textBase,
      fontSize: 40,
      fontWeight: 800,
      letterSpacing: "0.04em",
      padding: "12px 24px",
      borderRadius: 12,
      background: highlight ? COLORS.yellow : COLORS.navy,
      color: highlight ? COLORS.navy : COLORS.white,
      scale: String(Math.max(scale, 0)),
      transformOrigin: "left bottom",
      boxShadow: "0 10px 26px rgba(2,10,36,0.45)",
    }}
  >
    {text}
  </div>
);
