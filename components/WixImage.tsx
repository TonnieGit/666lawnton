import Image, { type ImageProps } from "next/image";
import type { WixImageRef, WixMediaImage } from "@/lib/data/types";
import { resolveMediaUrl, wixImageToUrl } from "@/lib/media";

type Source = WixMediaImage | WixImageRef | null | undefined;

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: Source;
  alt: string;
  /** Render at intrinsic size instead of `fill`. */
  intrinsic?: boolean;
};

function toResolved(image: Source) {
  if (!image) return null;
  if (typeof image === "string") return wixImageToUrl(image);
  return { src: image.url, width: image.width, height: image.height };
}

/** next/image for Wix media (store images or CMS `wix:image://` refs). */
export function WixImage({ image, alt, intrinsic, priority, ...props }: Props) {
  const r = toResolved(image);
  if (!r) return null;
  const src = resolveMediaUrl(r.src, r.width, r.height);
  // `priority` is deprecated in Next 16 and no longer raises fetch priority;
  // LCP candidates get eager loading + high fetch priority instead.
  const rest = priority ? { ...props, loading: "eager" as const, fetchPriority: "high" as const } : props;
  if (intrinsic && r.width && r.height) {
    return <Image src={src} alt={alt} width={r.width} height={r.height} {...rest} />;
  }
  return <Image src={src} alt={alt} fill {...rest} />;
}
