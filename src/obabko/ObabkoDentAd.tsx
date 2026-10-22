import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CASES, COLORS, PATHS, SCENES, TREATMENT_SCENES, WIPE, s } from "./config";
import { AudioTimeline } from "./components/AudioTimeline";
import { BeforeAfterWipe } from "./components/BeforeAfterWipe";
import { BrandEndCard } from "./components/BrandEndCard";
import { IntroHeadline } from "./components/IntroHeadline";
import { IntroToothMascot } from "./components/IntroToothMascot";
import { ResultsMontage } from "./components/ResultsMontage";
import { TreatmentLabel } from "./components/TreatmentLabel";
import { easeInOut, progress } from "./components/anim";
import "./fonts";

const LINE_Y = 1260;
const CARD_CENTER_Y = 930;

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dot = progress(frame, 0, 4);
  const draw = progress(frame, 3, 11, easeInOut);
  const retract = progress(frame, 73, 85, easeInOut);
  const out = progress(frame, 97, 105, easeInOut);

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      {/* graphite dot → red line */}
      <div
        style={{
          position: "absolute",
          left: 540 - 9,
          top: LINE_Y - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: COLORS.graphite,
          opacity: dot * (1 - draw),
          transform: `scale(${interpolate(dot, [0, 1], [0.2, 1.3])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 130,
          width: 820,
          top: LINE_Y - 3,
          height: 6,
          borderRadius: 3,
          background: COLORS.brand,
          clipPath: `inset(0 ${(1 - draw) * 100}% 0 ${retract * 100}%)`,
        }}
      />
      <IntroToothMascot lineY={LINE_Y} />
      {/* Slogan appears with the jump and stays until the hand-off (~3 s to read) */}
      <IntroHeadline top={1320} at={12} underlineAt={28} recedeAt={97} />
      {/* hand-off: light panel with a red edge sweeps in */}
      <div style={{ position: "absolute", inset: 0, background: COLORS.light, clipPath: `inset(0 ${(1 - out) * 100}% 0 0)` }} />
      {out > 0 && out < 1 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${out * 100}% - 3px)`, width: 6, background: COLORS.brand }} />
      ) : null}
    </AbsoluteFill>
  );
};

const SmallLogo: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
    <Img src={staticFile(PATHS.logo)} style={{ width: 400, height: "auto" }} />
  </div>
);

const TreatmentScene: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const scene = TREATMENT_SCENES[index];
  const item = CASES[scene.caseId];
  const { from, to } = SCENES[scene.key];
  const length = s(to - from);
  const exitAt = length - 8;
  const top = CARD_CENTER_Y - item.height / 2;
  const logoIn = index === 0 ? progress(frame, 0, 10) : 1;
  return (
    <AbsoluteFill style={{ background: COLORS.light }}>
      <div style={{ opacity: logoIn }}>
        <SmallLogo />
      </div>
      <BeforeAfterWipe
        item={item}
        left={(1080 - item.width) / 2}
        top={top}
        {...WIPE}
        zoomEnd={length}
        exitAt={exitAt}
      />
      <TreatmentLabel
        text={scene.label}
        accent={scene.accent}
        top={Math.max(top + item.height + 60, 1430)}
        at={WIPE.label}
        exitAt={exitAt}
        weight={scene.accent ? 800 : undefined}
      />
    </AbsoluteFill>
  );
};

const MontageScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.light }}>
      <SmallLogo />
      <ResultsMontage cardCenterY={CARD_CENTER_Y} labelTop={1430} />
    </AbsoluteFill>
  );
};

export const ObabkoDentAd: React.FC = () => {
  const seq = (key: keyof typeof SCENES) => ({
    from: s(SCENES[key].from),
    durationInFrames: s(SCENES[key].to) - s(SCENES[key].from),
  });
  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      <Sequence {...seq("intro")} name="1 Intro: tooth + headline">
        <IntroScene />
      </Sequence>
      {TREATMENT_SCENES.map((scene, i) => (
        <Sequence key={scene.key} {...seq(scene.key)} name={`${i + 2} ${scene.label}`}>
          <TreatmentScene index={i} />
        </Sequence>
      ))}
      <Sequence {...seq("montage")} name="5 Results montage">
        <MontageScene />
      </Sequence>
      <Sequence {...seq("endCard")} name="6 End card">
        <BrandEndCard />
      </Sequence>
      <AudioTimeline />
    </AbsoluteFill>
  );
};
