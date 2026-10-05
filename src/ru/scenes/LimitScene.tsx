import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { MaskReveal } from "../../loadcombos/components/MaskReveal";
import { Sfx } from "../../loadcombos/components/Sfx";
import { TechBackground } from "../../loadcombos/components/TechBackground";
import { BEBAS_RU, GILROY } from "../fonts";

// A vertical weight scale: the 26,000 LB limit is a red line and each
// result drops into its true position below it (0.5 px per pound).
const LIMIT_Y = 520;
const PX_PER_LB = 0.5;
const yFor = (lb: number) => LIMIT_Y + (26000 - lb) * PX_PER_LB;

const SLAM = 3;
const LINE = 10;
const RESULTS = [
  { value: "25,732 LB", margin: "268", lb: 25732, at: 26 },
  { value: "25,337 LB", margin: "663", lb: 25337, at: 40 },
  { value: "24,348 LB", margin: "1,652", lb: 24348, at: 54 },
];
const ZOOM = 70;
const VERDICT = 76; // «…остаются ниже двадцати шести тысяч.»

const Result: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { value, margin, lb, at } = RESULTS[index];
  const target = yFor(lb);
  // Falls from above the limit line, lands hard with a small rebound.
  const y = interpolate(frame, [at, at + 7, at + 10, at + 13], [LIMIT_Y - 260, target + 14, target - 4, target], {
    ...CLAMP,
    easing: Easing.bezier(0.5, 0, 0.75, 0),
  });
  const shown = frame >= at;
  const lead = interpolate(frame, [at + 7, at + 14], [0, 1], { ...CLAMP, easing: EASE_OUT });

  if (!shown) return null;
  return (
    <>
      {/* Marker on the scale + leader line */}
      <div
        style={{
          position: "absolute",
          left: 104,
          top: y - 13,
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: COLORS.yellow,
          boxShadow: "0 0 18px rgba(255,210,31,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          top: y - 1,
          width: 130 * lead,
          height: 3,
          background: "rgba(255,210,31,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 290,
          top: y - 66,
          display: "flex",
          alignItems: "center",
          gap: 26,
          scale: String(punch(frame, at + 7, 0.1, 2, 7)),
          transformOrigin: "left center",
        }}
      >
        <span style={{ fontFamily: BEBAS_RU, fontSize: 140, lineHeight: 1, paddingTop: 10, color: COLORS.white }}>
          {value}
        </span>
        <span
          style={{
            fontFamily: GILROY,
            fontWeight: 800,
            fontSize: 40,
            color: COLORS.yellow,
            opacity: lead,
          }}
        >
          −{margin}
        </span>
      </div>
      <Sfx at={at + 7} name="lock" volume={0.36} />
    </>
  );
};

export const LimitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [SLAM, SLAM + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const line = interpolate(frame, [LINE, LINE + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const zoom = interpolate(frame, [ZOOM, ZOOM + 14], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const ruler = interpolate(frame, [LINE + 4, LINE + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <TechBackground image />
      <AbsoluteFill
        style={{
          scale: String(1 - zoom * 0.14),
          translate: `0 ${zoom * -40}px`,
          transformOrigin: "50% 15%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 190,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: BEBAS_RU,
            fontSize: 220,
            lineHeight: 1,
            color: COLORS.white,
            opacity: slam,
            scale: String(interpolate(slam, [0, 1], [1.7, 1]) * punch(frame, SLAM + 7, 0.06, 2, 8)),
            filter: `blur(${(1 - slam) * 14}px)`,
            textShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          26,000 LB
        </div>

        {/* Vertical scale */}
        <div
          style={{
            position: "absolute",
            left: 114,
            top: LIMIT_Y,
            width: 6,
            height: 900 * ruler,
            background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.1))",
          }}
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 98,
              top: LIMIT_Y + (i + 1) * 110,
              width: 38,
              height: 3,
              background: "rgba(255,255,255,0.35)",
              opacity: ruler > (i + 1) / 9 ? 1 : 0,
            }}
          />
        ))}

        {/* LIMIT line */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: LIMIT_Y - 4,
            width: 960 * line,
            height: 8,
            background: COLORS.red,
            boxShadow: "0 0 24px rgba(227,16,27,0.9)",
          }}
        />
        <div style={{ position: "absolute", right: 60, top: LIMIT_Y - 90 }}>
          <MaskReveal start={LINE + 6} duration={8}>
            <div style={{ fontFamily: BEBAS_RU, fontSize: 80, lineHeight: 1, color: COLORS.red, letterSpacing: "0.06em" }}>
              ЛИМИТ
            </div>
          </MaskReveal>
        </div>

        {RESULTS.map((_, i) => (
          <Result key={i} index={i} />
        ))}
      </AbsoluteFill>

      {/* Verdict */}
      <div
        style={{
          position: "absolute",
          top: 1360,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MaskReveal start={VERDICT} duration={9}>
          <div style={{ fontFamily: BEBAS_RU, fontSize: 130, lineHeight: 1, color: COLORS.white }}>
            ВСЕ ТРИ — <span style={{ color: COLORS.yellow }}>НИЖЕ 26K</span>
          </div>
        </MaskReveal>
        <MaskReveal start={VERDICT + 8} duration={8}>
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: "0.22em",
              color: "#8CC8FF",
              marginTop: 10,
            }}
          >
            БЕЗ ПРЕВЫШЕНИЯ ЛИМИТА
          </div>
        </MaskReveal>
      </div>

      <Sfx at={0} name="riser" volume={0.18} />
      <Sfx at={SLAM + 5} name="impact-strong" volume={0.44} />
      <Sfx at={LINE} name="whoosh-fast" volume={0.2} />
      <Sfx at={ZOOM} name="whoosh-soft" volume={0.16} />
      <Sfx at={VERDICT} name="punch" volume={0.32} />
      <Sfx at={VERDICT + 2} name="resolve" volume={0.22} />
    </AbsoluteFill>
  );
};
