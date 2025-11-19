import type { NextConfig } from "next";
import { withPWA } from "next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pwa: {
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
  },
};

export default withPWA(nextConfig);
