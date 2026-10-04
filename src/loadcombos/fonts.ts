import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const BEBAS = "Bebas";
export const GILROY = "Gilroy";
export const BRITTANY = "Brittany";

// Gilroy and Brittany Signature are commercial fonts. Until the licensed
// files are supplied, Montserrat and Allura stand in for them; dropping the
// real woff2 files in at these paths swaps them everywhere.
loadFont({ family: BEBAS, url: staticFile("fonts/bebas-neue.woff2") });
loadFont({ family: BRITTANY, url: staticFile("fonts/brittany-sub.woff2") });
for (const weight of ["600", "700", "800"]) {
  loadFont({
    family: GILROY,
    url: staticFile(`fonts/gilroy-sub-${weight}.woff2`),
    weight,
  });
}
