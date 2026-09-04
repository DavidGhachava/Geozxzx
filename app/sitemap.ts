import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const primary = ['', '/learn-georgian', '/learn-georgian-batumi', '/learn-georgian-tbilisi', '/learn-georgian-for-russian-speakers', '/phrasebook', '/guided-learning', '/features', '/pricing', '/install'];
  const secondary = ['/learn-english-for-georgians', '/about', '/help', '/changelog', '/security', '/privacy', '/terms', '/cookies', '/acceptable-use', '/data-deletion', '/refunds', '/accessibility'];
  return [...primary, ...secondary].map((route) => ({ url: `${SITE_ORIGIN}${route}`, lastModified: new Date('2026-09-04'), changeFrequency: primary.includes(route) ? 'weekly' : 'monthly', priority: route === '' ? 1 : primary.includes(route) ? .85 : .55 }));
}
