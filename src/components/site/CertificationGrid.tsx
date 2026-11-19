import { Award, ExternalLink, FileText, CheckCircle2, Globe } from 'lucide-react';
import type { Certification } from '@/lib/types';

export function CertificationGrid({ items }: { items: Certification[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((cert) => {
        const isFao = /fao/i.test(cert.title) || /fao/i.test(cert.issuer);
        const isElite = /elite/i.test(cert.title);

        return (
          <li
            key={cert.id}
            className={`bp-card bp-card-hover group flex flex-col p-6 transition-all duration-300 ${
              isFao
                ? 'border-emerald-400/40 bg-gradient-to-b from-emerald-950/40 via-ink-900/80 to-ink-900'
                : 'border-emerald-500/20 bg-ink-900/70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {isFao ? <Globe size={20} /> : <Award size={20} />}
              </span>
              <div className="flex flex-col items-end gap-1">
                {cert.issued_on && <span className="font-mono text-xs text-subtle">{cert.issued_on}</span>}
                {isElite && (
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300 uppercase">
                    Elite Tier
                  </span>
                )}
                {isFao && (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 uppercase">
                    UN · FAO
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-5 font-display text-[1.1rem] leading-snug font-semibold tracking-tight text-fg text-balance">
              {cert.title}
            </h3>

            {cert.issuer && <p className="mt-2 text-sm text-emerald-300/90 font-medium">{cert.issuer}</p>}

            {(cert.credential_url || cert.file_url) && (
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-outline btn-sm hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                )}
                {cert.file_url && (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-outline btn-sm hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    <FileText size={14} /> View Certificate
                  </a>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
