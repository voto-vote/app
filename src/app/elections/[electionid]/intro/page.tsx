"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBackButtonStore } from "@/stores/back-button-store";

export default function Intro() {
  const { election } = useStore();
  const setBackPath = useBackButtonStore((state) => state.setBackPath);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();

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

  if (!election) return null;

  const pages = [
    {
      animation: "/intros/one.mp4",
      title: "Lerne mehr über aktuelle Themen und entdecke wer zu Dir passt!",
      description: (
        <>
          Um herauszufinden, welche Parteien und Kandidierenden zu deiner
          Einstellung passen, kannst du bis zu{" "}
          <span className="font-bold">25 Thesen</span> beantworten. 7 / 8
          Parteien und 78 / 112 Kandidierenden der Gemeinderatswahl 2025 in
          Musterstadt haben dies ebenfalls getan.
        </>
      ),
    },
    {
      animation: "/intros/one.mp4",
      title: "Wofür brennst du?",
      description: (
        <>
          Liegt dir ein Thema besonders am Herzen, kannst du dieses mit dem
          Stern Symbol markieren. Diese These wird{" "}
          <span className="font-bold">doppelt so stark bewertet</span>.
        </>
      ),
    },
    {
      animation: "/intros/one.mp4",
      title: "Vertippt? Keine Sorge.",
      description: (
        <>
          Über die <span className="font-bold">Timeline</span> kannst du schnell
          durch die Thesen <span className="font-bold">navigieren</span>. Bei
          von dir bereits beantworteten Thesen siehst Du Deine Antwort innerhalb
          des Kreises. Durch einen Tap auf einen der Kreise siehst du eine
          Vorschau der These. Durch einen zweiten Tap navigierst Du zur
          jeweiligen These, um sie erneut zu bewerten.
        </>
      ),
    },
    {
      animation: "/intros/one.mp4",
      title: "Deine Matches zur anstehenden Wahl.",
      description: (
        <>
          Hast du genug Thesen beantwortet siehst Du Dein Ergebnis. Hier kannst
          Du sehen, mit welcher Partei und welchem Kandidieren-den du am meisten{" "}
          <span className="font-bold">übereinstimmst</span>. Außerdem kannst du
          Dir einen Überblick über alle Parteien/Kandidierenden verschaffen und
          dir <span className="font-bold">Begründungen</span> zu den einzelnen
          Thesen durchlesen.
        </>
      ),
    },
  ];

  function goToNextPage() {
    if (currentPage >= pages.length - 1) {
      return router.push(`/elections/${election?.id}/runs/1`);
    }
    api?.scrollTo(currentPage + 1);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const videoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  return (
    <div className="h-full max-h-full flex flex-col justify-between">
      {/* Tutorial */}
      <Carousel
        setApi={setApi}
        className="grow"
        style={{ containerType: "size" }}
      >
        <CarouselContent>
          {pages.map((page, index) => (
            <CarouselItem key={index}>
              <motion.div
                className="space-y-4 text-xl my-4 p-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div
                  className="rounded-lg overflow-hidden aspect-square w-3/4 grid place-items-center mx-auto bg-white"
                  variants={videoVariants}
                >
                  <video autoPlay muted loop playsInline preload="none">
                    <source src={page.animation} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
                <motion.h1 className="font-bold mt-6" variants={itemVariants}>
                  {page.title}
                </motion.h1>
                <motion.div variants={itemVariants}>
                  {page.description}
                </motion.div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Footer */}
      <motion.div
        className="shrink-0 space-y-2 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-center gap-3 mb-3">
          {pages.map((_, index) => (
            <motion.div
              key={index}
              className={`rounded-full size-3 transition`}
              initial={false}
              animate={{
                scale: currentPage === index ? 1.2 : 1,
                backgroundColor:
                  currentPage === index ? "var(--primary)" : "#d4d4d8",
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={() => api?.scrollTo(index)}
            ></motion.div>
          ))}
        </div>

        {/* Primary Action */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button size="lg" className="w-full text-lg" onClick={goToNextPage}>
            Weiter
          </Button>
        </motion.div>

        {/* Secondary Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="link"
            className="w-full text-primary"
            onClick={() => router.push(`/elections/${election.id}/runs/1`)}
          >
            VOTO starten
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
