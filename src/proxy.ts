import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { getElection } from "./actions/election-action";

// If an election does not support the requested locale, we redirect to the default locale
export default async function proxy(request: NextRequest) {
  const [, ...segments] = request.nextUrl.pathname.split("/");
  let handleI18nRouting = createMiddleware(routing);

  const electionsPathIndex = segments.indexOf("elections");
  if (electionsPathIndex !== -1 && electionsPathIndex < segments.length - 1) {
    const electionId = segments[electionsPathIndex + 1];
    const election = await getElection(electionId);

    if (election) {
      const supportedLocales = routing.locales;
      const electionLocales =
        election.locales.map((l) => l.split("-")[0]) || [];
      // Intersection of the static locales and the election's locales
      const supportedElectionLocales = supportedLocales.filter((l) =>
        electionLocales.includes(l),
      );
      if (supportedElectionLocales.length === 0) {
        throw new Error(
          `The election ${election.title} - ${election.subtitle} (${electionId}) has unsupported locales. Supported locales: [${supportedLocales.join(
            ", ",
          )}]. Election locales: [${electionLocales.join(", ")}].`,
        );
      }

      handleI18nRouting = createMiddleware({
        locales: supportedElectionLocales,
        defaultLocale: routing.defaultLocale,
      });

      // If the url already starts with a locale that is not in the supported locales, we need to remove it
      // The next-intl middleware will not see this path as a valid locale and will just append the default locale
      // Wrong behavior: /ru/elections/1234 -> /de/ru/elections/1234
      // Correct behavior: /ru/elections/1234 -> /de/elections/1234
      if (electionsPathIndex > 0) {
        const locale = segments[electionsPathIndex - 1];
        if (
          !supportedElectionLocales.includes(
            locale as (typeof routing.locales)[number],
          )
        ) {
          request.nextUrl.pathname =
            "/" + segments.slice(electionsPathIndex).join("/");
        }
      }
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
