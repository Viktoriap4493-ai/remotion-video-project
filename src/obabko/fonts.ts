import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT, PATHS } from "./config";

export const obabkoFontsLoaded = Promise.all([
  loadFont({ family: FONT.family, url: staticFile(PATHS.fonts.medium), weight: "500" }),
  loadFont({ family: FONT.family, url: staticFile(PATHS.fonts.extraBold), weight: "800" }),
]);
