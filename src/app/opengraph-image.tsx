import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "XoomAI — your managed AI workforce for Australian business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 500px at 60% -10%, rgba(34,211,238,0.25), transparent 60%), radial-gradient(700px 500px at 0% 120%, rgba(124,92,252,0.25), transparent 60%), #070b16",
          color: "#e8edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #22d3ee, #7c5cfc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#04121a",
            }}
          >
            X
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>XoomAI</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
          Deploy your first AI employee without hiring another staff member
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#9aa7c2", maxWidth: 900 }}>
          XoomAgent™ — your managed AI workforce for Australian business
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
          {["Australian owned", "Backed by XoomCloud", "No training on your data"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 22,
                color: "#22d3ee",
                border: "1px solid rgba(34,211,238,0.35)",
                borderRadius: 999,
                padding: "8px 20px",
                display: "flex",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
