// Every LAZERHALL file is imported from ../assets so the bundler serves it;
// nothing for this brand is read from public/.
import logo from "../assets/logo/logo.png";
import stickerPill from "../assets/stickers/black-friday-pill.png";
import stickerTag from "../assets/stickers/black-friday-sale-tag.png";
import stickerFull from "../assets/stickers/black-friday-full.png";
import iconCheck from "../assets/icons/check.png";
import iconDrop from "../assets/icons/drop.png";
import iconLoop from "../assets/icons/loop.png";
import iconWaves from "../assets/icons/waves.png";
import click from "../assets/audio/click.wav";
import iplPigmentationBefore from "../assets/before-after/ipl-pigmentation/before.png";
import iplPigmentationAfter from "../assets/before-after/ipl-pigmentation/after.png";
import smasBefore from "../assets/before-after/smas/before.png";
import smasAfter from "../assets/before-after/smas/after.png";
import videoIplCheek from "../assets/video/ipl-cheek-handpiece.mp4";
import videoSmasMarking from "../assets/video/smas-marking.mp4";

export const ASSETS = {
  logo,
  sticker: { pill: stickerPill, tag: stickerTag, full: stickerFull },
  icons: { check: iconCheck, drop: iconDrop, loop: iconLoop, waves: iconWaves },
  audio: { click },
  beforeAfter: {
    iplPigmentation: { before: iplPigmentationBefore, after: iplPigmentationAfter },
    smas: { before: smasBefore, after: smasAfter },
  },
  video: { iplCheek: videoIplCheek, smasMarking: videoSmasMarking },
} as const;
