import type { Location } from "./types";

/**
 * Dresde (peluquería & barbería, @dresde.co) operates in Bahía Blanca,
 * Buenos Aires. The five addresses and WhatsApp links below are REAL,
 * pulled directly from the "Enlaces" list in their own Instagram bio.
 * A caption on their anniversary post confirms five sucursales total,
 * so this list is complete.
 *
 * The first photo per location (the storefront) is REAL, provided
 * directly for this build. Everything else — hours, prices, staff
 * names, and the two extra gallery photos per location — is still MOCK
 * DATA and needs to be swapped in before launch.
 */

const standardHours = (open: string, close: string) =>
  ([0, 1, 2, 3, 4, 5, 6] as const).map((day) => ({
    day,
    label: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][day],
    open: day === 0 ? null : open,
    close: day === 0 ? null : close,
  }));

const services = [
  { id: "corte", name: "Corte", price: 9000, duration: "40 min" },
  { id: "barba", name: "Barba", price: 6500, duration: "25 min" },
  { id: "corte-barba", name: "Corte + Barba", price: 14000, duration: "60 min" },
  { id: "fade", name: "Diseño / Fade", price: 11000, duration: "45 min" },
  { id: "color", name: "Color", price: 12500, duration: "50 min" },
];

export const locations: Location[] = [
  {
    id: "01",
    name: "Estomba",
    address: "Estomba 513",
    city: "Bahía Blanca",
    whatsapp: "https://wa.me/5492914239524",
    hours: standardHours("09:00", "20:00"),
    services,
    barbers: [
      { id: "b1", name: "Franco Ledesma", role: "Fundador · Barbero Senior" },
      { id: "b2", name: "Tomás Ibarra", role: "Especialista en Fade" },
      { id: "b3", name: "Nico Suárez", role: "Barba & Diseño" },
    ],
    images: [
      { src: "/locations/estomba.png", alt: "Fachada de Dresde Estomba" },
      { alt: "Interior de Dresde Estomba" },
      { alt: "Sillón de trabajo en Dresde Estomba" },
    ],
  },
  {
    id: "02",
    name: "Alem",
    address: "Av. Leandro N. Alem 2994",
    city: "Bahía Blanca",
    whatsapp: "https://wa.me/message/WHYRLNBWAU2ZC1",
    hours: standardHours("09:00", "20:00"),
    services,
    barbers: [
      { id: "b4", name: "Franco Lanza", role: "Barbero", image: "/team/franco-lanza.jpg" },
    ],
    images: [
      { src: "/locations/alem.png", alt: "Fachada de Dresde Alem" },
      { alt: "Interior de Dresde Alem" },
      { alt: "Detalle de herramientas en Dresde Alem" },
    ],
  },
  {
    id: "03",
    name: "Washington",
    address: "Washington 503",
    city: "Bahía Blanca",
    whatsapp: "https://wa.me/5492915276992",
    hours: standardHours("10:00", "21:00"),
    services,
    barbers: [
      { id: "b6", name: "Bruno Ferrari", role: "Barbero Senior" },
      { id: "b7", name: "Ezequiel Gómez", role: "Fade & Barba" },
      { id: "b8", name: "Julián Roldán", role: "Junior" },
    ],
    images: [
      { src: "/locations/washington.png", alt: "Fachada de Dresde Washington" },
      { alt: "Interior de Dresde Washington" },
      { alt: "Zona de espera en Dresde Washington" },
    ],
  },
  {
    id: "04",
    name: "Don Bosco",
    address: "Don Bosco 742",
    city: "Bahía Blanca",
    whatsapp: "https://wa.link/do5eqk",
    hours: standardHours("09:30", "20:30"),
    services,
    barbers: [
      { id: "b9", name: "Agustín Vera", role: "Barbero Senior" },
      { id: "b10", name: "Lucas Medina", role: "Especialista en Barba" },
    ],
    images: [
      { src: "/locations/don-bosco.png", alt: "Fachada de Dresde Don Bosco" },
      { alt: "Interior de Dresde Don Bosco" },
      { alt: "Sillón de trabajo en Dresde Don Bosco" },
    ],
  },
  {
    id: "05",
    name: "Salliqueló",
    address: "Salliqueló 739",
    city: "Bahía Blanca",
    whatsapp: "https://wa.link/t4yzc1",
    hours: standardHours("09:00", "20:00"),
    services,
    barbers: [
      { id: "b11", name: "Mateo Aguirre", role: "Barbero Senior" },
      { id: "b12", name: "Santino Díaz", role: "Fade & Diseño" },
    ],
    images: [
      { src: "/locations/salliquelo.png", alt: "Fachada de Dresde Salliqueló" },
      { alt: "Interior de Dresde Salliqueló" },
      { alt: "Detalle de herramientas en Dresde Salliqueló" },
    ],
  },
];

export const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});
