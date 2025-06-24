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
import { ChevronDown, X } from "lucide-react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FilterDialog({ open, onOpenChange }: FilterProps) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Filter"
      className="space-y-2"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className="rounded-full" variant="secondary">
          Alle zurücksetzen
          <button
            onClick={() => {}}
            className="transition-colors hover:bg-accent-foreground/10 rounded-full p-0.5"
          ></button>
        </Badge>

        {mockActiveFilters.map((f, i) => (
          <FilterPill label={f.label} key={i} />
        ))}
      </div>
      <Input placeholder="Nach Kandidierenden suchen..." />

      <DropdownInput
        label="Patei"
        items={["SPD", "Bündnis 90 / Die Grünen", "Die Linke"]}
        className="mt-4"
      />
      <DropdownInput label="Liste" items={["Die Staditsten"]} />
      <DropdownInput label="Region" items={["S-West"]} />

      <DropdownInput label="Alter" items={[]} className="mt-4" />
      <DropdownInput label="Geschlecht" items={[]} />

      <div className="text-xs text-muted-foreground mt-3 mb-1">
        Politiker/Parteien, die besonderen Wert auf diese Politikbereiche legen:
      </div>
      <DropdownInput label="Politikbereich" items={[]} />

      <div className="text-xs text-muted-foreground mt-3 mb-1">
        Politiker/Parteien, welche folgende Thesen wie ich beantwortet haben:
      </div>
      <DropdownInput label="These" items={[]} />

      <div className="flex gap-2 mt-4">
        <Button className="flex-auto">Filter (6)</Button>
        <Button className="flex-auto" variant="secondary">
          Alle zurücksetzen
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
