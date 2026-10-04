import "./index.css";
import { MyComposition } from "./Composition";
import { LoadCombosComposition } from "./loadcombos/LoadCombos";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LoadCombosComposition />
    </>
  );
};
