"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useEffect } from "react";
import { translateLocale } from "@/i18n/utils";
import { motion } from "framer-motion";
import Markdown from "@/components/markdown";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useElectionStore } from "@/stores/election-store";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function Election() {
  const { election } = useElectionStore();
  const router = useRouter();
  const { setBackPath } = useBackButtonStore();
  const locale = useLocale();
  const t = useTranslations("Election");
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    setBackPath("/");
  }, [setBackPath]);

  if (!election) return null;

  function changeLanguage(newLocale: string) {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale }
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const electionDate = new Date(election.date);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto max-w-screen-xl"
    >
      {/* Main Image */}
      <motion.div
        className="relative w-full h-[33vh] md:h-[50vh]"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: "easeOut" },
        }}
      >
        <Image
          src={election.image}
          alt="cover image"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_3fr)] md:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Date and Title */}
          <motion.div
            className="flex flex-col leading-tight md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.2,
              },
            }}
          >
            <div className="font-bold text-xl md:text-2xl">
              {electionDate.toLocaleDateString(locale, {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
            <div className="md:text-lg">
              {electionDate.toLocaleDateString(locale, { year: "numeric" })}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col leading-tight justify-center md:col-span-5 lg:col-span-6"
            variants={itemVariants}
          >
            <div className="text-xl md:text-2xl font-bold">
              {election.title}
            </div>
            <div className="md:text-xl">{election.subtitle}</div>
          </motion.div>

          {/* Language Selection */}
          <motion.div
            className="self-center md:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <div className="md:text-lg">{t("languageSelector")}</div>
          </motion.div>

          <motion.div
            className="self-center md:col-span-3 lg:col-span-4 md:text-lg flex gap-4 items-center"
            variants={itemVariants}
          >
            <Select value={locale} onValueChange={changeLanguage}>
              <SelectTrigger>
                <SelectValue placeholder={t("placeholderLanguageSelect")} />
              </SelectTrigger>
              <SelectContent>
                {routing.locales.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {translateLocale(locale, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Start Button */}
          <motion.div
            className="col-span-2 md:col-span-5 md:col-start-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.6,
              },
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size={"lg"}
              className="w-full text-lg transition"
              onClick={() => router.push(`/elections/${election.id}/intro`)}
            >
              {t("startVotoButton")}
            </Button>
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="col-span-2 md:col-span-12 mt-6 md:mt-12"
            variants={itemVariants}
          >
            <div className="font-bold text-xl md:text-2xl mb-2">
              {t("informationsTitle")}
            </div>
            <div className="md:text-lg">
              <Markdown content={election.description} />
            </div>
          </motion.div>

          {/* Sponsors */}
          <motion.div
            className="col-span-2 md:col-span-12 mt-6 md:mt-12"
            variants={itemVariants}
          >
            <div className="font-bold text-xl md:text-2xl mb-2">
              {t("sponsorsTitle")}
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8 mt-4">
              {election.sponsors.map((sponsor, i) => (
                <motion.a
                  key={i}
                  custom={0}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.5 + i * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href={sponsor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="md:max-w-[250px]"
                >
                  <Image
                    src={sponsor.image || "/placeholder.svg"}
                    alt={sponsor.name}
                    width={1000}
                    height={1000}
                    className="w-full"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
