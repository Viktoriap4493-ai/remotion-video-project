import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, COPY, END, FONT, PATHS, SCENES, s } from "../config";
import { AddressReveal } from "./AddressReveal";
import { AnimatedLocationPin } from "./AnimatedLocationPin";
import { clamp, easeInOut, progress } from "./anim";

// Local frame for an absolute time in seconds
const at = (seconds: number) => s(seconds - SCENES.endCard.from);

const ArrowDown: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M24 8 V38 M12 27 L24 39 L36 27" stroke={COLORS.white} strokeWidth={5.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BrandEndCard: React.FC = () => {
  const frame = useCurrentFrame();

  // White panel sweeps in with a red edge, then a thin red line draws across
  const panel = progress(frame, 0, 12, easeInOut);
  const line = progress(frame, 4, 18, easeInOut);

  const logo = progress(frame, at(END.logo), at(END.logo) + 20);
  const sl1 = progress(frame, at(END.slogan), at(END.slogan) + 12);
  const sl2 = progress(frame, at(END.slogan) + 5, at(END.slogan) + 17);

  const ctaStart = at(END.cta);
  const cta = progress(frame, ctaStart, ctaStart + 10);
  const arrow = interpolate(frame, [ctaStart + 8, ctaStart + 18], [0, 6], { ...clamp, easing: easeInOut });

  const mask = (p: number): React.CSSProperties => ({
    clipPath: `inset(-10px ${(1 - p) * 100}% -10px 0)`,
  });

  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - panel) * 100}% 0 0)` }}>
      <div style={{ position: "absolute", inset: 0, background: COLORS.white }} />
      {panel < 1 ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${panel * 100}% - 3px)`, width: 6, background: COLORS.brand }} />
      ) : null}

      {/* top and bottom brand rules */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 210, height: 4, borderRadius: 2, background: COLORS.brand, transformOrigin: "0 50%", transform: `scaleX(${line})` }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1600, height: 4, borderRadius: 2, background: COLORS.brand, transformOrigin: "100% 50%", transform: `scaleX(${line})` }} />

      {/* Original logo, untouched; only fades and rises */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", opacity: logo, transform: `translateY(${(1 - logo) * 16}px)` }}>
        <Img src={staticFile(PATHS.logo)} style={{ width: 780, height: "auto" }} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", fontFamily: FONT.family, fontWeight: FONT.bold, fontSize: 80, lineHeight: 1.15, color: COLORS.graphite }}>
        <div style={mask(sl1)}>{COPY.endLine1}</div>
        <div style={{ ...mask(sl2), color: COLORS.brand }}>{COPY.endLine2Accent}</div>
      </div>

      {/* Geo-marker + address */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
        <AnimatedLocationPin dotAt={at(END.pinDot)} dropAt={at(END.pinDrop)} landAt={at(END.pinLand)} size={90} />
        <AddressReveal text={COPY.address} pillAt={at(END.pill)} textAt={at(END.address)} fontSize={46} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "34px 50px 30px 56px",
            borderRadius: 30,
            background: COLORS.brand,
            color: COLORS.white,
            fontFamily: FONT.family,
            fontWeight: FONT.semibold,
            fontSize: 54,
            opacity: cta,
            transform: `scale(${interpolate(cta, [0, 1], [0.96, 1])})`,
            boxShadow: `0 18px 40px rgba(184,74,66,${0.32 * cta})`,
          }}
        >
          {COPY.cta}
          <div style={{ transform: `translateY(${arrow}px)` }}>
            <ArrowDown size={60} />
          </div>
        </div>
      </div>
    </div>
  );
};
