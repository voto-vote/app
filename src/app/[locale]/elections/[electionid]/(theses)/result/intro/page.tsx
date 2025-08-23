"use client";

import { useEffect } from "react";
import { useBackButtonStore } from "@/stores/back-button-store";
import { useTranslations } from "next-intl";
import { useElection } from "@/contexts/election-context";
import { useThesesStore } from "@/stores/theses-store";
import resultAnimation from "./result-animation.json";
import bookmarkEntitiesAnimation from "./bookmark-entities-animation.json";
import entityProfilesAnimation from "./entity-profiles-animation.json";
import { useIntroStore } from "@/stores/intro-store";
import Intro from "../../intro";
import { useRouter } from "@/i18n/navigation";

export default function ResultIntroPage() {
  const { election } = useElection();
  const { setBackPath } = useBackButtonStore();
  const { setResultIntroSeen } = useIntroStore();
  const { theses } = useThesesStore();
  const router = useRouter();
  const t = useTranslations("ResultIntroPage");

  useEffect(() => {
    if (election?.id) {
      setBackPath(`/elections/${election?.id}/theses`);
    } else {
      setBackPath("/");
    }
  }, [election?.id, setBackPath]);

  useEffect(() => setResultIntroSeen(true), [setResultIntroSeen]);

  if (!theses) {
    return null;
  }

  const entries = [
    {
      animation: resultAnimation,
      title: t("introOneTitle"),
      description: t("introOneDescription"),
    },
    {
      animation: bookmarkEntitiesAnimation,
      title: t("introTwoTitle"),
      description: t("introTwoDescription"),
    },
    {
      animation: entityProfilesAnimation,
      title: t("introThreeTitle"),
      description: t("introThreeDescription"),
    },
  ];

  return (
    <Intro
      entries={entries}
      onIntroFinished={() => router.push(`/elections/${election?.id}/result`)}
      endIntroText={t("goToResultsButton")}
    />
  );
}
