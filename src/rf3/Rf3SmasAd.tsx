import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { gilroy } from "../lazerhall/fonts";

// SMAS-lifting version of the "3рф" story. The original burned its overlay
// into footage of another procedure, so the overlay is rebuilt here on top of
// LAZERHALL's SMAS footage: same elements and styling, cuts on the original's
// cut times so its soundtrack still lines up. Positions follow the original
// (source px × 1.5) with the client's corrections: a bigger, lower title and
// the info block raised clear of Instagram's ad CTA.
export const FPS = 30;
export const DURATION_IN_FRAMES = 528; // 17.6s, the original length

const s = (seconds: number) => Math.round(seconds * FPS);
const k = (px: number) => px * 1.5;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BRAND_BLUE = "#051D5E";
// The original's light violet accent, moved to blue at the same lightness.
const LIGHT_BLUE = "#93AEF0";
const textShadow = "0 2px 10px rgba(0,0,0,0.45)";

// How far the whole info block sits above its original position.
const RAISE = 190;
const low = (px: number) => k(px) - RAISE;

// Cut times are the original's.
const SHOTS = [
  { src: "smas-2", from: 0, to: 1.93, sourceStart: 13.2 }, // handpiece on the cheek
  { src: "smas-1", from: 1.93, to: 8.4, sourceStart: 0.0 }, // under the jaw (behind the photos)
  { src: "smas-3", from: 8.4, to: 10.23, sourceStart: 3.8 }, // jawline measured in profile
  { src: "smas-1", from: 10.23, to: 12.1, sourceStart: 7.0 }, // specialist at the device
  { src: "smas-1", from: 12.1, to: 13.13, sourceStart: 12.0 }, // forehead close-up
  { src: "smas-3", from: 13.13, to: 14.1, sourceStart: 9.2 }, // handpiece along the marking
  { src: "smas-2", from: 14.1, to: 15.73, sourceStart: 6.0 }, // LAZERHALL specialist
  { src: "smas-2", from: 15.73, to: 17.6, sourceStart: 15.5 }, // cheek, closing shot
];

// Before/after cards in the original's slots; its last card is dropped.
const RESULTS = [
  { from: 2.75, to: 4.3, kind: "pair" as const },
  { from: 4.5, to: 6.0, kind: "single" as const, src: "rf3/img/result-a.png" },
  { from: 6.35, to: 7.9, kind: "single" as const, src: "rf3/img/result-b.png" },
];

const CARD = { left: 280, top: 420, size: 520 };

const Footage: React.FC = () => (
  <>
    {SHOTS.map((shot) => (
      <Sequence key={`${shot.src}-${shot.from}`} from={s(shot.from)} durationInFrames={s(shot.to) - s(shot.from)}>
        <Video
          src={staticFile(`smas/video/${shot.src}.mp4`)}
          trimBefore={s(shot.sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </Sequence>
    ))}
    {/* the original's dark top and bottom shading under the text */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(8,8,16,0.85) 0%, rgba(8,8,16,0.55) 22%, rgba(8,8,16,0) 38%, rgba(8,8,16,0) 46%, rgba(8,8,16,0.55) 60%, rgba(8,8,16,0.88) 78%, rgba(8,8,16,0.92) 100%)",
      }}
    />
  </>
);

const ResultCard: React.FC<{ kind: "pair" | "single"; src?: string }> = ({ kind, src }) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 6], [-(CARD.left + CARD.size), 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const half: React.CSSProperties = { width: "50%", height: "100%", objectFit: "cover" };
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.left,
        top: CARD.top,
        width: CARD.size,
        height: CARD.size,
        borderRadius: 22,
        overflow: "hidden",
        border: "3px solid rgba(255,255,255,0.75)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        transform: `translateX(${slide}px)`,
      }}
    >
      {kind === "pair" ? (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <Img src={staticFile("smas/img/before.png")} style={half} />
          <Img src={staticFile("smas/img/after.png")} style={half} />
        </div>
      ) : (
        <Img src={staticFile(src!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 22px",
          borderRadius: 30,
          backgroundColor: "#fff",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 24,
          color: BRAND_BLUE,
          whiteSpace: "nowrap",
        }}
      >
        до / після
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 262,
        width: "100%",
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: gilroy,
        fontWeight: 500,
        fontSize: 35,
        color: "#fff",
        textShadow,
      }}
    >
      Підтягнута шкіра без філерів і скальпеля
    </div>
    <div
      style={{
        position: "absolute",
        top: 345,
        width: "100%",
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: gilroy,
        fontWeight: 800,
        fontSize: 120,
        lineHeight: 1,
        whiteSpace: "nowrap",
        filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.5))",
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
      top: low(811),
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
    <span style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 6, color: "rgba(5,29,94,0.55)" }}>
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
      top: low(770),
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

const BENEFITS = [
  { icon: "icon-drop", cx: 89.5, cy: 926, w: 30, x: 125, y: 904, text: "Глибокий ліфтинг\nта ущільнення шкіри" },
  { icon: "icon-waves", cx: 89.5, cy: 990, w: 25, x: 125, y: 970, text: "Стимуляція колагену\nбез операцій" },
  { icon: "icon-loop", cx: 399.5, cy: 926, w: 26, x: 436, y: 904, text: "Чіткіший овал,\nрівніша текстура" },
  { icon: "icon-check", cx: 399.5, cy: 992, w: 20, x: 436, y: 970, text: "Зменшення\nвидимості зморшок" },
];

const Benefits: React.FC = () => (
  <>
    {BENEFITS.map((b) => (
      <React.Fragment key={b.icon}>
        <Img
          src={staticFile(`rf3/img/${b.icon}.png`)}
          style={{
            position: "absolute",
            left: k(b.cx),
            top: low(b.cy),
            width: k(b.w),
            transform: "translate(-50%, -50%)",
            // icons are white masks tinted with the light accent blue
            filter: "brightness(0) saturate(100%) invert(72%) sepia(29%) saturate(1095%) hue-rotate(194deg) brightness(99%) contrast(92%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: k(b.x),
            top: low(b.y) - 6,
            whiteSpace: "pre-line",
            fontFamily: gilroy,
            fontWeight: 500,
            fontSize: 34,
            lineHeight: 1.08,
            color: "#fff",
            textShadow,
          }}
        >
          {b.text}
        </div>
      </React.Fragment>
    ))}
  </>
);

const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: low(1073.5),
          width: "100%",
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "#fff",
          textShadow,
        }}
      >
        ОТРИМАЙТЕ ЗНИЖКУ -50%
      </div>
      <div
        style={{
          position: "absolute",
          top: low(1111),
          width: "100%",
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 34,
          color: LIGHT_BLUE,
        }}
      >
        запишіться на процедуру вже зараз
      </div>
      <svg
        width="26"
        height="36"
        viewBox="0 0 26 36"
        style={{
          position: "absolute",
          left: 540 - 13,
          top: low(1152) + Math.sin(frame / 8) * 3,
        }}
      >
        <path d="M13 2 V32 M3 22 L13 32 L23 22" stroke={LIGHT_BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </>
  );
};

export const Rf3SmasAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage />
    {RESULTS.map((r) => (
      <Sequence key={r.from} from={s(r.from)} durationInFrames={s(r.to) - s(r.from)}>
        <ResultCard kind={r.kind} src={r.kind === "single" ? r.src : undefined} />
      </Sequence>
    ))}
    <Header />
    <PricePill />
    <DatePlate />
    <Benefits />
    <CallToAction />
    <Audio src={staticFile("rf3/audio/music.m4a")} />
  </AbsoluteFill>
);
