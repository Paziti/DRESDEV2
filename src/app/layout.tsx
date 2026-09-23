import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Manrope } from "next/font/google";
import "./globals.css";

// Condensed, sign-painting proportions: the same tall, narrow build as the
// Dresde wordmark, which the previous extended display face fought.
// Variable with the optical-size axis so large headlines get display cuts.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  axes: ["opsz"],
  display: "swap",
  // next/font has no metrics for this family to build a size-adjusted
  // fallback; use a narrow system face instead of a mismatched one.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif-condensed", "sans-serif"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://dresde.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dresde · Peluquería & Barbería",
    template: "%s · Dresde",
  },
  description:
    "Dresde. Más que un corte, una experiencia. Peluquería y barbería en Bahía Blanca: elegí tu local y reservá por WhatsApp.",
  openGraph: {
    title: "Dresde · Peluquería & Barbería",
    description: "Más que un corte, una experiencia.",
    url: siteUrl,
    siteName: "Dresde",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dresde · Peluquería & Barbería",
    description: "Más que un corte, una experiencia.",
  },
  robots: { index: true, follow: true },
  // Mobile browsers (iOS Safari especially) auto-detect address-like text
  // ("Don Bosco 742", "Salliqueló 739") and silently turn it into a tappable
  // link of their own — inconsistent per string, entirely outside our CSS
  // or markup. Every real link on this page is an explicit <a>; nothing
  // here should be auto-linked.
  formatDetection: { telephone: false, date: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${bigShoulders.variable} ${manrope.variable} overflow-x-clip overflow-y-visible`}
    >
      <body className="bg-dresde-black text-dresde-paper antialiased overflow-x-clip overflow-y-visible">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
