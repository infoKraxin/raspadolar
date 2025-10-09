/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 🛑 SEÇÃO ADICIONAL DE DOMAINS (LEGACY) - FORÇA A COMPATIBILIDADE
    // ESSENCIAL PARA URLS COMPLEXAS COMO AS DO GITHUB E PLACEHOLDER
    domains: [
      'api.raspapixoficial.com',
      'raspadolar.vercel.app',
      'via.placeholder.com',
      'github.com', // Adicionado para cobrir o banner
      'raw.githubusercontent.com', // Adicionado para URLs raw
      'ik.imagekit.io',
      'raspagreen.cloud',
      'rdddmzabvuyo9kjb.public.blob.vercel-storage.com',
      'supabase.co' // Domínio base para **.supabase.co
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
        pathname: '/**', // Caminho genérico para cobrir ?raw=true
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // Adicionado para URLs diretas do GitHub
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/azx3nlpdu/**',
      },
      // --- BLOCOS ORIGINAIS ---
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
