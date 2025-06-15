"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavigationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NavigationSheet({
  open,
  onOpenChange,
}: NavigationSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>TODO</SheetTitle>
          <SheetDescription>Lorem Ipsum...</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
