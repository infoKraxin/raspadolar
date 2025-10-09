/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 🛑 SEÇÃO ADICIONAL DE DOMAINS (LEGACY) PARA FORÇAR A ACEITAÇÃO
    // ESSENCIAL PARA URLs que o remotePatterns está bloqueando
    domains: [
      'api.raspapixoficial.com',
      'raspadolar.vercel.app',
      'via.placeholder.com',
      'github.com',
      'raw.githubusercontent.com', 
      'ik.imagekit.io',
      'raspagreen.cloud',
      'rdddmzabvuyo9kjb.public.blob.vercel-storage.com',
      'supabase.co'
    ],
    // -------------------------------------------------------------
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
        pathname: '/**', // Caminho genérico
      },
      {
        protocol: 'https',
        hostname: 'raspadolar.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**', // 🛑 CORREÇÃO CRÍTICA: AGORA GENÉRICO '/**'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/azx3nlpdu/**',
      },
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
    ],
  },
};

module.exports = nextConfig;
