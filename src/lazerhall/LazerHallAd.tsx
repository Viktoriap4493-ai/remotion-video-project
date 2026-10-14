import React from "react";
import { AbsoluteFill, Composition, Sequence, interpolate, useCurrentFrame } from "remotion";
import { COLORS, DURATION_IN_FRAMES, FPS, SceneKey, fontsLoaded, sceneLength, sceneStart } from "./theme";
import { HookScene } from "./scenes/HookScene";
import { DiscountScene } from "./scenes/DiscountScene";
import { HifuScene } from "./scenes/HifuScene";
import { BenefitsScene } from "./scenes/BenefitsScene";
import { ResultsScene } from "./scenes/ResultsScene";
import { OFFERS, OfferScene } from "./scenes/OfferScene";
import { CtaScene } from "./scenes/CtaScene";
import { FinalScene } from "./scenes/FinalScene";

// Keep fonts from flashing in as fallback glyphs on the first frames.
void fontsLoaded;

// Extra frames a scene keeps rendering underneath the next one (for slide-over transitions).
const TAIL: Partial<Record<SceneKey, number>> = { results: 8 };

const SceneSlot: React.FC<{ scene: SceneKey; children: React.ReactNode }> = ({ scene, children }) => (
  <Sequence from={sceneStart(scene)} durationInFrames={sceneLength(scene) + (TAIL[scene] ?? 0)} name={scene}>
    {children}
  </Sequence>
);

/** White flash on the hook → −40% cut. */
const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = sceneStart("discount");
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        pointerEvents: "none",
        opacity: interpolate(frame, [cut - 3, cut, cut + 7], [0, 0.95, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

export const LazerHallSmasAd: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
    <SceneSlot scene="hook">
      <HookScene />
    </SceneSlot>
    <SceneSlot scene="discount">
      <DiscountScene />
    </SceneSlot>
    <SceneSlot scene="hifu">
      <HifuScene />
    </SceneSlot>
    <SceneSlot scene="benefits">
      <BenefitsScene />
    </SceneSlot>
    <SceneSlot scene="results">
      <ResultsScene />
    </SceneSlot>
    {OFFERS.map((offer) => (
      <SceneSlot key={offer.scene} scene={offer.scene}>
        <OfferScene offer={offer} />
      </SceneSlot>
    ))}
    <SceneSlot scene="cta">
      <CtaScene />
    </SceneSlot>
    <SceneSlot scene="final">
      <FinalScene />
    </SceneSlot>
    <FlashTransition />
  </AbsoluteFill>
);

export const LazerHallComposition: React.FC = () => (
  <Composition
    id="LazerHallSmas40"
    component={LazerHallSmasAd}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
