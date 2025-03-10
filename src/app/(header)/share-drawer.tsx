import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDrawer({ open, onOpenChange }: ShareDrawerProps) {
  const params = useParams<{ electionid: string; runid: string }>();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(
      `${window.location.origin}/elections/${params.electionid}/runs/${params.runid}/result`
    );
  }, [params.electionid, params.runid]);

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "VOTO",
        text: "Bewerte die Wahlprogramme und finde heraus, welche Partei am besten zu dir passt.",
        url,
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="sr-only">
            <DialogTitle>Teilen</DialogTitle>
          </DrawerHeader>
          <div className="p-4 flex flex-col gap-4">
            {url && params.runid && (
              <div className="border-[6px] rounded-xl border-votopurple-500 mx-auto flex flex-col">
                <QRCodeCanvas url={url} />
                <div className="font-mono text-xl font-extrabold border-t-[6px] border-votopurple-500 text-center py-1">
                  #{params.runid.toUpperCase()}
                </div>
              </div>
            )}

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
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function QRCodeCanvas({ url }: { url: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    QRCode.toCanvas(canvas.current, url, {
      width: 128,
    });
  }, [url]);

  return <canvas ref={canvas} className="rounded-xl"></canvas>;
}
