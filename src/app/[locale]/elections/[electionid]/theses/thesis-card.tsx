"use client";

import { ChevronDown, ChevronUp, Info, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thesis } from "@/schemas/thesis";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/markdown";
import ThesisText from "@/app/[locale]/elections/[electionid]/theses/thesis-text";

interface ThesisCardProps {
  thesis: Thesis;
  starred: boolean;
  onStarredChange: (starred: boolean) => void;
}

export default function ThesisCard({
  thesis,
  starred,
  onStarredChange,
}: ThesisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("ThesisCard");

  return (
    <div className="h-[100cqh] flex flex-col justify-center md:justify-end">
      <Card className="p-6 m-4 gap-2 border-none bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto md:shadow-md">
        <div className="flex items-start justify-between">
          <h2 className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {thesis.category}
          </h2>
          <button
            onClick={() => onStarredChange(!starred)}
            className="text-primary hover:brightness-80 transition-all"
          >
            <Star
              className={`duration-150 hover:scale-110 ${starred ? "fill-current" : "fill-transparent hover:fill-current/25"}`}
            />
          </button>
        </div>
        <ThesisText thesis={thesis} />
        {thesis.additionalInfos && (
          <div>
            <Button
              variant={"ghost"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary hover:bg-accent-foreground/5 transition-colors -ml-3"
            >
              <Info className="size-5" />
              {t("moreInfos")}
              {isExpanded ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </Button>
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
                    <Markdown content={thesis.additionalInfos} />
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
