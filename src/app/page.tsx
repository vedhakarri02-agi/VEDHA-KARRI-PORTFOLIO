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
import { SECTION_LABELS, sectionIntro, sectionTitle } from '@/lib/site';
import type { Portfolio, SectionKey } from '@/lib/types';

// Always render with the latest content so admin edits show up immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getPortfolio();
  const { profile } = data;
  const title = profile.seo_title || `${profile.full_name} — B.Sc. (Hons) Agriculture Portfolio`;
  const description = profile.seo_description || profile.headline;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: { title, description, type: 'profile', url: '/', siteName: profile.full_name },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function SectionBody({ sectionKey, data }: { sectionKey: SectionKey; data: Portfolio }) {
  switch (sectionKey) {
    case 'about':
      return <About profile={data.profile} education={data.education} />;
    case 'experience':
      return <ExperienceTimeline items={data.experiences.filter((e) => e.kind === 'internship')} />;
    case 'projects':
      return (
        <div className="grid gap-6 md:grid-cols-2">
          {data.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      );
    case 'skills':
      return <SkillsGrid skills={data.skills} />;
    case 'certifications':
      return <CertificationGrid items={data.certifications} />;
    case 'education':
      return <EducationList items={data.education} />;
    case 'leadership':
      return <LeadershipGrid items={data.experiences.filter((e) => e.kind === 'leadership')} />;
    case 'contact':
      return <ContactSection profile={data.profile} />;
  }
}

export default async function HomePage() {
  const { data, source, error } = await getPortfolio();
  const sections = visibleSections(data);
  const keys = sections.map((s) => s.key);
  const primaryHref = keys.includes('projects') ? '#projects' : keys.includes('experience') ? '#experience' : null;

  return (
    <SmoothScroll>
      <div className="blueprint-bg" aria-hidden="true" />
      <BotanicalParticles />
      <SiteHeader
        name={data.profile.full_name}
        monogram={initials(data.profile.full_name)}
        links={sections.map((s) => ({ href: `#${s.key}`, label: SECTION_LABELS[s.key] }))}
        resumeUrl={data.profile.resume_url}
      />
      <main id="top">
        <Hero
          profile={data.profile}
          stats={getStats(data)}
          primaryHref={primaryHref}
          contactHref={keys.includes('contact') ? '#contact' : null}
        />
        {sections.map((section, i) => (
          <Section
            key={section.key}
            id={section.key}
            index={i + 1}
            label={SECTION_LABELS[section.key]}
            title={sectionTitle(section)}
            intro={sectionIntro(section)}
          >
            <SectionBody sectionKey={section.key} data={data} />
          </Section>
        ))}
      </main>
      <SiteFooter name={data.profile.full_name} revision={data.settings.content_version} profile={data.profile} />
      <LiveRefresh />
      <DevNotice source={source} error={error} />
    </SmoothScroll>
  );
}
