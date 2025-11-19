declare module "next-pwa" {
  import type { NextConfig } from "next";

  type RuntimeCachingEntry = {
    urlPattern: RegExp | string;
    handler:
      | "CacheFirst"
      | "CacheOnly"
      | "NetworkFirst"
      | "NetworkOnly"
      | "StaleWhileRevalidate";
    options?: Record<string, unknown>;
  };

  type WithPWAOptions = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCachingEntry[];
  };

  type WithPWAFn = (config?: NextConfig) => NextConfig;

  export default function withPWA(options?: WithPWAOptions): WithPWAFn;
}
