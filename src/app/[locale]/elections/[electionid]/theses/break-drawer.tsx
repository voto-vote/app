"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useTranslations } from "next-intl";

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
  const isDesktop = useBreakpoint("md");
  const t = useTranslations("BreakDrawer");

  const content = (
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
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {t("title")}
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl">
              {t("title")}
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
