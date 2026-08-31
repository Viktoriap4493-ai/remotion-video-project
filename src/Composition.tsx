import {
  Composition as RemotionComposition,
  staticFile,
  Sequence,
  AbsoluteFill,
} from "remotion";
import { Audio } from "@remotion/media";
import { FPS, DURATION_IN_FRAMES, SCENES } from "./timeline";
import { HookScene } from "./scenes/HookScene";
import { TruckScene } from "./scenes/TruckScene";
import { TrailerScene } from "./scenes/TrailerScene";
import { TotalScene } from "./scenes/TotalScene";
import { CapacityScene } from "./scenes/CapacityScene";
import { VehiclesScene } from "./scenes/VehiclesScene";
import { CombosScene } from "./scenes/CombosScene";
import { OutroScene } from "./scenes/OutroScene";

const Drive4USAAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Audio src={staticFile("audio/voiceover.mp3")} />

      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.to - SCENES.hook.from}>
        <HookScene />
      </Sequence>
      <Sequence from={SCENES.truck.from} durationInFrames={SCENES.truck.to - SCENES.truck.from}>
        <TruckScene />
      </Sequence>
      <Sequence from={SCENES.trailer.from} durationInFrames={SCENES.trailer.to - SCENES.trailer.from}>
        <TrailerScene />
      </Sequence>
      <Sequence from={SCENES.total.from} durationInFrames={SCENES.total.to - SCENES.total.from}>
        <TotalScene />
      </Sequence>
      <Sequence from={SCENES.capacity.from} durationInFrames={SCENES.capacity.to - SCENES.capacity.from}>
        <CapacityScene />
      </Sequence>
      <Sequence from={SCENES.vehicles.from} durationInFrames={SCENES.vehicles.to - SCENES.vehicles.from}>
        <VehiclesScene />
      </Sequence>
      <Sequence from={SCENES.combos.from} durationInFrames={SCENES.combos.to - SCENES.combos.from}>
        <CombosScene />
      </Sequence>
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.to - SCENES.outro.from}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <RemotionComposition
      id="Drive4USAAd"
      component={Drive4USAAd}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
