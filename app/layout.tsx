import type { Metadata } from 'next';
import { Noto_Sans_Georgian, Nunito_Sans } from 'next/font/google';
import './globals.css';

const sans = Nunito_Sans({ variable: '--font-sans', subsets: ['latin', 'cyrillic'] });
const georgian = Noto_Sans_Georgian({ variable: '--font-georgian', subsets: ['georgian'] });

export const metadata: Metadata = {
  title: 'GEO — Speak Georgian in real life',
  description: 'Essential Georgian words, native pronunciation and simple daily lessons for life in Georgia.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${georgian.variable}`}>{children}</body></html>;
}
