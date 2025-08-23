"use client";

import { useEffect } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useTranslations } from "next-intl";
import { useElection } from "@/contexts/election-context";
import { useThesesStore } from "@/stores/theses-store";
import rateThesesAnimation from "./rate-theses-animation.json";
import starThesesAnimation from "./star-theses-animation.json";
import navigateThesesAnimation from "./navigate-theses-animation.json";
import { useIntroStore } from "@/stores/intro-store";
import Intro from "../../intro";
import { useRouter } from "@/i18n/navigation";
import { usePointer } from "@/hooks/use-pointer";

export default function ThesesIntroPage() {
  const { election } = useElection();
  const { setBackPath } = useBackButtonStore();
  const { setThesesIntroSeen } = useIntroStore();
  const { theses } = useThesesStore();
  const router = useRouter();
  const pointer = usePointer();
  const t = useTranslations("ThesesIntroPage");

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => setThesesIntroSeen(true), [setThesesIntroSeen]);

  if (!theses) {
    return null;
  }

  const entries = [
    {
      animation: rateThesesAnimation,
      title: t("introOneTitle"),
      description: t("introOneDescription", {
        count: theses.length,
      }),
    },
    {
      animation: starThesesAnimation,
      title: t("introTwoTitle"),
      description: t("introTwoDescription"),
    },
    {
      animation: navigateThesesAnimation,
      title: t("introThreeTitle"),
      description: t("introThreeDescription", {
        pointer,
      }),
    },
  ];

  return (
    <Intro
      entries={entries}
      onIntroFinished={() => router.push(`/elections/${election?.id}/theses`)}
      endIntroText={t("startVotoButton")}
    />
  );
}
