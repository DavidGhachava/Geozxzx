'use client';
/* eslint-disable next/no-img-element */
/* eslint-disable next/no-html-link-for-pages */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  BookOpen,
  Brain,
  Bus,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Compass,
  Download,
  Flame,
  Globe2,
  Heart,
  Home,
  LockKeyhole,
  Menu,
  Mic2,
  Plane,
  Search,
  ShieldCheck,
  ShieldPlus,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Users,
  LogIn,
  LogOut,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CookieNotice } from '@/components/cookie-notice';
import { PublicFooter } from '@/components/public-shell';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type Screen =
  | 'explore'
  | 'category'
  | 'saved'
  | 'premium'
  | 'daily'
  | 'lesson'
  | 'quiz'
  | 'progress';
type CategoryName =
  | 'Essentials'
  | 'Food & Cafés'
  | 'Transport'
  | 'Shopping'
  | 'Emergencies'
  | 'Meeting People';
type Phrase = {
  id?: string;
  category_slug?: string;
  ka: string;
  tr: string;
  en: string;
  ru: string;
  audio_url?: string | null;
};

const categories: {
  name: CategoryName;
  count: number;
  icon: typeof Heart;
  tone: string;
}[] = [
  { name: 'Essentials', count: 12, icon: Heart, tone: 'wine' },
  { name: 'Food & Cafés', count: 10, icon: Coffee, tone: 'coral' },
  { name: 'Transport', count: 8, icon: Bus, tone: 'sage' },
  { name: 'Shopping', count: 8, icon: ShoppingBag, tone: 'gold' },
  { name: 'Emergencies', count: 6, icon: ShieldPlus, tone: 'red' },
  { name: 'Meeting People', count: 6, icon: Users, tone: 'green' },
];

const phrases: Record<CategoryName, Phrase[]> = {
  Essentials: [
    { ka: 'გამარჯობა', tr: 'gamarjoba', en: 'Hello', ru: 'Привет' },
    { ka: 'მადლობა', tr: 'madloba', en: 'Thank you', ru: 'Спасибо' },
    { ka: 'ნახვამდის', tr: 'nakhvamdis', en: 'Goodbye', ru: 'До свидания' },
    { ka: 'გთხოვთ', tr: 'gtkhovt', en: 'Please', ru: 'Пожалуйста' },
    { ka: 'დიახ', tr: 'diakh', en: 'Yes', ru: 'Да' },
    { ka: 'არა', tr: 'ara', en: 'No', ru: 'Нет' },
  ],
  'Food & Cafés': [
    {
      ka: 'ერთი ყავა, გთხოვთ',
      tr: 'erti qava, gtkhovt',
      en: 'One coffee, please',
      ru: 'Один кофе, пожалуйста',
    },
    {
      ka: 'მენიუ შეიძლება?',
      tr: 'meniu sheidzleba?',
      en: 'May I see the menu?',
      ru: 'Можно меню?',
    },
    {
      ka: 'უგემრიელესია',
      tr: 'ugemrielesia',
      en: 'It is delicious',
      ru: 'Это очень вкусно',
    },
  ],
  Transport: [
    {
      ka: 'ბათუმამდე, გთხოვთ',
      tr: 'batumamde, gtkhovt',
      en: 'To Batumi, please',
      ru: 'До Батуми, пожалуйста',
    },
    {
      ka: 'რა ღირს ბილეთი?',
      tr: 'ra ghirs bileti?',
      en: 'How much is the ticket?',
      ru: 'Сколько стоит билет?',
    },
    {
      ka: 'აქ გააჩერეთ',
      tr: 'ak gaacheret',
      en: 'Stop here',
      ru: 'Остановите здесь',
    },
  ],
  Shopping: [
    {
      ka: 'რა ღირს?',
      tr: 'ra ghirs?',
      en: 'How much is it?',
      ru: 'Сколько это стоит?',
    },
    {
      ka: 'ბარათით შეიძლება?',
      tr: 'baratit sheidzleba?',
      en: 'Can I pay by card?',
      ru: 'Можно оплатить картой?',
    },
  ],
  Emergencies: [
    { ka: 'დამეხმარეთ!', tr: 'damekhmaret!', en: 'Help me!', ru: 'Помогите!' },
    {
      ka: 'ექიმი მჭირდება',
      tr: 'ekimi mchirdeba',
      en: 'I need a doctor',
      ru: 'Мне нужен врач',
    },
  ],
  'Meeting People': [
    {
      ka: 'რა გქვიათ?',
      tr: 'ra gkviat?',
      en: 'What is your name?',
      ru: 'Как вас зовут?',
    },
    {
      ka: 'სასიამოვნოა',
      tr: 'sasiamovnoa',
      en: 'Nice to meet you',
      ru: 'Приятно познакомиться',
    },
  ],
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'GEO',
      description:
        'Practical Georgian learning for life in Batumi, Tbilisi, and across Georgia.',
      inLanguage: ['en', 'ru', 'ka'],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'GEO — Learn Georgian',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web, Android, iOS, Windows, macOS',
      description:
        'A Georgian phrasebook and five-minute learning app for international residents, Russian speakers, expats, and visitors in Georgia.',
      inLanguage: ['en', 'ru', 'ka'],
      areaServed: [
        { '@type': 'City', name: 'Batumi' },
        { '@type': 'City', name: 'Tbilisi' },
        { '@type': 'Country', name: 'Georgia' },
      ],
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Phrasebook',
          price: 0,
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Phrasebook Pro Lifetime Access',
          price: 20,
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Guided Learning Monthly Subscription',
          price: 6.99,
          priceCurrency: 'USD',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Phrasebook Pro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Phrasebook Pro is a $20 one-time upgrade designed to provide lifetime access to a growing catalog of 1,000+ Georgian words and practical sentences with richer lookup tools.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need an account to use GEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. You can browse and search all 50 free phrases as a guest. An account is needed to synchronize saved phrases, and an active Guided Learning subscription is required for lessons and progress.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I install GEO as an app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. GEO is an installable progressive web app on supported browsers and can be added to an iPhone or iPad home screen from Safari.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is GEO useful for Russian speakers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Phrase entries include Russian meanings alongside Georgian, transliteration, and English.',
          },
        },
      ],
    },
  ],
};

function Brand({ onHome }: { onHome: () => void }) {
  return (
    <button
      className="brand"
      onClick={onHome}
      aria-label="Go to the GEO homepage"
    >
      GEO<span>.</span>
    </button>
  );
}

function AudioButton({
  id,
  playing,
  onPlay,
  text,
  audioUrl,
  large = false,
}: {
  id: string;
  playing: string | null;
  onPlay: (id: string, text?: string, audioUrl?: string | null) => void;
  text?: string;
  audioUrl?: string | null;
  large?: boolean;
}) {
  const active = playing === id;
  return (
    <button
      className={`audio-button ${large ? 'audio-large' : ''} ${active ? 'is-playing' : ''}`}
      onClick={() => onPlay(id, text, audioUrl)}
      aria-label="Play pronunciation"
    >
      {active ? (
        <span className="sound-bars">
          <i />
          <i />
          <i />
        </span>
      ) : (
        <Volume2 />
      )}
    </button>
  );
}

function Marketing({
  openApp,
  installApp,
}: {
  openApp: () => void;
  installApp: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () =>
      setShowInstall(window.scrollY > Math.min(620, window.innerHeight * 0.65));
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const surface = document.querySelector<HTMLElement>('.marketing');
    if (!surface) return;
    let disposed = false;
    const cleanups: (() => void)[] = [];
    void import('motion').then(({ animate, hover, inView, stagger }) => {
      if (disposed) return;
      const intro = animate(
        '.hero-copy > *',
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.7, delay: stagger(0.09), ease: [0.22, 1, 0.36, 1] },
      );
      const phones = animate(
        '.phone-front',
        { y: [0, -13, 0], rotate: [7, 5.5, 7] },
        { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      );
      const backPhone = animate(
        '.phone-back',
        { y: [0, 9, 0], rotate: [-3, -4.5, -3] },
        { duration: 7.2, repeat: Infinity, ease: 'easeInOut' },
      );
      const stopReveal = inView(
        '.audience-section, .local-section, .demo-pricing, .learning-story, .how-section, .pricing-section, .trust-section, .faq-section, .final-cta',
        (element) => {
          animate(
            element,
            { opacity: [0, 1], y: [38, 0] },
            { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          );
        },
        { amount: 0.12 },
      );
      const stopHover = hover(
        '.audience-grid article, .local-grid article, .how-grid article, .pricing-grid.redesigned article, .trust-list span, .category-showcase button',
        (element) => {
          animate(
            element,
            { y: -7, scale: 1.015 },
            { type: 'spring', stiffness: 420, damping: 28 },
          );
          return () => {
            animate(
              element,
              { y: 0, scale: 1 },
              { type: 'spring', stiffness: 420, damping: 28 },
            );
          };
        },
      );
      cleanups.push(
        () => intro.stop(),
        () => phones.stop(),
        () => backPhone.stop(),
        stopReveal,
        stopHover,
      );
    });
    let pointerFrame = 0;
    const trackPointer = (event: PointerEvent) => {
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        surface.style.setProperty('--pointer-x', `${event.clientX}px`);
        surface.style.setProperty('--pointer-y', `${event.clientY}px`);
        pointerFrame = 0;
      });
    };
    window.addEventListener('pointermove', trackPointer, { passive: true });
    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      window.removeEventListener('pointermove', trackPointer);
    };
  }, []);
  const play = (id: string) => {
    setPlaying(id);
    window.setTimeout(() => setPlaying(null), 1100);
  };
  const goHome = () => {
    setMenuOpen(false);
    history.replaceState(null, '', location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header">
        <Brand onHome={goHome} />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#why">Why GEO</a>
          <a href="#locations">Batumi & Tbilisi</a>
          <a href="#phrases">Phrasebook</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="header-actions">
          <button className="install-nav" onClick={installApp}>
            <Download /> Install
          </button>
          <button className="open-app-link" onClick={openApp}>
            Use on web <ChevronRight />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-menu"
            aria-label="Mobile navigation"
          >
            <a href="#why" onClick={() => setMenuOpen(false)}>
              Why GEO
            </a>
            <a href="#locations" onClick={() => setMenuOpen(false)}>
              Batumi & Tbilisi
            </a>
            <a href="#phrases" onClick={() => setMenuOpen(false)}>
              Phrasebook
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </a>
            <button onClick={installApp}>Install GEO</button>
            <button onClick={openApp}>Use on web</button>
          </nav>
        )}
      </header>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Learn Georgian in Batumi & Tbilisi</span>
          <h1>
            Georgia feels closer
            <br />
            when you can <span className="shine-word">speak.</span>
          </h1>
          <p>
            Practical Georgian for international residents, Russian speakers,
            expats, and visitors. Find the phrase you need, save it, and build
            confidence five minutes at a time.
          </p>
          <div className="hero-buttons">
            <Button className="primary-cta shiny-button" onClick={openApp}>
              Use GEO on the web <ChevronRight />
            </Button>
            <button className="secondary-cta" onClick={installApp}>
              <Download /> Install the app
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <CheckCircle2 /> Free browser access
            </span>
            <span>
              <ShieldCheck /> Secure progress sync
            </span>
            <span>
              <Globe2 /> Georgian · English · Russian
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-label="GEO app preview">
          <img
            className="skyline"
            src="/batumi-line.webp"
            width="1600"
            height="533"
            alt="Line illustration of the Batumi waterfront"
            fetchPriority="high"
          />
          <span className="geo-cross" aria-hidden="true">
            +
          </span>
          <span className="flag-orbit orbit-one" aria-hidden="true" />
          <span className="flag-orbit orbit-two" aria-hidden="true" />
          <div className="phone phone-back">
            <div className="phone-notch" />
            <div className="mini-status">
              9:41 <span>•••</span>
            </div>
            <h4>Real-life situations</h4>
            {categories.slice(0, 5).map(({ name, icon: Icon, tone }) => (
              <div className="mini-category" key={name}>
                <span className={`mini-icon ${tone}`}>
                  <Icon />
                </span>
                <b>{name}</b>
                <ChevronRight />
              </div>
            ))}
          </div>
          <div className="phone phone-front">
            <div className="phone-notch" />
            <div className="mini-status">
              9:41 <span>•••</span>
            </div>
            <span className="mini-back">‹ Essentials</span>
            <span className="mini-pill">Say it now</span>
            <div className="mini-phrase">
              <strong>გამარჯობა</strong>
              <em>gamarjoba</em>
              <p>Hello · Привет</p>
              <AudioButton
                id="hero-phone"
                playing={playing}
                onPlay={play}
                large
              />
            </div>
          </div>
        </div>
      </section>
      <div className="kinetic-strip" aria-label="GEO highlights">
        <div>
          <span>ქართული</span>
          <i>✦</i>
          <span>Real-life phrases</span>
          <i>✦</i>
          <span>Five-minute learning</span>
          <i>✦</i>
          <span>Made for Georgia</span>
          <i>✦</i>
          <span aria-hidden="true">ქართული</span>
          <i aria-hidden="true">✦</i>
          <span aria-hidden="true">Real-life phrases</span>
          <i aria-hidden="true">✦</i>
        </div>
      </div>
      <section className="audience-section" id="why">
        <div className="section-kicker">Made for real life</div>
        <h2>Not a textbook. A way into the conversation.</h2>
        <div className="audience-grid">
          <article>
            <Plane />
            <span>
              <b>Visiting Georgia</b>
              <p>
                Handle the moments that happen between landing and feeling at
                home.
              </p>
            </span>
          </article>
          <article>
            <Home />
            <span>
              <b>Starting a life here</b>
              <p>
                Keep useful words close while routines, places, and faces become
                familiar.
              </p>
            </span>
          </article>
          <article>
            <Users />
            <span>
              <b>Connecting with people</b>
              <p>
                Meet Georgian effort with effort of your own—even one good
                phrase matters.
              </p>
            </span>
          </article>
        </div>
      </section>
      <section className="local-section" id="locations">
        <div>
          <span className="section-kicker">Learn where you live</span>
          <h2>Georgian for Batumi, Tbilisi, and everyday life.</h2>
          <p>
            Use GEO at the café downstairs, in a Bolt or taxi, at the bazaar,
            with a landlord, or when meeting Georgian friends. English and
            Russian translations make the first step easier.
          </p>
        </div>
        <div className="local-grid">
          <article>
            <span>Batumi</span>
            <h3>Georgian for life by the Black Sea</h3>
            <p>
              Tourism, cafés, transport, shopping, directions, and neighborly
              conversation.
            </p>
            <a href="/learn-georgian-batumi">
              Learn Georgian in Batumi <ChevronRight />
            </a>
          </article>
          <article>
            <span>Tbilisi</span>
            <h3>Speak through the capital</h3>
            <p>
              Metro trips, restaurants, markets, services, workdays, and meeting
              people.
            </p>
            <a href="/learn-georgian-tbilisi">
              Learn Georgian in Tbilisi <ChevronRight />
            </a>
          </article>
          <article>
            <span>Русский → ქართული</span>
            <h3>Made approachable for Russian speakers</h3>
            <p>
              Search with Russian meanings while learning Georgian script and
              transliteration.
            </p>
            <a href="/learn-georgian-for-russian-speakers">
              Для русскоязычных <ChevronRight />
            </a>
          </article>
        </div>
      </section>
      <section className="teacher-section" id="teacher">
        <div className="teacher-copy">
          <span className="section-kicker">Learn with a real teacher</span>
          <h2>Want personal help speaking Georgian?</h2>
          <p>
            Kristina Beridze teaches Georgian to Russian-speaking students with
            calm explanations, conversation practice, and lessons shaped around
            everyday life in Georgia.
          </p>
          <div className="teacher-facts" aria-label="Lesson options">
            <span>
              <Users /> Children and adults
            </span>
            <span>
              <Globe2 /> Online or in Batumi
            </span>
            <span>
              <CheckCircle2 /> From 20 ₾ per lesson
            </span>
          </div>
          <a
            className="teacher-cta"
            href="https://www.kristinalanguages.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet Kristina and check availability <ChevronRight />
          </a>
        </div>
        <aside className="teacher-card" aria-label="About Kristina Beridze">
          <span className="teacher-monogram" aria-hidden="true">
            კბ
          </span>
          <div>
            <small>ქართული · Русский</small>
            <h3>Kristina Beridze</h3>
            <p>
              Georgian for Russian speakers, taught in Russian and Georgian.
              Individual, mini-group, and online formats depend on current
              availability.
            </p>
          </div>
        </aside>
      </section>
      <section className="demo-pricing" id="phrases">
        <div className="phrase-demo">
          <span className="section-kicker">Four-way phrasebook</span>
          <h2>Search the way you think.</h2>
          <p className="section-lead">
            Type Georgian, transliteration, English, or Russian. GEO keeps every
            form together.
          </p>
          <div className="demo-card">
            <div>
              <strong>მადლობა</strong>
              <em>madloba</em>
              <p>Thank you · Спасибо</p>
            </div>
            <AudioButton id="demo" playing={playing} onPlay={play} large />
          </div>
          <p className="demo-caption">
            <Mic2 /> Native-reviewed audio is being prepared for launch.
          </p>
          <a className="text-link" href="/phrasebook">
            Explore the phrasebook <ChevronRight />
          </a>
        </div>
        <div className="category-showcase">
          <span className="section-kicker">Six starting situations</span>
          <h2>From first hello to finding your way.</h2>
          <div>
            {categories.map(({ name, icon: Icon, tone }) => (
              <button key={name} onClick={openApp}>
                <span className={`mini-icon ${tone}`}>
                  <Icon />
                </span>
                <b>{name}</b>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="learning-story" id="learning">
        <div>
          <span className="section-kicker light">
            Guided Learning · $6.99/month
          </span>
          <h2>
            Five minutes today.
            <br />A phrase you remember tomorrow.
          </h2>
          <p>
            Daily lessons, quizzes, progress, XP, and streaks are part of the
            paid Guided Learning plan. The practical 50-phrase book remains
            free.
          </p>
          <a href="/guided-learning">
            See what the plan includes <ChevronRight />
          </a>
        </div>
        <div className="learning-metrics">
          <article>
            <Flame />
            <b>Daily streak</b>
            <span>Build consistency without marathon sessions.</span>
          </article>
          <article>
            <Brain />
            <b>Practice record</b>
            <span>Track phrases, answers, XP, and review timing.</span>
          </article>
          <article>
            <LockKeyhole />
            <b>Subscriber access</b>
            <span>Protected by account-level entitlement checks.</span>
          </article>
        </div>
      </section>
      <section className="how-section" id="how">
        <span className="section-kicker">How GEO works</span>
        <h2>Useful from the first minute.</h2>
        <div className="how-grid">
          <article>
            <span>01</span>
            <Search />
            <h3>Use 50 phrases free</h3>
            <p>
              Search Georgian, transliteration, English, or Russian without
              paying.
            </p>
          </article>
          <article>
            <span>02</span>
            <Bookmark />
            <h3>Save what matters</h3>
            <p>
              Browse as a guest, or sign in to keep useful phrases across
              devices.
            </p>
          </article>
          <article>
            <span>03</span>
            <LockKeyhole />
            <h3>Unlock guided practice</h3>
            <p>
              Subscribe for $6.99/month to access lessons, quizzes, progress,
              and streaks.
            </p>
          </article>
        </div>
      </section>
      <section className="pricing-section" id="pricing">
        <div className="pricing-heading">
          <span className="section-kicker">Simple pricing</span>
          <h2>Start free. Choose lookup power or guided learning.</h2>
          <p>
            Search 50 essentials for free. Phrasebook Pro is a $20 lifetime
            lookup pack; Guided Learning is a separate $6.99/month course.
          </p>
        </div>
        <div className="pricing-grid redesigned three-plans">
          <article>
            <span className="plan-state live">Free forever</span>
            <h3>Practical phrasebook</h3>
            <b>$0</b>
            <p>
              50 Georgian phrases with transliteration, English, Russian,
              search, and saved phrases.
            </p>
            <Button onClick={openApp}>Open phrasebook</Button>
          </article>
          <article className="phrasebook-plan">
            <span className="plan-state pro">Lifetime access</span>
            <h3>Phrasebook Pro</h3>
            <b>$20</b>
            <p>
              A growing 1,000+ word and sentence catalog, real-life examples,
              richer context, pronunciation, and downloadable offline packs. Pay
              once and keep access.
            </p>
            <a href="/pricing">Explore Phrasebook Pro</a>
          </article>
          <article className="popular">
            <span className="plan-state">Premium</span>
            <h3>Guided Learning</h3>
            <b>
              $6.99<small>/month</small>
            </b>
            <p>
              Daily lessons, quizzes, review, progress, XP, and streaks. Account
              access is checked securely.
            </p>
            <a href="/pricing">View subscription details</a>
          </article>
        </div>
      </section>
      <section className="trust-section">
        <div>
          <span className="section-kicker">Built with care</span>
          <h2>Your learning belongs to you.</h2>
          <p>
            Guest browsing stays open. When you sign in, database rules isolate
            your profile, saves, progress, activity, and streak from every other
            learner.
          </p>
        </div>
        <div className="trust-list">
          <span>
            <ShieldCheck /> Row-level account protection
          </span>
          <span>
            <CheckCircle2 /> Honest beta feature status
          </span>
          <span>
            <Globe2 /> Content model ready for EN · RU · KA
          </span>
        </div>
      </section>
      <section className="faq-section">
        <span className="section-kicker">Questions, answered</span>
        <h2>Before you begin.</h2>
        <div>
          <details>
            <summary>What can I use for free?</summary>
            <p>
              The complete 50-phrase practical phrasebook, four-way search, and
              browsing are free. Sign in if you want to save phrases across
              devices.
            </p>
          </details>
          <details>
            <summary>What is included with Phrasebook Pro?</summary>
            <p>
              The $20 one-time pack is designed for fast real-world lookup: a
              growing catalog of 1,000+ words and practical sentences, examples,
              richer context, pronunciation, and offline packs. The current beta
              contains 50 searchable entries while the expanded catalog and
              checkout are prepared.
            </p>
          </details>
          <details>
            <summary>What requires $6.99/month?</summary>
            <p>
              Daily lessons, quizzes, smart review, XP, progress, and streaks
              require an active Guided Learning subscription.
            </p>
          </details>
          <details>
            <summary>Can I install GEO and use it offline?</summary>
            <p>
              Yes. GEO is an installable PWA with a cached core interface and
              offline fallback. Account sync and uncached content still require
              a connection.
            </p>
          </details>
          <details>
            <summary>Can I subscribe today?</summary>
            <p>
              The access gate is active now. Secure payment checkout is the
              remaining billing connection, so this beta does not collect
              payment details yet.
            </p>
          </details>
        </div>
      </section>
      <section className="final-cta">
        <img
          src="/batumi-line.webp"
          width="1600"
          height="533"
          loading="lazy"
          alt=""
        />
        <span className="section-kicker light">50 phrases · free</span>
        <h2>Your next Georgian phrase is one tap away.</h2>
        <p>
          Open the free phrasebook now. Upgrade once for the expanded lookup
          library, or subscribe when you want guided learning.
        </p>
        <Button onClick={openApp}>
          Open free phrasebook <ChevronRight />
        </Button>
      </section>
      <PublicFooter />
      <CookieNotice />
      <div className={`sticky-install ${showInstall ? 'visible' : ''}`}>
        <span className="sticky-logo">GEO</span>
        <div>
          <b>Practical Georgian</b>
          <small>Web or installable app</small>
        </div>
        <span className="sticky-actions">
          <button onClick={installApp}>
            <Download /> Install
          </button>
          <Button onClick={openApp}>Use web</Button>
        </span>
      </div>
    </main>
  );
}

function AppShell({
  exitToSite,
  installApp,
  openModal,
  openAuth,
}: {
  exitToSite: () => void;
  installApp: () => void;
  openModal: (kind: 'install' | 'pricing') => void;
  openAuth: () => void;
}) {
  const [screen, setScreen] = useState<Screen>('explore');
  const [category, setCategory] = useState<CategoryName>('Essentials');
  const [playing, setPlaying] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [library, setLibrary] =
    useState<Record<CategoryName, Phrase[]>>(phrases);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [hasLearningAccess, setHasLearningAccess] = useState(false);
  const [hasPhrasebookProAccess, setHasPhrasebookProAccess] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    longest: 0,
    xp: 0,
    practiced: 0,
    activity: [] as { activity_date: string; xp_earned: number }[],
  });
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  useEffect(() => {
    let active = true;
    void import('@/lib/supabase/client').then((supabaseModule) => {
      if (active && supabaseModule.isSupabaseConfigured)
        setSupabase(supabaseModule.createClient());
    });
    return () => {
      active = false;
    };
  }, []);
  const play = (id: string, text?: string, audioUrl?: string | null) => {
    setPlaying(id);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      void audio.play().catch(() => undefined);
    } else if (text && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ka-GE';
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    }
    window.setTimeout(() => setPlaying(null), 1400);
  };
  const phraseKey = (phrase: Phrase) => phrase.id ?? phrase.ka;
  const allPhrases = useMemo(() => Object.values(library).flat(), [library]);
  const normalizedSearch = search.trim().normalize('NFKC').toLocaleLowerCase();
  const searchTerms = normalizedSearch.split(/\s+/).filter(Boolean);
  const filtered = normalizedSearch
    ? allPhrases.filter((p) => {
        const searchable = `${p.ka} ${p.tr} ${p.en} ${p.ru}`
          .normalize('NFKC')
          .toLocaleLowerCase();
        return searchTerms.every((term) => searchable.includes(term));
      })
    : [];
  const openCategory = (name: CategoryName) => {
    setCategory(name);
    setScreen('category');
  };
  const learnNav =
    screen === 'premium' ||
    screen === 'daily' ||
    screen === 'lesson' ||
    screen === 'quiz';
  const basicsPercent = Math.min(100, Math.round((stats.practiced / 50) * 100));
  const weekActivity = useMemo(() => {
    const byDate = new Map(
      stats.activity.map((day) => [day.activity_date, day.xp_earned]),
    );
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        label: date.toLocaleDateString('en', { weekday: 'narrow' }),
        xp: byDate.get(key) ?? 0,
      };
    });
  }, [stats.activity]);

  const loadUserData = useCallback(
    async (activeUser: User | null) => {
      if (!supabase || !activeUser) {
        setSaved([]);
        setDisplayName(null);
        setHasLearningAccess(false);
        setHasPhrasebookProAccess(false);
        setStats({ streak: 0, longest: 0, xp: 0, practiced: 0, activity: [] });
        return;
      }
      const [
        savedResult,
        profileResult,
        streakResult,
        activityResult,
        progressResult,
        accessResult,
        phrasebookAccessResult,
      ] = await Promise.all([
        supabase.from('saved_phrases').select('phrase_id'),
        supabase.from('profiles').select('display_name').maybeSingle(),
        supabase
          .from('streaks')
          .select('current_streak,longest_streak')
          .maybeSingle(),
        supabase
          .from('daily_activity')
          .select('activity_date,xp_earned')
          .order('activity_date', { ascending: false })
          .limit(30),
        supabase.from('learning_progress').select('phrase_id'),
        supabase.rpc('has_guided_learning_access'),
        supabase.rpc('has_phrasebook_pro_access'),
      ]);
      setSaved((savedResult.data ?? []).map((item) => item.phrase_id));
      setDisplayName(profileResult.data?.display_name ?? null);
      setHasLearningAccess(accessResult.data === true);
      setHasPhrasebookProAccess(phrasebookAccessResult.data === true);
      const activity = activityResult.data ?? [];
      setStats({
        streak: streakResult.data?.current_streak ?? 0,
        longest: streakResult.data?.longest_streak ?? 0,
        xp: activity.reduce((sum, day) => sum + day.xp_earned, 0),
        practiced: progressResult.data?.length ?? 0,
        activity,
      });
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase
      .from('phrases')
      .select(
        'id,category_slug,georgian,transliteration,english,russian,audio_url',
      )
      .order('sort_order')
      .then(({ data }) => {
        if (!active || !data?.length) return;
        const next = Object.fromEntries(
          categories.map((item) => [item.name, []]),
        ) as unknown as Record<CategoryName, Phrase[]>;
        const namesBySlug: Record<string, CategoryName> = {
          essentials: 'Essentials',
          'food-cafes': 'Food & Cafés',
          transport: 'Transport',
          shopping: 'Shopping',
          emergencies: 'Emergencies',
          'meeting-people': 'Meeting People',
        };
        data.forEach((row) => {
          const name = namesBySlug[row.category_slug];
          if (name)
            next[name].push({
              id: row.id,
              category_slug: row.category_slug,
              ka: row.georgian,
              tr: row.transliteration,
              en: row.english,
              ru: row.russian,
              audio_url: row.audio_url,
            });
        });
        setLibrary(next);
      });
    void supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        void loadUserData(data.user);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setUser(session?.user ?? null);
        void loadUserData(session?.user ?? null);
      },
    );
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase, loadUserData]);

  const toggleSaved = async (phrase: Phrase) => {
    const key = phraseKey(phrase);
    if (!supabase || !user || !phrase.id) {
      openAuth();
      return;
    }
    const wasSaved = saved.includes(key);
    setSaved((items) =>
      wasSaved ? items.filter((value) => value !== key) : [...items, key],
    );
    const result = wasSaved
      ? await supabase
          .from('saved_phrases')
          .delete()
          .eq('user_id', user.id)
          .eq('phrase_id', phrase.id)
      : await supabase
          .from('saved_phrases')
          .insert({ user_id: user.id, phrase_id: phrase.id });
    if (result.error)
      setSaved((items) =>
        wasSaved ? [...items, key] : items.filter((value) => value !== key),
      );
  };

  const openLearning = () => setScreen(hasLearningAccess ? 'daily' : 'premium');
  const openProgress = () =>
    setScreen(hasLearningAccess ? 'progress' : 'premium');

  useEffect(() => {
    if (
      !hasLearningAccess &&
      ['daily', 'lesson', 'quiz', 'progress'].includes(screen)
    ) {
      const redirect = window.setTimeout(() => setScreen('premium'), 0);
      return () => window.clearTimeout(redirect);
    }
  }, [hasLearningAccess, screen]);

  const completeQuiz = async () => {
    if (!hasLearningAccess) {
      setScreen('premium');
      return;
    }
    const quizPhrase = allPhrases.find((item) => item.ka === 'მადლობა');
    if (!supabase || !user || !quizPhrase?.id) {
      openAuth();
      return;
    }
    const { error } = await supabase.rpc('record_learning_activity', {
      p_phrase_id: quizPhrase.id,
      p_correct: true,
      p_lesson_completed: true,
      p_minutes: 5,
    });
    if (!error) {
      await loadUserData(user);
      setScreen('progress');
    }
  };
  useEffect(() => {
    type Tool = {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options?: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const categoryNames = categories.map((item) => item.name);
    void Promise.resolve(
      context.registerTool(
        {
          name: 'open_phrase_category',
          title: 'Open phrase category',
          description:
            'Open one of the visible Georgian phrase categories in the app.',
          inputSchema: {
            type: 'object',
            properties: { category: { type: 'string', enum: categoryNames } },
            required: ['category'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input) {
            const value = (input as { category?: unknown })?.category;
            if (
              typeof value !== 'string' ||
              !categoryNames.includes(value as CategoryName)
            )
              throw new Error('Choose a valid phrase category.');
            setCategory(value as CategoryName);
            setScreen('category');
            return { screen: 'category', category: value };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    void Promise.resolve(
      context.registerTool(
        {
          name: 'start_daily_lesson',
          title: 'Start daily lesson',
          description:
            'Open the five-minute Georgian lesson when the signed-in user has an active Guided Learning subscription.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute() {
            if (!hasLearningAccess) {
              setScreen('premium');
              return {
                screen: 'premium',
                locked: true,
                requiredPlan: 'guided_learning',
              };
            }
            setScreen('lesson');
            return { screen: 'lesson', lesson: 3, total: 10 };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, [hasLearningAccess]);
  const renderPhrases = (items: typeof allPhrases) => (
    <div className="phrase-list">
      {items.map((p, i) => (
        <article className="phrase-card" key={phraseKey(p)}>
          <div>
            <strong>{p.ka}</strong>
            <em>{p.tr}</em>
            <p>
              {p.en} · {p.ru}
            </p>
          </div>
          <div className="phrase-actions">
            <button
              className={`save-button ${saved.includes(phraseKey(p)) ? 'saved' : ''}`}
              onClick={() => void toggleSaved(p)}
              aria-label={
                saved.includes(phraseKey(p))
                  ? 'Remove saved phrase'
                  : 'Save phrase'
              }
            >
              <Bookmark />
            </button>
            <AudioButton
              id={`${p.ka}-${i}`}
              playing={playing}
              onPlay={play}
              text={p.ka}
              audioUrl={p.audio_url}
            />
          </div>
        </article>
      ))}
    </div>
  );
  return (
    <main className="app-view">
      <aside className="app-sidebar">
        <Brand onHome={exitToSite} />
        <nav>
          <button
            className={
              screen === 'explore' || screen === 'category' ? 'active' : ''
            }
            onClick={() => setScreen('explore')}
          >
            <Compass />
            Explore
          </button>
          <button className={learnNav ? 'active' : ''} onClick={openLearning}>
            <BookOpen />
            Learn
          </button>
          <button
            className={screen === 'saved' ? 'active' : ''}
            onClick={() => setScreen('saved')}
          >
            <Bookmark />
            Saved
          </button>
          <button
            className={screen === 'progress' ? 'active' : ''}
            onClick={openProgress}
          >
            <BarChart3 />
            Progress
          </button>
        </nav>
        <button
          className="sidebar-premium"
          onClick={() => setScreen('premium')}
        >
          <Star />
          <span>
            <b>Guided Learning</b>
            <small>
              {hasLearningAccess ? 'Your plan is active' : '$6.99 per month'}
            </small>
          </span>
          <ChevronRight />
        </button>
        <button className="back-to-site" onClick={exitToSite}>
          <ArrowLeft /> Website
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <Brand onHome={exitToSite} />
          <div className="app-top-actions">
            <button onClick={exitToSite}>Website</button>
            <button className="app-install" onClick={installApp}>
              <Download /> Install
            </button>
            <button
              onClick={() =>
                user && supabase ? void supabase.auth.signOut() : openAuth()
              }
            >
              {user ? <LogOut /> : <LogIn />}
              {user
                ? (displayName ?? user.email?.split('@')[0] ?? 'Sign out')
                : 'Sign in'}
            </button>
            <button onClick={() => setScreen('premium')}>
              <Sparkles /> Premium
            </button>
          </div>
        </header>
        <div className="app-content">
          {screen === 'explore' && (
            <section className="screen explore-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">გამარჯობა · gamarjoba</span>
                  <h1>Learn Georgian</h1>
                  <p>
                    {user
                      ? `Welcome back${displayName ? `, ${displayName}` : ''}.`
                      : 'Open the free 50-phrase book now. Sign in only to save phrases.'}
                  </p>
                </div>
                <button className="streak-chip" onClick={openProgress}>
                  <LockKeyhole /> Guided progress
                </button>
              </div>
              <search className="search-box">
                <Search />
                <input
                  type="search"
                  aria-label="Search the Georgian phrasebook"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Georgian, transliteration, English or Russian"
                />
                {search && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                  >
                    <X />
                  </button>
                )}
              </search>
              {normalizedSearch ? (
                <>
                  <div className="section-title">
                    <h2>Search results</h2>
                    <span>
                      {filtered.length} found for “{search.trim()}”
                    </span>
                  </div>
                  {filtered.length ? (
                    renderPhrases(filtered)
                  ) : (
                    <div className="empty-card">
                      <Search />
                      <h3>No phrase found</h3>
                      <p>Try “coffee”, “hello” or “ticket”.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="free-progress">
                    <div>
                      <b>{Math.min(allPhrases.length, 50)} of 50</b> free
                      phrases available
                    </div>
                    <Progress value={Math.min(100, allPhrases.length * 2)} />
                  </div>
                  <div className="section-title">
                    <h2>Browse by situation</h2>
                    <span>6 categories</span>
                  </div>
                  <div className="category-grid">
                    {categories.map(({ name, icon: Icon, tone }) => (
                      <button
                        className="category-card"
                        key={name}
                        onClick={() => openCategory(name)}
                      >
                        <span className={`category-icon ${tone}`}>
                          <Icon />
                        </span>
                        <span>
                          <b>{name}</b>
                          <small>{library[name].length} free phrases</small>
                        </span>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                  <button
                    className="learning-banner locked-learning"
                    onClick={openLearning}
                  >
                    <img
                      src="/batumi-line.webp"
                      width="1600"
                      height="533"
                      loading="lazy"
                      alt=""
                    />
                    <span>
                      <small>Guided Learning · Premium</small>
                      <b>Daily lessons are locked</b>
                      <em>
                        $6.99/month unlocks lessons, quizzes, progress, and
                        streaks.
                      </em>
                    </span>
                    <span className="banner-action">
                      <LockKeyhole /> View plan
                    </span>
                  </button>
                </>
              )}
            </section>
          )}
          {screen === 'category' && (
            <section className="screen category-screen">
              <button
                className="back-button"
                onClick={() => setScreen('explore')}
              >
                <ArrowLeft /> All categories
              </button>
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">Practical Georgian</span>
                  <h1>{category}</h1>
                  <p>{library[category].length} free phrases</p>
                </div>
              </div>
              {renderPhrases(library[category])}
              <div className="locked-card">
                <span className="lock-orb">
                  <LockKeyhole />
                </span>
                <div>
                  <h2>More words & phrases are coming</h2>
                  <p>
                    The content model is ready for the complete reviewed
                    phrasebook and audio library.
                  </p>
                </div>
                <Button onClick={() => openModal('pricing')}>
                  <LockKeyhole /> View learning plans
                </Button>
              </div>
            </section>
          )}
          {screen === 'saved' && (
            <section className="screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">Your phrasebook</span>
                  <h1>Saved phrases</h1>
                  <p>
                    {user
                      ? 'Synced securely across your devices.'
                      : 'Sign in to save and sync phrases.'}
                  </p>
                </div>
              </div>
              {saved.length ? (
                renderPhrases(
                  allPhrases.filter((p) => saved.includes(phraseKey(p))),
                )
              ) : (
                <div className="empty-card">
                  <Bookmark />
                  <h3>No saved phrases yet</h3>
                  <p>
                    {user
                      ? 'Tap the bookmark on any phrase to save it here.'
                      : 'Create an account or sign in to keep phrases across devices.'}
                  </p>
                  <Button
                    onClick={user ? () => setScreen('explore') : openAuth}
                  >
                    {user ? 'Explore phrases' : 'Sign in to sync'}
                  </Button>
                </div>
              )}
            </section>
          )}
          {screen === 'premium' && (
            <section className="screen premium-screen">
              <button
                className="back-button"
                onClick={() => setScreen('explore')}
              >
                <ArrowLeft /> Back to free phrasebook
              </button>
              <div className="premium-hero">
                <span className="premium-orb">
                  <LockKeyhole />
                </span>
                <h1>
                  Choose how
                  <br />
                  you want to learn
                </h1>
                <p>
                  Keep the 50-phrase book free, unlock a deep lookup library
                  once, or subscribe for a structured daily course.
                </p>
              </div>
              <div className="premium-layout">
                <div className="feature-list">
                  <div>
                    <Search />
                    <span>
                      <b>1,000+ instant lookups with Pro</b>
                      <small>
                        Find words and sentences in four writing forms
                      </small>
                    </span>
                  </div>
                  <div>
                    <Globe2 />
                    <span>
                      <b>Sentence examples and context</b>
                      <small>
                        Know what to say, when to say it, and how it sounds
                      </small>
                    </span>
                  </div>
                  <div>
                    <Download />
                    <span>
                      <b>Lifetime and offline value</b>
                      <small>
                        Pro is a one-time purchase with downloadable packs
                      </small>
                    </span>
                  </div>
                  <div>
                    <CalendarDays />
                    <span>
                      <b>Daily lessons with Guided Learning</b>
                      <small>Short, structured practice for $6.99/month</small>
                    </span>
                  </div>
                  <div>
                    <Brain />
                    <span>
                      <b>Quizzes, progress, XP, and streaks</b>
                      <small>
                        Guided Learning helps you build a lasting habit
                      </small>
                    </span>
                  </div>
                </div>
                <div className="premium-plan-stack">
                  <div className="premium-price-card phrasebook-pro-card">
                    <span>
                      {hasPhrasebookProAccess
                        ? 'Lifetime access active'
                        : 'Pay once · Keep forever'}
                    </span>
                    <h2>$20</h2>
                    <h3>Phrasebook Pro</h3>
                    <p>
                      1,000+ searchable words and practical sentences, examples,
                      context, pronunciation, and offline packs as the expanded
                      catalog launches.
                    </p>
                    <Button
                      onClick={
                        hasPhrasebookProAccess
                          ? () => setScreen('explore')
                          : user
                            ? () => openModal('pricing')
                            : openAuth
                      }
                    >
                      {hasPhrasebookProAccess
                        ? 'Search Phrasebook Pro'
                        : user
                          ? 'Get lifetime access'
                          : 'Sign in to get Pro'}
                    </Button>
                  </div>
                  <div className="premium-price-card">
                    <span>
                      {hasLearningAccess ? 'Active subscription' : 'Premium'}
                    </span>
                    <h2>
                      $6.99 <small>/ month</small>
                    </h2>
                    <h3>Guided Learning</h3>
                    <p>
                      Daily lessons, quizzes, smart review, progress, XP, and
                      streaks for learners who want structure.
                    </p>
                    <Button
                      onClick={
                        hasLearningAccess
                          ? openLearning
                          : user
                            ? () => openModal('pricing')
                            : openAuth
                      }
                    >
                      {hasLearningAccess
                        ? 'Open today’s lesson'
                        : user
                          ? 'Subscribe for $6.99'
                          : 'Sign in to subscribe'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}
          {screen === 'daily' && hasLearningAccess && (
            <section className="screen daily-screen">
              <div className="daily-heading">
                <div>
                  <span className="app-eyebrow">დღის მშვიდობისა</span>
                  <h1>Ready for today?</h1>
                  <p>A little Georgian goes a long way.</p>
                </div>
                <span className="day-badge">
                  <Flame /> {stats.streak}
                </span>
              </div>
              <img
                className="daily-skyline"
                src="/batumi-line.webp"
                width="1600"
                height="533"
                loading="lazy"
                alt="Batumi skyline illustration"
              />
              <button
                className="daily-lesson-card"
                onClick={() => setScreen('lesson')}
              >
                <span className="daily-book">
                  <BookOpen />
                </span>
                <span>
                  <b>5 min · 8 words</b>
                  <small>Premium daily lesson</small>
                </span>
                <span className="start-lesson">
                  Start lesson <ChevronRight />
                </span>
              </button>
              <div className="streak-card">
                <h3>
                  <Flame /> {stats.streak} day streak
                </h3>
                <div className="week-row">
                  {weekActivity.map((day, i) => (
                    <span key={`${day.label}-${i}`}>
                      <small>{day.label}</small>
                      <i className={day.xp > 0 ? 'done' : ''}>
                        {day.xp > 0 ? <Check /> : null}
                      </i>
                    </span>
                  ))}
                </div>
              </div>
              <button className="basics-progress" onClick={openProgress}>
                <span className="progress-ring">{basicsPercent}%</span>
                <span>
                  <b>Georgian basics</b>
                  <small>
                    {stats.practiced
                      ? 'Keep it up!'
                      : 'Practice your first phrase'}
                  </small>
                  <Progress value={basicsPercent} />
                </span>
                <ChevronRight />
              </button>
            </section>
          )}
          {screen === 'lesson' && hasLearningAccess && (
            <section className="screen lesson-screen">
              <div className="lesson-top">
                <button onClick={() => setScreen('daily')}>
                  <ArrowLeft />
                </button>
                <span>Lesson 3 of 10</span>
                <b>250 XP</b>
              </div>
              <Progress value={34} />
              <div className="lesson-card">
                <span className="lesson-tag">Essentials</span>
                <strong>გამარჯობა</strong>
                <em>gamarjoba</em>
                <p>Hello · Привет</p>
                <div className="wave-row">
                  <i />
                  <i />
                  <i />
                  <AudioButton
                    id="lesson"
                    playing={playing}
                    onPlay={play}
                    large
                  />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="speed-row">
                  <button>
                    0.7×<small>Slow</small>
                  </button>
                  <button className="selected">
                    1×<small>Normal</small>
                  </button>
                </div>
              </div>
              <Button
                className="lesson-continue"
                onClick={() => setScreen('quiz')}
              >
                I know this <ChevronRight />
              </Button>
            </section>
          )}
          {screen === 'quiz' && hasLearningAccess && (
            <section className="screen quiz-screen">
              <div className="lesson-top">
                <button onClick={() => setScreen('lesson')}>
                  <X />
                </button>
                <span>Quick check</span>
                <b>{stats.xp} XP</b>
              </div>
              <Progress value={60} />
              <div className="quiz-panel">
                <span className="app-eyebrow">Choose the meaning</span>
                <h1>What does this mean?</h1>
                <strong>მადლობა</strong>
                <div className="answers">
                  <button>Hello</button>
                  <button className="correct">
                    Thank you <CheckCircle2 />
                  </button>
                  <button>Goodbye</button>
                </div>
                <p className="correct-note">
                  <CheckCircle2 /> Correct! <b>+10 XP</b>
                </p>
                <Button onClick={() => void completeQuiz()}>
                  Save progress <ChevronRight />
                </Button>
              </div>
            </section>
          )}
          {screen === 'progress' && hasLearningAccess && (
            <section className="screen progress-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">Your learning journey</span>
                  <h1>Progress & streak</h1>
                  <p>
                    {user
                      ? 'Your learning record is synced securely.'
                      : 'Sign in to track progress across devices.'}
                  </p>
                </div>
                <span className="xp-badge">
                  <Trophy /> {stats.xp} XP
                </span>
              </div>
              <div className="stats-grid">
                <article>
                  <Flame />
                  <b>{stats.streak}</b>
                  <span>day streak</span>
                </article>
                <article>
                  <BookOpen />
                  <b>{basicsPercent}%</b>
                  <span>basics complete</span>
                </article>
                <article>
                  <Volume2 />
                  <b>{stats.practiced}</b>
                  <span>phrases practiced</span>
                </article>
              </div>
              <div className="progress-panel">
                <h2>Last 7 days</h2>
                <div className="chart-bars">
                  {weekActivity.map((day, i) => (
                    <span key={i}>
                      <i
                        style={{
                          height: `${Math.max(6, Math.min(100, day.xp))}%`,
                        }}
                      />
                      <small>{day.label}</small>
                    </span>
                  ))}
                </div>
              </div>
              {user ? (
                <div className="achievement-card">
                  <span>
                    <Star />
                  </span>
                  <div>
                    <b>Longest streak: {stats.longest} days</b>
                    <p>Keep practicing to build a lasting habit.</p>
                  </div>
                  <CheckCircle2 />
                </div>
              ) : (
                <div className="empty-card">
                  <UserRound />
                  <h3>Keep your learning history</h3>
                  <p>Sign in to sync XP, streaks, saved phrases and reviews.</p>
                  <Button onClick={openAuth}>Sign in or create account</Button>
                </div>
              )}
            </section>
          )}
        </div>
        <nav className="bottom-nav" aria-label="App navigation">
          <button
            className={
              screen === 'explore' || screen === 'category' ? 'active' : ''
            }
            onClick={() => setScreen('explore')}
          >
            <Home />
            <span>Home</span>
          </button>
          <button className={learnNav ? 'active' : ''} onClick={openLearning}>
            <BookOpen />
            <span>Learn</span>
          </button>
          <button
            className={screen === 'saved' ? 'active' : ''}
            onClick={() => setScreen('saved')}
          >
            <Bookmark />
            <span>Saved</span>
          </button>
          <button
            className={screen === 'progress' ? 'active' : ''}
            onClick={openProgress}
          >
            <BarChart3 />
            <span>Progress</span>
          </button>
        </nav>
      </div>
    </main>
  );
}

function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setStatus('');
    const supabaseModule = await import('@/lib/supabase/client');
    if (!supabaseModule.isSupabaseConfigured) {
      setStatus('Add the project publishable key to enable account access.');
      return;
    }
    setBusy(true);
    const client = supabaseModule.createClient();
    const result =
      mode === 'signin'
        ? await client.auth.signInWithPassword({ email, password })
        : await client.auth.signUp({
            email,
            password,
            options: { data: { display_name: name.trim() || undefined } },
          });
    setBusy(false);
    if (result.error) {
      setStatus(result.error.message);
      return;
    }
    if (result.data.session) {
      onOpenChange(false);
      setStatus('');
      return;
    }
    setStatus('Check your email to confirm your account, then sign in.');
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="auth-dialog">
        <DialogHeader>
          <span className="dialog-icon">
            <UserRound />
          </span>
          <DialogTitle>
            {mode === 'signin' ? 'Sign in to GEO' : 'Create your GEO account'}
          </DialogTitle>
          <DialogDescription>
            Save your free phrasebook across devices. Guided Learning history is
            available with an active subscription.
          </DialogDescription>
        </DialogHeader>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              Display name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={80}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              minLength={8}
              required
            />
          </label>
          {status && <output className="auth-status">{status}</output>}
          <Button type="submit" disabled={busy}>
            {busy
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>
        <button
          className="auth-switch"
          onClick={() => {
            setMode((value) => (value === 'signin' ? 'signup' : 'signin'));
            setStatus('');
          }}
        >
          {mode === 'signin'
            ? 'New to GEO? Create an account'
            : 'Already have an account? Sign in'}
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<'marketing' | 'app'>('marketing');
  const [modal, setModal] = useState<'install' | 'pricing' | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      location.hash === '#app'
    )
      window.setTimeout(() => setMode('app'), 0);
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production')
      void navigator.serviceWorker.register('/sw.js', { scope: '/' });
    const captureInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const installed = () => {
      setInstallPrompt(null);
      setMode('app');
    };
    window.addEventListener('beforeinstallprompt', captureInstall);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstall);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);
  const openApp = () => {
    setMode('app');
    history.replaceState(null, '', '#app');
    window.scrollTo(0, 0);
  };
  const installApp = async () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      openApp();
      return;
    }
    if (!installPrompt) {
      setModal('install');
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setInstallPrompt(null);
  };
  const exitToSite = () => {
    setMode('marketing');
    history.replaceState(null, '', location.pathname);
    window.scrollTo(0, 0);
  };
  return (
    <>
      {mode === 'marketing' ? (
        <Marketing openApp={openApp} installApp={() => void installApp()} />
      ) : (
        <AppShell
          exitToSite={exitToSite}
          installApp={() => void installApp()}
          openModal={setModal}
          openAuth={() => setAuthOpen(true)}
        />
      )}
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="mock-dialog">
          <DialogHeader>
            <span className="dialog-icon">
              {modal === 'install' ? <Download /> : <Star />}
            </span>
            <DialogTitle>
              {modal === 'install' ? 'Install GEO' : 'Choose your GEO upgrade'}
            </DialogTitle>
            <DialogDescription>
              {modal === 'install'
                ? 'On iPhone or iPad, tap Share, then “Add to Home Screen.” On Chrome or Edge, use “Install app” in the browser menu if the install prompt is not shown. GEO’s core interface is cached for quick launch and essential offline access.'
                : 'Phrasebook Pro is a lifetime lookup pack. Guided Learning is the monthly course. Secure checkout is being connected, so this beta does not collect payment details yet.'}
            </DialogDescription>
          </DialogHeader>
          {modal === 'pricing' && (
            <div className="modal-plans">
              <div className="phrasebook-choice">
                <span>
                  <b>Phrasebook Pro</b>
                  <small>1,000+ lookups · Lifetime access</small>
                </span>
                <strong>$20</strong>
              </div>
              <div className="recommended">
                <span>
                  <b>Guided Learning</b>
                  <small>Structured learning and progress</small>
                </span>
                <strong>$6.99/mo</strong>
              </div>
            </div>
          )}
          <div className="dialog-actions">
            {modal === 'install' && (
              <Button variant="outline" onClick={openApp}>
                Use on web
              </Button>
            )}
            <Button className="dialog-done" onClick={() => setModal(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
