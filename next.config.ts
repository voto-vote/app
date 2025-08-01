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
  // TODO: Remove this when the redirect is no longer needed
  async redirects() {
    return [
      {
        source: '/:locale/app/:id',
        destination: '/:locale/elections/:id',
        permanent: true, // 301 redirect
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
