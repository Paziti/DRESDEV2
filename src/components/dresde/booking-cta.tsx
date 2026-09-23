import type { Location } from "@/lib/types";
import { whatsappBookingUrl } from "@/lib/whatsapp";

/** Dresde books through WhatsApp; this opens the chat of the selected local. */
export function BookingCTA({ location }: { location: Location }) {
  return (
    <a
      href={whatsappBookingUrl(location)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-13 items-center justify-center border border-dresde-paper bg-dresde-paper px-6 text-body font-semibold text-black transition-colors duration-(--duration-fast) hover:border-dresde-brass hover:bg-dresde-brass"
    >
      Reservar por WhatsApp
    </a>
  );
}
