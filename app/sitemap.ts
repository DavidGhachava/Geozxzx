import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://geo-learn-georgian.heromak2008.chatgpt.site';
  const routes = ['', '/features', '/phrasebook', '/guided-learning', '/pricing', '/install', '/about', '/help', '/changelog', '/security', '/privacy', '/terms', '/cookies', '/acceptable-use', '/data-deletion', '/refunds', '/accessibility'];
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date('2026-09-04'), changeFrequency: route === '' ? 'weekly' : 'monthly', priority: route === '' ? 1 : .7 }));
}
