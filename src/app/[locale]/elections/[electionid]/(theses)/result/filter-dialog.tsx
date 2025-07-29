import ResponsiveDialog from "@/components/responsive-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEntityFilterStore } from "@/stores/entity-filter-store";
import { Candidates } from "@/types/candidate";
import { Election } from "@/types/election";
import { Entity } from "@/types/entity";
import { EntityFilters } from "@/types/entity-filter";
import { Ratings } from "@/types/ratings";
import { Theses } from "@/types/theses";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface FilterProps {
  election: Election;
  theses: Theses;
  candidates?: Candidates;
  userRatings: Ratings;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FilterDialog({
  election,
  theses,
  candidates = [],
  userRatings,
  open,
  onOpenChange,
}: FilterProps) {
  const { entityFilters, setEntityFilters } = useEntityFilterStore();
  const [tmpFilters, setTmpFilters] = useState<EntityFilters>(entityFilters);
  const t = useTranslations("FilterDialog");

  useEffect(() => {
    if (open) {
      setTmpFilters(entityFilters);
    } else {
      resetTmpFilters();
    }
  }, [entityFilters, open]);

  function removeTmpFilter(id: string) {
    const newFilters = { ...tmpFilters };
    delete newFilters[id];
    setTmpFilters(newFilters);
  }

  function resetTmpFilters() {
    setTmpFilters({});
  }

  function setTmpFilter(
    id: string,
    title: string,
    condition: (e: Entity) => boolean
  ) {
    const newFilters = { ...tmpFilters };
    newFilters[id] = { title, condition };
    setTmpFilters(newFilters);
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      className="space-y-2"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(tmpFilters).length > 0 && (
          <Badge asChild variant="secondary">
            <button
              onClick={resetTmpFilters}
              className="transition-colors hover:bg-accent-foreground/10 !rounded !py-0.5 !px-1.5"
            >
              {t("resetFilters")}
            </button>
          </Badge>
        )}

        {Object.entries(tmpFilters).map(([id, f]) => (
          <FilterPill
            label={f.title}
            key={id}
            onClick={() => removeTmpFilter(id)}
          />
        ))}
      </div>
      <Input
        placeholder={t("search", {
          matchType: election.algorithm.matchType,
        })}
        onChange={(e) => {
          const text = e.target.value;
          if (!text) {
            removeTmpFilter("search");
          } else {
            setTmpFilter("search", truncateText(text), (e) =>
              e.displayName.toLowerCase().includes(text.toLowerCase())
            );
          }
        }}
      />

      {election.algorithm.matchType === "candidates" && (
        <>
          <DropdownInput
            label={t("party")}
            items={candidates.reduce<Record<string, string>>((acc, c) => {
              acc[c.partyId.toString()] = c.partyName;
              return acc;
            }, {})}
            className="mt-4"
            onFilterAddition={(key, value) =>
              setTmpFilter(
                "party-" + key,
                truncateText(value),
                (entity) =>
                  entity.type === "candidate" &&
                  entity.partyId.toString() === key
              )
            }
            onFilterRemoval={(k) => removeTmpFilter("party-" + k)}
            tmpFilters={tmpFilters}
            tmpFiltersKeyPrefix="party-"
          />
          <DropdownInput
            label={t("listPosition")}
            items={candidates.reduce<Record<string, string>>((acc, c) => {
              acc[c.listPlace.toString()] = "#" + c.listPlace.toString();
              return acc;
            }, {})}
            onFilterAddition={(key, value) =>
              setTmpFilter(
                "list-" + key,
                truncateText(value),
                (entity) =>
                  entity.type === "candidate" &&
                  entity.listPlace.toString() === key
              )
            }
            onFilterRemoval={(k) => removeTmpFilter("list-" + k)}
            tmpFilters={tmpFilters}
            tmpFiltersKeyPrefix="list-"
          />
          <DropdownInput
            label={t("region")}
            items={candidates.reduce<Record<string, string>>((acc, c) => {
              acc[c.district] = c.district;
              return acc;
            }, {})}
            onFilterAddition={(key, value) =>
              setTmpFilter(
                "region-" + key,
                truncateText(value),
                (entity) =>
                  entity.type === "candidate" && entity.district === key
              )
            }
            onFilterRemoval={(k) => removeTmpFilter("region-" + k)}
            tmpFilters={tmpFilters}
            tmpFiltersKeyPrefix="region-"
          />

          <DropdownInput
            label={t("age")}
            items={candidates.reduce<Record<string, string>>((acc, c) => {
              const ageGroup = getAgeGroup(c.dateOfBirth);
              acc[ageGroup] = ageGroup;
              return acc;
            }, {})}
            className="mt-4"
            onFilterAddition={(key, value) =>
              setTmpFilter(
                "age-" + key,
                truncateText(value),
                (entity) =>
                  entity.type === "candidate" &&
                  getAgeGroup(entity.dateOfBirth) === key
              )
            }
            onFilterRemoval={(k) => removeTmpFilter("age-" + k)}
            tmpFilters={tmpFilters}
            tmpFiltersKeyPrefix="age-"
          />
          <DropdownInput
            label={t("gender")}
            items={candidates.reduce<Record<string, string>>((acc, c) => {
              acc[c.gender] = t(c.gender);
              return acc;
            }, {})}
            onFilterAddition={(key, value) =>
              setTmpFilter(
                "gender-" + key,
                truncateText(value),
                (entity) => entity.type === "candidate" && entity.gender === key
              )
            }
            onFilterRemoval={(k) => removeTmpFilter("gender-" + k)}
            tmpFilters={tmpFilters}
            tmpFiltersKeyPrefix="gender-"
          />
        </>
      )}

      <div className="text-xs text-muted-foreground mt-3 mb-1">
        {t("sameRatingsDescription", {
          matchType: election.algorithm.matchType,
        })}
      </div>
      <DropdownInput
        label={t("thesis")}
        items={theses.reduce<Record<string, string>>((acc, t) => {
          acc[t.id.toString()] = t.text;
          return acc;
        }, {})}
        onFilterAddition={(key, value) =>
          setTmpFilter(
            "thesis-" + key,
            truncateText(value),
            (entity) =>
              entity.type === "candidate" &&
              entity.ratings[key]?.rating === userRatings[key]?.rating
          )
        }
        onFilterRemoval={(k) => removeTmpFilter("thesis-" + k)}
        tmpFilters={tmpFilters}
        tmpFiltersKeyPrefix="thesis-"
      />

      <div className="flex gap-2 mt-4">
        <Button
          className="flex-auto"
          onClick={() => {
            setEntityFilters(tmpFilters);
            onOpenChange(false);
          }}
        >
          {t("filterButton", { count: Object.keys(tmpFilters).length })}
        </Button>
        <Button
          className="flex-auto"
          variant="secondary"
          onClick={() => {
            resetTmpFilters();
            setEntityFilters({});
            onOpenChange(false);
          }}
        >
          {t("resetFiltersButton")}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}

function FilterPill({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Badge className="rounded ps-1.5 pe-0.5">
      {label}
      <button
        onClick={onClick}
        className="transition-colors hover:bg-accent-foreground/10 rounded p-0.5"
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}

// DropdownInput Component
function DropdownInput({
  label,
  items,
  className,
  onFilterAddition,
  onFilterRemoval,
  tmpFilters,
  tmpFiltersKeyPrefix,
}: {
  label: string;
  items: Record<string, string>;
  className?: string;
  onFilterRemoval: (key: string, value: string) => void;
  onFilterAddition: (key: string, value: string) => void;
  tmpFilters: EntityFilters;
  tmpFiltersKeyPrefix: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full text-left px-3 py-1 font-[400] justify-between",
            className
          )}
        >
          {`${label} (${Object.keys(items).filter((k) => tmpFilters[tmpFiltersKeyPrefix + k]).length})`}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit max-w-screen" align="start">
        {Object.entries(items).map(([key, value], i) => (
          <DropdownMenuCheckboxItem
            key={i}
            checked={!!tmpFilters[tmpFiltersKeyPrefix + key]}
            onCheckedChange={(checked) => {
              if (checked) {
                onFilterAddition(key, value);
              } else {
                onFilterRemoval(key, value);
              }
            }}
            onSelect={(e) => e.preventDefault()}
          >
            {value.trim()}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function truncateText(text: string, maxLength: number = 35) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

type AgeGroupConfig = {
  [key: string]: { min: number; max: number };
};

const ageGroups: AgeGroupConfig = {
  "18-24": { min: 18, max: 24 },
  "25-34": { min: 25, max: 34 },
  "35-44": { min: 35, max: 44 },
  "45-54": { min: 45, max: 54 },
  "55-64": { min: 55, max: 64 },
  "65+": { min: 65, max: Infinity },
};

function getAgeGroup(birthDate: Date | string): string {
  const currentDate = new Date();
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  const age = Math.floor(
    (currentDate.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  for (const [groupName, range] of Object.entries(ageGroups)) {
    if (age >= range.min && age <= range.max) {
      return groupName;
    }
  }

  return "Unknown";
}
