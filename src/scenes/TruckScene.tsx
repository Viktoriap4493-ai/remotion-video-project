import React from "react";
import { staticFile } from "remotion";
import { Video } from "@remotion/media";
import { WeightBeat } from "../components/WeightBeat";

export const TruckScene: React.FC = () => {
  return (
    <WeightBeat
      badgeSrc={staticFile("images/cards/badge-truck-on-scale.png")}
      value={7240}
      background={
        <Video
          src={staticFile("video/clip-grille-fleet-a.mov")}
          trimBefore={90}
          style={{ width: "100%", height: "100%", scale: "1.08" }}
          objectFit="cover"
          muted
        />
      }
    />
  );
};
