import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BlueprintArt } from '@/components/site/BlueprintArt';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="blueprint-bg" aria-hidden="true" />
      <div className="max-w-md text-center">
        <BlueprintArt label="404" className="mx-auto w-56 text-accent-soft/80" />
        <p className="eyebrow mt-6">Error 404 / Not found</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">This drawing doesn’t exist</h1>
        <p className="mt-3 text-muted">The page may have been moved or removed.</p>
        <Link href="/" className="btn btn-primary mt-8">
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
      </div>
    </main>
  );
}
