"use client";

import { useEffect, useState } from "react";
import ResultList from "./result-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElection } from "@/contexts/election-context";
import { useBackButtonStore } from "@/stores/back-button-store";
import ThesesList from "./theses-list";
import { Bookmark } from "@/lib/icons";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";
import SurveyDialog from "@/app/[locale]/elections/[electionid]/survey-dialog";
import { useResultStore } from "@/stores/result-store";

export default function ResultPage() {
  const { election } = useElection();
  const { bookmarks } = useBookmarkStore();
  const { setBackPath } = useBackButtonStore();
  const [tab, setTab] = useState<"result" | "theses">("result");
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const t = useTranslations("ResultPage");
  const { results } = useResultStore();

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/theses`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  return (
    <>
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
        <TabsList className="w-full rounded-none p-0 h-16 border-0">
          <TabTrigger value="result" currentValue={tab}>
            {t("resultTab")}
          </TabTrigger>
          {results.length > 2 && (
            <TabTrigger value="theses" currentValue={tab}>
              {t("thesesTab")}
              <div className="absolute -top-2 max-sm:right-0 sm:left-[calc(50%_+_3rem)] size-12">
                <div className="size-full relative">
                  <Bookmark className="absolute inset-0 stroke-0 fill-primary size-full" />
                  <div className="absolute inset-0 text-primary-foreground text-sm font-semibold grid place-items-center mb-2">
                    {(bookmarks[election.id]?.parties?.length ?? 0) +
                      (bookmarks[election.id]?.candidates?.length ?? 0)}
                  </div>
                </div>
              </div>
            </TabTrigger>
          )}
        </TabsList>
        <TabsContent value="result">
          <ResultList
            filterBookmarked={filterBookmarked}
            setFilterBookmarked={setFilterBookmarked}
          />
          {results.length <= 2 && <ThesesList />}
        </TabsContent>
        <TabsContent value="theses">
          <ThesesList />
        </TabsContent>
      </Tabs>

      <SurveyDialog type="afterTheses" />
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
      className={`text-xl transition-all data-[state=active]:shadow-none h-full rounded-none text-primary relative
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
