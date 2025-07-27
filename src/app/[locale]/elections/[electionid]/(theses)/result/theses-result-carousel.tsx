import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Theses } from "@/types/theses";
import { ChevronLeft, ChevronRight, CircleQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import ThesisResultCard from "./theses-result-card";
import type { Election } from "@/types/election";
import type { Rating, Ratings } from "@/types/ratings";
import { useTranslations } from "next-intl";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";

interface ThesesResultCarouselProps {
  election: Election;
  theses: Theses;
  ratings: Ratings;
  onRatingChange: (thesisId: string, newRating: Rating) => void;
}

export default function ThesesResultCarousel({
  election,
  theses,
  ratings,
  onRatingChange,
}: ThesesResultCarouselProps) {
  const [sortedTheses, setSortedTheses] = useState<Theses>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentThesisIndex, setCurrentThesisIndex] = useState(0);
  const [thesesSorting, setThesesSorting] = useState<"random" | "category">(
    "category"
  );
  const isDesktop = useBreakpoint("sm");
  const t = useTranslations("ThesesResultCarousel");

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentThesisIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentThesisIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!theses) {
      return;
    }
    if (thesesSorting === "category") {
      setSortedTheses(
        [...theses].sort((a, b) => a.category.localeCompare(b.category))
      );
    } else {
      setSortedTheses(theses);
    }
  }, [theses, thesesSorting]);
  return (
    <>
      <div className="flex flex-wrap items-center text-sm">
        <div className="mr-1">
          {thesesSorting === "category"
            ? t("sortedByCategories")
            : t("sortedByYourVoto")}
        </div>
        <Button
          variant="link"
          className="text-primary p-0 h-fit max-w-full justify-start whitespace-normal text-start"
          onClick={() =>
            setThesesSorting(
              thesesSorting === "category" ? "random" : "category"
            )
          }
        >
          {thesesSorting === "category"
            ? t("useVOTOSort")
            : t("useCategoriesSort")}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-primary h-fit p-1!">
              <CircleQuestionMark />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-primary text-primary-foreground text-sm py-1 px-2 border-primary"
            side="top"
          >
            Die Thesen eines VOTOs sind beim Beantworten zufällig sortiert, um
            Dich nicht zu beeinflussen.
          </PopoverContent>
        </Popover>
      </div>

      <Carousel
        setApi={setApi}
        opts={{}}
        className="-mx-2 md:mx-0 md:[&>div]:overflow-visible"
      >
        <CarouselContent className="md:gap-x-32">
          {sortedTheses.map((thesis, i) => (
            <CarouselItem key={thesis.id}>
              <ThesisResultCard
                election={election}
                ratings={ratings}
                thesis={thesis}
                thesisIndex={i}
                numberOfTheses={sortedTheses.length}
                ownRating={
                  ratings?.[thesis.id] ?? {
                    rating: undefined,
                    favorite: false,
                  }
                }
                participantsRatings={[
                  {
                    participantId: "1",
                    participantName: "Brigitte Burn-Müllhaupt",
                    rating: { rating: 2, favorite: false },
                    color: "black",
                    explanation:
                      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                  },
                  {
                    participantId: "2",
                    participantName: "Max Mustermann",
                    rating: { rating: 1, favorite: true },
                    color: "red",
                  },
                ]}
                onRatingChange={(newRating) =>
                  onRatingChange(thesis.id, newRating)
                }
                isDesktop={isDesktop}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {isDesktop && (
        <div className="flex justify-between gap-1">
          <PrevButton
            currentThesisIndex={currentThesisIndex}
            api={api}
            sortedTheses={sortedTheses}
          />

          <CategoryProgress
            thesesSorting={thesesSorting}
            sortedTheses={sortedTheses}
            currentThesisIndex={currentThesisIndex}
          />

          <NextButton
            currentThesisIndex={currentThesisIndex}
            api={api}
            sortedTheses={sortedTheses}
          />
        </div>
      )}

      {!isDesktop && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <CategoryProgress
            thesesSorting={thesesSorting}
            sortedTheses={sortedTheses}
            currentThesisIndex={currentThesisIndex}
            className="col-span-2"
          />
          <PrevButton
            currentThesisIndex={currentThesisIndex}
            api={api}
            sortedTheses={sortedTheses}
          />
          <NextButton
            currentThesisIndex={currentThesisIndex}
            api={api}
            sortedTheses={sortedTheses}
          />
        </div>
      )}
    </>
  );
}

function PrevButton({
  currentThesisIndex,
  api,
  sortedTheses,
}: {
  currentThesisIndex: number;
  api?: CarouselApi;
  sortedTheses: Theses;
}) {
  return (
    <Button
      disabled={currentThesisIndex === 0}
      onClick={() => api?.scrollPrev()}
    >
      <ChevronLeft />
      These {Math.max(currentThesisIndex, 1)} / {sortedTheses.length}
    </Button>
  );
}

function NextButton({
  currentThesisIndex,
  api,
  sortedTheses,
}: {
  currentThesisIndex: number;
  api?: CarouselApi;
  sortedTheses: Theses;
}) {
  return (
    <Button
      disabled={currentThesisIndex === sortedTheses.length - 1}
      onClick={() => api?.scrollNext()}
    >
      These {Math.min(currentThesisIndex + 2, sortedTheses.length)} /{" "}
      {sortedTheses.length}
      <ChevronRight />
    </Button>
  );
}

function CategoryProgress({
  thesesSorting,
  sortedTheses,
  currentThesisIndex,
  className = "",
}: {
  thesesSorting: "category" | "random";
  sortedTheses: Theses;
  currentThesisIndex: number;
  className?: string;
}) {
  if (thesesSorting !== "category") {
    return null;
  }
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-1",
        className
      )}
    >
      <div className="text-sm text-muted-foreground text-center">
        {sortedTheses[currentThesisIndex]?.category}
      </div>
      <div className="flex gap-1">
        {sortedTheses
          .filter(
            (t) => t.category === sortedTheses[currentThesisIndex]?.category
          )
          .map((t) => (
            <div
              key={t.id}
              className="rounded-full size-2 transition-colors"
              style={{
                backgroundColor:
                  t.id === sortedTheses[currentThesisIndex]?.id
                    ? "var(--color-primary)"
                    : "var(--color-zinc-300)",
              }}
            ></div>
          ))}
      </div>
    </div>
  );
}
