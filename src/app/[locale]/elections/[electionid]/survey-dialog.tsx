import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useElection } from "@/contexts/election-context";
import { Link } from "@/i18n/navigation";
import { useDataSharingStore } from "@/stores/data-sharing-store";
import { useSurveyStore } from "@/stores/survey-store";
import { Survey, SurveyContent } from "@/types/election";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface SurveyDialogProps {
  type: keyof Survey;
}

export default function SurveyDialog({ type }: SurveyDialogProps) {
  const { election } = useElection();
  const [isSurveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const {
    isSurveyBeforeThesesSeen,
    isSurveyAfterThesesSeen,
    setSurveyBeforeThesesSeen,
    setSurveyAfterThesesSeen,
  } = useSurveyStore();
  const { sharingId } = useDataSharingStore();
  const [surveyUrl, setSurveyUrl] = useState<string>("");
  const [surveyContent, setSurveyContent] = useState<SurveyContent | false>(
    false
  );
  const t = useTranslations("SurveyDialog");

  useEffect(() => {
    if (type === "beforeTheses") {
      setSurveyContent(election.survey.beforeTheses);
    } else if (type === "afterTheses") {
      setSurveyContent(election.survey.afterTheses);
    }
  }, [type, election.survey]);

  useEffect(() => {
    const isSurveySeen =
      type === "beforeTheses"
        ? isSurveyBeforeThesesSeen(election.id)
        : isSurveyAfterThesesSeen(election.id);

    if (surveyContent && !isSurveySeen) {
      const timer = setTimeout(() => {
        setSurveyDialogOpen(true);
        // Mark as seen when showing
        if (type === "beforeTheses") {
          setSurveyBeforeThesesSeen(election.id, true);
        } else {
          setSurveyAfterThesesSeen(election.id, true);
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [
    surveyContent,
    election.id,
    isSurveyAfterThesesSeen,
    isSurveyBeforeThesesSeen,
    setSurveyAfterThesesSeen,
    setSurveyBeforeThesesSeen,
    type,
  ]);

  useEffect(() => {
    if (surveyContent) {
      const url = new URL(surveyContent.endpoint);
      url.searchParams.set("voteID", sharingId || "");
      setSurveyUrl(url.toString());
    }
  }, [surveyContent, sharingId]);

  if (!surveyContent) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isSurveyDialogOpen}
      onOpenChange={setSurveyDialogOpen}
      title={surveyContent.title || t("surveyTitle")}
    >
      <div className="flex flex-col gap-4">
        <p className="text-lg text-center mb-4">{surveyContent.description}</p>
        <Button onClick={() => setSurveyDialogOpen(false)} asChild>
          <Link href={surveyUrl} target="_blank" rel="noopener noreferrer">
            {surveyContent.yes}
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => setSurveyDialogOpen(false)}>
          {surveyContent.no}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
