import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "./(header)/header";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HeaderProvider } from "@/contexts/header-context";
import Spinner from "../../components/ui/spinner";

const inter = localFont({
  src: "../inter.ttf",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta name="theme-color" content="#860196"></meta>
      </head>
      <body
        className={`${inter.className} h-full antialiased overflow-hidden flex flex-col`}
      >
        <NextIntlClientProvider>
          <HeaderProvider>
            <Header />
            <Spinner />
            <div className="grow overflow-y-scroll">{children}</div>
          </HeaderProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
