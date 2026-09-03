import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "StepUp English",
  description:
    "All-in-one English learning platform — small by small, step by step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script
          // Stamp the theme before first paint: saved choice, else light.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("stepup.theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body className="relative antialiased">{children}</body>
    </html>
  );
}
