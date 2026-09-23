import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Dresde, peluquería y barbería en Bahía Blanca";
// Rendered once at build time, so it also works on a static host.
export const dynamic = "force-static";

// The real wordmark, not a system font standing in for it: this is the
// image WhatsApp and Instagram show every time the site is shared.
const LOGO_WIDTH = 675;
const LOGO_HEIGHT = 347;

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/dresde-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const renderWidth = 720;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={renderWidth}
          height={Math.round((renderWidth * LOGO_HEIGHT) / LOGO_WIDTH)}
        />
        <div
          style={{
            fontSize: 26,
            color: "#b99a63",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginTop: 28,
          }}
        >
          Peluquería & Barbería · Bahía Blanca
        </div>
      </div>
    ),
    { ...size }
  );
}
