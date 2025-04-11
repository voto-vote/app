import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://app.voto.vote/**"),
      new URL("https://app.voto.dev/**"),
      new URL("https://votoprod.appspot.com.storage.googleapis.com/**"),
    ],
  },
};

export default nextConfig;
