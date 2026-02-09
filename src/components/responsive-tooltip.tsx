import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePointer } from "@/hooks/use-pointer";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ResponsiveTooltip({
  children,
  trigger,
  className,
  onClick,
  side = "top",
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  onClick?: () => void;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const [open, setOpen] = useState(false);
  const pointer = usePointer();

  const handleTriggerClick = () => {
    if (pointer === "fine") {
      onClick?.();
    } else {
      setOpen(true);
    }
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger onClick={handleTriggerClick}>{trigger}</TooltipTrigger>
      <TooltipContent
        className={cn("max-w-[min(calc(100vw-1rem),50rem)]", className)}
        side={side}
        collisionPadding={8}
        onClick={onClick}
      >
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
