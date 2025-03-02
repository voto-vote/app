import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "de", "de-DE-simple"],
    defaultLocale: "en",
  },
};

export default nextConfig;
