import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

export type SfxName =
  | "whoosh-soft"
  | "whoosh-fast"
  | "whoosh-deep"
  | "car-a"
  | "car-b"
  | "car-c"
  | "card-thud"
  | "pen"
  | "tick"
  | "ui-click"
  | "punch"
  | "bass-hit"
  | "impact-strong"
  | "roulette"
  | "hard-stop"
  | "riser"
  | "notify"
  | "resolve"
  | "mech-ambience"
  | "assembly"
  | "scan"
  | "count"
  | "type"
  | "lock";

// SFX sit well under the voiceover (which plays at 0.72): keep volumes low.
const SFX_BUS = 0.85;

export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({
  at,
  name,
  volume = 0.3,
}) => {
  const level = volume * SFX_BUS;
  return (
    <Sequence from={Math.round(at)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`ad2/sfx/${name}.wav`)} volume={level} />
    </Sequence>
  );
};
