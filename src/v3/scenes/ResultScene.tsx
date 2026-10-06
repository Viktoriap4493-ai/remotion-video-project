import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { CLAMP, COLORS, EASE_BACK, EASE_IN_OUT, EASE_OUT, punch } from "../../loadcombos/anim";
import { Sfx } from "../../loadcombos/components/Sfx";
import { BEBAS, GILROY } from "../../loadcombos/fonts";

// веси.mov: heavier standard rig sits on the low LEFT pan, the Drive4USA
// rig on the raised RIGHT pan. Graphics live in the sky above the pans.
const LABELS = 4;
const LEFT = [14, 22, 30]; // truck, trailer, = total ("…from 15,900 pounds")
const RIGHT = [84, 92, 112]; // "…to just 12,500."
const COLLAPSE = 140;
const LIGHTER = 168; // "That's 3,400 pounds back on the table."

const Column: React.FC<{
  side: "left" | "right";
  title: string;
  truck: string;
  trailer: string;
  total: string;
  times: number[];
  accent: string;
}> = ({ side, title, truck, trailer, total, times, accent }) => {
  const frame = useCurrentFrame();
  const collapse = interpolate(frame, [COLLAPSE, COLLAPSE + 10], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const line = (at: number) => interpolate(frame, [at, at + 7], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const row: React.CSSProperties = {
    fontFamily: BEBAS,
    fontSize: 66,
    lineHeight: 1.05,
    color: COLORS.white,
    display: "flex",
    gap: 12,
    alignItems: "baseline",
  };
  const unit: React.CSSProperties = { fontFamily: GILROY, fontWeight: 700, fontSize: 24, letterSpacing: "0.16em", color: "#BFD9F2" };

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        [side]: 50,
        width: 460,
        display: "flex",
        flexDirection: "column",
        alignItems: side === "left" ? "flex-start" : "flex-end",
        padding: "22px 28px",
        borderRadius: 16,
        background: "rgba(7,28,51,0.72)",
        borderTop: `6px solid ${accent}`,
        opacity: 1 - collapse,
        translate: `0 ${-collapse * 40}px`,
      }}
    >
      <div style={{ fontFamily: GILROY, fontWeight: 800, fontSize: 28, letterSpacing: "0.18em", color: accent, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ ...row, opacity: line(times[0]), translate: `${(1 - line(times[0])) * 30}px 0` }}>
        {truck} <span style={unit}>TRUCK</span>
      </div>
      <div style={{ ...row, opacity: line(times[1]), translate: `${(1 - line(times[1])) * 30}px 0` }}>
        + {trailer} <span style={unit}>TRAILER</span>
      </div>
      <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.6)", margin: "8px 0", scale: `${line(times[2])} 1` }} />
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 104,
          lineHeight: 1,
          color: accent,
          opacity: line(times[2]),
          scale: String(punch(frame, times[2] + 6, 0.14, 2, 8)),
        }}
      >
        = {total}
      </div>
    </div>
  );
};

export const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const labels = interpolate(frame, [LABELS, LABELS + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const versus = interpolate(frame, [COLLAPSE + 6, COLLAPSE + 16], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const lighter = interpolate(frame, [LIGHTER, LIGHTER + 8], [0, 1], { ...CLAMP, easing: EASE_BACK });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 241], [1.0, 1.08], CLAMP)), transformOrigin: "50% 55%" }}>
        <Video
          src={staticFile("v3/video/balance.mp4")}
          muted
          playbackRate={0.63}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>

      {/* Pan labels: tags sitting just above each pan */}
      {[
        { text: "STANDARD SETUP", left: 60, top: 720, color: "#9FD0FF" },
        { text: "DRIVE4USA SETUP", left: 590, top: 640, color: COLORS.red },
      ].map((l) => (
        <div
          key={l.text}
          style={{
            position: "absolute",
            left: l.left,
            top: l.top,
            width: 430,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: labels,
            translate: `0 ${(1 - labels) * -20}px`,
          }}
        >
          <div
            style={{
              fontFamily: GILROY,
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: "0.14em",
              color: COLORS.white,
              background: "rgba(7,28,51,0.8)",
              borderLeft: `6px solid ${l.color}`,
              padding: "8px 16px",
            }}
          >
            {l.text}
          </div>
          <div style={{ width: 3, height: 50 * labels, background: l.color }} />
        </div>
      ))}

      <Column side="left" title="STANDARD SETUP" truck="8,300 LB" trailer="7,600 LB" total="15,900 LB" times={LEFT} accent="#9FD0FF" />
      <Column side="right" title="DRIVE4USA SETUP" truck="7,400 LB" trailer="5,100 LB" total="12,500 LB" times={RIGHT} accent={COLORS.red} />

      {/* Totals collapse into one comparison, then the saving */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          fontFamily: BEBAS,
          lineHeight: 1,
          opacity: versus,
          scale: String(interpolate(versus, [0, 1], [0.8, 1])),
        }}
      >
        <span style={{ fontSize: 130, color: "#BFD9F2", textDecoration: "line-through", textDecorationColor: COLORS.red, textDecorationThickness: 8 }}>
          15,900 LB
        </span>
        <span style={{ fontSize: 90, color: COLORS.red }}>→</span>
        <span style={{ fontSize: 150, color: COLORS.white }}>12,500 LB</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: COLORS.red,
            padding: "16px 50px 4px",
            borderRadius: 16,
            fontFamily: BEBAS,
            fontSize: 140,
            lineHeight: 1,
            color: COLORS.white,
            opacity: lighter,
            scale: String(interpolate(lighter, [0, 1], [1.6, 1]) * punch(frame, LIGHTER + 8, 0.08, 2, 8)),
            boxShadow: "0 18px 50px rgba(227,16,27,0.55)",
          }}
        >
          3,400 LB LIGHTER
        </div>
      </div>

      <Sfx at={LABELS} name="ui-click" volume={0.28} />
      {[...LEFT, ...RIGHT].map((at, i) => (
        <Sfx key={at} at={at} name={i % 3 === 2 ? "lock" : "tick"} volume={i % 3 === 2 ? 0.32 : 0.22} />
      ))}
      <Sfx at={LEFT[2] + 6} name="punch" volume={0.3} />
      <Sfx at={RIGHT[2] + 6} name="punch" volume={0.34} />
      <Sfx at={COLLAPSE} name="whoosh-soft" volume={0.24} />
      <Sfx at={LIGHTER + 4} name="impact-strong" volume={0.44} />
    </AbsoluteFill>
  );
};
