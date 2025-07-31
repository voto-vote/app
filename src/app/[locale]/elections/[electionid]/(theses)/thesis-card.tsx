"use client";

import { ChevronDown, ChevronUp, Info, Star, StarOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Thesis } from "@/types/theses";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/markdown";
import ThesisText from "@/app/[locale]/elections/[electionid]/(theses)/theses/thesis-text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ThesisCardProps {
  thesis: Thesis;
  starDisabled: boolean;
  starred: boolean;
  onStarredChange: (starred: boolean) => void;
}

export default function ThesisCard({
  thesis,
  starDisabled,
  starred,
  onStarredChange,
}: ThesisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("ThesisCard");

  return (
    <Card className="p-6 m-4 gap-2 border border-zinc-300 bg-zinc-100 overflow-auto md:max-w-3xl md:mx-auto shadow-none md:w-full">
      <div className="flex items-start justify-between">
        <h2 className="text-muted-foreground dark:text-muted leading-relaxed">
          {thesis.category}
        </h2>
        {starDisabled && (
          <Popover>
            <PopoverTrigger asChild>
              <button>
                <StarOff />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="top">
              <p className="text-sm text-muted-foreground">
                {t("starDisabledExplanation")}
              </p>
            </PopoverContent>
          </Popover>
        )}
        {!starDisabled && (
          <button onClick={() => onStarredChange(!starred)}>
            <Star
              className={`size-8 transition stroke-1 hover:scale-110 ${starred ? "fill-primary stroke-primary" : "fill-muted-foreground/35 stroke-muted-foreground/25 hover:fill-muted-foreground/45"}`}
            />
          </button>
        )}
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
  );
}
