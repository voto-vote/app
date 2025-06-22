"use client";

import { useState } from "react";
import ResultList from "./result-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResultPage() {
  const [tab, setTab] = useState<"result" | "theses">("result");

  return (
    <>
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
        <TabsList className="w-full rounded-none p-0 h-16 border-0">
          <TabTrigger value="result" currentValue={tab}>
            Ergebnis
          </TabTrigger>
          <TabTrigger value="theses" currentValue={tab}>
            Thesen
          </TabTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      <div>
        {tab === "result" && <ResultList />}
        {tab === "theses" && <div>TODO</div>}
      </div>
    </>
  );
}

function TabTrigger({
  value,
  currentValue,
  children,
}: {
  value: "result" | "theses";
  currentValue: "result" | "theses";
  children: React.ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className={`text-xl transition-all data-[state=active]:shadow-none h-full rounded-none text-primary
            ${value === currentValue ? "font-bold" : "text-primary/70"}`}
      style={
        value !== currentValue
          ? {
              boxShadow:
                "inset 0 -4px 4px var(--tw-inset-shadow-color, rgb(0 0 0 / 0.05))",
            }
          : {}
      }
    >
      {children}
    </TabsTrigger>
  );
}
