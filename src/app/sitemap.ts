import type { MetadataRoute } from 'next';
import { getPortfolio } from '@/lib/content';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const { data } = await getPortfolio();
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    ...data.projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
