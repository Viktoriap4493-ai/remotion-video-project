import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio, Video } from "@remotion/media";
import { gilroy } from "../lazerhall/fonts";

// Point adaptation of the "3рф" story for SMAS-lifting. The footage, its
// static overlay, transitions and soundtrack are the original's; the old
// title and "-45%" are inpainted out and the violet accents turned blue by
// scripts/clean_rf3.py. Here the new texts and the redrawn price pill and
// date plate go back on at the original coordinates (source px × 1.5).
export const FPS = 30;
export const DURATION_IN_FRAMES = 528; // 17.6s, the original length

const BRAND_BLUE = "#051D5E";
// The original's light violet accent, moved to blue at the same lightness.
const LIGHT_BLUE = "#93AEF0";
const k = (px: number) => px * 1.5;

const Title: React.FC = () => (
  <>
    {/* soft shade over the cleaned title area, like the original's dark top */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: k(140),
        height: k(130),
        background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: k(200),
        width: "100%",
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: gilroy,
        fontWeight: 800,
        fontSize: 89,
        lineHeight: 1,
        whiteSpace: "nowrap",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))",
      }}
    >
      <span style={{ fontStyle: "italic", fontWeight: 600, color: LIGHT_BLUE }}>SMAS-</span>
      <span
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 45%, #c9cbd3 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        ЛІФТИНГ
      </span>
    </div>
  </>
);

const PricePill: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: k(71),
      top: k(811),
      width: k(649 - 71),
      height: k(874 - 811),
      borderRadius: k(32),
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 26,
      fontFamily: gilroy,
      color: BRAND_BLUE,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: 33 }}>ОБЛИЧЧЯ ПОВНІСТЮ</span>
    <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontWeight: 800, fontSize: 58, letterSpacing: "-0.01em" }}>7 500</span>
      <span style={{ fontWeight: 800, fontSize: 34 }}>ГРН</span>
    </span>
    <span
      style={{
        position: "relative",
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        color: "rgba(5,29,94,0.55)",
      }}
    >
      <span style={{ fontWeight: 500, fontSize: 40, fontStyle: "italic" }}>15 000</span>
      <span style={{ fontWeight: 500, fontSize: 26 }}>ГРН</span>
      <span
        style={{
          position: "absolute",
          left: -4,
          right: -4,
          top: "52%",
          height: 3,
          backgroundColor: "rgba(5,29,94,0.6)",
          transform: "rotate(-7deg)",
        }}
      />
    </span>
  </div>
);

const DatePlate: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: k(456),
      top: k(770),
      width: k(658 - 456),
      height: k(821 - 770),
      borderRadius: k(26),
      backgroundColor: BRAND_BLUE,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: gilroy,
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: 28,
      color: "#fff",
      whiteSpace: "nowrap",
    }}
  >
    BLACK FRIDAY SALE
  </div>
);

const DiscountLine: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: k(1073.5),
      width: "100%",
      transform: "translateY(-50%)",
      textAlign: "center",
      fontFamily: gilroy,
      fontWeight: 800,
      fontSize: 50,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      color: "#fff",
      textShadow: "0 2px 10px rgba(0,0,0,0.45)",
    }}
  >
    ОТРИМАЙТЕ ЗНИЖКУ -50%
  </div>
);

export const Rf3SmasAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Video src={staticFile("rf3/video/clean.mp4")} style={{ width: "100%", height: "100%" }} objectFit="cover" muted />
    <Title />
    <PricePill />
    <DatePlate />
    <DiscountLine />
    <Audio src={staticFile("rf3/audio/music.m4a")} />
  </AbsoluteFill>
);
