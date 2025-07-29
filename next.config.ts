import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: [
    "10.*.*.*",
    "172.*.*.*",
    "192.168.*.*",
    "[fd00:*]",
    "localhost",
  ],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
