import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 auto-generates AGENTS.md/CLAUDE.md on every dev/build run —
  // disabled so the project folder stays free of anything agent-tooling
  // related.
  agentRules: false,
};

export default nextConfig;
