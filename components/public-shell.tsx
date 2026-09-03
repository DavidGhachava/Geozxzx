import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function PublicHeader() {
  return <header className="legal-header"><Link className="brand" href="/" aria-label="GEO home">GEO<span>.</span></Link><nav aria-label="Public navigation"><Link href="/features">Features</Link><Link href="/phrasebook">Phrasebook</Link><Link href="/pricing">Pricing</Link><Link className="header-open" href="/#app">Open app <ChevronRight /></Link></nav></header>;
}

export function PublicFooter() {
  return <footer className="public-footer"><div className="footer-brand"><Link className="brand" href="/">GEO<span>.</span></Link><p>Practical Georgian for everyday life.</p><small>Public beta · Updated September 2026</small></div><div><b>Product</b><Link href="/features">Features</Link><Link href="/phrasebook">Phrasebook</Link><Link href="/guided-learning">Guided Learning</Link><Link href="/pricing">Pricing</Link><Link href="/install">How to use GEO</Link></div><div><b>Company</b><Link href="/about">About</Link><Link href="/help">Help Center</Link><Link href="/changelog">Changelog</Link><Link href="/security">Security</Link></div><div><b>Legal</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/acceptable-use">Acceptable use</Link><Link href="/data-deletion">Data deletion</Link><Link href="/refunds">Refunds</Link><Link href="/accessibility">Accessibility</Link></div></footer>;
}

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <main className="legal-page"><PublicHeader /><article><Link className="back-home" href="/"><ArrowLeft /> Back to GEO</Link><span className="legal-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="legal-intro">{intro}</p>{children}</article><PublicFooter /></main>;
}
