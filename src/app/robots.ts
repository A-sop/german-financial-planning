import type { MetadataRoute } from 'next';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.germanfinancialplanning.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workspace/', '/api/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
