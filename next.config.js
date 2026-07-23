/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // enables the lightweight Docker build in Dockerfile
  images: {
    // Narrow allowlist, not a wildcard: `hostname: "**"` would let Next's
    // image optimizer fetch from ANY external host at request time, which
    // becomes an SSRF-ish proxy if `next/image` is ever pointed at
    // teacher-supplied `thumbnailUrl` values (the app doesn't use
    // next/image yet, but the Course model already has that field, so this
    // is here before that's added rather than after). Add your actual
    // storage/CDN domain(s) below - e.g. the R2/S3 public URL host from
    // S3_PUBLIC_URL_BASE - as thumbnails are wired up.
    remotePatterns: [
      // { protocol: "https", hostname: "pub-xxxxxxxxxxxx.r2.dev" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // The service worker file itself must never be cached by the browser/CDN —
        // otherwise an updated sw.js can take a very long time to reach clients.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
