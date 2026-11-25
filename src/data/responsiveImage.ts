import manifest from './image-variants.json';

type ImageVariant = { src: string; width: number; height: number; bytes: number };
type ImageEntry = { width: number; height: number; variants: ImageVariant[] };
const images: Record<string, ImageEntry> = manifest;

/** Keep the original as a legacy fallback; modern browsers select one responsive derivative. */
export function imageProps(src: string, sizes: string) {
  const image = images[src];
  if (!image) throw new Error(`Missing responsive image: ${src}`);
  return {
    src,
    srcSet: image.variants.map(variant => `${encodeURI(variant.src)} ${variant.width}w`).join(', '),
    sizes,
    width: image.width,
    height: image.height,
  };
}
