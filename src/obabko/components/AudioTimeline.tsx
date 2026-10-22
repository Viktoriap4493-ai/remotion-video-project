import React from "react";
import { Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { DURATION_IN_FRAMES, PATHS, s } from "../config";

type Cue = { at: number; sfx: string; volume?: number };

// Sound design cue sheet (seconds). Kept sparse: not every beat gets an effect.
export const CUES: Cue[] = [
  // Intro
  { at: 0.0, sfx: "click", volume: 0.5 },
  { at: 0.12, sfx: "whoosh-short", volume: 0.45 },
  { at: 0.4, sfx: "pop", volume: 0.6 },
  { at: 0.45, sfx: "boing", volume: 0.5 },
  { at: 0.6, sfx: "bass", volume: 0.45 },
  { at: 1.15, sfx: "click", volume: 0.55 },
  { at: 1.2, sfx: "pop", volume: 0.4 },
  { at: 1.82, sfx: "whoosh-short", volume: 0.4 },
  { at: 1.95, sfx: "click", volume: 0.4 },
  { at: 2.45, sfx: "click", volume: 0.5 },
  { at: 2.6, sfx: "whoosh", volume: 0.45 },
  { at: 3.2, sfx: "bass", volume: 0.5 },
  { at: 3.28, sfx: "whoosh-short", volume: 0.45 },
  // Before/after scenes (3.5, 7, 11)
  ...[3.5, 7, 11].flatMap((t, i): Cue[] => [
    { at: t + 0.03, sfx: "click", volume: 0.55 },
    { at: t + 0.2, sfx: "pop", volume: 0.35 },
    { at: t + 0.66, sfx: "riser", volume: 0.5 },
    { at: t + 1.08, sfx: "whoosh", volume: 0.6 },
    { at: t + 1.5, sfx: i === 2 ? "confirm" : "click", volume: 0.5 },
    ...(i === 0 ? [{ at: t + 1.85, sfx: "pop", volume: 0.4 }] : []),
    ...(i === 2 ? [{ at: t + 2.1, sfx: "bass", volume: 0.45 }] : []),
    { at: t + 3.72, sfx: "whoosh-short", volume: 0.35 },
  ]),
  // Montage
  { at: 15.0, sfx: "click", volume: 0.5 },
  { at: 15.25, sfx: "whoosh-short", volume: 0.5 },
  { at: 16.0, sfx: "click", volume: 0.5 },
  { at: 16.25, sfx: "whoosh-short", volume: 0.5 },
  { at: 17.0, sfx: "click", volume: 0.5 },
  { at: 17.35, sfx: "whoosh", volume: 0.55 },
  { at: 17.8, sfx: "bass", volume: 0.6 },
  // End card
  { at: 19.0, sfx: "whoosh", volume: 0.45 },
  { at: 19.5, sfx: "confirm", volume: 0.35 },
  { at: 20.4, sfx: "click", volume: 0.35 },
  { at: 21.7, sfx: "click", volume: 0.45 },
  { at: 21.9, sfx: "whoosh-short", volume: 0.35 },
  { at: 22.15, sfx: "pop", volume: 0.35 },
  { at: 22.72, sfx: "click", volume: 0.4 },
  { at: 22.8, sfx: "mouse-click", volume: 0.8 },
  { at: 22.82, sfx: "bass", volume: 0.25 },
];

export const AudioTimeline: React.FC<{ musicVolume?: number }> = ({ musicVolume = 0.85 }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio
        src={staticFile(PATHS.music)}
        volume={(f) =>
          musicVolume *
          interpolate(f, [DURATION_IN_FRAMES - fps * 1.2, DURATION_IN_FRAMES], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {CUES.map((cue, i) => (
        <Sequence key={i} from={s(cue.at)} durationInFrames={s(1.5)} layout="none">
          <Audio src={staticFile(PATHS.sfx(cue.sfx))} volume={() => cue.volume ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};
