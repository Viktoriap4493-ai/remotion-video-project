import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { gilroy } from "../lazerhall/fonts";

// Adaptation of the "2рф" reference story: procedure footage under a fixed
// layout, with three before/after collages swapping in a frame on the left.
// The Black Friday intro plays alone on the first music hit; the layout and
// collages follow on later onsets of the reference track (same total length).
export const FPS = 30;
export const DURATION_IN_FRAMES = 382; // 12.73s, the reference length

const BRAND_BLUE = "#051D5E";
const s = (seconds: number) => Math.round(seconds * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 12px rgba(0,0,0,0.5)";

// Music onsets in the reference track (seconds).
// The Black Friday intro plays alone first; the layout only starts once it has
// fully cleared, and every later entrance sits on a music onset.
const BEATS = {
  introExit: 2.6,
  layout: 2.7,
  chips: 3.0,
  bookLine: 3.3,
  price: 4.26,
  strike: 4.76,
};

const SHOTS = [
  { src: "face-procedure", from: 0, to: 2.87, sourceStart: 3.5 },
  { src: "face-procedure", from: 2.87, to: 6.9, sourceStart: 7.0 },
  { src: "hand-handpiece", from: 6.9, to: 8.4, sourceStart: 2.0 },
  { src: "face-procedure", from: 8.4, to: 10.0, sourceStart: 0.4 },
  { src: "hand-handpiece", from: 10.0, to: 11.35, sourceStart: 4.25 },
  { src: "device-wide", from: 11.35, to: 12.73, sourceStart: 6.0 },
];

// Before/after collages, one per music phrase once the layout is up.
const COLLAGES = [
  { file: "053fd1c2-image.jpg", w: 1200, h: 1200, from: 4.26, to: 5.8 },
  { file: "e79167f9-image.jpg", w: 1080, h: 1346, from: 5.8, to: 7.91 },
  { file: "9906e052-image.jpg", w: 736, h: 702, from: 7.91, to: 9.99 },
];

const CHIP_ROWS = [
  ["ДРЯБЛІСТЬ", "ЗМОРШКИ", "НАВИСЛА ПОВІКА"],
  ["БРИЛІ", "ДРУГЕ ПІДБОРІДДЯ", "ГУСЯЧІ ЛАПКИ"],
  ["НОСОГУБНІ СКЛАДКИ"],
];

const CROSSFADE = 4;

const ShotLayer: React.FC<{ src: string; sourceStart: number; length: number; fadeIn: boolean }> = ({
  src,
  sourceStart,
  length,
  fadeIn,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ overflow: "hidden", opacity: fadeIn ? interpolate(frame, [0, CROSSFADE], [0, 1], clamp) : 1 }}
    >
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, length], [1.03, 1.1])})` }}>
        <Video
          src={staticFile(`blackfriday/video/${src}.mp4`)}
          trimBefore={s(sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Footage: React.FC = () => (
  <>
    {SHOTS.map((shot, i) => {
      const length = s(shot.to) - s(shot.from) + (i < SHOTS.length - 1 ? CROSSFADE : 0);
      return (
        <Sequence key={`${shot.src}-${shot.from}`} from={s(shot.from)} durationInFrames={length}>
          <ShotLayer src={shot.src} sourceStart={shot.sourceStart} length={length} fadeIn={i > 0} />
        </Sequence>
      );
    })}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  </>
);

const Pin: React.FC = () => (
  <svg width="30" height="38" viewBox="0 0 24 30" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z" fill="#5aa9ff" />
    <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
  </svg>
);

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = s(BEATS.layout);
  const reveal = interpolate(frame, [t0, t0 + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 236,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: gilroy,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 36,
          color: "#fff",
          textShadow: shadow,
          opacity: reveal,
        }}
      >
        <Pin />
        Львів, вул. Мирослава Скорика, 16
      </div>
      <div
        style={{
          position: "absolute",
          top: 296,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontSize: 128,
          lineHeight: 1.05,
          color: "#fff",
          textShadow: shadow,
          whiteSpace: "nowrap",
          opacity: reveal,
          filter: `blur(${(1 - reveal) * 12}px)`,
          transform: `scale(${1.08 - reveal * 0.08})`,
        }}
      >
        <span style={{ fontWeight: 800 }}>RF </span>
        <span style={{ fontWeight: 500 }}>ЛІФТИНГ</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 448,
          left: "50%",
          transform: `translateX(-50%) scaleX(${reveal})`,
          width: 820,
          padding: "16px 0 18px",
          backgroundColor: BRAND_BLUE,
          border: "2px solid rgba(255,255,255,0.75)",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 37,
          lineHeight: 1.2,
          color: "#fff",
        }}
      >
        НАЙБІЛЬШ ЕФЕКТИВНА <span style={{ fontWeight: 800 }}>МЕТОДИКА</span>
        <br />
        <span style={{ fontWeight: 800 }}>БЕЗОПЕРАЦІЙНОЇ ПІДТЯЖКИ ШКІРИ</span>
      </div>
    </>
  );
};

const BOX = { left: 92, top: 618, maxW: 520, h: 480 };

const Collages: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {COLLAGES.map((c) => {
        const from = s(c.from);
        const to = s(c.to);
        if (frame < from || frame >= to) {
          return null;
        }
        const w = Math.min(BOX.maxW, Math.round((BOX.h * c.w) / c.h));
        const h = Math.round((w * c.h) / c.w);
        const local = frame - from;
        // hard cut in, as in the reference, with a short punch-in
        const punch = interpolate(local, [0, 5], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={c.file}
            style={{
              position: "absolute",
              left: BOX.left,
              top: BOX.top + (BOX.h - h) / 2,
              width: w,
              height: h,
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
              transform: `scale(${punch})`,
              transformOrigin: "50% 50%",
            }}
          >
            <Img
              src={staticFile(`rflifting/img/${c.file}`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: `scale(${interpolate(local, [0, to - from], [1, 1.04])})`,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = s(BEATS.price);
  const pop = spring({ frame: frame - start, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const strike = s(BEATS.strike);
  const line = interpolate(frame, [strike, strike + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const italic: React.CSSProperties = {
    fontFamily: gilroy,
    fontStyle: "italic",
    color: "#fff",
    textShadow: shadow,
    whiteSpace: "nowrap",
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 852,
        right: 72,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        opacity: frame < start ? 0 : 1,
      }}
    >
      <div style={{ ...italic, fontWeight: 500, fontSize: 34, transform: `translateX(${(1 - pop) * 60}px)` }}>
        ОБЛИЧЧЯ ПОВНІСТЮ
      </div>
      <div
        style={{
          ...italic,
          fontWeight: 600,
          fontSize: 78,
          lineHeight: 1.05,
          marginTop: 4,
          transform: `scale(${0.5 + pop * 0.5})`,
          transformOrigin: "100% 50%",
        }}
      >
        4 400 ГРН
      </div>
      <div style={{ ...italic, position: "relative", fontWeight: 500, fontSize: 44, opacity: 0.9 }}>
        8 800 ГРН
        <span
          style={{
            position: "absolute",
            left: -8,
            right: -8,
            top: "50%",
            height: 4,
            backgroundColor: "#fff",
            transformOrigin: "left center",
            transform: `rotate(-10deg) scaleX(${line})`,
          }}
        />
      </div>
    </div>
  );
};

const Indications: React.FC = () => {
  const frame = useCurrentFrame();
  const start = s(BEATS.chips);
  let index = 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 92,
          fontFamily: gilroy,
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 46,
          color: "#fff",
          textShadow: shadow,
          opacity: interpolate(frame, [start, start + 5], [0, 1], clamp),
        }}
      >
        ПОКАЗАННЯ:
      </div>
      <div
        style={{
          position: "absolute",
          top: 1222,
          left: 92,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {CHIP_ROWS.map((row) => (
          <div key={row[0]} style={{ display: "flex", gap: 16 }}>
            {row.map((chip) => {
              const at = start + 2 + index++ * 2;
              return (
                <div
                  key={chip}
                  style={{
                    padding: "8px 16px",
                    border: "2px solid rgba(255,255,255,0.8)",
                    borderRadius: 6,
                    backgroundColor: "rgba(5,29,94,0.35)",
                    fontFamily: gilroy,
                    fontWeight: 500,
                    fontSize: 37,
                    lineHeight: 1.1,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
                    filter: `blur(${interpolate(frame, [at, at + 5], [6, 0], clamp)}px)`,
                  }}
                >
                  {chip}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

// "Бронюй візит зі знижкою -50%" flickers like the reference line.
const BookLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flicker = 0.55 + 0.45 * Math.abs(Math.cos((frame / fps) * Math.PI * 1.25));
  return (
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: 92,
        fontFamily: gilroy,
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 44,
        color: "#fff",
        textShadow: shadow,
        opacity: interpolate(frame, [s(BEATS.bookLine), s(BEATS.bookLine) + 6], [0, 1], clamp) * flicker,
      }}
    >
      БРОНЮЙ ВІЗИТ ЗІ ЗНИЖКОЮ -50%
    </div>
  );
};

// Opening hit: "-50%" slams in with the supplied Black Friday Sale plate,
// holds, then both clear out completely before any other text appears.
const PLATE_W = 851;
const PLATE_H = 194;
const TAG_LEFT = 573;

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = s(BEATS.introExit);
  if (frame > exit) {
    return null;
  }
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const tagIn = spring({ frame, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const pillOpen = interpolate(frame, [7, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const leave = interpolate(frame, [exit - 12, exit], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const reveal = pillOpen * (1 - interpolate(frame, [exit - 12, exit - 5], [0, 1], clamp));
  const hidden = TAG_LEFT * (1 - reveal);
  const flash = interpolate(frame, [0, 2, 9], [0, 0.7, 0], clamp);
  const plateScale = 1.12;
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "rgba(2,10,40,0.62)", opacity: 1 - leave }} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <div
        style={{
          position: "absolute",
          left: (1080 - PLATE_W * plateScale) / 2,
          top: 690,
          width: PLATE_W,
          height: PLATE_H,
          transform: `scale(${plateScale})`,
          transformOrigin: "0 0",
          opacity: 1 - leave,
          filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))",
        }}
      >
        <Img
          src={staticFile("rflifting/img/bf-pill.png")}
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
          src={staticFile("rflifting/img/bf-sale-tag.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: PLATE_W,
            height: PLATE_H,
            transformOrigin: "84% 45%",
            transform: `scale(${tagIn}) rotate(${interpolate(tagIn, [0, 1], [-35, 0])}deg)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1080,
          transform: `translate(-50%, -50%) scale(${interpolate(slam, [0, 1], [3.2, 1.9]) * (1 - leave * 0.4)})`,
          opacity: Math.min(1, slam * 2) * (1 - leave),
          padding: "6px 30px 10px",
          borderRadius: 26,
          backgroundColor: BRAND_BLUE,
          boxShadow: "0 12px 34px rgba(0,0,0,0.35)",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 1,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        -50%
      </div>
    </>
  );
};

export const RfLiftingAd2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage />
    <Header />
    <Collages />
    <Price />
    <Indications />
    <BookLine />
    <Intro />
    <Audio src={staticFile("rflifting/audio/music2.m4a")} />
  </AbsoluteFill>
);
