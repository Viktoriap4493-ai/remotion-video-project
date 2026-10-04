import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../anim";

// Navy backdrop with a faint drifting engineering grid.
export const TechBackground: React.FC<{ image?: boolean }> = ({ image }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      {image ? (
        <Img
          src={staticFile("ad2/img/navy-bg.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `0px ${frame * 0.6}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(46,110,170,0.35) 0%, rgba(12,46,78,0) 55%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(3,14,28,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
