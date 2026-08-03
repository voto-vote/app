import { getTranslations } from "next-intl/server";
import FAQSearchWidget from "../faq-search-widget";

export default async function FAQChatPage() {
  const t = await getTranslations("FAQPage.aiSearch");

  return (
    <FAQSearchWidget
      placeholder={t("placeholder")}
      notConfigured={t("notConfigured")}
      tokenError={t("tokenError")}
    />
  );
}
