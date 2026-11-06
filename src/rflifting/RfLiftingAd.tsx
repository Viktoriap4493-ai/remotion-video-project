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

// Adaptation of the "RF ліфтинг" reference story: same layout and shot order,
// LAZERHALL footage, brand blue, Gilroy. The reference track runs at 120 BPM,
// so every entrance below lands on a beat (multiples of 0.5s).
export const FPS = 30;
export const DURATION_IN_FRAMES = 403; // 13.43s, the reference length

const BRAND_BLUE = "#051D5E";
const s = (seconds: number) => Math.round(seconds * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shadow = "0 2px 12px rgba(0,0,0,0.45)";

// Shot order follows the reference: device → handpiece → face → face → close-up → face.
const SHOTS = [
  { src: "device-wide", from: 0, to: 1.27, sourceStart: 6.0, rate: 1 },
  { src: "face-procedure", from: 1.27, to: 3.27, sourceStart: 0.5, rate: 1 },
  { src: "face-procedure", from: 3.27, to: 6.4, sourceStart: 3.45, rate: 1 },
  { src: "hand-handpiece", from: 6.4, to: 8.7, sourceStart: 2.0, rate: 0.9 },
  { src: "hand-handpiece", from: 8.7, to: 10.1, sourceStart: 4.25, rate: 1 },
  { src: "face-procedure", from: 10.1, to: 13.43, sourceStart: 7.85, rate: 1 },
];

const BEATS = {
  discountSlam: 0,
  discountSettle: 2.0,
  title: 1.0,
  subtitle: 1.5,
  address: 2.0,
  price: 2.5,
  strike: 3.0,
  band: 3.5,
  license: 4.5,
  // the Black Friday Sale plate opens together with the "-50%" slam
  plateTag: 0,
  platePill: 0.25,
  plateExit: 1.75,
};

const fadeUp = (frame: number, start: number, length = 8, distance = 30) => ({
  opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [start, start + length], [distance, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const Footage: React.FC = () => (
  <>
    {SHOTS.map((shot) => {
      const length = s(shot.to) - s(shot.from);
      return (
        <Sequence key={`${shot.src}-${shot.from}`} from={s(shot.from)} durationInFrames={length}>
          <ShotLayer src={shot.src} sourceStart={shot.sourceStart} rate={shot.rate} length={length} />
        </Sequence>
      );
    })}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 34%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.6) 100%)",
      }}
    />
  </>
);

const ShotLayer: React.FC<{ src: string; sourceStart: number; rate: number; length: number }> = ({
  src,
  sourceStart,
  rate,
  length,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, length], [1.02, 1.08])})` }}>
        <Video
          src={staticFile(`blackfriday/video/${src}.mp4`)}
          trimBefore={s(sourceStart)}
          playbackRate={rate}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Pin: React.FC = () => (
  <svg width="30" height="38" viewBox="0 0 24 30" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 30 12 30s12-9.7 12-18.4C24 5.2 18.6 0 12 0z" fill="#e5322d" />
    <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
  </svg>
);

// Top block: address, "RF ЛІФТИНГ" between two rules, subtitle.
const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const title = s(BEATS.title);
  const rule = interpolate(frame, [title, title + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ruleStyle: React.CSSProperties = {
    position: "absolute",
    left: 140,
    width: 800,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.85)",
    transform: `scaleX(${rule})`,
  };
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 216,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 34,
          color: "#fff",
          textShadow: shadow,
          ...fadeUp(frame, s(BEATS.address), 8, -20),
        }}
      >
        <Pin />
        Львів, вул. Мирослава Скорика, 16
      </div>
      <div style={{ ...ruleStyle, top: 290 }} />
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 124,
          lineHeight: 1.2,
          color: "#fff",
          textShadow: shadow,
          clipPath: `inset(${interpolate(frame, [title + 2, title + 11], [100, 0], clamp)}% 0 0 0)`,
          transform: `translateY(${interpolate(frame, [title + 2, title + 11], [40, 0], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          })}px)`,
        }}
      >
        RF ЛІФТИНГ
      </div>
      <div style={{ ...ruleStyle, top: 462 }} />
      <div
        style={{
          position: "absolute",
          top: 488,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.25,
          color: "#fff",
          textShadow: shadow,
          ...fadeUp(frame, s(BEATS.subtitle)),
        }}
      >
        БЕЗОПЕРАЦІЙНА РАДІОХВИЛЬОВА
        <br />
        ПІДТЯЖКА ОБЛИЧЧЯ
      </div>
    </>
  );
};

// "-50%": slams in big at the centre on the first beat, then settles above the price.
const Discount: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const settleStart = s(BEATS.discountSettle);
  const settle = interpolate(frame, [settleStart, settleStart + 11], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const flash = interpolate(frame, [0, 2, 9], [0, 0.7, 0], clamp);
  // one gentle pulse per bar once settled, like the reference's breathing "-50%"
  const pulse = frame > settleStart + 11 ? 1 + 0.045 * Math.max(0, Math.cos(((frame - settleStart) / fps) * Math.PI)) : 1;
  const centerX = 540;
  const centerY = 1060;
  const finalX = 800;
  const finalY = 1188;
  const x = interpolate(settle, [0, 1], [centerX, finalX]);
  const y = interpolate(settle, [0, 1], [centerY, finalY]);
  const scale = interpolate(settle, [0, 1], [interpolate(slam, [0, 1], [3.2, 1.9]), 1]) * pulse;
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.35)", opacity: 1 - settle }} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: Math.min(1, slam * 2),
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

const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const start = s(BEATS.price);
  const strike = s(BEATS.strike);
  const enter = (offset: number) => ({
    opacity: interpolate(frame, [start + offset, start + offset + 7], [0, 1], clamp),
    transform: `translateX(${interpolate(frame, [start + offset, start + offset + 9], [-50, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    })}px)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1290,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 26,
        fontFamily: gilroy,
        color: "#fff",
        textShadow: shadow,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontWeight: 500, fontSize: 42, ...enter(0) }}>обличчя повністю</span>
      <span style={{ fontWeight: 800, fontSize: 60, ...enter(3) }}>4 400 грн</span>
      <span
        style={{
          position: "relative",
          fontWeight: 500,
          fontSize: 44,
          opacity: interpolate(frame, [start + 6, start + 12], [0, 0.9], clamp),
        }}
      >
        8 800 грн
        <span
          style={{
            position: "absolute",
            left: -6,
            right: -6,
            top: "52%",
            height: 4,
            backgroundColor: "#fff",
            transformOrigin: "left center",
            transform: `rotate(-8deg) scaleX(${interpolate(frame, [strike, strike + 7], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            })})`,
          }}
        />
      </span>
    </div>
  );
};

const BENEFITS = ["чіткий овал", "підтягнута шкіра", "менше зморшок"];

const BenefitsBand: React.FC = () => {
  const frame = useCurrentFrame();
  const start = s(BEATS.band);
  const wipe = interpolate(frame, [start, start + 9], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 1418,
          left: 0,
          width: 1080,
          height: 78,
          backgroundColor: BRAND_BLUE,
          clipPath: `inset(0 ${wipe}% 0 0)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 36,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {BENEFITS.map((b, i) => (
          <span key={b} style={{ opacity: interpolate(frame, [start + 5 + i * 4, start + 11 + i * 4], [0, 1], clamp) }}>
            • {b}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1520,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 16,
          color: "#fff",
          textShadow: shadow,
          ...fadeUp(frame, s(BEATS.license), 8, 16),
        }}
      >
        працюємо за ліцензією МОЗ | процедуру виконує лікар
      </div>
    </>
  );
};

// The supplied Black Friday Sale plate (shown with the opening "-50%"), split into its two parts:
// the "sale" tag lands first, the "Black Friday" pill slides out from under it,
// then the pill tucks back in and the tag pops away.
const PLATE_W = 851;
const PLATE_H = 194;
const TAG_LEFT = 573;

const BlackFridayPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tagStart = s(BEATS.plateTag);
  const pillStart = s(BEATS.platePill);
  const exitStart = s(BEATS.plateExit);
  if (frame < tagStart - 1 || frame > exitStart + 14) {
    return null;
  }
  const tagIn = spring({ frame: frame - tagStart, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const tagOut = interpolate(frame, [exitStart + 7, exitStart + 13], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.back(2)),
  });
  const pillOpen = interpolate(frame, [pillStart, pillStart + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pillClose = interpolate(frame, [exitStart, exitStart + 7], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const reveal = pillOpen * pillClose;
  const hidden = TAG_LEFT * (1 - reveal);
  const breathe = 1 + Math.sin((frame - tagStart) / 7) * 0.012;
  const dim = Math.min(
    interpolate(frame, [tagStart - 1, tagStart + 4], [0, 1], clamp),
    interpolate(frame, [exitStart + 6, exitStart + 14], [1, 0], clamp),
  );
  const scale = 1.12 * breathe;
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.35)", opacity: dim }} />
      <div
        style={{
          position: "absolute",
          left: (1080 - PLATE_W * scale) / 2,
          top: 680,
          width: PLATE_W,
          height: PLATE_H,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
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
            transform: `scale(${tagIn * tagOut}) rotate(${interpolate(tagIn, [0, 1], [-35, 0])}deg)`,
          }}
        />
      </div>
    </>
  );
};

export const RfLiftingAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage />
    <Header />
    <Price />
    <BenefitsBand />
    <Discount />
    <BlackFridayPlate />
    <Audio src={staticFile("rflifting/audio/music.m4a")} volume={0.89} />
  </AbsoluteFill>
);
