import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const cms = process.env.CMS_BASE_URL?.replace(/\/$/, '');
    if (!cms || !/^https?:\/\//i.test(cms)) throw new Error('CMS_BASE_URL must be an HTTP(S) URL.');
    return {
      beforeFiles: [{ source: '/media/:path*', destination: `${cms}/wp-content/uploads/:path*` }],
    };
  },
};

export default nextConfig;
