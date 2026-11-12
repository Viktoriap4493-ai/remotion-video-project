import "./index.css";
import {
  BlackFridayComposition,
  IplComposition,
  LazerhallBlackFridayComposition,
  LazerhallComposition,
  MyComposition,
  Rf3SmasComposition,
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
      <Rf3SmasComposition />
    </>
  );
};
