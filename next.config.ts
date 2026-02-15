import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/insights', destination: '/financial-tips', permanent: true },
      {
        source: '/insights/life-in-germany',
        destination: '/financial-tips/retirement',
        permanent: true,
      },
      {
        source: '/insights/personal-finance',
        destination: '/financial-tips/finances',
        permanent: true,
      },
      { source: '/wichtig-fuer-sie', destination: '/financial-tips', permanent: true },
      { source: '/financial-tips/provision', destination: '/financial-tips/retirement', permanent: true },
      { source: '/financial-tips/provision/:slug', destination: '/financial-tips/retirement/:slug', permanent: true },
      {
        source: '/wichtig-fuer-sie/vorsorge',
        destination: '/financial-tips/retirement',
        permanent: true,
      },
      {
        source: '/wichtig-fuer-sie/finanzen',
        destination: '/financial-tips/finances',
        permanent: true,
      },
      {
        source: '/wichtig-fuer-sie/vorsorge/:slug',
        destination: '/financial-tips/retirement/:slug',
        permanent: true,
      },
      {
        source: '/wichtig-fuer-sie/finanzen/:slug',
        destination: '/financial-tips/finances/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
