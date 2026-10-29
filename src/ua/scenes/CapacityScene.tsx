import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { Whip } from "../components/Whip";

// CAT Scale clip (gross 4,760 lb): plays in from 2.23s, HOLDS 2.5s on the
// sharp, fully framed ticket at 2.83s, then plays on in slow motion. Nothing
// is drawn over the ticket.
const HOLD = 18;
const RESUME = 93;
const WHIP_OUT = 106;

export const CapacityScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Whip inFrames={6} outAt={WHIP_OUT}>
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        {frame < HOLD ? (
          <Video src={staticFile("ua/video/scale-ticket-4760.mp4")} muted trimBefore={67} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        ) : frame < RESUME ? (
          <Img src={staticFile("ua/img/ticket-4760-freeze.jpg")} style={{ width: "100%", height: "100%" }} />
        ) : null}
        <Sequence from={RESUME} layout="none">
          <AbsoluteFill style={{ scale: String(interpolate(frame, [RESUME, WHIP_OUT + 6], [1, 1.03], CLAMP)) }}>
            <Video src={staticFile("ua/video/scale-ticket-4760.mp4")} muted trimBefore={86} playbackRate={0.8} objectFit="cover" style={{ width: "100%", height: "100%" }} />
          </AbsoluteFill>
        </Sequence>

        <Sfx at={HOLD} name="hard-stop" volume={0.24} />
        <Sfx at={HOLD + 2} name="tick" volume={0.18} />
        <Sfx at={WHIP_OUT - 2} name="whoosh-deep" volume={0.3} />
      </AbsoluteFill>
    </Whip>
  );
};
