import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on a VPS with Coolify (see Dockerfile).
  output: "standalone",
  // The agent prompt files are read from disk at runtime, so they must ship with the server.
  outputFileTracingIncludes: {
    "/api/agent": ["./content/agent/*.md"],
  },
  // The stylesheet is small (Tailwind): inlining removes a render-blocking round trip on first visit.
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Portuguese is served unprefixed ("/"), English under "/en".
  async redirects() {
    return [
      { source: "/pt", destination: "/", permanent: true },
      // The generated OG image is advertised under /pt/ (its route segment): serve it there
      // directly, because link-preview crawlers do not always follow a redirect.
      { source: "/pt/:path((?!opengraph-image).+)", destination: "/:path", permanent: true },
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
