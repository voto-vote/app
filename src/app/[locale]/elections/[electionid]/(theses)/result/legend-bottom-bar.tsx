import { Button } from "@/components/ui/button";
import BottomBar from "./bottom-bar";
import { useState } from "react";
import { Square } from "lucide-react";
import { isLightColor } from "@/lib/color-utils";
import { Election } from "@/types/election";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animated-collapsible";

interface LegendBottomBarProps {
  election: Election;
}

export default function LegendBottomBar({ election }: LegendBottomBarProps) {
  const [open, setOpen] = useState(false);

  const mockParties = [
    {
      name: "Du",
      color: "var(--color-primary)",
    },
    {
      name: "CDU",
      color: "black",
    },
    {
      name: "AfD",
      color: "#009ee0",
    },
    {
      name: "EVP",
      color: "#f89a1f",
    },
    {
      name: "Grüne",
      color: "#19a329",
    },
    {
      name: "FDP",
      color: "#ffde00",
    },
    {
      name: "SPD",
      color: "#e30013",
    },
    {
      name: "Linke",
      color: "#be3075",
    },
    {
      name: "FDP",
      color: "#ffde00",
    },
    {
      name: "Grüne",
      color: "#19a329",
    },
    {
      name: "SPD",
      color: "#e30013",
    },
    {
      name: "Linke",
      color: "#be3075",
    },
  ];

  return (
    <BottomBar>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="w-full flex flex-col items-center"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost">
            {open ? "Legende ausblenden" : "Legende"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="self-stretch">
          <div className="grid grid-cols-8 gap-2">
            {mockParties.map((party, index) => {
              const foregroundColor = isLightColor(party.color)
                ? "var(--color-zinc-900)"
                : "var(--color-zinc-100)";

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs pt-1"
                >
                  <div
                    style={{
                      color: party.color,
                    }}
                    className="relative size-4"
                  >
                    <Square className="absolute inset-0 fill-current size-full" />
                    <div
                      style={{ color: foregroundColor }}
                      className="relative font-semibold text-xs text-center align-middle leading-4"
                    >
                      {election.algorithm.decisions}
                    </div>
                  </div>
                  <span className="text-foreground">{party.name}</span>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </BottomBar>
  );
}
