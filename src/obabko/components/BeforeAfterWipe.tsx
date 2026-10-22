import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, COPY, Case, FONT } from "../config";
import { clamp, easeInOut, progress } from "./anim";

type Props = {
  item: Case;
  left: number;
  top: number;
  cardIn: number;
  cardInEnd: number;
  beforeBadge: number;
  wipeStart: number;
  wipeEnd: number;
  afterBadge: number;
  zoomEnd: number; // frame where the 100 → 103 % push-in finishes
  zoomTo?: number;
  exitAt?: number; // card wipes out to the right from here (8 frames)
};

const Badge: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, at + 7);
  const pop = interpolate(frame, [at, at + 4, at + 8], [0.6, 1.08, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 28,
        top: 28,
        padding: "12px 26px 10px",
        borderRadius: 16,
        background: COLORS.brand,
        color: COLORS.white,
        fontFamily: FONT.family,
        fontWeight: FONT.semibold,
        fontSize: 40,
        letterSpacing: "0.04em",
        opacity: p,
        transform: `scale(${pop})`,
        transformOrigin: "0 0",
        boxShadow: "0 6px 18px rgba(32,38,48,0.25)",
      }}
    >
      {text}
    </div>
  );
};

/**
 * One clinical case: the BEFORE photo, then a vertical mask moving left → right
 * that uncovers the AFTER photo of the same case. Photos are only cropped
 * (object-fit: cover), never stretched or retouched.
 */
export const BeforeAfterWipe: React.FC<Props> = ({
  item,
  left,
  top,
  cardIn,
  cardInEnd,
  beforeBadge,
  wipeStart,
  wipeEnd,
  afterBadge,
  zoomEnd,
  zoomTo = 1.03,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const reveal = progress(frame, cardIn, cardInEnd);
  const wipe = progress(frame, wipeStart, wipeEnd, easeInOut);
  const zoom = interpolate(frame, [wipeEnd, zoomEnd], [1, zoomTo], { ...clamp, easing: easeInOut });
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, exitAt + 8, easeInOut);

  const img: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: item.focus ?? "50% 50%",
    transform: `scale(${zoom})`,
  };

  const lineVisible = wipe > 0 && wipe < 1;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: item.width,
        height: item.height,
        clipPath: `inset(-40px ${(1 - reveal) * 100}% -40px ${exit * 100}%)`,
        transform: `scale(${interpolate(reveal, [0, 1], [0.97, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 36,
          overflow: "hidden",
          background: COLORS.graphite,
          boxShadow: "0 24px 60px rgba(32,38,48,0.22)",
        }}
      >
        <Img src={staticFile(item.before)} style={img} />
        <Badge text={COPY.before} at={beforeBadge} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
          <Img src={staticFile(item.after)} style={img} />
          <Badge text={COPY.after} at={afterBadge} />
        </div>
        {lineVisible ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `calc(${wipe * 100}% - 2px)`,
              width: 4,
              background: COLORS.brand,
              boxShadow: "0 0 14px rgba(184,74,66,0.6)",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
