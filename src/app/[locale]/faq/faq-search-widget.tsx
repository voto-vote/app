"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

type GenSearchWidgetElement = HTMLElement & {
  authToken?: string;
};

interface FAQSearchWidgetProps {
  description: string;
  disclaimer: string;
  notConfigured: string;
  placeholder: string;
  title: string;
  tokenError: string;
}

const configId = "bf6c14db-11c5-4221-84f0-ebdacef2ae55";
const tokenEndpoint =
  process.env.NEXT_PUBLIC_GOOGLE_SEARCH_WIDGET_TOKEN_ENDPOINT;

export default function FAQSearchWidget({
  description,
  disclaimer,
  notConfigured,
  placeholder,
  title,
  tokenError,
}: FAQSearchWidgetProps) {
  const locale = useLocale();
  const widgetRef = useRef<GenSearchWidgetElement | null>(null);
  const [hasTokenError, setHasTokenError] = useState(false);
  const widgetLocale = locale === "de" || locale === "desimple" ? "de" : "en";

  useEffect(() => {
    if (!tokenEndpoint) {
      return;
    }

    let cancelled = false;

    async function setAuthToken() {
      try {
        const response = await fetch(tokenEndpoint!, {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load search widget token.");
        }

        const data = (await response.json()) as {
          access_token?: string;
          authToken?: string;
          token?: string;
        };
        const authToken = data.authToken ?? data.token ?? data.access_token;

        if (!authToken) {
          throw new Error("Search widget token response did not include token.");
        }

        if (!cancelled && widgetRef.current) {
          widgetRef.current.authToken = authToken;
        }
      } catch {
        if (!cancelled) {
          setHasTokenError(true);
        }
      }
    }

    setAuthToken();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mb-8 overflow-hidden rounded-lg border bg-card shadow-sm">
      <Script
        src={`https://cloud.google.com/ai/gen-app-builder/client?hl=${widgetLocale}`}
        strategy="afterInteractive"
      />

      <div className="border-b px-5 py-5 md:px-6">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
        <p className="mt-4 border-l-4 border-primary/40 pl-4 text-sm leading-6 text-muted-foreground">
          {disclaimer}
        </p>
      </div>

      <div className="px-5 py-5 md:px-6">
        {configId ? (
          <gen-search-widget
            ref={(node) => {
              widgetRef.current = node as GenSearchWidgetElement | null;
            }}
            configId="bf6c14db-11c5-4221-84f0-ebdacef2ae55"
            placeholder={placeholder}
            
            alwaysOpened="false"
          />
        ) : (
          <div className="rounded-md bg-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
            {notConfigured}
          </div>
        )}

        {hasTokenError && (
          <p className="mt-3 text-sm leading-6 text-destructive">
            {tokenError}
          </p>
        )}
      </div>
    </section>
  );
}
