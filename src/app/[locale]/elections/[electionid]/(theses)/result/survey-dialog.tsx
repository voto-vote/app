import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useElection } from "@/contexts/election-context";
import { Link } from "@/i18n/navigation";
import { useDataSharingStore } from "@/stores/data-sharing-store";
import { useSurveyStore } from "@/stores/survey-store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function SurveyDialog() {
  const { election } = useElection();
  const [isSurveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const { isSurveySeen, setSurveySeen } = useSurveyStore();
  const { sharingId } = useDataSharingStore();
  const [surveyUrl, setSurveyUrl] = useState<string>("");
  const t = useTranslations("SurveyDialog");

  useEffect(() => {
    if (election.survey.afterTheses && !isSurveySeen(election.id)) {
      const timer = setTimeout(() => {
        setSurveyDialogOpen(true);
        setSurveySeen(election.id, true); // Mark as seen when showing
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [election.survey.afterTheses, election.id, isSurveySeen, setSurveySeen]);

  useEffect(() => {
    if (election.survey.afterTheses) {
      const url = new URL(election.survey.afterTheses.endpoint);
      url.searchParams.set("voteID", sharingId || "");
      setSurveyUrl(url.toString());
    }
  }, [election.survey.afterTheses, sharingId]);

  if (!election.survey.afterTheses) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isSurveyDialogOpen}
      onOpenChange={setSurveyDialogOpen}
      title={election.survey.afterTheses.title || t("surveyTitle")}
    >
      <div className="flex flex-col gap-4">
        <p className="text-lg text-center mb-4">
          {election.survey.afterTheses.description}
        </p>
        <Button onClick={() => setSurveyDialogOpen(false)} asChild>
          <Link href={surveyUrl} target="_blank" rel="noopener noreferrer">
            {election.survey.afterTheses.yes}
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => setSurveyDialogOpen(false)}>
          {election.survey.afterTheses.no}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
