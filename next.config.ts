import type { NextConfig } from "next";

// GitHub Pages only serves static files, under /<repo-name>/. The Pages
// workflow sets NEXT_PUBLIC_BASE_PATH (e.g. "/DRESDEV2") and this switches
// the build to a static export in `out/`. Without it, it stays a normal
// Next.js server build (pnpm build && pnpm start).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on every dev/build run —
  // disabled so the project folder stays free of anything agent-tooling
  // related.
  agentRules: false,
  ...(basePath !== undefined && {
    output: "export",
    basePath,
    // No server to optimize images on a static host.
    images: { unoptimized: true },
  }),
};

export default nextConfig;
