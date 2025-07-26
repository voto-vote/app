"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Markdown from "@/components/markdown";
import { useElection } from "@/contexts/election-context";
import { useThesesStore } from "@/stores/theses-store";
import Lottie from "lottie-react";
import thesesCardAnimation from "./theses-card-animation.json";
import starThesesAnimation from "./star-theses-animation.json";
import navigateThesesAnimation from "./navigate-theses-animation.json";
import resultAnimation from "./result-animation.json";

export default function Intro() {
  const { election } = useElection();
  const { setBackPath } = useBackButtonStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const { theses } = useThesesStore();
  const t = useTranslations("Intro");

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentPage(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentPage(api.selectedScrollSnap());
    });
  }, [api]);

  if (!theses) {
    return null;
  }

  const intro = [
    {
      animation: thesesCardAnimation,
      title: t("introOneTitle"),
      description: t("introOneDescription", {
        matchType: election.algorithm.matchType.replaceAll("-", "_"),
        numberOfTheses: theses.length,
        electionTitle: election.title,
        electionSubtitle: election.subtitle,
      }),
    },
    {
      animation: starThesesAnimation,
      title: t("introTwoTitle"),
      description: t("introTwoDescription"),
    },
    {
      animation: navigateThesesAnimation,
      title: t("introThreeTitle"),
      description: t("introThreeDescription"),
    },
    {
      animation: resultAnimation,
      title: t("introFourTitle"),
      description: t("introFourDescription"),
    },
  ];

  function goToNextPage() {
    if (currentPage >= intro.length - 1) {
      return router.push(`/elections/${election?.id}/theses`);
    }
    api?.scrollTo(currentPage + 1);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto flex flex-col h-full max-h-full bg-gradient-to-b from-background to-background/80">
        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="flex-1 overflow-y-auto md:pt-8"
          opts={{
            loop: false,
            align: "center",
          }}
        >
          <CarouselContent className="h-full">
            <AnimatePresence>
              {intro.map((i, index) => (
                <CarouselItem key={index} className="h-full">
                  <motion.div
                    className="flex flex-col h-full p-4 md:p-8 space-y-4 md:space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Video Container */}
                    <motion.div
                      className="relative w-full max-w-60 md:max-w-72 mx-auto aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-300"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <Lottie animationData={i.animation} loop autoplay />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center space-y-3 md:space-y-4 max-w-2xl mx-auto px-2">
                      <motion.h1
                        className="text-2xl md:text-3xl font-bold text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {i.title}
                      </motion.h1>

                      <motion.div
                        className="text-base md:text-lg text-muted-foreground text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <Markdown content={i.description} />
                      </motion.div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </AnimatePresence>
          </CarouselContent>
        </Carousel>

        {/* Footer */}
        <motion.div
          className="p-4 md:p-8 space-y-4 border-t border-border/30 bg-background/80 backdrop-blur-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Progress Indicators */}
          <div className="flex justify-center gap-1 mb-4">
            {intro.map((_, index) => (
              <motion.button
                key={index}
                className="relative p-1 focus:outline-none"
                onClick={() => api?.scrollTo(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`size-2.5 md:size-3 rounded-full transition-colors ${currentPage === index ? "bg-primary" : "bg-zinc-300 hover:bg-primary/75"}`}
                  initial={false}
                  animate={{
                    scale: currentPage === index ? 1.1 : 1,
                  }}
                />
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 max-w-md mx-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="w-full text-base font-medium"
                onClick={goToNextPage}
              >
                {currentPage >= intro.length - 1
                  ? t("startVotoButton")
                  : t("nextButton")}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="ghost"
                className={`w-full text-primary hover:text-primary/80 text-sm ${currentPage >= intro.length - 1 ? "opacity-0" : ""}`}
                onClick={() => router.push(`/elections/${election.id}/theses`)}
              >
                {t("startVotoButton")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Suspense>
  );
}
