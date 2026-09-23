import type { Location } from "@/lib/types";
import { directionsUrl } from "@/lib/whatsapp";
import { LocationGallery } from "./location-gallery";
import { LocationMap } from "./location-map";
import { OpenNow, OpeningHours } from "./opening-hours";
import { Services } from "./services";
import { Barbers } from "./barbers";
import { BookingCTA } from "./booking-cta";
import { RollingName } from "./motion-text";

function SectionHeading({
  id,
  large = false,
  children,
}: {
  id: string;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <h4
      id={id}
      className={
        large
          ? "mb-6 font-display text-display-m font-extrabold uppercase text-dresde-paper"
          : "mb-5 font-display text-display-s font-bold uppercase text-dresde-paper"
      }
    >
      {children}
    </h4>
  );
}

/**
 * Top: two columns on desktop. Left, what decides the visit (where,
 * whether it's open now, booking, hours); right, the photos. Below,
 * services, team and map each take the full width. On mobile the same
 * order stacks, with booking right under the name.
 */
export function LocationDetail({ location }: { location: Location }) {
  return (
    <div className="flex flex-col gap-20 py-12 sm:py-16 lg:gap-28 lg:py-20">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
        <aside className="@container flex flex-col gap-8 md:col-span-5 lg:col-span-4">
          <header className="flex flex-col gap-4">
            <p className="text-small text-dresde-paper-dim">
              {location.address}, {location.city}
            </p>
            {/* h3: nested under the "Elegí tu Dresde" h2 above it. Sized
                to the column (cqw), not the viewport: the longest names
                ("Washington", "Salliqueló") must fit the column at every
                width instead of spilling into the gap beside it. */}
            <RollingName
              text={location.name}
              className="font-display text-[clamp(3.25rem,17cqw,8.5rem)] leading-[0.86] font-extrabold uppercase text-dresde-paper"
            />
            <OpenNow location={location} />
          </header>

          <div className="flex flex-col gap-3">
            <BookingCTA location={location} />
            <a
              href={directionsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center border border-dresde-line-strong px-5 text-small font-semibold text-dresde-paper transition-colors duration-(--duration-fast) hover:border-dresde-brass hover:text-dresde-brass"
            >
              Cómo llegar
            </a>
          </div>

          <section aria-labelledby={`horarios-${location.id}`}>
            <SectionHeading id={`horarios-${location.id}`}>Horarios</SectionHeading>
            <OpeningHours location={location} />
          </section>
        </aside>

        <div className="min-w-0 md:col-span-7 lg:col-span-8">
          <LocationGallery location={location} />
        </div>
      </div>

      <section aria-labelledby={`servicios-${location.id}`}>
        <SectionHeading id={`servicios-${location.id}`} large>
          Servicios
        </SectionHeading>
        <Services location={location} />
      </section>

      <section aria-labelledby={`equipo-${location.id}`}>
        <SectionHeading id={`equipo-${location.id}`} large>
          Equipo
        </SectionHeading>
        <Barbers location={location} />
      </section>

      <section aria-labelledby={`mapa-${location.id}`}>
        <SectionHeading id={`mapa-${location.id}`} large>
          Ubicación
        </SectionHeading>
        <LocationMap location={location} />
      </section>
    </div>
  );
}
