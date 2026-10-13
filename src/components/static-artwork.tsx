/* eslint-disable @next/next/no-img-element -- responsive WebPs are encoded before deployment. */
import type { ImgHTMLAttributes } from "react";

export const ART_WIDTHS = [180, 360, 600, 900, 1200] as const;

/** Public image paths, never /_next/image or a paid resizing endpoint. */
export function staticArtSrcSet(src: string, width: number) {
  const slash = src.lastIndexOf("/");
  const directory = src.slice(0, slash);
  const stem = src.slice(slash + 1, -5);
  return [...ART_WIDTHS.filter((size) => size < width).map((size) => `${directory}/sizes/${stem}-${size}.webp ${size}w`), `${src} ${width}w`].join(", ");
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string; width: number; height: number; eager?: boolean;
};

export function StaticArtwork({ src, width, height, eager, sizes = "100vw", alt = "", ...props }: Props) {
  return <img {...props} src={src} srcSet={staticArtSrcSet(src, width)} sizes={sizes} width={width} height={height}
    alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />;
}
