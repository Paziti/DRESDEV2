export type DayHours = {
  /** 0 = Sunday … 6 = Saturday, matching Date#getDay() */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  /** null when the location is closed that day */
  open: string | null;
  close: string | null;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: string;
};

export type Barber = {
  id: string;
  name: string;
  role: string;
  image?: string;
};

export type Location = {
  /** Internal identifier only (used in the URL hash, DOM anchors, React
   * keys) — never shown in the UI. Addresses are what identify a local
   * on screen; see `address`/`name` below. */
  id: string;
  /** Short public-facing name — Dresde identifies its locals by street,
   * not by neighborhood branding (confirmed from their real Instagram
   * bio links), so this is the street name, e.g. "Estomba". */
  name: string;
  address: string;
  city: string;
  /**
   * The real booking link from @dresde.co's Instagram bio. Two shapes:
   * a plain `wa.me/<digits>` link (supports a prefilled `?text=`) or a
   * `wa.me/message/<code>` / `wa.link/<code>` redirect (doesn't reliably
   * support prefill, so it's opened as-is).
   */
  whatsapp: string;
  hours: DayHours[];
  services: Service[];
  barbers: Barber[];
  /** Hero/grid image and gallery. Undefined src -> rendered as a styled
   * placeholder ready to swap for real photography. */
  images: { src?: string; alt: string }[];
};
