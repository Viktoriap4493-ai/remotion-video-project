import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, Case } from "../config";
import { clamp, easeInOut, progress } from "./anim";

type Props = {
  item: Case;
  left: number;
  top: number;
  cardIn: number;
  cardInEnd: number;
  wipeStart: number;
  wipeEnd: number;
  zoomEnd: number; // frame where the 100 → 103 % push-in finishes
  zoomTo?: number;
  exitAt?: number; // card wipes out to the right from here (8 frames)
};

/**
 * One clinical case: the initial photo, then a vertical mask moving left → right
 * that uncovers the result photo of the same case. No "before/after" captions. Photos are only cropped
 * (object-fit: cover), never stretched or retouched.
 */
export const BeforeAfterWipe: React.FC<Props> = ({
  item,
  left,
  top,
  cardIn,
  cardInEnd,
  wipeStart,
  wipeEnd,
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
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
          <Img src={staticFile(item.after)} style={img} />
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
