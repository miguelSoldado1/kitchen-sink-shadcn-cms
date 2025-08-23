import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/product",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
