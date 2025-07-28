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
import { Election } from "@/types/election";
import { Theses } from "@/types/theses";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const mockActiveFilters = [
  { label: "SPD" },
  { label: "Die Stadtisten" },
  { label: "S-West" },
  { label: "Kinder und Jugend" },
  { label: "These 2" },
  { label: "These 9" },
];

interface FilterProps {
  election: Election;
  theses: Theses;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FilterDialog({
  election,
  theses,
  open,
  onOpenChange,
}: FilterProps) {
  const t = useTranslations("FilterDialog");

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      className="space-y-2"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className="rounded-full" variant="secondary">
          {t("resetFilters")}
          <button
            onClick={() => {}}
            className="transition-colors hover:bg-accent-foreground/10 rounded-full p-0.5"
          ></button>
        </Badge>

        {mockActiveFilters.map((f, i) => (
          <FilterPill label={f.label} key={i} />
        ))}
      </div>
      <Input placeholder={t("searchCandidates")} />

      <DropdownInput
        label={t("party")}
        items={["SPD", "Bündnis 90 / Die Grünen", "Die Linke"]}
        className="mt-4"
      />
      <DropdownInput label={t("list")} items={["Die Staditsten"]} />
      <DropdownInput label={t("region")} items={["S-West"]} />

      <DropdownInput label={t("age")} items={[]} className="mt-4" />
      <DropdownInput label={t("gender")} items={[]} />

      <div className="text-xs text-muted-foreground mt-3 mb-1">
        {t("politicalAreaDescription", {
          matchType: election.algorithm.matchType,
        })}
      </div>
      <DropdownInput label={t("policyArea")} items={[]} />

      <div className="text-xs text-muted-foreground mt-3 mb-1">
        {t("sameRatingsDescription", {
          matchType: election.algorithm.matchType,
        })}
      </div>
      <DropdownInput label={t("thesis")} items={theses.map((t) => t.text)} />

      <div className="flex gap-2 mt-4">
        <Button className="flex-auto">{t("filterButton", { count: 6 })}</Button>
        <Button className="flex-auto" variant="secondary">
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
    <Badge className="rounded-full">
      {label}
      <button
        onClick={onClick}
        className="transition-colors hover:bg-accent-foreground/10 rounded-full p-0.5"
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
}: {
  label: string;
  items: string[];
  className?: string;
}) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
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
          {`${label} (${checkedItems.length})`}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {items.map((item, i) => (
          <DropdownMenuCheckboxItem
            key={i}
            checked={checkedItems.includes(item)}
            onCheckedChange={(checked) => {
              setCheckedItems((prev) =>
                checked ? [...prev, item] : prev.filter((i) => i !== item)
              );
            }}
            onSelect={(e) => e.preventDefault()}
          >
            {item}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
