import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voto",
  description: "Wählen einfach machen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#fbdbff"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased fixed inset-0 max-w-screen`}
      >
        {children}
      </body>
    </html>
  );
}
