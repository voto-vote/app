"use client";

import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ResponsiveDialog from "@/components/responsive-dialog";
import { useResultStore } from "@/stores/result-store";

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareDrawer({ open, onOpenChange }: ShareDrawerProps) {
  const params = useParams<{ electionid: string }>();
  const { results } = useResultStore();
  const [url, setUrl] = useState<string>("");
  const t = useTranslations("ShareDrawer");

  useEffect(() => {
    const idsAndPercentages = results.flatMap((result) => [
      result.entity.id,
      result.matchPercentage,
    ]);
    const json = JSON.stringify(idsAndPercentages);
    const base64 = Buffer.from(json).toString('base64');
    setUrl(
      `${window.location.origin}/elections/${params.electionid}/theses/result?data=${base64}`
    );
  }, [params.electionid]);

  function share() {
    if (navigator.share) {
      navigator.share({
        title: "VOTO",
        text: t("systemModalDescription"),
        url,
      });
    } else {
      navigator.clipboard?.writeText(url).then(() => {
        alert(t("sharingNotSupported"));
      });
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("screenReaderTitle")}
    >
      <div className="flex flex-col gap-4">
        {url && (
          <div className="border-[6px] rounded-xl border-primary mx-auto">
            <QRCodeCanvas url={url} />
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
    </ResponsiveDialog>
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
