"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="container mx-auto max-w-screen-xl min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        className="space-y-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">{t("title")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button asChild size="lg">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
