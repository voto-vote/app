"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ResponsiveDialog from "@/components/responsive-dialog";

interface BreakDrawerProps {
  completedTheses: number;
  totalTheses: number;
  onContinue: () => void;
  onSkipToResults: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BreakDrawer({
  completedTheses,
  totalTheses,
  onContinue,
  onSkipToResults,
  open,
  onOpenChange,
}: BreakDrawerProps) {
  const remainingTheses = totalTheses - completedTheses;
  const t = useTranslations("BreakDrawer");

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
    >
      <div className="pb-8 md:p-4 space-y-6 md:space-y-10">
        <div>
          <h3 className="font-semibold mb-2 text-lg">{t("titleSkip")}</h3>
          <p className="text-sm">
            {t("descriptionSkip", {
              completedTheses: completedTheses,
            })}
          </p>
          <Button variant={"link"} className="p-0" onClick={onSkipToResults}>
            {t("skipToResults")}
          </Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-lg">{t("titleContinue")}</h3>
          <p className="text-sm">
            {t("descriptionContinue", {
              remainingTheses: remainingTheses,
            })}
          </p>
        </div>
        <Button onClick={onContinue} className="w-full">
          {t("continue")}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
