import React from "react";
import { staticFile } from "remotion";
import { Video } from "@remotion/media";
import { WeightBeat } from "../components/WeightBeat";

export const TrailerScene: React.FC = () => {
  return (
    <WeightBeat
      badgeSrc={staticFile("images/cards/badge-trailer-on-scale.png")}
      value={5140}
      background={
        <Video
          src={staticFile("video/clip-trailer-scale-approach.mov")}
          style={{ width: "100%", height: "100%", scale: "1.04" }}
          objectFit="cover"
          muted
        />
      }
    />
  );
};
