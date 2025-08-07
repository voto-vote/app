"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion, stagger } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error("VOTO encountered an unexpected error:");
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-screen-xl min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        className="flex flex-col gap-8 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delayChildren: stagger(0.1) }}
      >
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="VOTO"
          width={200}
          height={87}
          className="mx-auto"
          priority
        />

        {/* Error Message */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-primary">
            {t("errorOccured")}
          </h1>
          <h2 className="text-2xl font-semibold">{error.name}</h2>
          {error.message && (
            <p className="text-muted-foreground max-w-md mx-auto">
              {error.message}
            </p>
          )}
          {error.digest && (
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {error.digest}
            </code>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="lg" onClick={reset}>
            {t("retry")}
          </Button>
          <Button asChild size="lg">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
