import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./(header)/header";
import { BackButtonProvider } from "@/contexts/BackButtonContext";

const inter = localFont({
  src: "./inter.ttf",
  display: "swap",
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
        className={`${inter.className} h-full antialiased overflow-hidden flex flex-col`}
      >
        <BackButtonProvider>
          <Header />
          <div className="grow overflow-y-scroll">{children}</div>
        </BackButtonProvider>
      </body>
    </html>
  );
}
