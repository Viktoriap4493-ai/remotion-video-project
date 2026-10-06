import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS } from "../../loadcombos/fonts";

// вага.mov: the CAT scale ticket. The clip runs from 0.9s and FREEZES on the
// 2.7s frame (ticket fully in shot, GROSS WEIGHT 12520 lb readable at about
// x 280–400, y 1350). Every graphic stays in the sky band above y ≈ 560 so
// nothing ever touches the document.
const TRIM = 27; // 0.9s into the clip
const FREEZE = 54; // clip 2.7s
const LINES = [36, 54, 72];

const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ height: 34, display: "flex", justifyContent: "center", opacity: p }}>
      <svg width="40" height="34" viewBox="0 0 40 34">
        <path d="M20 2 V28 M8 18 L20 30 L32 18" stroke={COLORS.red} strokeWidth="5" fill="none" strokeDasharray="60" strokeDashoffset={60 * (1 - p)} />
      </svg>
    </div>
  );
};

export const MeaningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const frozen = frame >= FREEZE;
  const shutter = interpolate(frame, [FREEZE, FREEZE + 2, FREEZE + 8], [0, 0.5, 0], CLAMP);
  const l1 = interpolate(frame, [LINES[0], LINES[0] + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const l2 = interpolate(frame, [LINES[1], LINES[1] + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const l3 = interpolate(frame, [LINES[2], LINES[2] + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Slow push centred on the ticket's weight row keeps it in frame */}
      <AbsoluteFill
        style={{
          scale: String(frozen ? interpolate(frame, [FREEZE, 108], [1, 1.04], { ...CLAMP, easing: EASE_IN_OUT }) : 1),
          transformOrigin: "340px 1350px",
        }}
      >
        {frozen ? (
          <Img src={staticFile("v3/img/ticket-freeze.jpg")} style={{ width: "100%", height: "100%" }} />
        ) : (
          <Video src={staticFile("v3/video/scale-ticket.mp4")} muted trimBefore={TRIM} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: shutter }} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 580,
          background: "linear-gradient(180deg, rgba(4,16,30,0.92) 0%, rgba(4,16,30,0.8) 75%, rgba(4,16,30,0) 100%)",
          opacity: interpolate(frame, [LINES[0] - 6, LINES[0]], [0, 1], CLAMP),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: BEBAS,
          lineHeight: 1,
          color: COLORS.white,
        }}
      >
        {/* 1: technical fade/slide */}
        <div style={{ fontSize: 96, opacity: l1, translate: `${(1 - l1) * -80}px 0`, filter: `blur(${(1 - l1) * 6}px)` }}>
          LESS SETUP WEIGHT
        </div>
        <Arrow at={LINES[1] - 4} />
        {/* 2: upward movement */}
        <div style={{ fontSize: 76, opacity: l2, translate: `0 ${(1 - l2) * 60}px` }}>MORE WEIGHT AVAILABLE FOR CARS</div>
        <Arrow at={LINES[2] - 4} />
        {/* 3: stronger punch */}
        <div
          style={{
            fontSize: 118,
            color: COLORS.red,
            opacity: l3,
            scale: String(interpolate(l3, [0, 1], [1.7, 1]) * punch(frame, LINES[2] + 7, 0.08, 2, 8)),
            textShadow: "0 0 30px rgba(227,16,27,0.5)",
          }}
        >
          MORE ROOM FOR CARS
        </div>
      </div>

      <Sfx at={FREEZE} name="hard-stop" volume={0.32} />
      <Sfx at={LINES[0]} name="ui-click" volume={0.26} />
      <Sfx at={LINES[1]} name="whoosh-fast" volume={0.22} />
      <Sfx at={LINES[2] + 4} name="punch" volume={0.38} />
    </AbsoluteFill>
  );
};
