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
    }, {
      source: '/x46',
      destination: '/the-yachts/x46/',
      statusCode: 301,
    }, {
      source: '/jpk-48-fc',
      destination: '/the-yachts/jpk-48-fc/',
      statusCode: 301,
    }, {
      source: '/landing-page',
      destination: '/book-now/',
      statusCode: 301,
    }];
  },
};

export default nextConfig;
