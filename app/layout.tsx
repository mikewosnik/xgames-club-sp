import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Games Club São Paulo — Official Assistant",
  description:
    "Ask anything about X Games Club São Paulo: GM, roster, season, XGL format, and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-xgray-100 text-xgray-900 antialiased">{children}</body>
    </html>
  );
}
