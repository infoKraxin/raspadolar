const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.raspapixoficial.com',
        port: '',
        pathname: '/uploads/**',
      },
      // Supabase CDN
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Domínio para as imagens do Vercel Blob
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // Adicione este bloco para permitir o domínio via.placeholder.com
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Domínio para a URL final do Vercel
      {
        protocol: 'https',
        hostname: 'raspadolar.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
