import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "child_process": false,
        "fs": false, // fs is also a common server-side module
        "net": false, // net is also a common server-side module
        "tls": false, // tls is also a common server-side module
      };
    }
    return config;
  },
};

export default nextConfig;
