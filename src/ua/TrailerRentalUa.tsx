import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fonts";
import { DURATION_IN_FRAMES, FPS, SCENES, sceneLength, type SceneName } from "./timeline";
import { Flash } from "../v3/components/Flash";
import { HookScene } from "./scenes/HookScene";
import { ModificationScene } from "./scenes/ModificationScene";
import { RevealScene } from "./scenes/RevealScene";
import { CompareScene } from "./scenes/CompareScene";
import { CapacityScene } from "./scenes/CapacityScene";
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
    <Scene name="compare">
      <CompareScene />
    </Scene>
    <Scene name="capacity">
      <CapacityScene />
    </Scene>
    <Scene name="cta">
      <CtaScene />
    </Scene>

    {/* Hard cuts into the reveal and the comparison; hook→production and
        capacity→CTA use whip-pans inside the scenes. */}
    {[SCENES.reveal.from, SCENES.compare.from].map((at) => (
      <Flash key={at} at={at} strength={0.55} />
    ))}

    <Audio src={staticFile("ua/voiceover.mp3")} volume={1} />
  </AbsoluteFill>
);

export const TrailerRentalUaComposition: React.FC = () => (
  <Composition id="TrailerRentalUA" component={TrailerRentalUaAd} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1080} height={1920} />
);
