import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME} - Raspadinhas Online com Prêmios Reais</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <Toaster 
        position="top-center"
        richColors
        theme="dark"
        closeButton
      />
    </AuthProvider>
  )
}
