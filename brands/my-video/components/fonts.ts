import { loadFont } from "@remotion/fonts";
import interMedium from "../assets/fonts/Inter-Medium.ttf";
import interBold from "../assets/fonts/Inter-Bold.ttf";
import interExtraBold from "../assets/fonts/Inter-ExtraBold.ttf";
import gilroyMedium from "../assets/fonts/Gilroy-Medium.ttf";
import gilroyExtraBold from "../assets/fonts/Gilroy-ExtraBold.ttf";
import sloopOne from "../assets/fonts/Sloop-ScriptOne.ttf";
import playfairItalicCyr from "../assets/fonts/playfair-display-cyrillic-500-italic.woff2";
import playfairItalicLat from "../assets/fonts/playfair-display-latin-500-italic.woff2";

export const INTER = "Inter MyVideo";
// Subtitles only.
export const GILROY = "Gilroy MyVideo";
export const PLAYFAIR = "Playfair Display MyVideo";
// Latin only: Sloop has no Cyrillic glyphs.
export const SLOOP = "Sloop MyVideo";

export const fontsLoaded = Promise.all([
  loadFont({ family: INTER, url: interMedium, weight: "500" }),
  loadFont({ family: INTER, url: interBold, weight: "700" }),
  loadFont({ family: INTER, url: interExtraBold, weight: "800" }),
  loadFont({
    family: PLAYFAIR,
    url: playfairItalicCyr,
    weight: "500",
    style: "italic",
    unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
  }),
  loadFont({
    family: PLAYFAIR,
    url: playfairItalicLat,
    weight: "500",
    style: "italic",
    unicodeRange:
      "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  }),
  loadFont({ family: GILROY, url: gilroyMedium, weight: "500" }),
  loadFont({ family: GILROY, url: gilroyExtraBold, weight: "800" }),
  loadFont({ family: SLOOP, url: sloopOne, weight: "400" }),
]);
