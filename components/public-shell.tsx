/* eslint-disable next/no-html-link-for-pages */
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function PublicHeader() {
  return <header className="legal-header"><a className="brand" href="/" aria-label="GEO home">GEO<span>.</span></a><nav aria-label="Public navigation"><a href="/features">Features</a><a href="/phrasebook">Phrasebook</a><a href="/pricing">Pricing</a><a className="header-open" href="/#app">Open app <ChevronRight /></a></nav></header>;
}

export function PublicFooter() {
  return <footer className="public-footer"><div className="footer-brand"><a className="brand" href="/">GEO<span>.</span></a><p>Practical Georgian for everyday life.</p><small>Public beta · Updated September 2026</small><a href="/learn-english-for-georgians">English for Georgians (secondary)</a></div><div><b>Learn Georgian</b><a href="/learn-georgian">Beginner guide</a><a href="/learn-georgian-batumi">Georgian in Batumi</a><a href="/learn-georgian-tbilisi">Georgian in Tbilisi</a><a href="/learn-georgian-for-russian-speakers">For Russian speakers</a><a href="/phrasebook">Phrasebook</a><a href="/install">Install GEO</a></div><div><b>Product</b><a href="/features">Features</a><a href="/guided-learning">Guided Learning</a><a href="/pricing">Pricing</a><a href="/about">About</a><a href="/help">Help Center</a><a href="/security">Security</a></div><div><b>Legal</b><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a><a href="/acceptable-use">Acceptable use</a><a href="/data-deletion">Data deletion</a><a href="/refunds">Refunds</a><a href="/accessibility">Accessibility</a></div></footer>;
}

export function InfoPage({ eyebrow, title, intro, lang, children }: { eyebrow: string; title: string; intro: string; lang?: string; children: React.ReactNode }) {
  return <main className="legal-page"><PublicHeader /><article lang={lang}><a className="back-home" href="/"><ArrowLeft /> Back to GEO</a><span className="legal-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="legal-intro">{intro}</p>{children}</article><PublicFooter /></main>;
}
