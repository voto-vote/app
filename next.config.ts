import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://app.voto.vote/**"),
      new URL("https://app.voto.dev/**"),
    ],
  },
};

export default nextConfig;
