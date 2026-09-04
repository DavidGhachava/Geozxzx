/* eslint-disable next/no-html-link-for-pages */
import { ArrowLeft, ChevronRight } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="legal-header">
      <a className="brand" href="/" aria-label="GEO home">
        GEO<span>.</span>
      </a>
      <nav aria-label="Public navigation">
        <a href="/features">Features</a>
        <a href="/phrasebook">Phrasebook</a>
        <a href="/pricing">Pricing</a>
        <a className="header-open" href="/#app">
          Open app <ChevronRight />
        </a>
      </nav>
    </header>
  );
}

export function PublicFooter({
  locale = 'en',
}: {
  locale?: 'en' | 'ru' | 'ka';
}) {
  const copy = {
    en: {
      tagline: 'Practical Georgian for everyday life.',
      beta: 'Public beta · Updated September 2026',
      learn: 'Learn Georgian',
      beginner: 'Beginner guide',
      batumi: 'Georgian in Batumi',
      tbilisi: 'Georgian in Tbilisi',
      russian: 'For Russian speakers',
      phrases: 'Phrasebook',
      install: 'Install GEO',
      product: 'Product',
      features: 'Features',
      guided: 'Guided Learning',
      pricing: 'Pricing',
      about: 'About',
      help: 'Help Center',
      security: 'Security',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      cookies: 'Cookies',
      use: 'Acceptable use',
      deletion: 'Data deletion',
      refunds: 'Refunds',
      accessibility: 'Accessibility',
      secondary: 'English for Georgians (secondary)',
    },
    ru: {
      tagline: 'Практический грузинский для повседневной жизни.',
      beta: 'Публичная бета · Обновлено в сентябре 2026',
      learn: 'Учить грузинский',
      beginner: 'Для начинающих',
      batumi: 'Грузинский в Батуми',
      tbilisi: 'Грузинский в Тбилиси',
      russian: 'Для русскоязычных',
      phrases: 'Разговорник',
      install: 'Установить GEO',
      product: 'Продукт',
      features: 'Возможности',
      guided: 'Курс обучения',
      pricing: 'Цены',
      about: 'О проекте',
      help: 'Помощь',
      security: 'Безопасность',
      legal: 'Документы',
      privacy: 'Конфиденциальность',
      terms: 'Условия',
      cookies: 'Cookie',
      use: 'Правила использования',
      deletion: 'Удаление данных',
      refunds: 'Возвраты',
      accessibility: 'Доступность',
      secondary: 'Английский для грузин (дополнительно)',
    },
    ka: {
      tagline: 'პრაქტიკული ქართული ყოველდღიური ცხოვრებისთვის.',
      beta: 'საჯარო ბეტა · განახლდა 2026 წლის სექტემბერში',
      learn: 'ქართული ენის სწავლა',
      beginner: 'დამწყების გზამკვლევი',
      batumi: 'ქართული ბათუმში',
      tbilisi: 'ქართული თბილისში',
      russian: 'რუსულენოვანთათვის',
      phrases: 'ფრაზები',
      install: 'GEO-ს დაყენება',
      product: 'პროდუქტი',
      features: 'შესაძლებლობები',
      guided: 'სასწავლო კურსი',
      pricing: 'ფასები',
      about: 'ჩვენ შესახებ',
      help: 'დახმარება',
      security: 'უსაფრთხოება',
      legal: 'დოკუმენტები',
      privacy: 'კონფიდენციალურობა',
      terms: 'პირობები',
      cookies: 'Cookie',
      use: 'გამოყენების წესები',
      deletion: 'მონაცემების წაშლა',
      refunds: 'თანხის დაბრუნება',
      accessibility: 'ხელმისაწვდომობა',
      secondary: 'ინგლისური ქართველებისთვის (დამატებითი)',
    },
  }[locale];
  return (
    <footer className="public-footer">
      <div className="footer-brand">
        <a className="brand" href="/">
          GEO<span>.</span>
        </a>
        <p>{copy.tagline}</p>
        <small>{copy.beta}</small>
        <a href="/learn-english-for-georgians">{copy.secondary}</a>
      </div>
      <div>
        <b>{copy.learn}</b>
        <a href="/learn-georgian">{copy.beginner}</a>
        <a href="/learn-georgian-batumi">{copy.batumi}</a>
        <a href="/learn-georgian-tbilisi">{copy.tbilisi}</a>
        <a href="/learn-georgian-for-russian-speakers">{copy.russian}</a>
        <a href="/phrasebook">{copy.phrases}</a>
        <a href="/install">{copy.install}</a>
      </div>
      <div>
        <b>{copy.product}</b>
        <a href="/features">{copy.features}</a>
        <a href="/guided-learning">{copy.guided}</a>
        <a href="/pricing">{copy.pricing}</a>
        <a href="/about">{copy.about}</a>
        <a href="/help">{copy.help}</a>
        <a href="/security">{copy.security}</a>
      </div>
      <div>
        <b>{copy.legal}</b>
        <a href="/privacy">{copy.privacy}</a>
        <a href="/terms">{copy.terms}</a>
        <a href="/cookies">{copy.cookies}</a>
        <a href="/acceptable-use">{copy.use}</a>
        <a href="/data-deletion">{copy.deletion}</a>
        <a href="/refunds">{copy.refunds}</a>
        <a href="/accessibility">{copy.accessibility}</a>
      </div>
    </footer>
  );
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  lang,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lang?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="legal-page">
      <PublicHeader />
      <article lang={lang}>
        <a className="back-home" href="/">
          <ArrowLeft /> Back to GEO
        </a>
        <span className="legal-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        {children}
      </article>
      <PublicFooter />
    </main>
  );
}
