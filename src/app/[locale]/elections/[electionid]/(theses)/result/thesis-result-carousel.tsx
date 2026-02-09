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
import { useMemo, useState } from "react";
import ThesisResultCard from "./thesis-result-card";
import type { Election } from "@/types/election";
import type { Rating, Ratings } from "@/types/ratings";
import { useTranslations } from "next-intl";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { Entities } from "@/types/entity";

interface ThesesResultCarouselProps {
  election: Election;
  theses: Theses;
  userRatings: Ratings;
  entities: Entities;
  onRatingChange: (thesisId: string, newRating: Rating) => void;
}

export default function ThesesResultCarousel({
  election,
  theses,
  userRatings,
  entities,
  onRatingChange,
}: ThesesResultCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentThesisIndex, setCurrentThesisIndex] = useState(0);
  const [thesesSorting, setThesesSorting] = useState<"random" | "category">(
    "category",
  );
  const isDesktop = useBreakpoint("sm");
  const t = useTranslations("ThesesResultCarousel");

  const sortedTheses = useMemo(() => {
    if (!theses) {
      return [];
    }
    if (thesesSorting === "category") {
      return [...theses].sort((a, b) => a.category.localeCompare(b.category));
    }
    return theses;
  }, [theses, thesesSorting]);

  const handleSetApi = (api: CarouselApi) => {
    if (!api) {
      return;
    }

    setApi(api);
    setCurrentThesisIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentThesisIndex(api.selectedScrollSnap());
    });
  };

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
              thesesSorting === "category" ? "random" : "category",
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
            {t("thesesSortingInfo")}
          </PopoverContent>
        </Popover>
      </div>

      <Carousel
        setApi={handleSetApi}
        className="-mx-2 md:mx-0 md:[&>div]:overflow-visible select-none"
      >
        <CarouselContent className="md:gap-x-32">
          {sortedTheses.map((thesis, i) => (
            <CarouselItem key={thesis.id}>
              <ThesisResultCard
                election={election}
                userRatings={userRatings}
                thesis={thesis}
                thesisIndex={i}
                numberOfTheses={sortedTheses.length}
                ownRating={
                  userRatings?.[thesis.id] ?? {
                    value: "unrated",
                    isFavorite: false,
                  }
                }
                entityRatings={entities.map((entity) => {
                  const rating = entity.ratings[thesis.id] ?? {
                    value: "unrated",
                    isFavorite: false,
                  };
                  return { entity, rating };
                })}
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

          <ThesesProgress
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
          <ThesesProgress
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
  const t = useTranslations("ThesesResultCarousel");

  return (
    <Button
      disabled={currentThesisIndex === 0}
      onClick={() => api?.scrollPrev()}
    >
      <ChevronLeft />
      {t("previousThesis", {
        current: Math.max(currentThesisIndex, 1),
        total: sortedTheses.length,
      })}
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
  const t = useTranslations("ThesesResultCarousel");

  return (
    <Button
      disabled={currentThesisIndex === sortedTheses.length - 1}
      onClick={() => api?.scrollNext()}
    >
      {t("nextThesis", {
        current: Math.min(currentThesisIndex + 2, sortedTheses.length),
        total: sortedTheses.length,
      })}
      <ChevronRight />
    </Button>
  );
}

function ThesesProgress({
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
  const t = useTranslations("ThesesResultCarousel");

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-1",
        className,
      )}
    >
      <div className="text-sm text-muted-foreground text-center">
        {thesesSorting === "category"
          ? sortedTheses[currentThesisIndex]?.category
          : t("yourRandomSorting")}
      </div>
      <div className="flex flex-wrap justify-center gap-1 max-w-full">
        {sortedTheses
          .filter((t) =>
            thesesSorting === "category"
              ? t.category === sortedTheses[currentThesisIndex]?.category
              : true,
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
