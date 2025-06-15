import DialogOrDrawer from "@/components/dialog-or-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Filter({ open, onOpenChange }: FilterProps) {
  return (
    <DialogOrDrawer open={open} onOpenChange={onOpenChange} title="Filter">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full text-xs px-3 py-1"
        >
          &#10005; Alle zurücksetzen
        </Button>
        {mockActiveFilters.map((f, i) => (
          <span
            key={i}
            className="bg-votopurple/10 text-votopurple px-3 py-1 rounded-full text-xs flex items-center gap-1"
          >
            {f.label}
            <X className="size-3" />
          </span>
        ))}
      </div>
      <Input placeholder="Nach Kandidierenden suchen..." className="mb-2" />
      <DropdownInput label="Partei" />
      <DropdownInput label="Liste" />
      <DropdownInput label="Region" />
      <DropdownInput label="Alter" />
      <DropdownInput label="Geschlecht" />
      <DropdownInput label="Politikbereich" />
      <DropdownInput label="These" />
      <div className="flex gap-2 mt-4">
        <Button className="grow bg-votopurple text-white hover:bg-votopurple/90">
          Filter (6)
        </Button>
        <Button variant="secondary" className="grow">
          &#10005; Alle zurücksetzen
        </Button>
      </div>
    </DialogOrDrawer>
  );
}

// DropdownInput Component
function DropdownInput({ label }: { label: string }) {
  const [, setOpen] = useState(false);
  return (
    <div className="relative mb-2">
      <button
        className="w-full flex items-center justify-between border rounded-lg px-3 py-2 bg-zinc-50"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className="text-zinc-600">{label}</span>
        <ChevronDown className="size-4 text-zinc-500" />
      </button>
      {/* Add dropdown menu here if needed */}
    </div>
  );
}
