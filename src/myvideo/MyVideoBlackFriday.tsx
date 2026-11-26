import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import "../../brands/my-video/components/fonts";
import { INTER, PLAYFAIR, SLOOP } from "../../brands/my-video/components/fonts";
import { clamp, enter, exit, riseIn } from "../../brands/my-video/components/motion";
import { Plate } from "../../brands/my-video/components/Plate";
import { Subtitles } from "../../brands/my-video/components/Subtitles";
import { ACCENT_TOP, BEIGE, BUTTER, CHOCOLATE, H, W } from "../../brands/my-video/components/tokens";
import { ACCENTS, CUES, DURATION, FPS, SHOTS } from "./timeline";

const f = (s: number) => Math.round(s * FPS);

// ---------- camera: framing per shot + a slow push-in inside each shot ----------
const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = SHOTS.findIndex((s, k) => t >= s.from && (k === SHOTS.length - 1 || t < SHOTS[k + 1].from));
  const shot = SHOTS[i];
  const end = i === SHOTS.length - 1 ? DURATION : SHOTS[i + 1].from;
  const k = 1 + 0.035 * interpolate(t, [shot.from, end], [0, 1], clamp);
  const { x, y, w } = shot.framing;
  const h = (w * 16) / 9;
  const cx = x + w / 2;
  const cy = y + h * 0.38; // keep the face steady while pushing in
  const w2 = w / k;
  const h2 = h / k;
  const x2 = Math.min(Math.max(cx - w2 / 2, 0), W - w2);
  const y2 = Math.min(Math.max(cy - h2 * 0.38, 0), H - h2);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: CHOCOLATE }}>
      <div
        style={{
          position: "absolute",
          width: W,
          height: H,
          transformOrigin: "0 0",
          transform: `scale(${W / w2}) translate(${-x2}px, ${-y2}px)`,
        }}
      >
        <Video src={staticFile("myvideo/main.mp4")} muted style={{ width: W, height: H }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- layout helpers ----------
const Column: React.FC<{ children: React.ReactNode; out: number; gap?: number }> = ({ children, out, gap = 14 }) => {
  const frame = useCurrentFrame();
  const e = exit(frame, out, 7);
  return (
    <AbsoluteFill
      style={{
        top: ACCENT_TOP,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap,
        opacity: e,
        transform: `translateY(${(1 - e) * -10}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const label: React.CSSProperties = {
  fontFamily: INTER,
  fontWeight: 700,
  fontSize: 54,
  lineHeight: 1.1,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
};

const bigNumber: React.CSSProperties = {
  fontFamily: INTER,
  fontWeight: 800,
  fontSize: 180,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  whiteSpace: "nowrap",
};

// Service + discount: small label plate, then the big butter number plate on the spoken "мінус".
const Offer: React.FC<{ from: number; to: number; number: number; title: string; value: string; extra?: number }> = ({
  from,
  to,
  number,
  title,
  value,
  extra,
}) => {
  const frame = useCurrentFrame();
  return (
    <Column out={f(to - from)}>
      <Plate start={0} bg={BEIGE} color={CHOCOLATE}>
        <div style={label}>{title}</div>
      </Plate>
      {frame >= f(number - from) - 1 ? (
        <div style={{ transform: `scale(${0.94 + 0.06 * enter(frame, f(number - from), 14)})` }}>
          <Plate start={f(number - from)} bg={BUTTER} color={CHOCOLATE} padding="0.1em 0.26em 0.12em" open={10}>
            <div style={bigNumber}>{value}</div>
          </Plate>
        </div>
      ) : null}
      {extra !== undefined && frame >= f(extra - from) - 1 ? (
        <Plate start={f(extra - from)} bg={CHOCOLATE} color={BEIGE} padding="0.2em 0.45em 0.24em">
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 40, lineHeight: 1.1, whiteSpace: "nowrap" }}>
            щотижневі живі онлайн-зустрічі
          </div>
        </Plate>
      ) : null}
    </Column>
  );
};

// ---------- the accents ----------
const BlackFriday: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ACCENTS.blackFriday;
  const s = ACCENTS.allServices;
  const breathe = 1 + 0.015 * interpolate(frame, [0, f(a.to - a.from)], [0, 1], clamp);
  const sale = enter(frame, 14, 16);
  return (
    <Column out={f(a.to - a.from)} gap={16}>
      <div style={{ position: "relative", transform: `scale(${breathe})` }}>
        <Plate start={0} bg={BUTTER} color={CHOCOLATE} padding="0.14em 0.3em 0.16em" open={13}>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            BLACK FRIDAY
          </div>
        </Plate>
        <div
          style={{
            position: "absolute",
            right: -46,
            top: -78,
            fontFamily: SLOOP,
            fontSize: 104,
            color: CHOCOLATE,
            transform: "rotate(-8deg)",
          }}
        >
          <div style={riseIn(sale, 12, 4)}>sale</div>
        </div>
      </div>
      {frame >= f(s.from - a.from) - 1 ? (
        <Plate start={f(s.from - a.from)} bg={CHOCOLATE} color={BEIGE} padding="0.12em 0.4em 0.18em">
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 500, fontSize: 66, color: BUTTER }}>
              знижки
            </span>
            <span style={{ ...label, fontSize: 50, color: BEIGE }}>НА ВСІ ПОСЛУГИ</span>
          </div>
        </Plate>
      ) : null}
    </Column>
  );
};

const Dates: React.FC = () => {
  const a = ACCENTS.dates;
  return (
    <Column out={f(a.to - a.from)}>
      <Plate start={0} bg={CHOCOLATE} color={BEIGE} padding="0.14em 0.36em 0.18em">
        <div style={{ ...label, fontSize: 86, letterSpacing: "-0.01em" }}>
          <span style={{ color: BUTTER }}>27–28</span> ЛИСТОПАДА
        </div>
      </Plate>
    </Column>
  );
};

const Now: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ACCENTS.now;
  const it = enter(frame, 6, 14);
  return (
    <Column out={f(a.to - a.from)} gap={6}>
      <Plate start={0} bg={BUTTER} color={CHOCOLATE} padding="0.12em 0.34em 0.16em">
        <div style={{ ...label, fontSize: 92, fontWeight: 800, letterSpacing: "-0.01em" }}>ЗАРАЗ</div>
      </Plate>
      <div
        style={{
          fontFamily: PLAYFAIR,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 80,
          color: CHOCOLATE,
          textShadow: "0 1px 14px rgba(234,220,200,0.55)",
          ...riseIn(it, 16, 6),
        }}
      >
        саме той момент
      </div>
    </Column>
  );
};

const Cta: React.FC = () => {
  const a = ACCENTS.cta;
  return (
    // Stays on until the final fade: no exit of its own.
    <Column out={f(a.to - a.from) + 30}>
      <Plate start={0} bg={CHOCOLATE} color={BEIGE} padding="0.16em 0.4em 0.2em" open={12}>
        <div style={{ ...label, fontSize: 80, letterSpacing: "-0.005em" }}>
          ПИШІТЬ У <span style={{ color: BUTTER }}>DIRECT</span>
        </div>
      </Plate>
    </Column>
  );
};

// A breath of chocolate over the picture as BLACK FRIDAY lands — no flash.
const Hush: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, 30], [0, 0.12, 0], clamp);
  return <AbsoluteFill style={{ background: CHOCOLATE, opacity: o }} />;
};

const Seq: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={f(to) - f(from)} layout="none">
    {children}
  </Sequence>
);

export const MyVideoBlackFriday: React.FC = () => {
  const fadeOut = (frame: number) => interpolate(frame, [f(DURATION) - 12, f(DURATION)], [1, 0], clamp);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CHOCOLATE }}>
      <AbsoluteFill style={{ opacity: fadeOut(frame) }}>
        <Camera />
        <Seq from={ACCENTS.blackFriday.from} to={ACCENTS.blackFriday.from + 1.2}>
          <Hush />
        </Seq>
        <Seq from={ACCENTS.blackFriday.from} to={ACCENTS.blackFriday.to}>
          <BlackFriday />
        </Seq>
        <Seq from={ACCENTS.dates.from} to={ACCENTS.dates.to}>
          <Dates />
        </Seq>
        <Seq from={ACCENTS.consult.from} to={ACCENTS.consult.to}>
          <Offer {...ACCENTS.consult} title="КОНСУЛЬТАЦІЯ" value="−50%" />
        </Seq>
        <Seq from={ACCENTS.target.from} to={ACCENTS.target.to}>
          <Offer {...ACCENTS.target} title="ТАРГЕТ ПІД КЛЮЧ" value="−30%" />
        </Seq>
        <Seq from={ACCENTS.mentor.from} to={ACCENTS.mentor.to}>
          <Offer
            from={ACCENTS.mentor.from}
            to={ACCENTS.mentor.to}
            number={ACCENTS.mentor.number}
            extra={ACCENTS.mentor.meetings}
            title="ІНДИВІДУАЛЬНЕ МЕНТОРСТВО"
            value="−40%"
          />
        </Seq>
        <Seq from={ACCENTS.now.from} to={ACCENTS.now.to}>
          <Now />
        </Seq>
        <Seq from={ACCENTS.cta.from} to={ACCENTS.cta.to}>
          <Cta />
        </Seq>
        <Subtitles cues={CUES} />
      </AbsoluteFill>
      <Audio src={staticFile("myvideo/soundtrack.wav")} />
    </AbsoluteFill>
  );
};
