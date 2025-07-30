import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { getElection } from "./actions/election-action";

export const runtime = "nodejs";

// If an election does not support the requested locale, we redirect to the default locale
export default async function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.nextUrl.toString());
  // "" / ...
  const [, ...segments] = request.nextUrl.pathname.split("/");
  let handleI18nRouting;

  const electionsPathIndex = segments.indexOf("elections");
  if (electionsPathIndex !== -1 && electionsPathIndex < segments.length - 1) {
    const staticLocales = routing.locales;
    const electionId = segments[electionsPathIndex + 1];
    const election = await getElection(electionId);
    const electionLocales =
      election?.locales?.map((l) => l.split("-")[0]) || [];
    // Intersection of the static locales and the election's locales
    const supportedLocales = staticLocales.filter((l) =>
      electionLocales.includes(l)
    );

    handleI18nRouting = createMiddleware({
      locales: supportedLocales,
      defaultLocale: routing.defaultLocale,
    });

    // If the url already starts with a locale that is not in the supported locales, we need to remove it
    // This would otherwise lead to a redirect loop
    if (electionsPathIndex > 0) {
      const locale = segments[electionsPathIndex - 1];
      if (
        !supportedLocales.includes(locale as (typeof routing.locales)[number])
      ) {
        request.nextUrl.pathname =
          "/" + segments.slice(electionsPathIndex).join("/");
      }
    }
  } else {
    handleI18nRouting = createMiddleware(routing);
  }

  const response = handleI18nRouting(request);
  console.log("Redirecting to: ", response.status === 307 ? response.headers.get("Location") : request.nextUrl.toString());
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
