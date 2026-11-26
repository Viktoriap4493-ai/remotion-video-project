// The Remotion bundler turns these imports into served URLs.
declare module "*.ttf" {
  const src: string;
  export default src;
}
declare module "*.woff2" {
  const src: string;
  export default src;
}
