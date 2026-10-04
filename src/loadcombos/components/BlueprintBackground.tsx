import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Video } from "@remotion/media";

// The supplied фон.mp4: a light engineering-grid backdrop.
export const BlueprintBackground: React.FC<{ trimBefore?: number }> = ({ trimBefore = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: "#F3F8FC" }}>
    <Video
      src={staticFile("ad2/video/blueprint-bg.mp4")}
      muted
      trimBefore={trimBefore}
      objectFit="cover"
      style={{ width: "100%", height: "100%" }}
    />
  </AbsoluteFill>
);
