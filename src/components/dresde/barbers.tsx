import type { Location } from "@/lib/types";
import { PlaceholderImage } from "./placeholder-image";
import { whatsappBarberUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// On desktop the row always spans the full width: as many columns as
// barbers (up to 4), with a wider frame for two. A single barber gets
// its own layout (SoloBarber) instead of a stretched, cropped portrait.
const DESKTOP_COLUMNS = ["", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];
const DESKTOP_ASPECT = ["", "lg:aspect-[4/3]", "lg:aspect-[3/4]", "lg:aspect-[3/4]"];

/**
 * Portraits with the name set on the photo, as the reference barbershops
 * do (Buenos Aires Barbershop, Fade Masters): the person is the content,
 * the caption sits on a shade at the bottom of the frame.
 */
export function Barbers({ location }: { location: Location }) {
  const count = location.barbers.length;
  const slot = Math.min(count, 4) - 1;

  if (count === 1) return <SoloBarber location={location} />;

  return (
    <ul
      className={cn(
        "grid gap-1",
        count === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        DESKTOP_COLUMNS[slot]
      )}
    >
      {location.barbers.map((barber) => (
        <li
          key={barber.id}
          className={cn(
            "relative overflow-hidden bg-dresde-surface",
            "aspect-[3/4]",
            DESKTOP_ASPECT[slot]
          )}
        >
          <PlaceholderImage
            alt={barber.name}
            src={barber.image}
            // Faces sit in the upper part of a portrait; keep them in
            // frame when a wide slot crops it.
            className="object-[50%_25%]"
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 33vw, 50vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:p-6">
            <span className="font-display text-display-s font-bold uppercase leading-none text-dresde-paper">
              {barber.name}
            </span>
            <span className="text-small text-dresde-paper-dim">{barber.role}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * One barber, full width without blowing the portrait up: the photo at
 * its own proportion and near its real resolution, the name large beside
 * it, and a way to book with that person. On phones it keeps the same
 * captioned portrait as the multi-barber grid.
 */
function SoloBarber({ location }: { location: Location }) {
  const barber = location.barbers[0];
  const firstName = barber.name.split(" ")[0];

  return (
    <div className="grid border border-dresde-line sm:grid-cols-[minmax(0,24rem)_1fr]">
      <div className="relative aspect-[3/4] overflow-hidden bg-dresde-surface">
        <PlaceholderImage
          alt={barber.name}
          src={barber.image}
          className="object-[50%_25%]"
          sizes="(min-width: 640px) 24rem, 100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:hidden"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 sm:hidden">
          <span className="font-display text-display-s font-bold uppercase leading-none text-dresde-paper">
            {barber.name}
          </span>
          <span className="text-small text-dresde-paper-dim">{barber.role}</span>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-6 p-5 sm:p-10 lg:p-14">
        <div className="hidden flex-col gap-2 sm:flex">
          <span className="font-display text-display-l font-extrabold uppercase text-dresde-paper">
            {barber.name}
          </span>
          <span className="text-body text-dresde-paper-dim">
            {barber.role} en Dresde {location.name}
          </span>
        </div>
        <a
          href={whatsappBarberUrl(location, barber.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-fit items-center border border-dresde-line-strong px-5 text-small font-semibold text-dresde-paper transition-colors duration-(--duration-fast) hover:border-dresde-brass hover:text-dresde-brass"
        >
          Reservar con {firstName}
        </a>
      </div>
    </div>
  );
}
