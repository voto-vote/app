"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Markdown from "@/components/markdown";
import { useThesesStore } from "@/stores/theses-store";
import Lottie from "lottie-react";

type IntroEntry = {
  animation: unknown;
  title: string;
  description: string;
};

export default function Intro({
  entries,
  onIntroFinished,
  endIntroText,
}: {
  entries: IntroEntry[];
  onIntroFinished: () => void;
  endIntroText: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const { theses } = useThesesStore();
  const t = useTranslations("Intro");

  const handleSetApi = (api: CarouselApi) => {
    if (!api) {
      return;
    }

    setApi(api);
    setCurrentPage(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentPage(api.selectedScrollSnap());
    });
  };

  function goToNextPage() {
    if (currentPage >= entries.length - 1) {
      onIntroFinished();
      return;
    }
    api?.scrollTo(currentPage + 1);
  }

  if (!theses) {
    return null;
  }

  return (
    <div className="container mx-auto flex flex-col h-full max-h-full bg-linear-to-b from-background to-background/80">
      {/* Carousel */}
      <Carousel
        setApi={handleSetApi}
        className="flex-1 overflow-y-auto md:pt-8"
        opts={{
          loop: false,
          align: "center",
        }}
      >
        <CarouselContent className="h-full">
          <AnimatePresence>
            {entries.map((e, index) => (
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
                    className="relative w-full max-w-52 md:max-w-72 mx-auto aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-300"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <Lottie animationData={e.animation} loop autoplay />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center space-y-3 md:space-y-4 max-w-2xl mx-auto px-2">
                    <motion.h1
                      className="text-2xl md:text-3xl font-bold text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {e.title}
                    </motion.h1>

                    <motion.div
                      className="text-base md:text-lg text-muted-foreground text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Markdown content={e.description} />
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
          {entries.map((_, index) => (
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
              {currentPage >= entries.length - 1
                ? endIntroText
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
              className={`w-full text-primary hover:text-primary/80 text-sm ${currentPage >= entries.length - 1 ? "opacity-0" : ""}`}
              onClick={onIntroFinished}
            >
              {endIntroText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
