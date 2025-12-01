import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import './globals.css';

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Asset Manager",
  description: "Track, organize, and optimize your company assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.className} min-h-screen bg-background antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
