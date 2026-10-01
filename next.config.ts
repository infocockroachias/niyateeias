import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone output keeps `bun run start` self-contained locally; Vercel
  // ignores it (uses its own builder).
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
