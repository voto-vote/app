import { getTranslations } from "next-intl/server";
import FAQAccordion from "./faq-accordion";
import FAQSearchLauncher from "./faq-search-launcher";

const faqKeys = [
  "whatIsVoto",
  "howItWorks",
  "isRecommendation",
  "personalData",
  "changeAnswers",
  "randomOrder",
] as const;

export default async function FAQPage() {
  const t = await getTranslations("FAQPage");
  const items = faqKeys.map((key) => ({
    question: t(`questions.${key}.question`),
    answer: t(`questions.${key}.answer`),
  }));

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-8 md:py-12">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold text-primary">{t("eyebrow")}</p>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {t("description")}
        </p>
      </div>

      <FAQSearchLauncher
        title={t("aiSearch.title")}
        description={t("aiSearch.description")}
        disclaimer={t("aiSearch.disclaimer")}
        openInNewTab={t("aiSearch.openInNewTab")}
        notConfigured={t("aiSearch.notConfigured")}
      />

      <FAQAccordion items={items} />
    </div>
  );
}
