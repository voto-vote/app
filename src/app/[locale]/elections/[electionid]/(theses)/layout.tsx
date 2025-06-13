"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useThesesStore } from "@/stores/theses-store";
import { fetchTheses } from "@/lib/theses";
import { useLocale } from "next-intl";

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { electionid } = useParams<{ electionid: string }>();
  const { setTheses } = useThesesStore();
  const locale = useLocale();

  useEffect(() => {
    (async () => {
      const theses = await fetchTheses(electionid, locale);
      setTheses(theses);
    })();
  }, [electionid, locale, setTheses]);
  return children;
}
