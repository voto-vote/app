"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animated-collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  answer: string;
  question: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openItem, setOpenItem] = useState("0");

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      {items.map((item, index) => {
        const id = String(index);
        const isOpen = openItem === id;

        return (
          <Collapsible
            key={item.question}
            open={isOpen}
            onOpenChange={(open) => setOpenItem(open ? id : "")}
            className="border-b last:border-b-0"
          >
            <CollapsibleTrigger asChild>
              <button className="flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left text-base font-semibold transition-colors hover:bg-primary/5 md:px-6">
                <span className="grow">{item.question}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground md:px-6 md:text-base">
              {item.answer}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
