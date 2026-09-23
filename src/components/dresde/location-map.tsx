import type { Location } from "@/lib/types";
import { mapEmbedUrl } from "@/lib/whatsapp";

export function LocationMap({ location }: { location: Location }) {
  return (
    <div className="flex flex-col gap-3">
      {/* No CSS filter on the iframe: filtering a live Google Maps embed
          forces continuous expensive repaints and alters Google's map
          branding, which its embed terms don't allow. Framed with a plain
          border instead so it still sits quietly in the black layout. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-dresde-line bg-dresde-surface lg:aspect-auto lg:h-[28rem]">
        <iframe
          src={mapEmbedUrl(location)}
          title={`Mapa de ${location.name}, ${location.address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      {/* Accessible alternative: never depend on the map alone to convey
          the address. */}
      <address className="not-italic text-small text-dresde-paper-dim">
        {location.address}, {location.city}
      </address>
    </div>
  );
}
