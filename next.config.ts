import type { NextConfig } from "next";

// API routes that read/write the bundled SQLite file on Vercel. The serverless
// filesystem only contains files traced into the bundle, so db/custom.db is
// explicitly included for each db-backed route (see src/lib/db.ts for the
// runtime /tmp copy logic that makes reads + writes work on Vercel).
const DB_ROUTES = [
  "/api/courses",
  "/api/news",
  "/api/news/monthly",
  "/api/resources",
  "/api/rankers",
  "/api/testimonials",
  "/api/books",
  "/api/test-series",
  "/api/stats",
  "/api/faq",
  "/api/plans",
  "/api/enquiry",
  "/api/newsletter",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/user/bookmarks",
  "/api/user/bookmarks/remove",
  "/api/ai/mcq",
];

const nextConfig: NextConfig = {
  // standalone output keeps `bun run start` self-contained locally; Vercel
  // ignores it (uses its own builder) and instead gets the traced db file.
  ...(process.env.VERCEL
    ? {
        outputFileTracingIncludes: Object.fromEntries(
          DB_ROUTES.map((route) => [route, ["./db/custom.db"]])
        ),
      }
    : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
