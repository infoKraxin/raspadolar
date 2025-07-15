import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
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
