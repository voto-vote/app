import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function ShareDrawer() {
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
    <Drawer>
      <DrawerTrigger className="fixed bottom-6 right-6 rounded-full bg-votopurple-500 text-white p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DialogTitle className="sr-only">Teilen</DialogTitle>
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100svh-12rem)]">
          <div className="p-4 flex flex-col gap-4">
            <div className="border-8 rounded-xl border-votopurple-500 mx-auto flex flex-col">
              <Image
                src="/qr-code.svg"
                width={128}
                height={128}
                alt="QR Code"
                className="rounded-xl"
              />
              <div className="font-mono text-xl font-extrabold border-t-8 border-votopurple-500 text-center py-1">
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
                Code ist jederzeit über den Teilen-Button unten rechts
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
