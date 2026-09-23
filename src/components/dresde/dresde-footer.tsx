import Image from "next/image";
import { locations } from "@/lib/locations";
import { whatsappBookingUrl } from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/dresde.co";

/**
 * Built around what the site actually links to: the five locals, each
 * with a way to open it on the page and a way to book, plus Instagram.
 */
export function DresdeFooter() {
  return (
    <footer className="border-t border-dresde-line px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
      <div className="grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col items-start gap-5 md:col-span-4">
          <a href="#top" aria-label="Dresde, volver arriba" className="inline-flex min-h-11 items-center">
            <Image
              src="/brand/dresde-logo.png"
              alt="Dresde"
              width={675}
              height={347}
              className="h-14 w-auto select-none"
            />
          </a>
          <p className="max-w-[28ch] text-small text-dresde-paper-dim">
            Más que un corte, una experiencia. Peluquería y barbería en Bahía Blanca.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-small font-semibold text-dresde-paper underline decoration-dresde-line-strong underline-offset-4 transition-colors duration-(--duration-fast) hover:text-dresde-brass hover:decoration-dresde-brass"
          >
            @dresde.co en Instagram
          </a>
        </div>

        <nav aria-labelledby="footer-locales" className="md:col-span-8">
          <h2
            id="footer-locales"
            className="mb-6 font-display text-display-s font-bold uppercase text-dresde-paper"
          >
            Locales
          </h2>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li
                key={location.id}
                className="flex items-center justify-between gap-4 border-t border-dresde-line py-4"
              >
                <a
                  href={`#dresde-${location.id}`}
                  className="group flex min-h-11 min-w-0 flex-col justify-center"
                >
                  <span className="text-small font-semibold text-dresde-paper transition-colors duration-(--duration-fast) group-hover:text-dresde-brass">
                    {location.name}
                  </span>
                  <span className="text-small text-dresde-mute">{location.address}</span>
                </a>
                <a
                  href={whatsappBookingUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Reservar en ${location.name} por WhatsApp`}
                  className="inline-flex min-h-11 shrink-0 items-center text-small text-dresde-paper-dim transition-colors duration-(--duration-fast) hover:text-dresde-brass"
                >
                  Reservar
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-16 text-small text-dresde-mute">© {new Date().getFullYear()} Dresde</p>
    </footer>
  );
}
