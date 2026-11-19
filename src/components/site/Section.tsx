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

/** A homepage section with agriculture field registry heading ("02 / FIELDWORK"). */
export function Section({ id, index, label, title, intro, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-16 sm:py-24">
      <div className="container-x">
        <AnimatedSection>
          <header className="mb-10 sm:mb-14">
            <p className="eyebrow text-emerald-400">
              {pad2(index)} <span className="text-emerald-500/40">/</span> {label}
            </p>
            <h2 id={`${id}-title`} className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
              {title}
            </h2>
            {intro && <p className="mt-3 max-w-2xl text-pretty text-muted text-base sm:text-lg">{intro}</p>}
            <div className="dim-line mt-6 max-w-[14rem]">
              <span className="dim-line-sweep" aria-hidden="true" />
            </div>
          </header>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
}
