import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wojak News",
  description: "Your daily dose of wojak-powered news tweets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
