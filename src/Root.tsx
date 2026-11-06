import "./index.css";
import {
  BlackFridayComposition,
  LazerhallComposition,
  MyComposition,
  RfLiftingComposition,
} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerhallComposition />
      <BlackFridayComposition />
      <RfLiftingComposition />
    </>
  );
};
