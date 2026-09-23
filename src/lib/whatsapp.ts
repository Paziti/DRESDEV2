import type { Location } from "./types";

/**
 * Dresde books exclusively through WhatsApp (confirmed from the real
 * @dresde.co bio) and `location.whatsapp` is the real link for that
 * local. Two shapes show up in their own bio: a plain `wa.me/<digits>`
 * link, which supports a prefilled `?text=` message, and a
 * `wa.me/message/<code>` or `wa.link/<code>` redirect, which doesn't
 * reliably carry query params through — those open as-is.
 */
const PLAIN_WA_ME = /^https:\/\/wa\.me\/(\d+)$/;

export function whatsappBookingUrl(location: Location, service?: string) {
  const match = location.whatsapp.match(PLAIN_WA_ME);
  if (!match) return location.whatsapp;

  const message = service
    ? `¡Hola! Quiero reservar un turno para “${service}” en Dresde ${location.name}.`
    : `¡Hola! Quiero reservar un turno en Dresde ${location.name}.`;
  return `${location.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Same channel, asking for a specific barber. */
export function whatsappBarberUrl(location: Location, barberName: string) {
  if (!PLAIN_WA_ME.test(location.whatsapp)) return location.whatsapp;
  const message = `¡Hola! Quiero reservar un turno con ${barberName} en Dresde ${location.name}.`;
  return `${location.whatsapp}?text=${encodeURIComponent(message)}`;
}

function fullAddress(location: Location) {
  return `${location.address}, ${location.city}, Argentina`;
}

export function directionsUrl(location: Location) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(location))}`;
}

export function mapEmbedUrl(location: Location) {
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(location))}&z=15&output=embed`;
}
