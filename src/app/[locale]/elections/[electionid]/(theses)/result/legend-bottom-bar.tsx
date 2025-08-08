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
import { useTranslations } from "next-intl";
import { usePartiesStore } from "@/stores/party-store";

interface LegendBottomBarProps {
  election: Election;
}

export default function LegendBottomBar({ election }: LegendBottomBarProps) {
  const [open, setOpen] = useState(false);
  const { parties } = usePartiesStore();
  const t = useTranslations("LegendBottomBar");

  return (
    parties && (
      <BottomBar>
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-full flex flex-col items-center"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost">
              {open ? t("hideLegend") : t("showLegend")}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="self-stretch">
            <div className="flex flex-wrap justify-center gap-4">
              {parties.map((party, index) => {
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
                        {(index + 1) % election.algorithm.decisions}
                      </div>
                    </div>
                    <span className="text-foreground">{party.displayName}</span>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </BottomBar>
    )
  );
}
