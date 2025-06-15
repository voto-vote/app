"use client";

import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DialogOrDrawer from "@/components/dialog-or-drawer";

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDrawer({ open, onOpenChange }: ShareDrawerProps) {
  const params = useParams<{ electionid: string; runid: string }>();
  const [url, setUrl] = useState<string>();
  const t = useTranslations("ShareDrawer");

  useEffect(() => {
    setUrl(
      `${window.location.origin}/elections/${params.electionid}/theses/result`
    );
  }, [params.electionid, params.runid]);

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "VOTO",
        text: t("systemModalDescription"),
        url,
      });
    }
  }

  return (
    <DialogOrDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("screenReaderTitle")}
    >
      <div className="p-4 flex flex-col gap-4">
        {url && params.runid && (
          <div className="border-[6px] rounded-xl border-primary mx-auto flex flex-col">
            <QRCodeCanvas url={url} />
            <div className="font-mono text-xl font-extrabold border-t-[6px] border-primary text-center py-1">
              #{params.runid.toUpperCase()}
            </div>
          </div>
        )}

        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Button onClick={share}>{t("shareButton")}</Button>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          {t("closeButton")}
        </Button>
      </div>
    </DialogOrDrawer>
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
