import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

export default function MatchBar({
  value,
  color,
  size = "md",
  className,
}: {
  value: number;
  color?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClassesProgress = {
    sm: "h-3 rounded-[0.25rem]",
    md: "h-4 rounded-sm",
  };

  const sizeClassesText = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <div className={cn("relative", className)}>
      <Progress
        value={value}
        className={sizeClassesProgress[size]}
        style={color ? ({ "--primary": color } as CSSProperties) : {}}
      />
      <div
        className={cn(
          "absolute inset-y-0 text-primary-foreground font-semibold pr-0.5 flex items-center",
          sizeClassesText[size]
        )}
        style={{ right: 100 - value + "%" }}
      >
        {value}%
      </div>
    </div>
  );
}
