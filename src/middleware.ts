import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import { getElection } from "./actions/election-action";

// If an election does not support the requested locale, we redirect to the default locale
export default async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");
  let handleI18nRouting;

  const electionsPathIndex = segments.indexOf("elections");
  if (electionsPathIndex !== -1 && electionsPathIndex < segments.length - 1) {
    const electionId = segments[electionsPathIndex + 1];
    const election = await getElection(electionId);
    // Intersection of the static locales and the election's locales
    const supportedLocales = routing.locales.filter((l) =>
      election.locales.includes(l)
    );

    let defaultLocale = election.defaultLocale;
    if (!hasLocale(supportedLocales, locale)) {
      // If the election does not support the requested locale, redirect to the default locale
      defaultLocale =
        supportedLocales.find((l) => l === election.defaultLocale) ??
        routing.defaultLocale;
    }

    handleI18nRouting = createMiddleware({
      locales: supportedLocales,
      defaultLocale: defaultLocale as typeof routing.defaultLocale,
    });

    if (electionsPathIndex > 0) {
      request.nextUrl.pathname =
        "/" + segments.slice(electionsPathIndex).join("/");
    }
  } else {
    handleI18nRouting = createMiddleware(routing);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
