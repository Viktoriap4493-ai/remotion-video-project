import "./index.css";
import { MyComposition } from "./Composition";
import { LoadCombosComposition } from "./loadcombos/LoadCombos";
import { LoadCombosRuComposition } from "./ru/LoadCombosRu";
import { SetupStoryComposition } from "./v3/SetupStory";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LoadCombosComposition />
      <LoadCombosRuComposition />
      <SetupStoryComposition />
    </>
  );
};
