import type { Location } from "@/lib/types";
import { PlaceholderImage } from "./placeholder-image";

/**
 * Desktop: the storefront large, the other two photos smaller beneath it;
 * on wide screens, stacked beside it instead, so the photos don't push
 * services and team a full screen further down.
 * Mobile: a swipeable row, so three photos don't cost three screens of
 * scrolling; the next photo peeks in to show there is more.
 */
export function LocationGallery({ location }: { location: Location }) {
  const images = location.images.slice(0, 3);

  return (
    <div
      role="group"
      aria-label={`Fotos de ${location.name}`}
      className="-mx-5 flex snap-x snap-mandatory gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-3"
    >
      {images.map((image, i) => (
        <div
          key={i}
          className={
            i === 0
              ? "relative aspect-[4/3] w-[85%] shrink-0 snap-start sm:col-span-2 sm:w-auto sm:aspect-[16/10] xl:row-span-2 xl:aspect-auto"
              : "relative aspect-[4/3] w-[85%] shrink-0 snap-start sm:w-auto"
          }
        >
          <PlaceholderImage
            alt={image.alt}
            src={image.src}
            label={location.address}
            priority={i === 0}
            sizes={i === 0 ? "(min-width: 768px) 55vw, 85vw" : "(min-width: 1280px) 20vw, (min-width: 768px) 27vw, 85vw"}
          />
        </div>
      ))}
    </div>
  );
}
