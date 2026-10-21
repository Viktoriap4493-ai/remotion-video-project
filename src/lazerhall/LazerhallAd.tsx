import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { gilroy } from "./fonts";
import {
  ADVANTAGES,
  BEFORE_AFTER_END,
  BRAND_BLUE,
  CLIPS,
  OUTRO,
  PRICE,
  s,
} from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const textShadow = "0 2px 10px rgba(0,0,0,0.35)";

// Before/after photo opened by a vertical edge travelling right → left.
const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const edge = interpolate(frame, [5, 50], [100, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <Img
        src={staticFile("lazerhall/img/before.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge}%)` }}>
        <Img
          src={staticFile("lazerhall/img/after.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Footage: React.FC = () => (
  <>
    {CLIPS.map((clip) => (
      <Sequence
        key={`${clip.src}-${clip.from}`}
        from={s(clip.from)}
        durationInFrames={s(clip.to) - s(clip.from)}
      >
        <Video
          src={staticFile(`lazerhall/video/${clip.src}.mp4`)}
          trimBefore={s(clip.sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.24) 35%, rgba(0,0,0,0.24) 100%)",
          }}
        />
      </Sequence>
    ))}
  </>
);

// Warm light flash that hides the cut on every advantage change.
const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = Math.max(
    0,
    ...ADVANTAGES.slice(1).map(({ at }) =>
      interpolate(frame, [at - 6, at, at + 8], [0, 0.85, 0], clamp),
    ),
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(circle at 70% 40%, rgba(255,250,240,1) 0%, rgba(255,196,120,0.9) 40%, rgba(240,140,60,0.55) 75%, rgba(200,90,40,0.3) 100%)",
        mixBlendMode: "screen",
      }}
    />
  );
};

const Pin: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
    <g transform="rotate(40 32 32)">
      <rect x="29.5" y="36" width="5" height="24" rx="2" fill="#9aa3ad" />
      <path d="M20 10 h24 l-4 14 l8 10 H16 l8-10z" fill="#e5322d" />
      <rect x="18" y="6" width="28" height="7" rx="3.5" fill="#c41e1a" />
    </g>
  </svg>
);

const Asterisk: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {[0, 45, 90, 135].map((a) => (
      <rect
        key={a}
        x="10.6"
        y="1"
        width="2.8"
        height="22"
        rx="1.4"
        fill={color}
        transform={`rotate(${a} 12 12)`}
      />
    ))}
  </svg>
);

const Header: React.FC = () => (
  <>
    <Img
      src={staticFile("lazerhall/img/logo.png")}
      style={{
        position: "absolute",
        top: 128,
        left: "50%",
        height: 104,
        transform: "translateX(-50%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 315,
        width: "100%",
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: gilroy,
        fontWeight: 800,
        fontSize: 80,
        lineHeight: 1,
        color: "#fff",
        textShadow,
      }}
    >
      LAZERHALL
    </div>
    <div
      style={{
        position: "absolute",
        top: 430,
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: 100,
        padding: "0 30px",
        borderRadius: 50,
        backgroundColor: BRAND_BLUE,
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        fontFamily: gilroy,
        fontWeight: 500,
        fontSize: 47,
        color: "#fff",
      }}
    >
      ЛІКУВАННЯ КУПЕРОЗУ ТА ПІГМЕНТАЦІЇ
    </div>
  </>
);

const SWAP_FRAMES = 12;

// Advantages travel as one horizontal strip: the current line leaves to
// the left while the next one arrives from the right.
const Advantages: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {ADVANTAGES.map(({ text, at }, i) => {
        const next = ADVANTAGES[i + 1]?.at;
        const enter = interpolate(frame, [at, at + SWAP_FRAMES], [1080, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const exit =
          next === undefined
            ? 0
            : interpolate(frame, [next, next + SWAP_FRAMES], [0, -1080], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              });
        if (frame < at || (next !== undefined && frame > next + SWAP_FRAMES)) {
          return null;
        }
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              top: 542,
              width: "100%",
              transform: `translate(${enter + exit}px, -50%)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              whiteSpace: "nowrap",
              fontFamily: gilroy,
              fontWeight: 500,
              fontSize: 39,
              color: "#fff",
              textShadow,
            }}
          >
            <Pin size={44} />
            {text}
          </div>
        );
      })}
    </>
  );
};

const PriceBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeBlur = (start: number, length: number) => ({
    opacity: interpolate(frame, [start, start + length], [0, 1], clamp),
    filter: `blur(${interpolate(frame, [start, start + length], [10, 0], clamp)}px)`,
  });
  const pillScale = interpolate(frame, [PRICE.pillIn, PRICE.pillIn + 5], [0.7, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const pillOpacity = interpolate(frame, [PRICE.pillIn, PRICE.pillIn + 3], [0, 1], clamp);
  const textShift = interpolate(frame, [PRICE.textIn, PRICE.textIn + 8], [-120, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const textBlur = interpolate(frame, [PRICE.textIn, PRICE.textIn + 8], [14, 0], clamp);
  const textOpacity = interpolate(frame, [PRICE.textIn, PRICE.textIn + 4], [0, 1], clamp);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 1305,
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 62,
          lineHeight: 1,
          color: "#fff",
          textShadow,
          ...fadeBlur(PRICE.oldIn, 5),
        }}
      >
        3000 грн
        <div
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            top: "50%",
            height: 4,
            backgroundColor: "#fff",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1418,
          left: "50%",
          transform: `translate(-50%, -50%) scale(${pillScale})`,
          opacity: pillOpacity,
          height: 120,
          padding: "0 52px",
          borderRadius: 60,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontFamily: gilroy,
          color: BRAND_BLUE,
          fontSize: 64,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            transform: `translateX(${textShift}px)`,
            filter: `blur(${textBlur}px)`,
            opacity: textOpacity,
          }}
        >
          <span style={{ fontWeight: 800 }}>1800 грн</span>
          <span style={{ fontWeight: 500 }}> — процедура</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1525,
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: 56,
          padding: "0 20px",
          borderRadius: 12,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 10,
          whiteSpace: "nowrap",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 33,
          color: BRAND_BLUE,
          ...fadeBlur(PRICE.noteIn, 5),
        }}
      >
        <Asterisk size={28} color={BRAND_BLUE} />
        Пропозиція діє на перший візит до кінця місяця
      </div>

      <div
        style={{
          position: "absolute",
          top: 1578,
          left: "50%",
          transform: `translateX(-50%) scale(${pillScale})`,
          opacity: pillOpacity,
          padding: "16px 64px 12px",
          borderRadius: 28,
          backgroundColor: BRAND_BLUE,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: "0.04em",
          color: "#fff",
        }}
      >
        ЗАПИСАТИСЯ
        <svg width="34" height="30" viewBox="0 0 34 30">
          <path
            d="M17 2 V26 M5 15 L17 27 L29 15"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [OUTRO.cardIn, OUTRO.cardIn + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile("lazerhall/img/logo.png")}
        style={{
          position: "absolute",
          top: 634,
          left: "50%",
          width: 520,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1115,
          width: "100%",
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 40,
          color: "#fff",
        }}
      >
        <Pin size={42} />
        вул. Мирослава Скорика, 16
      </div>
    </AbsoluteFill>
  );
};

export const LazerhallAd: React.FC = () => {
  const frame = useCurrentFrame();
  const mainOpacity = interpolate(frame, [OUTRO.fadeOut, OUTRO.fadeOut + 10], [1, 0], clamp);
  const musicVolume = (f: number) =>
    interpolate(f, [s(20.9) - 6, s(20.9)], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_BLUE }}>
      <AbsoluteFill style={{ opacity: mainOpacity }}>
        <Sequence durationInFrames={BEFORE_AFTER_END}>
          <BeforeAfter />
        </Sequence>
        <Footage />
        <LightLeak />
        <Header />
        <Advantages />
        <PriceBlock />
      </AbsoluteFill>
      <EndCard />

      <Audio src={staticFile("lazerhall/audio/music.m4a")} volume={musicVolume} />
      {ADVANTAGES.map(({ at }) => (
        <Sequence key={at} from={at} durationInFrames={s(0.2)}>
          <Audio src={staticFile("lazerhall/audio/click.wav")} volume={0.9} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
