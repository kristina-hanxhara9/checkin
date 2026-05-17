import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer"],
  async headers() {
    return [
      {
        // Required by MSAL popup sign-in: the parent page must explicitly
        // allow itself to communicate with popups it opens, otherwise newer
        // browsers block window.closed checks and MSAL incorrectly reports
        // "user cancelled" even on successful auth.
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
