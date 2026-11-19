import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-jetbrains-mono', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Veda Sri Karri — B.Sc. (Hons) Agriculture Portfolio',
    template: '%s | Veda Sri Karri',
  },
  description:
    'Academic and field portfolio of Veda Sri Karri, B.Sc. (Hons) Agriculture scholar at Centurion University of Technology and Management. Expertise in soil testing, sustainable agronomy, natural resource management, and agroforestry.',
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

export const viewport: Viewport = {
  themeColor: '#030805',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://mqnobywvbluuticblnjy.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://mqnobywvbluuticblnjy.supabase.co" />
      </head>
      <body className="min-h-dvh" suppressHydrationWarning>{children}</body>
    </html>
  );
}
