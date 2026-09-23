import type { Location } from "@/lib/types";
import { currency } from "@/lib/locations";
import { whatsappBookingUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const cell =
  "group flex min-h-32 flex-col justify-between gap-6 bg-dresde-black p-5 transition-colors duration-(--duration-fast) hover:bg-dresde-surface-2 focus-visible:bg-dresde-surface-2 focus-visible:outline-offset-[-3px] sm:p-6";

/**
 * Service cells ruled by hairlines, the pattern the better barbershop
 * sites in Buenos Aires use (The Bulldog, Buenos Aires Barbershop): each
 * cell is the booking link, price in the accent next to the duration.
 * The grid is filled out with one more cell that asks about anything not
 * listed, so an odd count never leaves a hole.
 */
export function Services({ location }: { location: Location }) {
  const cells = location.services.length + 1;

  return (
    <>
      <p className="mb-6 text-small text-dresde-paper-dim">
        Tocá un servicio para pedir turno por WhatsApp.
      </p>
      <ul
        className={cn(
          "grid gap-px border border-dresde-line bg-dresde-line sm:grid-cols-2",
          cells % 3 === 0 && "lg:grid-cols-3"
        )}
      >
        {location.services.map((service) => (
          <li key={service.id} className="flex">
            <a
              href={whatsappBookingUrl(location, service.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Reservar ${service.name}, ${service.duration}, ${currency.format(service.price)}`}
              className={cn(cell, "w-full")}
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-body font-semibold text-dresde-paper">{service.name}</span>
                <span className="text-small text-dresde-mute opacity-0 transition-opacity duration-(--duration-fast) group-hover:text-dresde-brass group-hover:opacity-100 group-focus-visible:opacity-100">
                  Reservar
                </span>
              </span>
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-small text-dresde-mute">{service.duration}</span>
                <span className="font-display text-display-s font-bold tabular-nums text-dresde-brass">
                  {currency.format(service.price)}
                </span>
              </span>
            </a>
          </li>
        ))}
        <li className="flex">
          <a
            href={whatsappBookingUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(cell, "w-full")}
          >
            <span className="text-body font-semibold text-dresde-paper">¿Buscás otro servicio?</span>
            <span className="text-small text-dresde-paper-dim transition-colors duration-(--duration-fast) group-hover:text-dresde-brass">
              Consultalo por WhatsApp con {location.name}.
            </span>
          </a>
        </li>
      </ul>
    </>
  );
}
