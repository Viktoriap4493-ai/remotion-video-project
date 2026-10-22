import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, PATHS } from "../config";
import { clamp, easeInOut, progress } from "./anim";

// Source image is 934 × 941 (cut out from the supplied render).
const RATIO = 941 / 934;

type Props = {
  lineY: number;
  width?: number;
  // Frame timings (local to the intro)
  jumpAt?: number;
  winkAt?: number;
  leanAt?: number;
  moveAt?: number;
  recedeAt?: number;
  // Where the mascot parks to make room for the headline
  parkX?: number;
  parkY?: number;
  parkScale?: number;
};

const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill={color} />
  </svg>
);

/**
 * The supplied 3D tooth is a single still that already winks, so the "wink"
 * beat is sold with a head tilt, a pulse and small strokes beside the closed
 * eye instead of deforming the face. No new limbs are drawn.
 */
export const IntroToothMascot: React.FC<Props> = ({
  lineY,
  width = 760,
  jumpAt = 10,
  winkAt = 33,
  leanAt = 54,
  moveAt = 73,
  recedeAt = 96,
  parkX = 150,
  parkY = -250,
  parkScale = 0.68,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const height = width * RATIO;

  const jumpCfg = { damping: 9, stiffness: 110, mass: 0.9 };
  const jump = spring({ frame: frame - jumpAt, fps, config: jumpCfg });
  const jumpPrev = spring({ frame: frame - jumpAt - 1, fps, config: jumpCfg });
  const velocity = jump - jumpPrev;

  const rise = (1 - jump) * (height * 0.95);
  const baseScale = interpolate(jump, [0, 1], [0.7, 1]);
  // Squash & stretch from the jump velocity, kept subtle so the tooth keeps its shape
  const stretch = Math.max(-0.05, Math.min(0.07, velocity * 0.9));
  const sy = 1 + stretch;
  const sx = 1 - stretch * 0.6;

  // Wink: tilt + pulse
  const wink = progress(frame, winkAt, winkAt + 10, easeInOut) - progress(frame, winkAt + 12, winkAt + 21, easeInOut);
  // Friendly lean toward the thumbs-up
  const lean = progress(frame, leanAt, leanAt + 10, easeInOut) - 0.6 * progress(frame, leanAt + 12, leanAt + 19, easeInOut);

  const move = progress(frame, moveAt, moveAt + 14, easeInOut);
  const recede = progress(frame, recedeAt, recedeAt + 9, easeInOut);

  const rotate = -4 * wink + 6 * lean;
  const scale = baseScale * (1 + 0.04 * wink) * interpolate(move, [0, 1], [1, parkScale]) * (1 - 0.06 * recede);

  // Small strokes beside the winking eye (left eye, ~33% / 40% of the image)
  const strokesIn = progress(frame, winkAt + 2, winkAt + 8);
  const strokesOut = progress(frame, winkAt + 16, winkAt + 22);
  const strokes = strokesIn * (1 - strokesOut);

  // The one red accent: a sparkle by the thumbs-up
  const sparkle = progress(frame, leanAt + 4, leanAt + 12) * (1 - progress(frame, moveAt, moveAt + 8));

  const shadowOpacity = interpolate(jump, [0.6, 1], [0, 0.18], clamp) * (1 - move);

  return (
    <>
      {/* Contact shadow on the line */}
      <div
        style={{
          position: "absolute",
          left: 540 - width * 0.3,
          top: lineY - 18,
          width: width * 0.6,
          height: 36,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(32,38,48,${shadowOpacity}), rgba(32,38,48,0))`,
        }}
      />
      {/* Everything below the line is hidden, so the tooth jumps out from behind it */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: move > 0 ? undefined : `inset(0 0 ${1920 - lineY}px 0)`,
          opacity: 1 - 0.55 * recede,
          filter: recede > 0 ? `blur(${recede * 5}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 540 - width / 2,
            top: lineY - height,
            width,
            height,
            transformOrigin: "50% 100%",
            transform: `translate(${parkX * move}px, ${rise + parkY * move}px) rotate(${rotate}deg) scale(${scale * sx}, ${scale * sy})`,
          }}
        >
          <Img src={staticFile(PATHS.mascot)} style={{ width: "100%", height: "100%" }} />
          {/* wink strokes */}
          <svg
            width={width * 0.14}
            height={width * 0.14}
            viewBox="0 0 100 100"
            style={{ position: "absolute", left: width * 0.11, top: height * 0.27, opacity: strokes }}
          >
            {[
              [20, 70, 2, 45],
              [45, 55, 30, 25],
              [70, 52, 70, 22],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x1 + (x2 - x1) * strokesIn}
                y2={y1 + (y2 - y1) * strokesIn}
                stroke={COLORS.graphite}
                strokeWidth={7}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div
            style={{
              position: "absolute",
              left: width * 0.92,
              top: height * 0.24,
              transform: `scale(${sparkle}) rotate(${sparkle * 45}deg)`,
              opacity: sparkle,
            }}
          >
            <Star size={width * 0.075} color={COLORS.brand} />
          </div>
        </div>
      </div>
    </>
  );
};
