"use client";

import Script from "next/script";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

type GenSearchWidgetElement = HTMLElement & {
  authToken?: string;
};

interface FAQSearchWidgetProps {
  configId?: string;
  notConfigured: string;
  placeholder: string;
  tokenEndpoint?: string;
  tokenError: string;
}

export default function FAQSearchWidget({
  configId,
  notConfigured,
  placeholder,
  tokenEndpoint,
  tokenError,
}: FAQSearchWidgetProps) {
  const locale = useLocale();
  const widgetRef = useRef<GenSearchWidgetElement | null>(null);
  const [authToken, setAuthTokenValue] = useState<string | null>(null);
  const [hasTokenError, setHasTokenError] = useState(false);
  const widgetLocale = locale === "de" || locale === "desimple" ? "de" : "en";
  const canRenderWidget = Boolean(configId) && (!tokenEndpoint || authToken);

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

        if (!cancelled) {
          setAuthTokenValue(authToken);
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
  }, [tokenEndpoint]);

  useEffect(() => {
    if (widgetRef.current && authToken) {
      widgetRef.current.authToken = authToken;
    }
  }, [authToken]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F7F7F8]">
      <Script
        src={`https://cloud.google.com/ai/gen-app-builder/client?hl=${widgetLocale}`}
        strategy="afterInteractive"
      />

      {canRenderWidget ? (
        <gen-search-widget
          ref={(node) => {
            const widget = node as GenSearchWidgetElement | null;
            widgetRef.current = widget;

            if (widget && authToken) {
              widget.authToken = authToken;
            }
          }}
          configId={configId}
          location="eu"
          anchorsTarget="_self"
          placeholder={placeholder}
          alwaysOpened=""
        />
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-sm items-center px-4">
          <p className="w-full border border-[#D9DCE3] bg-white px-5 py-4 text-sm leading-6 text-[#5A606C]">
            {notConfigured}
          </p>
        </div>
      )}

      {hasTokenError && (
        <p className="fixed right-4 bottom-4 left-4 z-50 border border-destructive bg-white px-4 py-3 text-sm leading-6 text-destructive">
          {tokenError}
        </p>
      )}
    </div>
  );
}
