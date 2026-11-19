/**
 * Minimal site footer.
 * Only displays "Copyright D2W 2026" as requested.
 */
export function SiteFooter(_props?: { name?: string; revision?: number; profile?: unknown }) {
  void _props;
  return (
    <footer className="border-t border-emerald-500/15 bg-ink-950/90 py-6">
      <div className="container-x flex items-center justify-start text-left">
        <p className="font-mono text-xs tracking-wider text-muted hover:text-fg/80 transition-colors">
          © D2W 2026
        </p>
      </div>
    </footer>
  );
}
