import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface ThesisCardProps {
  category: string;
  thesis: string;
  onRate: (value: number) => void;
  onSkip: () => void;
}

export default function ThesisCard({
  category,
  thesis,
  onRate,
  onSkip,
}: ThesisCardProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card className="p-6 m-4 gap-2">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-votopurple-900 dark:text-votopurple-100">
            {category}
          </h2>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="text-votopurple-500 hover:text-votopurple-600 dark:hover:text-votopurple-300 transition-colors"
          >
            <Star className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {thesis}
        </p>
      </div>

      {/* Rating System */}
      <div className="space-y-4 mt-10">
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => {
                setRating(value);
                onRate(value);
              }}
              className={`w-16 h-16 rounded-lg font-medium transition-all transform hover:scale-105 ${
                rating === value
                  ? "bg-votopurple-500 text-white shadow-lg scale-105"
                  : "bg-votopurple-50 text-votopurple-900 hover:bg-votopurple-100 dark:bg-votopurple-900/50 dark:text-votopurple-100 dark:hover:bg-votopurple-800/70"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 px-2">
          <span>keine Zustimmung</span>
          <span>volle Zustimmung</span>
        </div>
      </div>

      {/* Action */}
      <Button
        variant="link"
        className="w-full text-votopurple-500 dark:text-votopurple-400"
        onClick={() => onSkip()}
      >
        Überspringen
      </Button>
    </Card>
  );
}
