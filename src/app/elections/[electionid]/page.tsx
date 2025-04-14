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
import { useBackButton } from "@/contexts/BackButtonContext";
import { type Election } from "@/lib/api";
import Markdown from "@/components/markdown";
import { useElection } from "@/contexts/ElectionContext";

export default function Election() {
  const { election } = useElection();
  const [language, setLanguage] = useState(election.defaultLocale);
  const router = useRouter();
  const { setBackPath } = useBackButton();

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
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Main Image */}
      <motion.div
        className="relative w-full h-[33vh]"
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

      <div className="p-4 grid grid-cols-[minmax(0,_1fr)_minmax(0,_3fr)] gap-4">
        {/* Date and Title */}
        <motion.div
          className="flex flex-col leading-tight mr-6"
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
          <div className="font-bold text-xl">
            {electionDate.toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
            })}
          </div>
          <div>{electionDate.getFullYear()}</div>
        </motion.div>
        <motion.div
          className="flex flex-col leading-tight justify-center"
          variants={itemVariants}
        >
          <div className="text-xl font-bold">{election.title}</div>
          <div>{election.subtitle}</div>
        </motion.div>

        {/* Language Selection */}
        <motion.div className="self-center" variants={itemVariants}>
          Sprache:
        </motion.div>
        <motion.div variants={itemVariants}>
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
        <div className="col-span-2 w-full">
          <motion.div
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
              Start
            </Button>
          </motion.div>
        </div>

        {/* Content Area */}
        <motion.div className="col-span-2 mt-6" variants={itemVariants}>
          <div className="font-bold">Informationen</div>
          <Markdown content={election.description} />
        </motion.div>

        {/* Sponsors */}
        <motion.div className="col-span-2 mt-6" variants={itemVariants}>
          <div className="font-bold">Kooperationspartner & Sponsoren</div>
          <div className="flex flex-col items-center gap-4 mt-4">
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
              >
                <Image
                  src={sponsor.image}
                  alt={sponsor.name}
                  width={1000}
                  height={1000}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
