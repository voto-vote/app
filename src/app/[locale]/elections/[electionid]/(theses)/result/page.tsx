"use client";

import { useEffect, useState } from "react";
import ResultList from "./result-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElection } from "@/contexts/election-context";
import { useBackButtonStore } from "@/stores/back-button-store";
import ThesesList from "./theses-list";
import { Bookmark } from "@/components/icons/bookmark";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useTranslations } from "next-intl";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useSurveyStore } from "@/stores/survey-store";
import { useResultIDStore } from "@/stores/submission-store";

export default function ResultPage() {
  const { election } = useElection();
  const { bookmarks } = useBookmarkStore();
  const { setBackPath } = useBackButtonStore();
  const [tab, setTab] = useState<"result" | "theses">("result");
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const t = useTranslations("ResultPage");
  const [isSurveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const { setSurveySeen, isSurveySeen } = useSurveyStore();
  const { resultID } = useResultIDStore();

  useEffect(() => {
    if (election.survey.afterTheses !== false &&
      typeof election.survey.afterTheses === "object" &&
      !isSurveySeen(election.id)) {
      const timer = setTimeout(() => {
        setSurveyDialogOpen(true);
        setSurveySeen(election.id, true); // Mark as seen when showing
      }, 10000);

      console.log("Result ID:", resultID);

      return () => clearTimeout(timer);
    }
  }, [election.survey.afterTheses, election.id, isSurveySeen, setSurveySeen, resultID]);

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
        </TabsList>
        <TabsContent value="result">
          <ResultList
            filterBookmarked={filterBookmarked}
            setFilterBookmarked={setFilterBookmarked}
          />
        </TabsContent>
        <TabsContent value="theses">
          <ThesesList />
        </TabsContent>
      </Tabs>

      {election.survey.afterTheses &&
        typeof election.survey.afterTheses === "object" && (
          <ResponsiveDialog
            open={isSurveyDialogOpen}
            onOpenChange={setSurveyDialogOpen}
            title={election.survey.afterTheses.title || t("surveyTitle")}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2 text-center">
                <h2 className="text-lg font-semibold">
                  {election.survey.afterTheses.description}
                </h2>
              </div>
              {
                <Button asChild>
                  <a
                    href={(() => {
                      const url = new URL(election.survey.afterTheses.endpoint);
                      url.searchParams.set('voteID', resultID || '');
                      return url.toString();
                    })()}                    
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {election.survey.afterTheses.yes}
                  </a>
                </Button>
              }
              <Button
                variant="ghost"
                onClick={() => setSurveyDialogOpen(false)}
              >
                {election.survey.afterTheses.no}
              </Button>
            </div>
          </ResponsiveDialog>
        )}
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
