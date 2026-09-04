import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Georgian, Nunito_Sans } from 'next/font/google';
import { SITE_ORIGIN } from '@/lib/site';
import './globals.css';

const sans = Nunito_Sans({ variable: '--font-sans', subsets: ['latin', 'cyrillic'] });
const georgian = Noto_Sans_Georgian({ variable: '--font-georgian', subsets: ['georgian'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: 'GEO',
  title: { default: 'Learn Georgian in Batumi & Tbilisi | GEO', template: '%s | GEO' },
  description: 'Learn practical Georgian for life in Batumi, Tbilisi, and across Georgia. Search phrases in Georgian, English, Russian, or transliteration and practice in five minutes a day.',
  keywords: ['learn Georgian', 'Georgian language app', 'Georgian phrases', 'learn Georgian Batumi', 'learn Georgian Tbilisi', 'Georgian for Russian speakers'],
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'GEO', statusBarStyle: 'default' },
  category: 'education',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    title: 'Learn Georgian in Batumi & Tbilisi | GEO',
    description: 'Practical Georgian phrases for international residents, Russian speakers, expats, and visitors in Georgia.',
    url: '/',
    siteName: 'GEO',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Learn Georgian in Batumi & Tbilisi | GEO', description: 'Practical Georgian phrases and five-minute lessons for everyday life in Georgia.' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#b20d2f', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${georgian.variable}`}>{children}</body></html>;
}
