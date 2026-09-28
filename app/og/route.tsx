// Branded 1200×630 fallback share image (seo.md §B6), for pages without a photo.
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const title = (new URL(request.url).searchParams.get("title") ?? "666 Tattoo & Antiques").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#131110",
          color: "#efe8da",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://static.wixstatic.com/media/bfd742_98a9fb601a3341fa8f04ed8615c53a1b~mv2.jpeg/v1/fill/w_240,h_240/logo.jpg"
            width={120}
            height={120}
            style={{ borderRadius: 999 }}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40 }}>666 Tattoo &amp; Antiques</span>
            <span style={{ fontSize: 24, color: "#c9a45c", letterSpacing: 6 }}>LAWNTON · NORTH BRISBANE</span>
          </div>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", height: 10, width: 220, background: "#9e2a22" }} />
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
