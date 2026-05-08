import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}