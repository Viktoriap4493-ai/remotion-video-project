import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT } from "../anim";

// The cutouts face left, so "driving in" means entering from the right of
// the card, braking (nose dips), overshooting a touch and settling back.
const OVERSHOOT = -14;

const carX = (frame: number, start: number, duration: number, travel: number) => {
  const brake = start + duration * 0.85;
  if (frame <= brake) {
    return interpolate(frame, [start, brake], [travel, OVERSHOOT], {
      ...CLAMP,
      easing: EASE_OUT,
    });
  }
  return interpolate(frame, [brake, start + duration + 6], [OVERSHOOT, 0], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
};

export const DriveInCar: React.FC<{
  src: string;
  start: number;
  duration?: number;
  travel: number;
  width: number;
  height: number;
  id: string;
}> = ({ src, start, duration = 16, travel, width, height, id }) => {
  const frame = useCurrentFrame();
  const x = carX(frame, start, duration, travel);
  const velocity = Math.abs(x - carX(frame - 1, start, duration, travel));
  const blur = Math.min(velocity * 0.22, 14);
  const dip = interpolate(
    frame,
    [
      start + duration * 0.55,
      start + duration * 0.85,
      start + duration + 4,
      start + duration + 11,
    ],
    [0, -1.8, 0.7, 0],
    CLAMP,
  );
  const bob = interpolate(
    frame,
    [start + duration * 0.8, start + duration + 3, start + duration + 10],
    [0, 3, 0],
    CLAMP,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width,
        height,
        translate: `${x}px 0`,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "6%",
          bottom: 4,
          height: 26,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.28)",
          filter: "blur(9px)",
        }}
      />
      <Img
        src={staticFile(`ad2/img/${src}.png`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center bottom",
          rotate: `${dip}deg`,
          translate: `0 ${bob}px`,
          transformOrigin: "50% 95%",
          filter: blur > 0.3 ? `url(#${id})` : undefined,
        }}
      />
    </div>
  );
};
