import "./index.css";
import { MyComposition } from "./Composition";
import { LazerHallComposition } from "./lazerhall/LazerHallAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LazerHallComposition />
    </>
  );
};
