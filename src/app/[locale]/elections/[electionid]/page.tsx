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
import { useEffect, useState } from "react";
import { translateLocale } from "@/i18n/utils";
import { motion, type Variants } from "framer-motion";
import Markdown from "@/components/markdown";
import { useBackButtonStore } from "@/stores/back-button-store";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useElection } from "@/contexts/election-context";
import { useIntroStore } from "@/stores/intro-store";
import { CreateEventRequest } from "@/types/api";
import { EventsAPI } from "@/lib/api";
import { useResultIDStore } from "@/stores/submission-store";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Election() {
  const { election } = useElection();
  const { introSeen } = useIntroStore();
  const router = useRouter();
  const { setBackPath } = useBackButtonStore();
  const locale = useLocale();
  const t = useTranslations("Election");
  const pathname = usePathname();
  const params = useParams();
  const { enableResultID } = useResultIDStore();

  // Countdown state
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);

  useEffect(() => {
    setBackPath("/");
  }, [setBackPath]);


  useEffect(() => {
    // Enable result ID tracking when the election is loaded
    enableResultID();
  }, [enableResultID]);

  // Countdown effect
  useEffect(() => {
    const targetDate = new Date(election.launchDate);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsCountdownFinished(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
      setIsCountdownFinished(false);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [election.electionDate, election.launchDate]);

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
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const electionDate = new Date(election.electionDate);
  const [imageSrc, setImageSrc] = useState(
    election.image || "/placeholder.svg"
  );

  function goToIntroOrTheses() {
    const createEventRequest: CreateEventRequest = {
      electionId: election.id,
      eventType: "voto_started",
      ratings: ratings,
    };
    // Just fire and forget the event
    EventsAPI.createEvent(createEventRequest);
    if (introSeen) {
      router.push(`/elections/${election.id}/theses`);
    } else {
      router.push(`/elections/${election.id}/intro`);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto max-w-screen-xl"
    >
      {/* Main Image with Countdown Overlay */}
      <motion.div
        className="relative w-full h-64 md:h-96"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: "easeOut" },
        }}
      >
        <Image
          src={imageSrc}
          alt="cover image"
          fill
          className="object-cover"
          priority
          onError={() => setImageSrc("/placeholder.svg")}
        />

        {/* Countdown Overlay */}
        {!isCountdownFinished && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50"
            variants={itemVariants}
          >
            <div className="text-center text-white">
              <div className="grid grid-cols-4 gap-2 md:gap-4 mx-auto">
                {[
                  [countdown.days, t("countdownDays")],
                  [countdown.hours, t("countdownHours")],
                  [countdown.minutes, t("countdownMinutes")],
                  [countdown.seconds, t("countdownSeconds")],
                ].map(([value, label], i) => (
                  <div
                    key={i}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-white/30 min-w-fit"
                  >
                    <div className="text-xl md:text-2xl font-bold">{value}</div>
                    <div className="text-xs md:text-sm opacity-90">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="p-4 md:p-8">
        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_3fr)] md:grid-cols-12 gap-4">
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
                {routing.locales
                  .filter((l) => election.locales.includes(l))
                  .map((locale) => (
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
            whileTap={isCountdownFinished ? { scale: 0.97 } : {}}
          >
            <Button
              size={"lg"}
              className="w-full text-lg transition"
              onClick={goToIntroOrTheses}
              disabled={!isCountdownFinished}
            >
              {isCountdownFinished
                ? t("startVotoButton")
                : t("startVotoButtonDisabled")}
            </Button>
            {/* Show a small message, that anonymous voting is not allowed */}
            <p className="text-sm text-muted-foreground">
              {t("dataDisclaimer")}
            </p>
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="col-span-2 md:col-span-12 mt-6 md:mt-12"
            variants={itemVariants}
          >
            <Markdown
              content={election.description}
              className="prose-sm [&_img]:max-w-xl [&_img]:w-full"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
