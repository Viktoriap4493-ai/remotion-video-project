import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import "../../brands/my-video/components/fonts";
import { INTER } from "../../brands/my-video/components/fonts";
import { clamp, enter, exit } from "../../brands/my-video/components/motion";
import { Subtitles } from "../../brands/my-video/components/Subtitles";
import { BUTTER, CHOCOLATE, H, W } from "../../brands/my-video/components/tokens";
import { BEATS, type Beat, DURATION, FPS, SHOTS, SUBS, type TypeLine } from "./timeline";

const f = (s: number) => Math.round(s * FPS);
const LEFT = 64;

// ---------- camera: wide / medium-wide framing per shot + a very slow push-in ----------
const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = SHOTS.findIndex((s, k) => t >= s.from && (k === SHOTS.length - 1 || t < SHOTS[k + 1].from));
  const shot = SHOTS[i];
  const end = i === SHOTS.length - 1 ? DURATION : SHOTS[i + 1].from;
  const k = 1 + 0.02 * interpolate(t, [shot.from, end], [0, 1], clamp);
  const { x, y, w } = shot.framing;
  const h = (w * 16) / 9;
  const cx = x + w / 2;
  const cy = y + h * 0.3;
  const w2 = w / k;
  const h2 = h / k;
  const x2 = Math.min(Math.max(cx - w2 / 2, 0), W - w2);
  const y2 = Math.min(Math.max(cy - h2 * 0.3, 0), H - h2);
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

// ---------- typography: big chocolate words on the wall, no plates ----------
const Line: React.FC<{ line: TypeLine; start: number; end?: number }> = ({ line, start, end }) => {
  const frame = useCurrentFrame();
  const p = enter(frame, start, line.size > 120 ? 14 : 11) * (end === undefined ? 1 : exit(frame, end, 6));
  const common: React.CSSProperties = {
    position: "absolute",
    left: line.x ?? LEFT,
    top: line.y,
    fontFamily: INTER,
    fontWeight: line.weight ?? 700,
    fontSize: line.size,
    lineHeight: 1,
    letterSpacing: line.tracking ?? "-0.01em",
    whiteSpace: "nowrap",
    color: CHOCOLATE,
    opacity: p,
    transform: `translateY(${(1 - p) * Math.min(40, line.size * 0.22)}px)`,
    filter: `blur(${(1 - p) * 10}px)`,
  };
  if (line.tag) {
    // the only plate: a small square butter tag, like «серія 1» in the reference
    return (
      <div style={{ ...common, background: BUTTER, padding: "0.22em 0.42em 0.26em", borderRadius: 0 }}>{line.text}</div>
    );
  }
  return <div style={{ ...common, textShadow: "0 1px 18px rgba(234,220,200,0.35)" }}>{line.text}</div>;
};

const BeatView: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const last = beat.to >= DURATION;
  const e = last ? 1 : exit(frame, f(beat.to - beat.from), 7);
  return (
    <AbsoluteFill style={{ opacity: e, transform: `translateY(${(1 - e) * -12}px)` }}>
      {beat.lines.map((l) => (
        <Line
          key={l.text + l.at}
          line={l}
          start={f(l.at - beat.from)}
          end={l.until === undefined ? undefined : f(l.until - beat.from)}
        />
      ))}
    </AbsoluteFill>
  );
};

export const MyVideoBlackFriday: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [f(DURATION) - 12, f(DURATION)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: CHOCOLATE }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Camera />
        {BEATS.map((b) => (
          <Sequence key={b.from} from={f(b.from)} durationInFrames={f(b.to) - f(b.from)} layout="none">
            <BeatView beat={b} />
          </Sequence>
        ))}
        <Subtitles groups={SUBS} />
      </AbsoluteFill>
      <Audio src={staticFile("myvideo/soundtrack.wav")} />
    </AbsoluteFill>
  );
};
