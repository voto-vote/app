import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://app.voto.vote/**"),
      new URL("https://app.voto.dev/**"),
      new URL("https://votoprod.appspot.com.storage.googleapis.com/**"),
      new URL("https://picsum.photos/**"),
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
