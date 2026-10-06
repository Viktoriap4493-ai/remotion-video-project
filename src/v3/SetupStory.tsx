import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "../loadcombos/fonts";
import { DURATION_IN_FRAMES, FPS, SCENES, sceneLength, type SceneName } from "./timeline";
import { Flash } from "./components/Flash";
import { HookScene } from "./scenes/HookScene";
import { TrailerScene } from "./scenes/TrailerScene";
import { TruckScene } from "./scenes/TruckScene";
import { ResultScene } from "./scenes/ResultScene";
import { MeaningScene } from "./scenes/MeaningScene";
import { CombosScene } from "./scenes/CombosScene";
import { FormulaScene } from "./scenes/FormulaScene";
import { LimitScene } from "./scenes/LimitScene";
import { EngineeringScene } from "./scenes/EngineeringScene";
import { CtaScene } from "./scenes/CtaScene";

const Scene: React.FC<{ name: SceneName; children: React.ReactNode }> = ({ name, children }) => (
  <Sequence name={name} from={SCENES[name].from} durationInFrames={sceneLength(name)} premountFor={30}>
    {children}
  </Sequence>
);

// "3,400 LB off the setup": standard vs Drive4USA truck + trailer.
const SetupStoryAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Scene name="hook">
      <HookScene />
    </Scene>
    <Scene name="trailer">
      <TrailerScene />
    </Scene>
    <Scene name="truck">
      <TruckScene />
    </Scene>
    <Scene name="result">
      <ResultScene />
    </Scene>
    <Scene name="meaning">
      <MeaningScene />
    </Scene>
    <Scene name="combos">
      <CombosScene />
    </Scene>
    <Scene name="formula">
      <FormulaScene />
    </Scene>
    <Scene name="limit">
      <LimitScene />
    </Scene>
    <Scene name="engineering">
      <EngineeringScene />
    </Scene>
    <Scene name="cta">
      <CtaScene />
    </Scene>

    {/* In-hook impact on "We did." plus hard cuts into the key scenes */}
    {[88, SCENES.trailer.from, SCENES.result.from, SCENES.meaning.from, SCENES.combos.from, SCENES.engineering.from, SCENES.cta.from].map(
      (at) => (
        <Flash key={at} at={at} strength={at === 88 ? 0.9 : 0.6} />
      ),
    )}

    <Audio src={staticFile("v3/voiceover.mp3")} volume={0.75} />
  </AbsoluteFill>
);

export const SetupStoryComposition: React.FC = () => (
  <Composition id="SetupStory" component={SetupStoryAd} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={1080} height={1920} />
);
