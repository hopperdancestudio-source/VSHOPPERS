import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary is the only remote media source.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
