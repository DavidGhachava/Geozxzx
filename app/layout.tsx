import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Georgian, Nunito_Sans } from 'next/font/google';
import { SITE_ORIGIN } from '@/lib/site';
import './globals.css';

const sans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
});
const georgian = Noto_Sans_Georgian({
  variable: '--font-georgian',
  subsets: ['georgian'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: 'GEO',
  title: {
    default: 'Learn Georgian in Batumi & Tbilisi | GEO',
    template: '%s | GEO',
  },
  description:
    'Learn practical Georgian three words at a time. Build a personalized daily plan, search a curated starter, and explore a broad reference dictionary.',
  keywords: [
    'learn Georgian',
    'Georgian language app',
    'Georgian phrases',
    'learn Georgian Batumi',
    'learn Georgian Tbilisi',
    'Georgian for Russian speakers',
  ],
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'GEO', statusBarStyle: 'default' },
  category: 'education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Learn Georgian in Batumi & Tbilisi | GEO',
    description:
      'Personalized three-word Georgian lessons for real life in Georgia.',
    url: '/',
    siteName: 'GEO',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Learn Georgian in Batumi & Tbilisi | GEO',
    description:
      'Personalized three-word lessons, memory review, and practical Georgian for everyday life.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b20d2f',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${georgian.variable}`}>
        {children}
      </body>
    </html>
  );
}
