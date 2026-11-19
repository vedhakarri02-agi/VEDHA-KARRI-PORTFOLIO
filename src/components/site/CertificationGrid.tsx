import { Award, ExternalLink, FileText, Globe, Sparkles } from 'lucide-react';
import type { Certification } from '@/lib/types';

export function CertificationGrid({ items }: { items: Certification[] }) {
  return (
    <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((cert) => {
        const isFao = /fao/i.test(cert.title) || /fao/i.test(cert.issuer);
        const isElite = /elite/i.test(cert.title);

        return (
          <li
            key={cert.id}
            className={`bp-card bp-card-hover group flex flex-col p-8 sm:p-9 rounded-[2rem] border transition-all duration-300 ${
              isFao
                ? 'border-emerald-400/35 bg-gradient-to-b from-emerald-500/[0.08] via-white/[0.03] to-white/[0.01]'
                : isElite
                ? 'border-amber-400/35 bg-gradient-to-b from-amber-500/[0.08] via-white/[0.03] to-white/[0.01]'
                : 'border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg ${
                  isFao
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300'
                    : isElite
                    ? 'border-amber-400/40 bg-amber-500/15 text-amber-300'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {isFao ? <Globe size={22} /> : isElite ? <Sparkles size={22} /> : <Award size={22} />}
              </span>

              <div className="flex flex-col items-end gap-1.5">
                {cert.issued_on && (
                  <span className="font-mono text-xs text-subtle font-medium">
                    {cert.issued_on}
                  </span>
                )}
                {isElite && (
                  <span className="rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    Elite Tier
                  </span>
                )}
                {isFao && (
                  <span className="rounded-full border border-emerald-400/50 bg-emerald-400/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                    UN · FAO
                  </span>
                )}
              </div>
            </div>

            <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold tracking-tight text-fg text-balance leading-snug group-hover:text-emerald-300 transition-colors">
              {cert.title}
            </h3>

            {cert.issuer && (
              <p className="mt-3 text-sm sm:text-base text-emerald-300/90 font-medium leading-relaxed">
                {cert.issuer}
              </p>
            )}

            {(cert.credential_url || cert.file_url) && (
              <div className="mt-auto flex flex-wrap gap-2.5 pt-8">
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
                    <FileText size={14} /> Certificate File
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
