import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Clip, PopIn, SlideIn, TEXT_SHADOW, textBase } from "../components";
import { COLORS, EASE_IN, EASE_OUT, WIPE_FRAMES, beat, bounce, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("results");
const LEN = sceneLength("results");

// Two blocks side by side, kept inside the Reels/Stories safe width (clear of the right-hand buttons).
const BLOCK_WIDTH = 410;
const BLOCK_GAP = 20;

// Both source photos are the clinic's own before|after collages (before on the left, in the cap).
// Each half is shown in its own block by cropping only — no scaling distortion, no retouching.
const PAIRS = [
  {
    src: "lazerhall/images/before-after-front.png",
    width: 480,
    height: 480,
    split: 240,
    in: beat("pair1In") - S,
    wipe: beat("pair1Wipe") - S,
  },
  {
    src: "lazerhall/images/before-after-profile.jpg",
    width: 1122,
    height: 1195,
    split: 561,
    in: beat("pair2In") - S,
    wipe: beat("pair2Wipe") - S,
  },
];

// 0:13–0:18 — real before/after photos over a lightly blurred shot of the procedure.
export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Smooth cross-dissolve with a gentle settle-in from the benefits block underneath.
  const enter = progress(frame, 0, 12, EASE_OUT);

  return (
    <AbsoluteFill
      style={{
        opacity: enter,
        scale: String(1.06 - enter * 0.06),
        filter: `blur(${(1 - enter) * 8}px)`,
      }}
    >
      <Clip name="1175" from={0} to={LEN} trim={0.6} zoom={[1.04, 1.1]} origin="50% 45%" blur={7} />
      {/* Light neutral darkening only, so the procedure stays recognizable and the photos lead. */}
      <AbsoluteFill style={{ backgroundColor: "rgba(8,10,18,0.28)" }} />
      <AbsoluteFill
        style={{
          height: 640,
          background: "linear-gradient(180deg, rgba(8,10,18,0.55) 0%, rgba(8,10,18,0) 100%)",
        }}
      />

      <AbsoluteFill style={{ top: 280, alignItems: "center", ...textBase, textAlign: "center", textShadow: TEXT_SHADOW }}>
        <PopIn at={beat("resultsTitle") - S} style={{ fontSize: 66, fontWeight: 800 }}>
          РЕЗУЛЬТАТ, ЯКИЙ
        </PopIn>
        <PopIn at={beat("resultsTitle") - S + 4} style={{ fontSize: 66, fontWeight: 800, color: COLORS.yellow, marginTop: 6 }}>
          ВАРТО ПОБАЧИТИ
        </PopIn>
        <SlideIn at={beat("resultsSubtitle") - S} direction="up" distance={24} style={{ marginTop: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 500 }}>Фото до та після процедури</div>
        </SlideIn>
      </AbsoluteFill>

      {PAIRS.map((pair, i) => {
        const next = PAIRS[i + 1];
        return <PhotoPair key={pair.src} {...pair} inAt={pair.in} wipeAt={pair.wipe} outAt={next ? next.in - 5 : null} />;
      })}
    </AbsoluteFill>
  );
};

const PhotoPair: React.FC<{
  src: string;
  width: number;
  height: number;
  split: number;
  inAt: number;
  wipeAt: number;
  outAt: number | null;
}> = ({ src, width, height, split, inAt, wipeAt, outAt }) => {
  const frame = useCurrentFrame();
  if (frame < inAt - 1 || (outAt !== null && frame > outAt + 6)) {
    return null;
  }
  const enter = progress(frame, inAt, 10, EASE_OUT);
  const exit = outAt === null ? 0 : progress(frame, outAt, 6, EASE_IN);
  const wipe = progress(frame, wipeAt, WIPE_FRAMES, EASE_OUT);
  const afterPop = bounce(frame, wipeAt + WIPE_FRAMES - 2);
  const beforePop = bounce(frame, inAt + 4);

  // Uniform scale so the block is BLOCK_WIDTH wide for the wider of the two halves.
  const scale = BLOCK_WIDTH / Math.max(split, width - split);
  const blockHeight = Math.round(height * scale);

  return (
    <AbsoluteFill style={{ top: 560, alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          gap: BLOCK_GAP,
          translate: `${-exit * 700}px ${(1 - enter) * 120}px`,
          opacity: Math.min(enter * 1.6, 1) * (1 - exit),
          filter: `blur(${(1 - enter) * 10 + exit * 14}px)`,
        }}
      >
        <PhotoHalf src={src} width={width} height={blockHeight} scale={scale} offset={0} visibleWidth={split} label="ДО" labelScale={beforePop} />
        <PhotoHalf
          src={src}
          width={width}
          height={blockHeight}
          scale={scale}
          offset={split}
          visibleWidth={width - split}
          label="ПІСЛЯ"
          labelScale={wipe > 0.6 ? afterPop : 0}
          highlight
          reveal={wipe}
        />
      </div>
    </AbsoluteFill>
  );
};

/** One half of a before|after collage, cropped (never stretched) into its own block. */
const PhotoHalf: React.FC<{
  src: string;
  width: number;
  height: number;
  scale: number;
  offset: number;
  visibleWidth: number;
  label: string;
  labelScale: number;
  highlight?: boolean;
  reveal?: number;
}> = ({ src, width, height, scale, offset, visibleWidth, label, labelScale, highlight, reveal = 1 }) => (
  <div
    style={{
      position: "relative",
      width: BLOCK_WIDTH,
      height,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 18px 44px rgba(0,0,0,0.38), 0 2px 8px rgba(0,0,0,0.25)",
      // Vertical wipe: the "after" photo is uncovered top → bottom; no coloured panel over it.
      clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0 round 18px)`,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: width * scale,
        height: height,
        left: -offset * scale + (BLOCK_WIDTH - visibleWidth * scale) / 2,
        top: 0,
        maxWidth: "none",
      }}
    />
    {reveal > 0 && reveal < 1 ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `calc(${reveal * 100}% - 6px)`,
          height: 6,
          background: COLORS.yellow,
          boxShadow: "0 0 22px rgba(255,216,77,0.8)",
        }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        ...textBase,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "0.04em",
        padding: "8px 18px",
        borderRadius: 10,
        background: highlight ? COLORS.yellow : COLORS.white,
        color: COLORS.navy,
        scale: String(Math.max(labelScale, 0)),
        transformOrigin: "left bottom",
        boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
      }}
    >
      {label}
    </div>
  </div>
);
