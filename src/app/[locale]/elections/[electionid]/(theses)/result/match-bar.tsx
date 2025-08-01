import { Progress } from "@/components/ui/progress";
import { isLightColor, isVeryLightColor } from "@/lib/color-utils";
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

  const backgroundColor = color || "var(--primary)";
  const foregroundColor = isLightColor(backgroundColor)
    ? "var(--color-zinc-900)"
    : "var(--color-zinc-100)";
  const needsBorder = isVeryLightColor(backgroundColor);

  return (
    <div className={cn("relative", className)}>
      <Progress
        value={value}
        className={cn(
          sizeClassesProgress[size],
          '[&_[data-slot="progress-indicator"]]:bg-(--progress-indicator) bg-(--progress-indicator)/20',
          needsBorder && 'border [&_[data-slot="progress-indicator"]]:border-r'
        )}
        style={{ "--progress-indicator": backgroundColor } as CSSProperties}
      />
      <div
        className={cn(
          "absolute inset-y-0 font-semibold pr-0.5 flex items-center",
          sizeClassesText[size]
        )}
        style={{
          right: 100 - value + "%",
          color: foregroundColor,
        }}
      >
        {value}%
      </div>
    </div>
  );
}
