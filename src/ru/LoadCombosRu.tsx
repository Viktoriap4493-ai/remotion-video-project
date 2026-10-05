import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fonts";
import { DURATION_IN_FRAMES, FPS, SCENES, sceneLength, type SceneName } from "./timeline";
import { Slices } from "./components/Slices";
import { HookScene } from "./scenes/HookScene";
import { SetupScene } from "./scenes/SetupScene";
import { Load2Scene } from "./scenes/Load2Scene";
import { Load3Scene } from "./scenes/Load3Scene";
import { Load1Scene } from "./scenes/Load1Scene";
import { LimitScene } from "./scenes/LimitScene";
import { PointScene } from "./scenes/PointScene";
import { AllLoadsScene } from "./scenes/AllLoadsScene";
import { CtaScene } from "./scenes/CtaScene";

const Scene: React.FC<{ name: SceneName; children: React.ReactNode }> = ({ name, children }) => (
  <Sequence name={name} from={SCENES[name].from} durationInFrames={sceneLength(name)} premountFor={30}>
    {children}
  </Sequence>
);

// Russian version: same source assets as LoadCombos, new storyboard —
// loads run #2 → #3 → #1 and every scene has its own mechanic.
const LoadCombosRuAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Scene name="hook">
      <HookScene />
    </Scene>
    <Scene name="setup">
      <SetupScene />
    </Scene>
    <Scene name="load2">
      <Load2Scene />
    </Scene>
    <Scene name="load3">
      <Load3Scene />
    </Scene>
    <Scene name="load1">
      <Load1Scene />
    </Scene>
    <Scene name="limit">
      <LimitScene />
    </Scene>
    <Scene name="point">
      <PointScene />
    </Scene>
    <Scene name="allLoads">
      <AllLoadsScene />
    </Scene>
    <Scene name="cta">
      <CtaScene />
    </Scene>

    {[SCENES.load2.from, SCENES.load3.from, SCENES.load1.from, SCENES.limit.from, SCENES.cta.from].map((at) => (
      <Slices key={at} at={at} />
    ))}

    <Audio src={staticFile("ru/voiceover-ru.mp3")} volume={0.85} />
  </AbsoluteFill>
);

export const LoadCombosRuComposition: React.FC = () => (
  <Composition
    id="LoadCombosRU"
    component={LoadCombosRuAd}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
