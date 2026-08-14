import { getTranslations } from "next-intl/server";
import FAQSearchWidget from "../faq-search-widget";

export default async function FAQChatPage() {
  const t = await getTranslations("FAQPage.aiSearch");
  const runtimeEnv = process.env;

  return (
    <FAQSearchWidget
      configId={runtimeEnv.GOOGLE_SEARCH_WIDGET_CONFIG_ID}
      placeholder={t("placeholder")}
      notConfigured={t("notConfigured")}
      tokenEndpoint={
        runtimeEnv.GOOGLE_SEARCH_WIDGET_TOKEN_ENDPOINT ??
        runtimeEnv.NEXT_PUBLIC_GOOGLE_SEARCH_WIDGET_TOKEN_ENDPOINT
      }
      tokenError={t("tokenError")}
    />
  );
}
