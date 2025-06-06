export function translateLocale(code: string, locale: string | undefined) {
  // convert de-DE-simple to Deutsch (Deutschland, Einfach)
  if (code.endsWith("-simple")) {
    // translate with out the -simple
    const localeWithoutDialect = code.replace("-simple", "");
    const language =
      new Intl.DisplayNames(locale, { type: "language" }).of(
        localeWithoutDialect
      ) ?? "";
    if (language.endsWith(")")) {
      return `${language.replace(/\)$/, "")}, Einfach)`;
    } else {
      return `${language} (Einfach)`;
    }
  }
  return new Intl.DisplayNames(locale, { type: "language" }).of(code);
}
