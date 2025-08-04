 /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Domínios que você já tinha
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
      // Domínio do GitHub (versão corrigida)
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/infoKraxin/raspadolar/**',
      },
      // --- NOVO DOMÍNIO ADICIONADO AQUI ---
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/azx3nlpdu/**',
      },
    ],
  },
};

module.exports = nextConfig;


