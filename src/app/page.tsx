import type { Metadata } from 'next';
import { About } from '@/components/site/About';
import { CertificationGrid } from '@/components/site/CertificationGrid';
import { ContactSection } from '@/components/site/ContactSection';
import { DevNotice } from '@/components/site/DevNotice';
import { EducationList } from '@/components/site/EducationList';
import { ExperienceTimeline } from '@/components/site/ExperienceTimeline';
import { Hero } from '@/components/site/Hero';
import { LeadershipGrid } from '@/components/site/LeadershipGrid';
import { LiveRefresh } from '@/components/site/LiveRefresh';
import { ProjectCard } from '@/components/site/ProjectCard';
import { Section } from '@/components/site/Section';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SkillsGrid } from '@/components/site/SkillsGrid';
import { SmoothScroll } from '@/components/site/SmoothScroll';
import { BotanicalParticles } from '@/components/site/BotanicalParticles';
import { getPortfolio, getStats, visibleSections } from '@/lib/content';
import { initials } from '@/lib/format';
import { getSiteUrl, sectionIntro, sectionLabel, sectionTitle } from '@/lib/site';
import type { Portfolio, SectionSetting } from '@/lib/types';
import { AchievementsGrid } from '@/components/site/AchievementsGrid';

// Always render with the latest content so admin edits show up immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getPortfolio();
  const { profile } = data;
  const siteUrl = getSiteUrl();
  const title = profile.seo_title || `${profile.full_name} — B.Sc. (Hons) Agriculture Portfolio`;
  const description = profile.seo_description || profile.headline;
  const keywords = Array.from(
    new Set([
      'Agriculture',
      'Agronomy',
      'Soil Testing',
      'Sustainable Agriculture',
      'Precision Farming',
      'Agroforestry',
      profile.full_name,
      ...data.skills.map((s) => s.name),
    ])
  );

  return {
    title: { absolute: title },
    description,
    keywords,
    authors: [{ name: profile.full_name, url: siteUrl }],
    creator: profile.full_name,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: '/',
      siteName: `${profile.full_name} Portfolio`,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${profile.full_name} — Academic & Field Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

function SectionBody({ section, data }: { section: SectionSetting; data: Portfolio }) {
  switch (section.key) {
    case 'about':
      return <About profile={data.profile} education={data.education} skills={data.skills} section={section} />;
    case 'experience':
      return <ExperienceTimeline items={data.experiences.filter((e) => e.kind === 'internship')} />;
    case 'projects':
      return (
        <div className="grid gap-8 md:grid-cols-2">
          {data.projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              className={i === 0 ? 'md:col-span-2' : ''}
            />
          ))}
        </div>
      );
    case 'skills':
      return <SkillsGrid skills={data.skills} />;
    case 'certifications':
      return <CertificationGrid items={data.certifications} />;
    case 'achievements':
      return <AchievementsGrid items={section.items} />;
    case 'education':
      return <EducationList items={data.education} />;
    case 'leadership':
      return <LeadershipGrid items={data.experiences.filter((e) => e.kind === 'leadership')} />;
    case 'contact':
      return <ContactSection profile={data.profile} />;
    default:
      return <AchievementsGrid items={section.items} emptyMessage="Custom module content can be edited in Admin → Sections." />;
  }
}

export default async function HomePage() {
  const { data, source, error } = await getPortfolio();
  const sections = visibleSections(data);
  const keys = sections.map((s) => s.key);
  const primaryHref = keys.includes('projects') ? '#projects' : keys.includes('experience') ? '#experience' : null;
  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: data.profile.full_name,
        jobTitle: data.profile.headline,
        description: data.profile.seo_description || data.profile.headline,
        url: siteUrl,
        image: data.profile.avatar_url || `${siteUrl}/opengraph-image`,
        sameAs: [data.profile.linkedin_url, data.profile.github_url].filter(Boolean),
        address: data.profile.location
          ? {
              '@type': 'PostalAddress',
              addressLocality: data.profile.location,
            }
          : undefined,
        alumniOf: data.education.map((e) => ({
          '@type': 'EducationalOrganization',
          name: e.institution,
        })),
        knowsAbout: data.skills.map((s) => s.name),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: `${data.profile.full_name} Portfolio`,
        description: data.profile.seo_description || data.profile.headline,
        publisher: {
          '@id': `${siteUrl}/#person`,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${data.profile.full_name} — Academic & Field Portfolio`,
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#person`,
        },
        mainEntity: {
          '@id': `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.theme = ${JSON.stringify(data.settings.theme_color || 'emerald')};`,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SmoothScroll>
        <div className="blueprint-bg" aria-hidden="true" />
        <BotanicalParticles />
        <SiteHeader
          name={data.profile.full_name}
          monogram={initials(data.profile.full_name)}
          links={sections.map((s) => ({ href: `#${s.key}`, label: sectionLabel(s.key) }))}
          resumeUrl={data.profile.resume_url}
        />
        <main id="top">
          <Hero
            profile={data.profile}
            stats={getStats(data)}
            primaryHref={primaryHref}
            contactHref={keys.includes('contact') ? '#contact' : null}
            portfolio={data}
          />
          {sections.map((section, i) => (
            <Section
              key={section.key}
              id={section.key}
              index={i + 1}
              label={sectionLabel(section.key)}
              title={sectionTitle(section)}
              intro={sectionIntro(section)}
            >
              <SectionBody section={section} data={data} />
            </Section>
          ))}
        </main>
        <SiteFooter name={data.profile.full_name} revision={data.settings.content_version} profile={data.profile} />
        <LiveRefresh />
        <DevNotice source={source} error={error} />
      </SmoothScroll>
    </>
  );
}
