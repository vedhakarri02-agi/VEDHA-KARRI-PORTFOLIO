import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlueprintArt } from '@/components/site/BlueprintArt';
import { LiveRefresh } from '@/components/site/LiveRefresh';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { ThemeSwitcher } from '@/components/site/ThemeSwitcher';
import { SmoothScroll } from '@/components/site/SmoothScroll';
import { getPortfolio, visibleSections } from '@/lib/content';
import { initials, pad2, paragraphs } from '@/lib/format';
import { SECTION_LABELS, getSiteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

async function loadProject(slug: string) {
  const { data } = await getPortfolio();
  const index = data.projects.findIndex((p) => p.slug === slug);
  return { data, index, project: index === -1 ? null : data.projects[index]! };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { project, data } = await loadProject(slug);
  if (!project) return { title: 'Project not found' };
  const description = project.summary || data.profile.seo_description;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${data.profile.full_name}`,
      description,
      type: 'article',
      images: project.cover_url ? [project.cover_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — ${data.profile.full_name}`,
      description,
      images: project.cover_url ? [project.cover_url] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data, project, index } = await loadProject(slug);
  if (!project) notFound();

  const next = data.projects.length > 1 ? data.projects[(index + 1) % data.projects.length] : null;
  const images = [project.cover_url, ...project.gallery].filter(Boolean);
  const siteUrl = getSiteUrl();

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: project.title,
    headline: project.summary,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.cover_url || undefined,
    keywords: project.tools,
    author: {
      '@type': 'Person',
      name: data.profile.full_name,
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <SmoothScroll>
        <div className="blueprint-bg" aria-hidden="true" />
      <SiteHeader
        name={data.profile.full_name}
        monogram={initials(data.profile.full_name)}
        links={visibleSections(data).map((s) => ({ href: `/#${s.key}`, label: SECTION_LABELS[s.key] }))}
        resumeUrl={data.profile.resume_url}
      />

      <main className="container-x pt-28 pb-24 sm:pt-36">
        <Link href="/#projects" className="btn btn-ghost btn-sm -ml-3 hover:text-emerald-300">
          <ArrowLeft size={16} /> Back to Field Projects
        </Link>

        <header className="animate-in mt-8 max-w-3xl">
          <p className="eyebrow text-emerald-400">
            FIELD-{pad2(index + 1)} <span className="text-emerald-500/40">/</span> {project.category || 'Agronomic Research'}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight text-balance text-fg sm:text-5xl">
            {project.title}
          </h1>
          {project.summary && <p className="mt-5 text-lg text-pretty text-muted">{project.summary}</p>}
          {project.tools.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools">
              {project.tools.map((tool) => (
                <li key={tool} className="tag border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                  {tool}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="animate-in delay-2 bp-card relative mt-12 aspect-[16/9] overflow-hidden border-emerald-500/20 bg-ink-950">
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={`${project.title} — cover image`}
              fill
              priority
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="rounded-[15px] object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center rounded-[15px] bg-ink-950">
              <BlueprintArt variant={index} animate className="h-[80%] text-emerald-400/80" />
            </div>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-5 text-lg leading-relaxed text-pretty text-muted">
            {paragraphs(project.description).map((p, i) => (
              <p key={i} className={i === 0 ? 'text-fg' : undefined}>
                {p}
              </p>
            ))}
          </div>

          {project.links.length > 0 && (
            <aside className="bp-card self-start p-5 border-emerald-500/20 bg-ink-900/80">
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-emerald-400 uppercase">Field Data & Resources</h2>
              <ul className="mt-4 grid gap-2">
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      className="btn btn-outline btn-sm w-full justify-between hover:border-emerald-500/40 hover:text-emerald-300"
                    >
                      {link.label || 'Open link'} <ExternalLink size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        {images.length > 1 && (
          <section aria-labelledby="gallery-title" className="mt-20">
            <h2 id="gallery-title" className="eyebrow text-emerald-400">
              Field Documentation Gallery
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <li key={src}>
                  <a href={src} target="_blank" rel="noopener" className="bp-card bp-card-hover relative block aspect-[4/3] overflow-hidden border-emerald-500/20">
                    <Image
                      src={src}
                      alt={`${project.title} — image ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="rounded-[15px] object-cover"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <Link href={`/projects/${next.slug}`} className="bp-card bp-card-hover group mt-20 flex items-center justify-between gap-6 p-6 sm:p-8 border-emerald-500/20 bg-ink-900/80">
            <span>
              <span className="eyebrow text-emerald-400">Next study</span>
              <span className="mt-2 block font-display text-2xl font-semibold tracking-tight text-fg group-hover:text-emerald-300 transition-colors">{next.title}</span>
            </span>
            <ArrowRight size={22} className="shrink-0 text-emerald-400 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </main>

      <SiteFooter name={data.profile.full_name} revision={data.settings.content_version} profile={data.profile} />
      <ThemeSwitcher initialTheme={data.settings.theme_color} />
      <LiveRefresh />
    </SmoothScroll>
  </>
);
}
