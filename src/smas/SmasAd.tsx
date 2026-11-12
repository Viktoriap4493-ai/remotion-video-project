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

// LAZERHALL SMAS-lifting Black Friday story rebuilt on the IMG_9363 reference:
// same text layout, word-by-word blur captions, light-leak cut and the
// reference soundtrack (music with its whooshes). Times are the reference's.
export const FPS = 30;
export const DURATION_IN_FRAMES = 440; // 14.67s, the reference length

const s = (seconds: number) => Math.round(seconds * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Highlight blue sampled from the reference captions.
const ACCENT = "#0044C9";
const textShadow = "0 2px 10px rgba(0,0,0,0.55)";
const accentShadow = "0 0 14px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.6)";

const INTRO_END = 4.33;

// Shots picked from the three LAZERHALL clips to match each caption.
const SHOTS = [
  { src: "smas-1", from: 0, to: INTRO_END, sourceStart: 0.3 }, // handpiece under the jaw
  { src: "smas-3", from: INTRO_END, to: 6.5, sourceStart: 9.0 }, // cheekbone with marking
  { src: "smas-3", from: 6.5, to: 8.5, sourceStart: 3.7 }, // jawline measured in profile
  { src: "smas-3", from: 8.5, to: 10.45, sourceStart: 0.4 }, // hands lifting the face
  { src: "smas-1", from: 10.45, to: 12.5, sourceStart: 11.9 }, // forehead close-up
  { src: "smas-2", from: 12.5, to: 14.67, sourceStart: 8.8 }, // LAZERHALL specialist
];

type Word = { text: string; accent?: boolean };

const w = (line: string): Word[] =>
  line.split(" ").map((part) =>
    part.startsWith("*") ? { text: part.slice(1).replace(/_/g, " "), accent: true } : { text: part.replace(/_/g, " ") },
  );

// "*" marks a highlighted word, "_" keeps words inside one highlight.
const CAPTIONS: { lines: Word[][]; from: number; to: number }[] = [
  { lines: [w("Виразні *вилиці й рівний"), w("контур *підборіддя")], from: 4.45, to: 6.45 },
  { lines: [w("Підтягнутий та чіткий"), w("*овал_обличчя")], from: 6.5, to: 8.45 },
  { lines: [w("Свіжий, *відпочилий_вигляд без"), w("ефекту «перетягнутого» обличчя")], from: 8.5, to: 10.4 },
  { lines: [w("Зменшення *зморшок і *провисань")], from: 10.45, to: 12.45 },
  { lines: [w("Для запису, пиши"), w("*“SMAS” у дірект!")], from: 12.5, to: 14.67 },
];

const ShotLayer: React.FC<{ src: string; sourceStart: number; length: number }> = ({ src, sourceStart, length }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, length], [1.04, 1.1])})` }}>
        <Video
          src={staticFile(`smas/video/${src}.mp4`)}
          trimBefore={s(sourceStart)}
          style={{ width: "100%", height: "100%" }}
          objectFit="cover"
          muted
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Darker, warmer grade like the reference so white text reads on bright footage.
const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const endDim = interpolate(frame, [s(13.6), s(14.67)], [0, 0.55], clamp);
  return (
    <>
      {SHOTS.map((shot) => {
        const length = s(shot.to) - s(shot.from);
        return (
          <Sequence key={`${shot.src}-${shot.from}`} from={s(shot.from)} durationInFrames={length}>
            <ShotLayer src={shot.src} sourceStart={shot.sourceStart} length={length} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ backgroundColor: "rgba(40,22,10,0.32)" }} />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.45) 100%)" }}
      />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: endDim }} />
    </>
  );
};

// Warm orange light leak flashing over a cut, as in the reference.
const LightLeak: React.FC<{ at: number; peak: number }> = ({ at, peak }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [s(at) - 4, s(at), s(at) + 9], [0, peak, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "screen",
        background:
          "radial-gradient(circle at 35% 30%, rgba(255,214,150,1) 0%, rgba(255,150,40,0.95) 40%, rgba(230,110,20,0.7) 75%, rgba(180,70,10,0.4) 100%)",
      }}
    />
  );
};

const PHOTO = { top: 97, width: 410, height: 832, beforeLeft: 86, afterLeft: 586 };

const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [s(INTRO_END) - 2, s(INTRO_END) + 1], [1, 0], clamp);
  const slide = (start: number, from: number) =>
    interpolate(frame, [s(start), s(start) + 7], [from, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const photo = (src: string, left: number, start: number, from: number) =>
    frame < s(start) ? null : (
      <div
        style={{
          position: "absolute",
          top: PHOTO.top,
          left,
          width: PHOTO.width,
          height: PHOTO.height,
          overflow: "hidden",
          opacity: exit,
          transform: `translateX(${slide(start, from)}px)`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  return (
    <>
      {photo("smas/img/before.png", PHOTO.beforeLeft, 1.75, -520)}
      {photo("smas/img/after.png", PHOTO.afterLeft, 2.4, 520)}
    </>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [s(INTRO_END) - 2, s(INTRO_END) + 1], [1, 0], clamp);
  const titleIn = interpolate(frame, [s(1.4), s(1.4) + 8], [0, 1], clamp);
  const pctIn = interpolate(frame, [s(1.55), s(1.55) + 8], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 1196,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 88,
          lineHeight: 1.1,
          color: "#fff",
          textShadow,
          opacity: titleIn * exit,
          filter: `blur(${(1 - titleIn) * 10}px)`,
        }}
      >
        СМАС-ліфтинг
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          width: "100%",
          textAlign: "center",
          fontFamily: gilroy,
          fontWeight: 500,
          fontSize: 42,
          color: "rgba(255,255,255,0.85)",
          textShadow,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp) * exit,
        }}
      >
        безОпераційна підтяжка обличчя
      </div>
      <div
        style={{
          position: "absolute",
          top: 1378,
          left: 610,
          fontFamily: gilroy,
          fontWeight: 800,
          fontSize: 135,
          lineHeight: 1,
          color: ACCENT,
          textShadow: "0 6px 16px rgba(0,0,0,0.75)",
          opacity: pctIn * exit,
          filter: `blur(${(1 - pctIn) * 12}px)`,
        }}
      >
        -50%
      </div>
    </>
  );
};

// The original Black Friday Sale sticker (PNG with the background removed),
// split into the pill and the tag: the tag drops in on the reference whoosh,
// the pill slides out from under it, both leave with the light leak.
const PLATE_W = 851;
const PLATE_H = 194;
const TAG_LEFT = 573;
const STICKER_SCALE = 0.88;

const Sticker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tagStart = s(1.4);
  const pillStart = s(1.65);
  const exit = s(INTRO_END);
  if (frame < tagStart || frame > exit + 2) {
    return null;
  }
  const tagIn = spring({ frame: frame - tagStart, fps, config: { damping: 8, stiffness: 200, mass: 0.6 } });
  const pillOpen = interpolate(frame, [pillStart, pillStart + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hidden = TAG_LEFT * (1 - pillOpen);
  const fade = interpolate(frame, [exit - 2, exit + 1], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - PLATE_W * STICKER_SCALE) / 2,
        top: 985,
        width: PLATE_W,
        height: PLATE_H,
        transform: `scale(${STICKER_SCALE})`,
        transformOrigin: "0 0",
        opacity: fade,
        filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.4))",
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
  );
};

// Words of a caption come in one after another through a blur, then the
// whole caption fades out just before the next one.
const Caption: React.FC<{ lines: Word[][]; length: number }> = ({ lines, length }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [length - 4, length], [1, 0], clamp);
  let index = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 1392,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: gilroy,
        fontWeight: 800,
        fontSize: 50,
        lineHeight: 1.18,
        opacity: out,
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((word, wi) => {
            const at = 2 + index++ * 2;
            const t = interpolate(frame, [at, at + 6], [0, 1], clamp);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  marginRight: wi < line.length - 1 ? "0.25em" : 0,
                  color: word.accent ? ACCENT : "#fff",
                  textShadow: word.accent ? accentShadow : textShadow,
                  opacity: t,
                  filter: `blur(${(1 - t) * 8}px)`,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const SmasAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage />
    <BeforeAfter />
    <Title />
    <Sticker />
    {CAPTIONS.map((c) => (
      <Sequence key={c.from} from={s(c.from)} durationInFrames={s(c.to) - s(c.from)}>
        <Caption lines={c.lines} length={s(c.to) - s(c.from)} />
      </Sequence>
    ))}
    <LightLeak at={INTRO_END} peak={0.95} />
    <LightLeak at={13.4} peak={0.45} />
    {/* Reference soundtrack: music together with its whooshes */}
    <Audio src={staticFile("smas/audio/music.m4a")} />
  </AbsoluteFill>
);
