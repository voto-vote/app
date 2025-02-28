import { ChevronDown, ChevronUp, Info, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ThesisCardProps {
  category: string;
  thesis: string;
  additionalInformation?: string;
  onRate: (value: number) => void;
  onSkip: () => void;
}

export default function ThesisCard({
  category,
  thesis,
  additionalInformation = "",
}: ThesisCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="h-full flex flex-col justify-center">
      <Card className="p-6 m-4 gap-2 border-none bg-zinc-100">
        <div className="flex items-start justify-between">
          <h2 className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {category}
          </h2>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="text-votopurple-500 hover:text-votopurple-600 dark:hover:text-votopurple-300 transition-colors"
          >
            <Star className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>
        <p className="text-2xl font-bold text-votopurple-900 dark:text-votopurple-100">
          {thesis}
        </p>
        {additionalInformation && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-votopurple-500 mt-4 focus:outline-none focus:ring-2 focus:ring-votopurple-100 focus:ring-offset-2 rounded-md"
            >
              <Info className="h-5 w-5 mr-2" />
              <span>Weitere Informationen</span>
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
                  <div className="p-4 bg-votopurple-50/50 rounded-lg text-sm text-gray-700 space-y-2">
                    {additionalInformation.split("\n").map((line, index) => (
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
