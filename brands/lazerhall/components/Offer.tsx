import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ASSETS } from "./assets";
import { GILROY, WEIGHT } from "./fonts";
import { blurIn, clamp, flashOpacity, slamScale } from "./motion";
import { COLORS, SHADOWS } from "./tokens";

// "-50%" on a blue plate: slams in on a beat with a white flash.
export const DiscountBadge: React.FC<{
  text?: string;
  start?: number;
  fontSize?: number;
  top?: number;
  flash?: boolean;
}> = ({ text = "-50%", start = 0, fontSize = 210, top = 890, flash = true }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {flash ? <AbsoluteFill style={{ backgroundColor: COLORS.white, opacity: flashOpacity(frame, start) }} /> : null}
      <div
        style={{
          position: "absolute",
          top,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [start, start + 2], [0, 1], clamp),
        }}
      >
        <div
          style={{
            transform: `scale(${slamScale(frame, start)})`,
            padding: "6px 44px 16px",
            borderRadius: 40,
            backgroundColor: COLORS.blue,
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            fontFamily: GILROY,
            fontWeight: WEIGHT.black,
            fontSize,
            lineHeight: 1,
            color: COLORS.white,
          }}
        >
          {text}
        </div>
      </div>
    </>
  );
};

// Price block over footage: struck-through old price in white, white pill
// with the price in blue, small white note plate under it.
export const PriceBlock: React.FC<{
  oldPrice: string;
  price: string;
  unit: string;
  note?: string;
  start?: number;
  top?: number;
}> = ({ oldPrice, price, unit, note, start = 0, top = 1305 }) => {
  const frame = useCurrentFrame();
  const pill = start + 6;
  const textIn = start + 12;
  const pillScale = interpolate(frame, [pill, pill + 5], [0.7, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const shift = interpolate(frame, [textIn, textIn + 8], [-120, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top,
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: GILROY,
          fontWeight: WEIGHT.medium,
          fontSize: 62,
          lineHeight: 1,
          color: COLORS.white,
          textShadow: SHADOWS.text,
          ...blurIn(frame, start, 5),
        }}
      >
        {oldPrice}
        <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 4, backgroundColor: COLORS.white }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: top + 113,
          left: "50%",
          transform: `translate(-50%, -50%) scale(${pillScale})`,
          opacity: interpolate(frame, [pill, pill + 3], [0, 1], clamp),
          height: 120,
          padding: "0 52px",
          borderRadius: 60,
          backgroundColor: COLORS.white,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontFamily: GILROY,
          color: COLORS.blue,
          fontSize: 64,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ transform: `translateX(${shift}px)`, ...blurIn(frame, textIn, 8, 14) }}>
          <span style={{ fontWeight: WEIGHT.extraBold }}>{price}</span>
          <span style={{ fontWeight: WEIGHT.medium }}> — {unit}</span>
        </div>
      </div>
      {note ? (
        <div
          style={{
            position: "absolute",
            top: top + 220,
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: 56,
            padding: "0 20px",
            borderRadius: 12,
            backgroundColor: COLORS.white,
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
            fontFamily: GILROY,
            fontWeight: WEIGHT.medium,
            fontSize: 33,
            color: COLORS.blue,
            ...blurIn(frame, start + 18, 5),
          }}
        >
          <Asterisk />
          {note}
        </div>
      ) : null}
    </>
  );
};

const Asterisk: React.FC = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {[0, 45, 90, 135].map((a) => (
      <rect key={a} x="10.6" y="1" width="2.8" height="22" rx="1.4" fill={COLORS.blue} transform={`rotate(${a} 12 12)`} />
    ))}
  </svg>
);

// The client's own Black Friday Sale sticker (original PNG, unchanged):
// the "sale" tag drops in, the "Black Friday" pill slides out from under it,
// and both tuck away at `exit` (frame-local).
const PLATE_W = 851;
const PLATE_H = 194;
const TAG_LEFT = 573;

export const BlackFridaySticker: React.FC<{ start?: number; exit?: number; top?: number; scale?: number }> = ({
  start = 0,
  exit,
  top = 690,
  scale = 1.12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start || (exit !== undefined && frame > exit + 14)) {
    return null;
  }
  const tagIn = spring({ frame: frame - start, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const tagOut =
    exit === undefined ? 1 : interpolate(frame, [exit + 7, exit + 13], [1, 0], { ...clamp, easing: Easing.in(Easing.back(2)) });
  const open = interpolate(frame, [start + 7, start + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const close = exit === undefined ? 1 : interpolate(frame, [exit, exit + 7], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const hidden = TAG_LEFT * (1 - open * close);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - PLATE_W * scale) / 2,
        top,
        width: PLATE_W,
        height: PLATE_H,
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))",
      }}
    >
      <Img
        src={ASSETS.sticker.pill}
        style={{
          position: "absolute",
          inset: 0,
          width: PLATE_W,
          height: PLATE_H,
          clipPath: `inset(0 0 0 ${hidden}px)`,
          transform: `translateX(${hidden * 0.35}px)`,
        }}
      />
      <Img
        src={ASSETS.sticker.tag}
        style={{
          position: "absolute",
          inset: 0,
          width: PLATE_W,
          height: PLATE_H,
          transformOrigin: "84% 45%",
          transform: `scale(${tagIn * tagOut}) rotate(${interpolate(tagIn, [0, 1], [-35, 0])}deg)`,
        }}
      />
    </div>
  );
};

// "BLACK FRIDAY" pill + tilted "SALE" tag set in Gilroy and brand blue
// (used where the client approved a redrawn version of the sticker).
export const BlackFridayBadge: React.FC<{ start?: number; scale?: number }> = ({ start = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 180, mass: 0.7 } });
  const tag = spring({ frame: frame - start - 13, fps, config: { damping: 9, stiffness: 180, mass: 0.7 } });
  return (
    <div style={{ position: "relative", transform: `scale(${scale})` }}>
      <div
        style={{
          transform: `translateX(${(1 - pill) * -220}px) scale(${0.7 + pill * 0.3})`,
          opacity: Math.min(1, pill * 1.5),
          padding: "24px 50px",
          borderRadius: 120,
          border: `5px solid ${COLORS.blue}`,
          backgroundColor: COLORS.white,
          fontFamily: GILROY,
          fontWeight: WEIGHT.extraBold,
          fontSize: 84,
          lineHeight: 1,
          color: COLORS.blue,
          whiteSpace: "nowrap",
          boxShadow: "0 20px 50px rgba(5,29,94,0.18)",
        }}
      >
        BLACK FRIDAY
      </div>
      <div
        style={{
          position: "absolute",
          right: -84,
          top: -58,
          transform: `rotate(${interpolate(tag, [0, 1], [-30, 14])}deg) scale(${tag})`,
          padding: "14px 36px",
          borderRadius: 90,
          backgroundColor: COLORS.blue,
          border: `4px solid ${COLORS.white}`,
          fontFamily: GILROY,
          fontWeight: WEIGHT.black,
          fontSize: 70,
          lineHeight: 1,
          color: COLORS.white,
          boxShadow: "0 14px 34px rgba(5,29,94,0.35)",
        }}
      >
        SALE
      </div>
    </div>
  );
};

// Compact offer-dates badge: label, dates, short note (lilac accent).
export const OfferDatesBadge: React.FC<{
  label?: string;
  dates: string;
  note?: string;
  start?: number;
  top?: number;
  right?: number;
}> = ({ label = "СПЕЦІАЛЬНА ЦІНА", dates, note, start = 0, top = 622, right = 44 }) => {
  const frame = useCurrentFrame();
  if (frame < start) {
    return null;
  }
  const appear = interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rise = (at: number, distance: number) => ({
    opacity: interpolate(frame, [at, at + 9], [0, 1], clamp),
    transform: `translateY(${interpolate(frame, [at, at + 10], [distance, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`,
  });
  const datesAt = start + 15;
  return (
    <div
      style={{
        position: "absolute",
        top,
        right,
        padding: "16px 24px 18px",
        borderRadius: 22,
        backgroundColor: "rgba(5,29,94,0.92)",
        border: "1.5px solid rgba(230,179,242,0.45)",
        boxShadow: `0 10px 28px rgba(0,0,0,0.35), 0 0 22px rgba(230,179,242,${0.22 * appear})`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 24}px) scale(${0.94 + appear * 0.06})`,
        transformOrigin: "100% 0%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        fontFamily: GILROY,
        color: COLORS.white,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 22, letterSpacing: "0.12em", ...rise(start + 4, 10) }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.lilac }} />
        {label}
      </div>
      <div
        style={{
          fontWeight: WEIGHT.extraBold,
          fontSize: 44,
          lineHeight: 1.05,
          clipPath: `inset(0 ${interpolate(frame, [datesAt, datesAt + 10], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}% 0 0)`,
          opacity: interpolate(frame, [datesAt, datesAt + 4], [0, 1], clamp),
        }}
      >
        {dates}
      </div>
      {note ? <div style={{ fontWeight: WEIGHT.medium, fontSize: 22, color: COLORS.lilac, ...rise(start + 30, 8) }}>{note}</div> : null}
    </div>
  );
};
