/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.raspapixoficial.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raspadolar.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/infoKraxin/raspadolar/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/azx3nlpdu/**',
      },
      // --- ADICIONE ESTE BLOCO ---
      {
        protocol: 'https',
        hostname: 'raspagreen.cloud',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'rdddmzabvuyo9kjb.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // --------------------------
    ],
  },
};

module.exports = nextConfig;

