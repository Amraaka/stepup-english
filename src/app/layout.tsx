import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StepUp English",
  description:
    "English learning platform for kids — everything in one place, step by step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
