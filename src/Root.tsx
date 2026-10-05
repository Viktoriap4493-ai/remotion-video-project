import "./index.css";
import { MyComposition } from "./Composition";
import { LoadCombosComposition } from "./loadcombos/LoadCombos";
import { LoadCombosRuComposition } from "./ru/LoadCombosRu";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LoadCombosComposition />
      <LoadCombosRuComposition />
    </>
  );
};
