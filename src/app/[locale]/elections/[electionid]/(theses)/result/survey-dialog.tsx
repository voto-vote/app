import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SurveyContent } from "@/types/election";

interface SurveyDialogProps {
  survey: SurveyContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SurveyDialog({
  survey,
  open,
  onOpenChange,
}: SurveyDialogProps) {
  if (!survey) {
    return null; 
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{survey.title}</DialogTitle>
          <DialogDescription>{survey.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">{survey.no}</Button>
            </DialogClose>
            <DialogClose asChild>
              <a
                href={survey.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {survey.yes}
              </a>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
