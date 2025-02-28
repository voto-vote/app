import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ShareDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ShareDrawer({ open, setOpen }: ShareDrawerProps) {
  function share() {
    if (navigator.share) {
      navigator.share({
        title: "VOTO",
        text: "Bewerte die Wahlprogramme und finde heraus, welche Partei am besten zu dir passt.",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DialogTitle className="sr-only">Teilen</DialogTitle>
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100svh-12rem)]">
          <div className="p-4 flex flex-col gap-4">
            <div className="border-[6px] rounded-xl border-votopurple-500 mx-auto flex flex-col">
              <Image
                src="/qr-code.svg"
                width={128}
                height={128}
                alt="QR Code"
                className="rounded-xl"
              />
              <div className="font-mono text-xl font-extrabold border-t-[6px] border-votopurple-500 text-center py-1">
                #29DH27L
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold">
                Dein persönlicher VOTO Code
              </h2>
              <p className="text-sm text-muted-foreground">
                Deine Bewertungen sind die nächsten 3 Monate über den obigen
                Code abrufbar. Du kannst jederzeit weitermachen, wo du aufgehört
                hast oder Dir Dein Ergebnis erneut ansehen. Dein persönlicher
                Code ist jederzeit über das QR Code Symbol oben rechts
                einsehbar.
              </p>
            </div>

            <Button onClick={share}>Teilen</Button>
            <DrawerClose asChild>
              <Button variant="ghost">Schließen</Button>
            </DrawerClose>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
