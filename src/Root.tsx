import "./index.css";
import { BlackFridayComposition, LazerhallComposition, MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerhallComposition />
      <BlackFridayComposition />
    </>
  );
};
