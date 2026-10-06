import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on a VPS with Coolify (see Dockerfile).
  output: "standalone",
  // The agent prompt files are read from disk at runtime, so they must ship with the server.
  outputFileTracingIncludes: {
    "/api/agent": ["./content/agent/*.md"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Portuguese is served unprefixed ("/"), English under "/en".
  async redirects() {
    return [
      { source: "/pt", destination: "/", permanent: true },
      { source: "/pt/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/", destination: "/pt" },
      {
        source: "/:path((?!pt/|pt$|en/|en$|api/|_next/|media/).*)",
        destination: "/pt/:path",
      },
    ];
  },
};

export default nextConfig;
