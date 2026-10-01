import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone output keeps `bun run start` self-contained; Vercel ignores it
  // and uses its own Next.js builder, so this is safe for both targets.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
