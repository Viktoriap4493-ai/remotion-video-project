import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config";
import { MASCOT_RIG } from "../mascotRig";
import { clamp, easeInOut, progress } from "./anim";

const RIG = MASCOT_RIG;
const RATIO = RIG.height / RIG.width;
type LayerName = keyof typeof RIG.layers;

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

// One rig layer, placed in source-pixel coordinates.
const Layer: React.FC<{ name: LayerName; rotate?: number; style?: React.CSSProperties }> = ({ name, rotate = 0, style }) => {
  const l = RIG.layers[name];
  const pivot = "pivot" in l ? l.pivot : undefined;
  return (
    <Img
      src={staticFile(`obabko/mascot/${name}.png`)}
      style={{
        position: "absolute",
        left: l.x,
        top: l.y,
        width: l.w,
        height: l.h,
        transformOrigin: pivot ? `${pivot.x - l.x}px ${pivot.y - l.y}px` : undefined,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    />
  );
};

// Every eye sprite is mounted all the time (so nothing reloads mid-render);
// only the current one is visible.
const EyeSet: React.FC<{ names: LayerName[]; active: LayerName }> = ({ names, active }) => (
  <>
    {names.map((n) => (
      <Layer key={n} name={n} style={{ opacity: n === active ? 1 : 0 }} />
    ))}
  </>
);

const LEFT_EYES: LayerName[] = ["eye-l-open-g0", "eye-l-open-g1", "eye-l-close0", "eye-l-close1", "eye-l-closed"];
const RIGHT_EYES: LayerName[] = ["eye-r-g0", "eye-r-g1"];

/**
 * The tooth is cut into a 2D rig (scripts/obabko/build_mascot_rig.py): body,
 * two arms on shoulder pivots and eye sprites. The arms trail and settle after
 * the jump, the right arm lifts for a friendly gesture, the eyes look at the
 * viewer, glance at the headline and the left eye winks (lid + lashes close
 * into the original closed-eye art and open again).
 */
export const IntroToothMascot: React.FC<Props> = ({
  lineY,
  width = 760,
  jumpAt = 10,
  winkAt = 36,
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
  const k = width / RIG.width;

  const jumpCfg = { damping: 9, stiffness: 110, mass: 0.9 };
  const jump = spring({ frame: frame - jumpAt, fps, config: jumpCfg });
  const jumpPrev = spring({ frame: frame - jumpAt - 1, fps, config: jumpCfg });
  const velocity = jump - jumpPrev;

  const rise = (1 - jump) * (height * 0.95);
  const baseScale = interpolate(jump, [0, 1], [0.7, 1]);
  // Squash & stretch from the jump velocity, kept subtle so the tooth keeps its shape
  const stretch = Math.max(-0.04, Math.min(0.06, velocity * 0.8));
  const sy = 1 + stretch;
  const sx = 1 - stretch * 0.6;

  const landed = Math.max(0, frame - jumpAt - 14);
  // Gentle idle sway + breathing once it has landed
  const idle = interpolate(landed, [0, 12], [0, 1], clamp);
  const sway = Math.sin(landed / 13) * 1.3 * idle;
  const breathe = 1 + Math.sin(landed / 9) * 0.006 * idle;

  // Wink: small head tilt toward the winking eye
  const wink = progress(frame, winkAt - 2, winkAt + 6, easeInOut) - progress(frame, winkAt + 9, winkAt + 17, easeInOut);
  // Friendly lean toward the thumbs-up
  const lean = progress(frame, leanAt, leanAt + 10, easeInOut) - 0.6 * progress(frame, leanAt + 12, leanAt + 19, easeInOut);

  const move = progress(frame, moveAt, moveAt + 14, easeInOut);
  const recede = progress(frame, recedeAt, recedeAt + 9, easeInOut);

  const rotate = -4 * wink + 6 * lean + sway;
  const scale = baseScale * breathe * interpolate(move, [0, 1], [1, parkScale]) * (1 - 0.06 * recede);

  // Arms: trail behind the jump (the spring overshoot makes them swing and
  // settle), idle drift, and the right arm lifts in a friendly gesture.
  const trail = Math.max(-1, Math.min(1, 1 - jump));
  const gesture = spring({ frame: frame - leanAt, fps, config: { damping: 8, stiffness: 140 } }) -
    spring({ frame: frame - leanAt - 14, fps, config: { damping: 12, stiffness: 120 } });
  const armRight = 22 * trail - 11 * gesture + Math.sin(landed / 11 + 1) * 1.6 * idle;
  const armLeft = -14 * trail + Math.sin(landed / 12) * 1.8 * idle - 3 * wink;

  // Eyes
  const glance = frame >= moveAt + 3 && frame < recedeAt - 4 ? 1 : 0;
  const w = frame - winkAt;
  const leftEye: LayerName =
    w === 0 || w === 9
      ? "eye-l-close0"
      : w === 1 || w === 8
        ? "eye-l-close1"
        : w >= 2 && w < 8
          ? "eye-l-closed"
          : glance
            ? "eye-l-open-g1"
            : "eye-l-open-g0";
  const rightEye: LayerName = glance ? "eye-r-g1" : "eye-r-g0";

  // The one red accent: a sparkle by the thumbs-up
  const sparkle = progress(frame, leanAt + 6, leanAt + 14) * (1 - progress(frame, moveAt, moveAt + 8));

  const shadowOpacity = interpolate(jump, [0.6, 1], [0, 0.12], clamp) * (1 - move);

  return (
    <>
      {/* Soft contact shadow on the line */}
      <div
        style={{
          position: "absolute",
          left: 540 - width * 0.26,
          top: lineY - 14,
          width: width * 0.52,
          height: 28,
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
          opacity: 1 - 0.4 * recede,
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
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: RIG.width,
              height: RIG.height,
              transformOrigin: "0 0",
              transform: `scale(${k})`,
            }}
          >
            <Layer name="body" />
            <EyeSet names={RIGHT_EYES} active={rightEye} />
            <EyeSet names={LEFT_EYES} active={leftEye} />
            <Layer name="arm-left" rotate={armLeft} />
            <Layer name="arm-right" rotate={armRight} />
            <div
              style={{
                position: "absolute",
                left: 1185,
                top: 400,
                transform: `scale(${sparkle}) rotate(${sparkle * 45}deg)`,
                opacity: sparkle,
              }}
            >
              <Star size={70} color={COLORS.brand} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
