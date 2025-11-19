import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const withPWAPlugin = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
  runtimeCaching: [
    {
      urlPattern: /\/_next\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-build-cache",
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},
};

export default withPWAPlugin(nextConfig);
