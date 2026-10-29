import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fonts";
import { CTA_VO_TRIM, DURATION_IN_FRAMES, FPS, MIDDLE_VO_AT, ORIGINAL_VO_CUT, SCENES, WEIGHT_VO_AT, sceneLength, type SceneName } from "./timeline";
import { Flash } from "../v3/components/Flash";
import { HookScene } from "./scenes/HookScene";
import { ModificationScene } from "./scenes/ModificationScene";
import { RevealScene } from "./scenes/RevealScene";
import { SetupScene } from "./scenes/SetupScene";
import { ReserveScene } from "./scenes/ReserveScene";
import { CapacityScene } from "./scenes/CapacityScene";
import { OptionsScene } from "./scenes/OptionsScene";
import { CtaScene } from "./scenes/CtaScene";

const Scene: React.FC<{ name: SceneName; children: React.ReactNode }> = ({ name, children }) => (
  <Sequence name={name} from={SCENES[name].from} durationInFrames={sceneLength(name)} premountFor={30}>
    {children}
  </Sequence>
);

// Ukrainian Drive4USA trailer-rental ad (rental of the TRAILER only).
const TrailerRentalUaAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Scene name="hook">
      <HookScene />
    </Scene>
    <Scene name="modification">
      <ModificationScene />
    </Scene>
    <Scene name="reveal">
      <RevealScene />
    </Scene>
    <Scene name="setup">
      <SetupScene />
    </Scene>
    <Scene name="reserve">
      <ReserveScene />
    </Scene>
    <Scene name="options">
      <OptionsScene />
    </Scene>
    <Scene name="capacity">
      <CapacityScene />
    </Scene>
    <Scene name="cta">
      <CtaScene />
    </Scene>

    {/* Hard cuts into the reveal and into the setup comparison; the other
        joins use whip-pans or wipes inside the scenes. */}
    {[SCENES.reveal.from, SCENES.setup.from].map((at) => (
      <Flash key={at} at={at} strength={0.55} />
    ))}

    {/* Original voiceover up to the production line, the 4 760 line, the new
        middle take, and the original voiceover again for the CTA. */}
    <Sequence durationInFrames={ORIGINAL_VO_CUT} layout="none">
      <Audio src={staticFile("ua/voiceover.mp3")} volume={1} />
    </Sequence>
    <Sequence from={WEIGHT_VO_AT} durationInFrames={SCENES.setup.from - WEIGHT_VO_AT} layout="none">
      <Audio src={staticFile("ua/voiceover-weight-4760.wav")} volume={1.2} />
    </Sequence>
    <Sequence from={MIDDLE_VO_AT} durationInFrames={SCENES.cta.from - MIDDLE_VO_AT} layout="none">
      <Audio src={staticFile("ua/voiceover-setup-middle.wav")} volume={1.2} />
    </Sequence>
    <Sequence from={SCENES.cta.from} layout="none">
      <Audio src={staticFile("ua/voiceover.mp3")} trimBefore={CTA_VO_TRIM} volume={1} />
    </Sequence>
  </AbsoluteFill>
);

export const TrailerRentalUaComposition: React.FC = () => (
  <Composition id="TrailerRentalUA" component={TrailerRentalUaAd} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1080} height={1920} />
);
