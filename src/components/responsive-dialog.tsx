import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  children,
  className = "",
}: ResponsiveDialogProps) {
  const isDesktop = useBreakpoint("md");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{title}</DialogTitle>
            <DialogDescription className="sr-only">{title}</DialogDescription>
          </DialogHeader>
          <div className={cn("overflow-y-auto", className)}>{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center text-xl">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">{title}</DrawerDescription>
        </DrawerHeader>
        <div className={cn("overflow-y-auto p-4", className)}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
