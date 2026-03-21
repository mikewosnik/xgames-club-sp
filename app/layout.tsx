import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Games Club São Paulo — Official Assistant",
  description:
    "Ask anything about X Games Club São Paulo: GM, roster, season, XGL format, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-xgray-100 text-xgray-900 antialiased">{children}</body>
    </html>
  );
}
