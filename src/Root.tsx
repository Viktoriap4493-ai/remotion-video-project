import "./index.css";
import {
  BlackFridayComposition,
  IplComposition,
  LazerhallBlackFridayComposition,
  LazerhallComposition,
  MyComposition,
  RfLifting2Composition,
  RfLiftingComposition,
  SmasComposition,
} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerhallComposition />
      <LazerhallBlackFridayComposition />
      <BlackFridayComposition />
      <RfLiftingComposition />
      <RfLifting2Composition />
      <IplComposition />
      <SmasComposition />
    </>
  );
};
