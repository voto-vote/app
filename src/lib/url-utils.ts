export function safeParseUrl(url: string): string | undefined {
  if (!url) {
    return undefined;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    return new URL(url).toString();
  } catch (e) {
    console.error(`Invalid URL: ${url}`, e);
    return undefined;
  }
}
