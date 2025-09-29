import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      // Explicitly set the root directory for Turbopack
      // This should be the absolute path to your game-hub project
      // Replace with your actual path if different
      root: "C:\\Users\\munki\\Documents\\masterproject\\game-hub",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "child_process": false,
        "fs": false, // fs is also a common server-side module
        "net": false, // net is also a common server-side module
        "tls": false, // tls is also a common server-side module
      };
      // Explicitly ignore problematic mongodb sub-modules for client-side
      config.externals.push({
        'mongodb-client-encryption': 'mongodb-client-encryption',
        'aws4': 'aws4',
        'saslprep': 'saslprep',
        'kerberos': 'kerberos',
        'snappy': 'snappy',
        'bson-ext': 'bson-ext',
        'bufferutil': 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }
    return config;
  },
};

export default nextConfig;
