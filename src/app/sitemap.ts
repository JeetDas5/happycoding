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
      url: `${baseUrl}/dashboard`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/reset-password`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/verify-email`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: new Date('2026-05-05'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}