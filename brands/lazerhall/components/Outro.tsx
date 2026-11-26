import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { ASSETS } from "./assets";
import { MapPin } from "./Header";
import { GILROY, WEIGHT } from "./fonts";
import { clamp, usePop } from "./motion";
import { ADDRESS, COLORS } from "./tokens";

// "ЗАПИСАТИСЯ" button with a bobbing arrow; pops in at `start`. Blue on
// footage and light screens; `inverted` (white, blue text) on brand blue.
export const CtaButton: React.FC<{ start?: number; top?: number; fontSize?: number; text?: string; inverted?: boolean }> = ({
  start = 0,
  top = 1578,
  fontSize = 40,
  text = "ЗАПИСАТИСЯ",
  inverted = false,
}) => {
  const fg = inverted ? COLORS.blue : COLORS.white;
  const frame = useCurrentFrame();
  const pop = usePop(start, 10);
  const pulse = frame > start + 15 ? 1 + Math.sin((frame - start) / 7) * 0.025 : 1;
  const arrow = frame > start ? Math.sin((frame - start) / 6) * 6 : 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translateX(-50%) scale(${(frame < start ? 0 : pop) * pulse})`,
        padding: `${fontSize * 0.4}px ${fontSize * 1.6}px ${fontSize * 0.3}px`,
        borderRadius: fontSize * 0.7,
        backgroundColor: inverted ? COLORS.white : COLORS.blue,
        boxShadow: inverted ? "0 18px 40px rgba(0,0,0,0.3)" : "0 24px 60px rgba(5,29,94,0.35)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        fontFamily: GILROY,
        fontWeight: WEIGHT.extraBold,
        fontSize,
        letterSpacing: "0.04em",
        color: fg,
        whiteSpace: "nowrap",
      }}
    >
      {text}
      <svg width={fontSize * 0.85} height={fontSize * 0.75} viewBox="0 0 34 30" style={{ transform: `translateY(${arrow}px)` }}>
        <path d="M17 2 V26 M5 15 L17 27 L29 15" stroke={fg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
};

// End card on brand blue: big logo, address with a pin, optional CTA.
export const EndCard: React.FC<{ start?: number; withCta?: boolean; address?: string }> = ({
  start = 0,
  withCta = true,
  address = ADDRESS,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: COLORS.blue }}>
      <Img src={ASSETS.logo} style={{ position: "absolute", top: 634, left: "50%", width: 520, transform: "translate(-50%, -50%)" }} />
      <div
        style={{
          position: "absolute",
          top: 1115,
          width: "100%",
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: GILROY,
          fontWeight: WEIGHT.extraBold,
          fontSize: 40,
          color: COLORS.white,
        }}
      >
        <MapPin size={34} />
        {address}
      </div>
      {withCta ? <CtaButton start={start + 12} top={1260} fontSize={52} inverted /> : null}
    </AbsoluteFill>
  );
};
