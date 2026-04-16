import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { SidebarCliente } from '@/components/sidebar-cliente';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://terrasoft-inmobiliaria-git-main-gpsanchezrs-projects.vercel.app'),
  title: 'Proyecto Inmobiliario - Venta de Lotes',
  description: 'Sistema de venta de lotes inmobiliarios con gestión de pagos y PQRS',
  openGraph: {
    title: 'Proyecto Inmobiliario - Venta de Lotes',
    description: 'Invierte en el mejor proyecto inmobiliario de la región',
    type: 'website',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
        width: 1200,
        height: 630
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proyecto Inmobiliario - Venta de Lotes',
    description: 'Invierte en el mejor proyecto inmobiliario',
    images: ['https://bolt.new/static/og_default.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="notranslate">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description || "MonteVerde Reserva Inmobiliaria - Tu inversión en futuro"} />
        <meta name="google" content="notranslate" />
      </head>
      <body className={inter.className + ' notranslate'}>
        <Header />
        <SidebarCliente />
        <main className="md:ml-64 notranslate">
          {children}
        </main>
      </body>
    </html>
  );
}
