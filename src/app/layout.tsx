import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header";

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
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#860196"></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-hidden flex flex-col`}
      >
        <Header />
        <div className="grow">{children}</div>
      </body>
    </html>
  );
}
