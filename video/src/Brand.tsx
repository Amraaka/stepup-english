import { Img, staticFile } from "remotion";
import type { Look } from "./looks";

export const Brand = ({ look }: { look: Look }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 28px 12px 16px",
      borderRadius: 999,
      background: look.brandBg,
      border: `2px solid ${look.brandBorder}`,
      boxShadow: "0 10px 28px rgba(26, 26, 31, 0.07)",
    }}
  >
    <Img src={staticFile("logo.svg")} style={{ width: 48, height: 48 }} />
    <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: look.brandText }}>
      StepUp <span style={{ fontWeight: 500, color: look.brandMuted }}>English</span>
    </span>
  </div>
);
