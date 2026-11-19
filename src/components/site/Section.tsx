import { pad2 } from '@/lib/format';
import { AnimatedSection } from './AnimatedSection';

type Props = {
  id: string;
  index: number;
  label: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/** A spacious, modern section container with radiant editorial typography. */
export function Section({ id, index, label, title, intro, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-24 sm:py-32 md:py-40">
      <div className="container-x">
        <AnimatedSection>
          <header className="mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono tracking-wider text-emerald-300 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{pad2(index)}</span>
              <span className="text-emerald-500/40">/</span>
              <span className="uppercase">{label}</span>
            </div>

            <h2
              id={`${id}-title`}
              className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-fg"
            >
              {title}
            </h2>

            {intro && (
              <p className="mt-4 max-w-2xl text-pretty text-muted text-base sm:text-xl leading-relaxed font-normal">
                {intro}
              </p>
            )}
          </header>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
}
