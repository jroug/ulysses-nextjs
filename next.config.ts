import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: '/jpk-39-fc',
      destination: '/the-yachts/jpk-39-fc/',
      statusCode: 301,
    }, {
      source: '/pogo-36',
      destination: '/the-yachts/pogo-36/',
      statusCode: 301,
    }];
  },
};

export default nextConfig;
