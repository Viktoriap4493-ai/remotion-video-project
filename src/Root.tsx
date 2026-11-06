import "./index.css";
import {
  BlackFridayComposition,
  IplComposition,
  LazerhallComposition,
  MyComposition,
  RfLifting2Composition,
  RfLiftingComposition,
} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerhallComposition />
      <BlackFridayComposition />
      <RfLiftingComposition />
      <RfLifting2Composition />
      <IplComposition />
    </>
  );
};
