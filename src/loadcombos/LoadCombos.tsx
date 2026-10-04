import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fonts";
import { DURATION_IN_FRAMES, FPS, SCENES, sceneLength, type SceneName } from "./timeline";
import { LOADS } from "./data";
import { Wipe } from "./components/Wipe";
import { HookScene } from "./scenes/HookScene";
import { SetupScene } from "./scenes/SetupScene";
import { LoadScene, type LoadTiming } from "./scenes/LoadScene";
import { RevealScene } from "./scenes/RevealScene";
import { PointScene } from "./scenes/PointScene";
import { AllLoadsScene } from "./scenes/AllLoadsScene";
import { CtaScene } from "./scenes/CtaScene";

// Beats (scene-local frames) are tied to the voiceover: e.g. LOAD #3's cars
// drive in on "A Rivian", "a Tesla", "and a Chevy Equinox", and every
// "UNDER" lands on "…under twenty-six thousand".
const LOAD_TIMINGS: LoadTiming[] = [
  { cars: [6, 12, 18], drive: 16, cargo: 50, total: 66, under: 84, exit: 125 },
  { cars: [4, 11], drive: 14, cargo: 40, total: 52, under: 63, exit: 112 },
  { cars: [5, 36, 68], drive: 13, cargo: 106, total: 120, under: 132, energetic: true },
];

const Scene: React.FC<{ name: SceneName; children: React.ReactNode }> = ({ name, children }) => (
  <Sequence name={name} from={SCENES[name].from} durationInFrames={sceneLength(name)} premountFor={30}>
    {children}
  </Sequence>
);

const LoadCombosAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Scene name="hook">
      <HookScene />
    </Scene>
    <Scene name="setup">
      <SetupScene />
    </Scene>
    {(["load1", "load2", "load3"] as const).map((name, i) => (
      <Scene key={name} name={name}>
        <LoadScene load={LOADS[i]} timing={LOAD_TIMINGS[i]} idPrefix={name} />
      </Scene>
    ))}
    <Scene name="reveal">
      <RevealScene />
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

    {[SCENES.setup.from, SCENES.load1.from, SCENES.reveal.from, SCENES.point.from, SCENES.cta.from].map(
      (at) => (
        <Wipe key={at} at={at} />
      ),
    )}

    <Audio src={staticFile("ad2/audio/voiceover.mp3")} volume={0.72} />
  </AbsoluteFill>
);

export const LoadCombosComposition: React.FC = () => (
  <Composition
    id="LoadCombos"
    component={LoadCombosAd}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
