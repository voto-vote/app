"use client";

import { ChevronDown, ChevronUp, Info, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thesis } from "@/schemas/thesis";
import { useTranslations } from "next-intl";

interface ThesisCardProps {
  thesis: Thesis;
}

// TODO explanations for the thesis
export default function ThesisCard({ thesis }: ThesisCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("ThesisCard");

  return (
    <div className="h-[100cqh] flex flex-col justify-center">
      <Card className="p-6 m-4 gap-2 border-none bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto md:shadow-md">
        <div className="flex items-start justify-between">
          <h2 className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {thesis.category}
          </h2>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="text-primary hover:brightness-80 transition"
          >
            <Star className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>
        <p className="text-2xl font-bold">{thesis.text}</p>
        {thesis.additionalInfos && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-primary mt-4 rounded-md"
            >
              <Info className="h-5 w-5 mr-2" />
              <span>{t("moreInfos")}</span>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 ml-1" />
              ) : (
                <ChevronDown className="h-5 w-5 ml-1" />
              )}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    marginTop: 16,
                  }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-2 rounded-lg text-sm text-gray-700 space-y-2">
                    {thesis.additionalInfos.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  );
}
