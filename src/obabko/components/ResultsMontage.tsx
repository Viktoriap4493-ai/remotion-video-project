import React from "react";
import { Sequence } from "remotion";
import { CASES, COPY, MONTAGE, SCENES, s } from "../config";
import { BeforeAfterWipe } from "./BeforeAfterWipe";
import { TreatmentLabel } from "./TreatmentLabel";

// Fast sequence of whole cases; the last one is the strongest result and
// slows down (push-in eases out by 18.6 s) before the end card at 19 s.
export const ResultsMontage: React.FC<{ cardCenterY: number; labelTop: number }> = ({ cardCenterY, labelTop }) => {
  const total = s(SCENES.montage.to - SCENES.montage.from);
  const holdFrom = s(18.6 - SCENES.montage.from);
  return (
    <>
      {MONTAGE.map((beat, i) => {
        const from = s(beat.at);
        const to = i + 1 < MONTAGE.length ? s(MONTAGE[i + 1].at) : total;
        const item = CASES[beat.caseId];
        const wipeStart = s(beat.wipeAt) - from;
        const wipeEnd = wipeStart + beat.wipeFrames;
        const last = i === MONTAGE.length - 1;
        return (
          <Sequence key={beat.caseId} from={from} durationInFrames={to - from}>
            <BeforeAfterWipe
              item={item}
              left={(1080 - item.width) / 2}
              top={cardCenterY - item.height / 2}
              cardIn={0}
              cardInEnd={5}
              wipeStart={wipeStart}
              wipeEnd={wipeEnd}
              zoomEnd={last ? holdFrom - from : to - from}
              zoomTo={last ? 1.045 : 1.02}
            />
          </Sequence>
        );
      })}
      <TreatmentLabel text={COPY.montage} top={labelTop} at={0} />
    </>
  );
};
