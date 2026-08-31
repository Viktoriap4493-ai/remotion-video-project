import React from "react";
import { staticFile } from "remotion";
import { WeightBeat } from "../components/WeightBeat";
import { KenBurnsImage } from "../components/KenBurns";
import { sceneDuration } from "../timeline";

export const TrailerScene: React.FC = () => {
  const duration = sceneDuration("trailer");

  return (
    <WeightBeat
      badgeSrc={staticFile("images/cards/badge-trailer-on-scale.png")}
      value={5140}
      background={
        <KenBurnsImage
          src={staticFile("images/photos/empty-trailer-wide-1.jpg")}
          durationInFrames={duration}
          startScale={1.02}
          endScale={1.14}
        />
      }
    />
  );
};
