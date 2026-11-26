import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./motion";
import { BlackFridaySticker, DiscountBadge } from "./Offer";

// Black Friday opening over footage: dimmed frame, the client's sticker and
// "-50%" land together on the first beat, then everything clears at `exit`
// (frame-local) before any other text appears.
export const BlackFridayIntro: React.FC<{ exit: number; discount?: string }> = ({ exit, discount = "-50%" }) => {
  const frame = useCurrentFrame();
  if (frame > exit + 14) {
    return null;
  }
  const leave = interpolate(frame, [exit - 12, exit], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: 1 - leave }}>
      <AbsoluteFill style={{ backgroundColor: "rgba(2,10,40,0.62)" }} />
      <BlackFridaySticker start={0} exit={exit - 12} top={690} />
      <DiscountBadge text={discount} start={0} top={960} fontSize={160} />
    </AbsoluteFill>
  );
};
