'use client';
/* eslint-disable next/no-img-element */
/* eslint-disable next/no-html-link-for-pages */

import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Download,
  Flame,
  Headphones,
  MapPin,
  Menu,
  Mic2,
  Plane,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import { LanguageMenu, type InterfaceLocale } from './language-menu';
import { MarketingFooter } from './marketing-footer';
import { CookieNotice } from './cookie-notice';

type Props = {
  openApp: () => void;
  installApp: () => void;
  openAuth: () => void;
  openAccount: () => void;
  user: User | null;
  displayName: string | null;
  accountReady: boolean;
  locale: InterfaceLocale;
  onLocaleChange: (locale: InterfaceLocale) => void;
  copy: (key: string) => string;
};

const words = [
  ['გამარჯობა', 'gamarjoba', 'Hello', '/audio/words/word-035.mp3'],
  ['მადლობა', 'madloba', 'Thank you', '/audio/words/word-036.mp3'],
  ['გთხოვთ', 'gtkhovt', 'Please', '/audio/words/word-037.mp3'],
] as const;

export function MarketingExperience({
  openApp,
  installApp,
  openAuth,
  openAccount,
  user,
  displayName,
  accountReady,
  locale,
  onLocaleChange,
  copy,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  const playWord = (id: string, source: string) => {
    audioRef.current?.pause();
    const audio = new Audio(source);
    audioRef.current = audio;
    setPlaying(id);
    const finish = () =>
      setPlaying((current) => (current === id ? null : current));
    audio.addEventListener('ended', finish, { once: true });
    audio.addEventListener('error', finish, { once: true });
    void audio.play().catch(finish);
  };

  const accountName =
    displayName ||
    (typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null) ||
    (accountReady ? copy('signIn') : 'Account');

  return (
    <main className="travel-site">
      <header className="travel-header">
        <button
          className="travel-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="GEO home"
        >
          <img src="/brand/geo-wave.svg" alt="" width="38" height="38" />
          <span>GEO</span>
        </button>

        <nav className="travel-nav" aria-label="Main navigation">
          <a href="#experience">Experience</a>
          <a href="#course">Course</a>
          <a href="#membership">Membership</a>
        </nav>

        <div className="travel-header-actions">
          <LanguageMenu
            locale={locale}
            onChange={onLocaleChange}
            label={copy('language')}
          />
          <button
            className="travel-account"
            onClick={user ? openAccount : openAuth}
            aria-label={accountName}
          >
            <UserRound />
            <span>{accountName}</span>
          </button>
          <button className="travel-open" onClick={openApp}>
            Open app <ArrowRight />
          </button>
          <button
            className="travel-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="travel-mobile-menu" aria-label="Mobile navigation">
            <a href="#experience" onClick={() => setMenuOpen(false)}>
              Experience
            </a>
            <a href="#course" onClick={() => setMenuOpen(false)}>
              Course
            </a>
            <a href="#membership" onClick={() => setMenuOpen(false)}>
              Membership
            </a>
            <button onClick={installApp}>
              <Download /> Install GEO
            </button>
            <button onClick={user ? openAccount : openAuth}>
              <UserRound /> {accountName}
            </button>
            <button className="primary" onClick={openApp}>
              Open the app <ArrowRight />
            </button>
          </nav>
        )}
      </header>

      <section className="travel-hero">
        <div className="travel-hero-photo">
          <img
            src="/geo-dusk-hero.png"
            alt="A cinematic evening view of Georgia"
            width="1536"
            height="1024"
          />
          <div className="photo-topline">
            <span>
              <MapPin /> Georgia
            </span>
            <span>ქართული</span>
          </div>
          <div className="photo-caption">
            <span className="caption-icon">
              <Mic2 />
            </span>
            <span>
              <small>Made for real conversations</small>
              <b>From your first coffee to your first friendship.</b>
            </span>
          </div>
        </div>

        <div className="travel-hero-copy">
          <span className="travel-kicker">
            <Sparkles /> Georgian, made practical
          </span>
          <h1>
            Learn the words.
            <span>Live the moment.</span>
          </h1>
          <p>
            Tiny audio-first lessons for the Georgian you actually need—in
            cafés, taxis, shops, streets, and everyday conversations.
          </p>
          <div className="travel-hero-actions">
            <button className="travel-primary" onClick={openApp}>
              Start learning free <ArrowRight />
            </button>
            <button className="travel-secondary" onClick={installApp}>
              <Download /> Install app
            </button>
          </div>
          <div className="travel-trust-row">
            <span>
              <Check /> Free phrasebook
            </span>
            <span>
              <Headphones /> Native audio
            </span>
            <span>
              <ShieldCheck /> Progress synced
            </span>
          </div>
        </div>

        <div className="travel-lesson-dock" aria-label="Try a Georgian lesson">
          <header>
            <span>
              <BookOpen /> Your first three words
            </span>
            <b>01 / 03</b>
          </header>
          <div className="travel-word-row">
            {words.map(([georgian, phonetic, meaning, audio], index) => (
              <article key={georgian}>
                <span className="travel-word-number">0{index + 1}</span>
                <span className="travel-word-copy">
                  <strong>{georgian}</strong>
                  <small>{phonetic}</small>
                  <em>{meaning}</em>
                </span>
                <button
                  onClick={() => playWord(georgian, audio)}
                  aria-label={`Play ${georgian}`}
                  className={playing === georgian ? 'playing' : ''}
                >
                  {playing === georgian ? <Volume2 /> : <Play />}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="travel-quickbar" aria-label="GEO highlights">
        <span>
          <b>50</b> free phrases
        </span>
        <span>
          <b>9,000</b> dictionary words
        </span>
        <span>
          <b>96</b> guided steps
        </span>
        <span>
          <b>5 min</b> daily rhythm
        </span>
      </section>

      <section className="travel-experience" id="experience">
        <header className="travel-section-head">
          <div>
            <span className="travel-kicker">Built around your day</span>
            <h2>Useful Georgian starts here.</h2>
          </div>
          <p>
            Search when you need an answer, or follow the course when you want
            to build confidence step by step.
          </p>
        </header>

        <div className="travel-bento">
          <article className="travel-bento-search">
            <div className="bento-title">
              <span className="bento-icon blue">
                <Search />
              </span>
              <span>
                <small>Instant phrasebook</small>
                <h3>Find the phrase before the moment passes.</h3>
              </span>
            </div>
            <div className="phrase-search-mock">
              <span>
                <Search /> coffee
              </span>
              <b>ყავა, გთხოვთ</b>
              <small>qava, gtkhovt · Coffee, please</small>
              <button
                onClick={() => playWord('coffee', '/audio/words/word-037.mp3')}
              >
                <Volume2 /> Listen
              </button>
            </div>
            <button className="bento-link" onClick={openApp}>
              Explore the phrasebook <ArrowRight />
            </button>
          </article>

          <article className="travel-bento-course" id="course">
            <div className="course-orbit">
              <span className="orbit-score">72%</span>
              <span className="orbit-chip chip-one">
                <Flame /> 6 day streak
              </span>
              <span className="orbit-chip chip-two">
                <Star /> +120 XP
              </span>
            </div>
            <div>
              <small>Guided learning</small>
              <h3>A route you can actually finish.</h3>
              <p>
                Three words, one quick check, one real-life speaking mission.
              </p>
              <button onClick={openApp}>
                See today’s lesson <ChevronRight />
              </button>
            </div>
          </article>

          <article className="travel-bento-situations">
            <div className="bento-title">
              <span className="bento-icon dark">
                <Plane />
              </span>
              <span>
                <small>Choose a situation</small>
                <h3>Learn for where you’re going.</h3>
              </span>
            </div>
            <div className="situation-list">
              {['Essentials', 'Food & cafés', 'Transport', 'Shopping'].map(
                (item, index) => (
                  <button key={item} onClick={openApp}>
                    <span>0{index + 1}</span>
                    {item}
                    <ChevronRight />
                  </button>
                ),
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="travel-places">
        <div className="travel-place-feature">
          <img
            src="/geo-dusk-hero.png"
            alt="Georgia at dusk"
            width="1536"
            height="1024"
            loading="lazy"
          />
          <div>
            <span>Learn locally</span>
            <h2>
              One language.
              <br />
              Thousands of small moments.
            </h2>
            <a href="/learn-georgian">
              Explore Georgian <ArrowRight />
            </a>
          </div>
        </div>
        <div className="travel-place-cards">
          <a href="/learn-georgian-batumi">
            <small>By the Black Sea</small>
            <b>Batumi</b>
            <ArrowRight />
          </a>
          <a href="/learn-georgian-tbilisi">
            <small>In the capital</small>
            <b>Tbilisi</b>
            <ArrowRight />
          </a>
          <a href="/learn-georgian-for-russian-speakers">
            <small>Русский → ქართული</small>
            <b>Start clearly</b>
            <ArrowRight />
          </a>
        </div>
      </section>

      <section className="travel-teacher">
        <div className="teacher-photo-wrap">
          <img
            src="/kristina-beridze-960.avif"
            alt="Kristina Beridze, Georgian teacher"
            width="960"
            height="640"
            loading="lazy"
          />
          <span>
            <Star /> Live lessons from ₾20
          </span>
        </div>
        <div className="travel-teacher-copy">
          <span className="travel-kicker">
            A real teacher when you want one
          </span>
          <h2>Practice with Kristina.</h2>
          <p>
            Personal Georgian lessons for Russian speakers, online or in Batumi.
            Bring the words from GEO into a real conversation.
          </p>
          <div className="teacher-points">
            <span>
              <Check /> Adults and children
            </span>
            <span>
              <Check /> Online or in Batumi
            </span>
            <span>
              <Check /> Georgian and Russian
            </span>
          </div>
          <a
            href="https://www.kristinalanguages.com/"
            target="_blank"
            rel="noreferrer"
          >
            Meet Kristina <ArrowRight />
          </a>
        </div>
      </section>

      <section className="travel-membership" id="membership">
        <header className="travel-section-head">
          <div>
            <span className="travel-kicker">Simple access</span>
            <h2>Start free. Go deeper when ready.</h2>
          </div>
          <p>
            No confusing bundles. Choose the level that matches how you learn.
          </p>
        </header>
        <div className="travel-plan-grid">
          <article>
            <span>01</span>
            <small>Explore</small>
            <h3>Free phrasebook</h3>
            <b>₾0</b>
            <p>50 essential phrases with Georgian audio.</p>
            <button onClick={openApp}>
              Open free <ArrowRight />
            </button>
          </article>
          <article>
            <span>02</span>
            <small>Look up anything</small>
            <h3>Full dictionary</h3>
            <b>₾60</b>
            <p>9,000 searchable words for quick reference.</p>
            <button onClick={openApp}>
              View dictionary <ArrowRight />
            </button>
          </article>
          <article className="featured">
            <span>03</span>
            <small>Most complete</small>
            <h3>Guided learning</h3>
            <b>
              ₾19 <em>/ month</em>
            </b>
            <p>Lessons, review, speaking, streaks, and the full dictionary.</p>
            <button onClick={openApp}>
              Start learning <ArrowRight />
            </button>
          </article>
        </div>
      </section>

      <section className="travel-final">
        <span className="travel-kicker">
          Your first lesson takes five minutes
        </span>
        <h2>Meet Georgia in its own language.</h2>
        <div>
          <button onClick={openApp}>
            Start learning free <ArrowRight />
          </button>
          <a href="/phrasebook">
            <Bookmark /> Browse phrases
          </a>
        </div>
      </section>

      <MarketingFooter locale={locale} />
      <CookieNotice locale={locale} />
    </main>
  );
}
