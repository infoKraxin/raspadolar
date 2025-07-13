import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <title>raspa.ae - Raspadinhas Online com Prêmios Reais</title>
        <meta name="description" content="Jogue raspadinhas online na raspa.ae e ganhe prêmios reais! PIX na conta, produtos incríveis e muito mais. Diversão garantida com segurança total." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
