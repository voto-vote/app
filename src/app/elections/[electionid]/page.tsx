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
import { useState, useEffect } from "react";
import { translateLocale } from "@/lib/locales";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Markdown from "@/components/markdown";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useElectionStore } from "@/stores/election-store";

export default function Election() {
  const election = useElectionStore((state) => state.election);
  const [language, setLanguage] = useState(election?.defaultLocale);
  const router = useRouter();
  const setBackPath = useBackButtonStore((state) => state.setBackPath);

  useEffect(() => {
    setBackPath("/");
  }, [setBackPath]);

  if (!election) return null;

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
            className="flex flex-col leading-tight mr-6 md:col-span-2"
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
              {electionDate.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
            <div className="md:text-lg">{electionDate.getFullYear()}</div>
          </motion.div>

          <motion.div
            className="flex flex-col leading-tight justify-center md:col-span-6"
            variants={itemVariants}
          >
            <div className="text-xl md:text-2xl font-bold">
              {election.title}
            </div>
            <div className="md:text-xl">{election.subtitle}</div>
          </motion.div>

          {/* Language Selection */}
          <motion.div
            className="self-center md:col-span-4 md:text-lg flex gap-4 items-center"
            variants={itemVariants}
          >
            Sprache:
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Deutsch" />
              </SelectTrigger>
              <SelectContent>
                {election.locales.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {translateLocale(locale, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Start Button */}
          <motion.div
            className="col-span-2 md:col-span-4 md:col-start-9"
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
              VOTO starten
            </Button>
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="col-span-2 md:col-span-12 mt-6 md:mt-12"
            variants={itemVariants}
          >
            <div className="font-bold text-xl md:text-2xl mb-2">
              Informationen
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
              Kooperationspartner & Sponsoren
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
