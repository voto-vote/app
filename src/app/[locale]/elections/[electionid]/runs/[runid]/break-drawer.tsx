"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useTranslations } from "next-intl";

interface BreakDrawerProps {
  currentQuestion: number;
  totalQuestions: number;
  onContinue: () => void;
  onSkipToResults: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BreakDrawer({
  currentQuestion,
  totalQuestions,
  onContinue,
  onSkipToResults,
  open,
  onOpenChange,
}: BreakDrawerProps) {
  const remainingQuestions = totalQuestions - currentQuestion;
  const isDesktop = useBreakpoint("md");
  const t = useTranslations("BreakDrawer");

  const content = (
    <>
      <div className="px-4 py-2">
        <div className="rounded-lg border bg-card p-4 mb-4">
          <h3 className="font-medium mb-2">Your options:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5 aspect-square">
                1
              </span>
              <span>
                Continue with {remainingQuestions} more theses for the most
                accurate results
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5 aspect-square">
                2
              </span>
              <span>Skip to results now (less accurate but faster)</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 mb-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Skipping will reduce the accuracy of your match results
          </p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button onClick={onContinue} className="w-full">
          Continue with more theses
        </Button>
        <Button
          onClick={onSkipToResults}
          variant="outline"
          className="w-full mt-2"
        >
          Skip to results
        </Button>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-center">
              You&apos;ve completed {currentQuestion} of {totalQuestions} theses
            </DialogDescription>
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
            <DrawerDescription className="text-center">
              You&apos;ve completed {currentQuestion} of {totalQuestions} theses
            </DrawerDescription>
          </DrawerHeader>
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
