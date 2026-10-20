import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
// Gilroy stand-in with its Cyrillic subset (covers і ї є ґ).
import "../ru/fonts";

export { GILROY } from "../loadcombos/fonts";

// Fontfabric Bebas Neue Bold + Ukrainian І/Ї (the identical Latin I/Ï
// glyphs) and Є/є (mirrored Э/э), patched in for this ad.
export const BEBAS_UA = "Bebas UA";

loadFont({ family: BEBAS_UA, url: staticFile("fonts/bebas-neue-ua.woff2") });
