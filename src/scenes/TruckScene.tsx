import React from "react";
import { staticFile } from "remotion";
import { Video } from "@remotion/media";
import { WeightBeat } from "../components/WeightBeat";
import { sceneDuration } from "../timeline";

export const TruckScene: React.FC = () => {
  const duration = sceneDuration("truck");

  return (
    <WeightBeat
      badgeSrc={staticFile("images/cards/badge-truck-on-scale.png")}
      ticketSrc={staticFile("images/photos/ticket-truck-7240.png")}
      value={7240}
      ticketStart={38}
      ticketEnd={duration - 8}
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
