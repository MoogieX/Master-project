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
