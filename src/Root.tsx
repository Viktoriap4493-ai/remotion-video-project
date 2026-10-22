import "./index.css";
import { LazerhallComposition, MyComposition, ObabkoDentComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerhallComposition />
      <ObabkoDentComposition />
    </>
  );
};
