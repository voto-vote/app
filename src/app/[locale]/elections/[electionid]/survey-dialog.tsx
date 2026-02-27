import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useElection } from "@/contexts/election-context";
import { Link } from "@/i18n/navigation";
import { useDataSharingStore } from "@/stores/data-sharing-store";
import { useSurveyStore } from "@/stores/survey-store";
import { SurveyContent } from "@/types/election";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface SurveyDialogProps {
  placement: "beforeTheses" | "afterTheses";
}

// Defines the time, after which the survey dialog is shown (in ms)
const SURVEY_TIMEOUT = 5000;

export default function SurveyDialog({ placement }: SurveyDialogProps) {
  const { election } = useElection();
  const [isSurveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const {
    isSurveyBeforeThesesSeen,
    isSurveyAfterThesesSeen,
    setSurveyBeforeThesesSeen,
    setSurveyAfterThesesSeen,
  } = useSurveyStore();
  const { sharingId } = useDataSharingStore();
  const t = useTranslations("SurveyDialog");

  const surveyContent: SurveyContent =
    placement === "beforeTheses"
      ? election.survey.beforeTheses
      : election.survey.afterTheses;

  useEffect(() => {
    const isSurveySeen =
      placement === "beforeTheses"
        ? isSurveyBeforeThesesSeen(election.id)
        : isSurveyAfterThesesSeen(election.id);

    if (surveyContent && !isSurveySeen) {
      const timer = setTimeout(() => {
        setSurveyDialogOpen(true);

        // Mark as seen when showing
        if (placement === "beforeTheses") {
          setSurveyBeforeThesesSeen(election.id, true);
        } else {
          setSurveyAfterThesesSeen(election.id, true);
        }
      }, SURVEY_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [
    surveyContent,
    election.id,
    isSurveyAfterThesesSeen,
    isSurveyBeforeThesesSeen,
    setSurveyAfterThesesSeen,
    setSurveyBeforeThesesSeen,
    placement,
  ]);

  if (!surveyContent) {
    return null;
  }

  let surveyUrl = "";
  try {
    const url = new URL(surveyContent.endpoint);
    url.searchParams.set("voteID", sharingId || "");
    surveyUrl = url.toString();
  } catch (e) {
    throw new Error("Invalid survey URL: " + e); // TODO remove try catch once proper error handling in the backend
  }

  return (
    <ResponsiveDialog
      open={isSurveyDialogOpen}
      onOpenChange={setSurveyDialogOpen}
      title={surveyContent.title || t("surveyTitle")}
      className={
        surveyContent.displayType === "embedded"
          ? "max-w-full h-screen"
          : undefined
      }
    >
      <div className="flex flex-col gap-4 h-full">
        {surveyContent.displayType === "embedded" ? (
          <>
            <div className="flex-1 min-h-0">
              <iframe
                src={surveyUrl}
                className="size-full border-0 rounded"
                title={surveyContent.title || t("surveyTitle")}
              />
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setSurveyDialogOpen(false)}>
                {t("close")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg text-center mb-4">
              {surveyContent.description}
            </p>
            <Button onClick={() => setSurveyDialogOpen(false)} asChild>
              <Link href={surveyUrl} target="_blank" rel="noopener noreferrer">
                {surveyContent.yes}
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => setSurveyDialogOpen(false)}>
              {surveyContent.no}
            </Button>
          </>
        )}
      </div>
    </ResponsiveDialog>
  );
}
