export const FPS = 30;

const s = (seconds: number) => Math.round(seconds * FPS);

// The master VO runs 51.4s, so the storyboard's 40s structure follows the
// speech. Cuts sit in its pauses (silence-detected at -40dB / 0.09s):
//   0.10  "What if you could take 3,400 pounds off your setup?"  3.36 "We did."
//   4.38  "We took a standard Kaufman Dually trailer from around 7,600 … 5,100."
//  10.21  "And the truck — from 8,300 | down to 7,400 pounds." (12.22)
//  14.58  "That brings the complete setup down from 15,900 pounds | to just 12,500." (18.01)
//  19.41  "That's 3,400 pounds back on the table."
//  23.17  "Less setup weight means more weight available for cars."
//  25.99  "And this is what that looks like in practice — | 12 different load combinations." (27.99)
//  29.98  "All built around the same lightweight setup."
//  32.36  "Less setup weight gives you more options when choosing your vehicle combinations,"
//  36.11  "and more opportunities to stay within the allowable weight."
//  39.51  "We didn't just build a truck and trailer." 41.52 "We analyzed … real driver needs."
//  45.62  "Want to get into car hauling in the U.S., even without a CDL?"
//  48.73  "Join Drive4USA. Call or text today."
export const SCENES = {
  hook: { from: s(0), to: s(4.25) },
  trailer: { from: s(4.25), to: s(10.0) },
  truck: { from: s(10.0), to: s(14.35) },
  result: { from: s(14.35), to: s(22.4) },
  meaning: { from: s(22.4), to: s(26.0) },
  combos: { from: s(26.0), to: s(32.2) },
  formula: { from: s(32.2), to: s(36.0) },
  limit: { from: s(36.0), to: s(39.35) },
  engineering: { from: s(39.35), to: s(45.45) },
  cta: { from: s(45.45), to: s(53.5) },
} as const;

export type SceneName = keyof typeof SCENES;

export const DURATION_IN_FRAMES = SCENES.cta.to;

export const sceneLength = (scene: SceneName) =>
  SCENES[scene].to - SCENES[scene].from;
