import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Photos, project renders and certificates uploaded from the admin live in Supabase Storage.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
