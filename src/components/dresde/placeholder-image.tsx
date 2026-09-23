import Image from "next/image";
import { asset, cn } from "@/lib/utils";

type PlaceholderImageProps = {
  alt: string;
  src?: string;
  label?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

/**
 * Renders real photography when `src` is provided. Otherwise renders a
 * styled stand-in — never a fabricated image that could pass as an actual
 * Dresde photo. Swap in a `src` per image and this becomes a normal
 * next/image with no other changes needed downstream.
 */
export function PlaceholderImage({
  alt,
  src,
  label,
  className,
  priority,
  sizes = "100vw",
  fill = true,
}: PlaceholderImageProps) {
  if (src) {
    return (
      <Image
        src={src.startsWith("/") ? asset(src) : src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-dresde-surface",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 140% at 20% 0%, #1c1c1c 0%, #0a0a0a 45%, #000000 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {label ? (
        <span className="relative text-small text-dresde-mute">
          {label}
        </span>
      ) : null}
    </div>
  );
}
