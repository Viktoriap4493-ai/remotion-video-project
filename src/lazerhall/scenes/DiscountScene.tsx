import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Clip, SlideIn, textBase } from "../components";
import { COLORS, EASE_IN, EASE_OUT, beat, bounce, mix, progress, sceneLength, sceneStart } from "../theme";

const S = sceneStart("discount");
const LEN = sceneLength("discount");

// 0:03–0:06 — the full-screen −40% offer, then the deadline, then what it applies to.
export const DiscountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const numberAt = beat("discountNumber") - S;
  const deadlineAt = beat("discountDeadline") - S;
  const subtitleAt = beat("discountSubtitle") - S;
  const exitAt = beat("discountExit") - S;

  const pop = bounce(frame, numberAt);
  const settle = progress(frame, numberAt, 6, EASE_OUT);
  const exit = progress(frame, exitAt, LEN - exitAt, EASE_IN);
  const deadline = progress(frame, deadlineAt, 9, EASE_OUT);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Clip name="1175" from={0} to={LEN} trim={2.2} zoom={[1.12, 1.2]} blur={5} />
      <AbsoluteFill style={{ backgroundColor: "rgba(5,29,94,0.8)" }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(255,216,77,0.16) 0%, rgba(5,29,94,0) 55%)",
          opacity: settle,
        }}
      />

      {/* Directional-blur exit: everything whips upward into the next scene. */}
      <AbsoluteFill
        style={{
          translate: `0px ${-exit * 260}px`,
          filter: `blur(${exit * 18}px)`,
          opacity: 1 - exit * 0.6,
          alignItems: "center",
          justifyContent: "center",
          ...textBase,
        }}
      >
        <div
          style={{
            marginTop: -120,
            fontSize: 330,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: COLORS.yellow,
            lineHeight: 1,
            scale: String(mix(pop, 1.9, 1)),
            opacity: interpolate(frame, [numberAt, numberAt + 2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            filter: `blur(${(1 - settle) * 16}px)`,
            textShadow: "0 0 60px rgba(255,216,77,0.35), 0 14px 40px rgba(2,10,36,0.5)",
          }}
        >
          −40%
        </div>

        <div
          style={{
            marginTop: 40,
            background: COLORS.yellow,
            color: COLORS.navy,
            borderRadius: 16,
            padding: "22px 40px",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "0.01em",
            clipPath: `inset(0 ${(1 - deadline) * 100}% 0 0 round 16px)`,
            translate: `0px ${(1 - deadline) * 24}px`,
            boxShadow: "0 18px 48px rgba(2,10,36,0.45)",
          }}
        >
          ЛИШЕ ДО КІНЦЯ МІСЯЦЯ
        </div>

        <SlideIn at={subtitleAt} direction="up" distance={40} style={{ marginTop: 40 }}>
          <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: "0.04em" }}>НА SMAS-ЛІФТИНГ</div>
        </SlideIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
