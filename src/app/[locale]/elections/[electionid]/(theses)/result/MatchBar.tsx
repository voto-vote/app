import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

export default function MatchBar({
  value,
  color,
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Progress
        value={value}
        className="h-4 rounded-sm"
        style={color ? ({ "--primary": color } as CSSProperties) : {}}
      />
      <div
        className="absolute inset-y-0 text-primary-foreground text-sm font-semibold leading-none pr-0.5"
        style={{ right: 100 - value + "%" }}
      >
        {value}%
      </div>
    </div>
  );
}
