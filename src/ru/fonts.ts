import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { GILROY } from "../loadcombos/fonts";

export { BRITTANY, GILROY } from "../loadcombos/fonts";

// The Google build of Bebas Neue has no Cyrillic; the 2014 Fontfabric
// release (Bold) does, so Russian headlines and numbers use it.
export const BEBAS_RU = "Bebas Cyr";

loadFont({ family: BEBAS_RU, url: staticFile("fonts/bebas-neue-cyr.woff2") });

// Cyrillic subset for the Gilroy stand-in (Montserrat), merged into the
// same family so Latin and Russian labels share one font-family name.
for (const weight of ["600", "700", "800"]) {
  loadFont({
    family: GILROY,
    url: staticFile(`fonts/gilroy-sub-cyr-${weight}.woff2`),
    weight,
    unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  });
}
