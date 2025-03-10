import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./(header)/header";

const inter = Inter();

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
        className={`${inter.className} h-full antialiased overflow-hidden flex flex-col`}
      >
        <Header />
        <div className="grow overflow-y-scroll">{children}</div>
      </body>
    </html>
  );
}
