"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";

// See https://github.com/shadcn-ui/ui/issues/2053#issuecomment-2968789059

type CollapsibleContentProps = React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
  animate?: boolean;
};

function CollapsibleContent({ className, animate = true, ...props }: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        animate && "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };