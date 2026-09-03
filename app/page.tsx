'use client';
/* eslint-disable next/no-img-element */
/* eslint-disable next/no-html-link-for-pages */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { animate, hover, inView, stagger } from 'motion';
import type { User } from '@supabase/supabase-js';
import {
  ArrowLeft, BarChart3, Bookmark, BookOpen, Brain, Bus, CalendarDays,
  Check, CheckCircle2, ChevronRight, Coffee, Compass, Download, Flame,
  Globe2, Heart, Home, LockKeyhole, Menu, Mic2, Plane, Search,
  ShieldCheck, ShieldPlus, ShoppingBag, Sparkles, Star, Trophy, Users, LogIn, LogOut, UserRound,
  Volume2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { CookieNotice } from '@/components/cookie-notice';
import { PublicFooter } from '@/components/public-shell';

type Screen = 'explore' | 'category' | 'saved' | 'premium' | 'daily' | 'lesson' | 'quiz' | 'progress';
type CategoryName = 'Essentials' | 'Food & Cafés' | 'Transport' | 'Shopping' | 'Emergencies' | 'Meeting People';
type Phrase = { id?: string; category_slug?: string; ka: string; tr: string; en: string; ru: string; audio_url?: string | null };

const categories: { name: CategoryName; count: number; icon: typeof Heart; tone: string }[] = [
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
    { ka: 'ერთი ყავა, გთხოვთ', tr: 'erti qava, gtkhovt', en: 'One coffee, please', ru: 'Один кофе, пожалуйста' },
    { ka: 'მენიუ შეიძლება?', tr: 'meniu sheidzleba?', en: 'May I see the menu?', ru: 'Можно меню?' },
    { ka: 'უგემრიელესია', tr: 'ugemrielesia', en: 'It is delicious', ru: 'Это очень вкусно' },
  ],
  Transport: [
    { ka: 'ბათუმამდე, გთხოვთ', tr: 'batumamde, gtkhovt', en: 'To Batumi, please', ru: 'До Батуми, пожалуйста' },
    { ka: 'რა ღირს ბილეთი?', tr: 'ra ghirs bileti?', en: 'How much is the ticket?', ru: 'Сколько стоит билет?' },
    { ka: 'აქ გააჩერეთ', tr: 'ak gaacheret', en: 'Stop here', ru: 'Остановите здесь' },
  ],
  Shopping: [
    { ka: 'რა ღირს?', tr: 'ra ghirs?', en: 'How much is it?', ru: 'Сколько это стоит?' },
    { ka: 'ბარათით შეიძლება?', tr: 'baratit sheidzleba?', en: 'Can I pay by card?', ru: 'Можно оплатить картой?' },
  ],
  Emergencies: [
    { ka: 'დამეხმარეთ!', tr: 'damekhmaret!', en: 'Help me!', ru: 'Помогите!' },
    { ka: 'ექიმი მჭირდება', tr: 'ekimi mchirdeba', en: 'I need a doctor', ru: 'Мне нужен врач' },
  ],
  'Meeting People': [
    { ka: 'რა გქვიათ?', tr: 'ra gkviat?', en: 'What is your name?', ru: 'Как вас зовут?' },
    { ka: 'სასიამოვნოა', tr: 'sasiamovnoa', en: 'Nice to meet you', ru: 'Приятно познакомиться' },
  ],
};

function Brand() {
  return <button className="brand" onClick={() => location.reload()} aria-label="GEO home">GEO<span>.</span></button>;
}

function AudioButton({ id, playing, onPlay, large = false }: { id: string; playing: string | null; onPlay: (id: string) => void; large?: boolean }) {
  const active = playing === id;
  return <button className={`audio-button ${large ? 'audio-large' : ''} ${active ? 'is-playing' : ''}`} onClick={() => onPlay(id)} aria-label="Play pronunciation">{active ? <span className="sound-bars"><i /><i /><i /></span> : <Volume2 />}</button>;
}

function Marketing({ openApp }: { openApp: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => setShowInstall(window.scrollY > Math.min(620, window.innerHeight * .65));
    onScroll(); window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const surface = document.querySelector<HTMLElement>('.marketing');
    if (!surface) return;
    const intro = animate('.hero-copy > *', { opacity: [0, 1], y: [24, 0] }, { duration: .7, delay: stagger(.09), ease: [.22, 1, .36, 1] });
    const phones = animate('.phone-front', { y: [0, -13, 0], rotate: [7, 5.5, 7] }, { duration: 6, repeat: Infinity, ease: 'easeInOut' });
    const backPhone = animate('.phone-back', { y: [0, 9, 0], rotate: [-3, -4.5, -3] }, { duration: 7.2, repeat: Infinity, ease: 'easeInOut' });
    const stopReveal = inView('.audience-section, .demo-pricing, .learning-story, .how-section, .pricing-section, .trust-section, .faq-section, .final-cta', (element) => {
      animate(element, { opacity: [0, 1], y: [38, 0] }, { duration: .75, ease: [.22, 1, .36, 1] });
    }, { amount: .12 });
    const stopHover = hover('.audience-grid article, .how-grid article, .pricing-grid.redesigned article, .trust-list span, .category-showcase button', (element) => {
      animate(element, { y: -7, scale: 1.015 }, { type: 'spring', stiffness: 420, damping: 28 });
      return () => { animate(element, { y: 0, scale: 1 }, { type: 'spring', stiffness: 420, damping: 28 }); };
    });
    const trackPointer = (event: PointerEvent) => {
      surface.style.setProperty('--pointer-x', `${event.clientX}px`);
      surface.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', trackPointer, { passive: true });
    return () => { intro.stop(); phones.stop(); backPhone.stop(); stopReveal(); stopHover(); window.removeEventListener('pointermove', trackPointer); };
  }, []);
  const play = (id: string) => { setPlaying(id); window.setTimeout(() => setPlaying(null), 1100); };
  return <main className="marketing">
    <header className="site-header"><Brand /><nav className="desktop-nav" aria-label="Main navigation"><a href="#why">Why GEO</a><a href="#phrases">Phrasebook</a><a href="#learning">Learning</a><a href="#pricing">Pricing</a></nav><div className="header-actions"><span className="beta-label">Public beta</span><button className="open-app-link" onClick={openApp}>Open app <ChevronRight /></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <div className="mobile-menu"><a href="#why" onClick={() => setMenuOpen(false)}>Why GEO</a><a href="#phrases" onClick={() => setMenuOpen(false)}>Phrasebook</a><a href="#learning" onClick={() => setMenuOpen(false)}>Learning</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a><button onClick={openApp}>Open app</button></div>}</header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">ქართული, for the life you’re living</span><h1>Georgia feels closer<br />when you can <span className="shine-word">speak.</span></h1><p>Find the Georgian you need at a café, in a taxi, at the market, or when meeting someone new. Search in four forms, save what matters, and build confidence five minutes at a time.</p><div className="hero-buttons"><Button className="primary-cta shiny-button" onClick={openApp}>Try GEO free <ChevronRight /></Button><a className="secondary-cta" href="#how"><BookOpen /> See how it works</a></div><div className="hero-proof"><span><CheckCircle2 /> No account needed to browse</span><span><ShieldCheck /> Private progress sync</span><span><Globe2 /> Georgian · English · Russian</span></div></div><div className="hero-visual" aria-label="GEO app preview"><img className="skyline" src="/batumi-line.png" alt="Line illustration of the Batumi waterfront" /><span className="geo-cross" aria-hidden="true">+</span><span className="flag-orbit orbit-one" aria-hidden="true" /><span className="flag-orbit orbit-two" aria-hidden="true" /><div className="phone phone-back"><div className="phone-notch" /><div className="mini-status">9:41 <span>•••</span></div><h4>Real-life situations</h4>{categories.slice(0, 5).map(({ name, icon: Icon, tone }) => <div className="mini-category" key={name}><span className={`mini-icon ${tone}`}><Icon /></span><b>{name}</b><ChevronRight /></div>)}</div><div className="phone phone-front"><div className="phone-notch" /><div className="mini-status">9:41 <span>•••</span></div><span className="mini-back">‹ Essentials</span><span className="mini-pill">Say it now</span><div className="mini-phrase"><strong>გამარჯობა</strong><em>gamarjoba</em><p>Hello · Привет</p><AudioButton id="hero-phone" playing={playing} onPlay={play} large /></div></div></div></section>
    <div className="kinetic-strip" aria-label="GEO highlights"><div><span>ქართული</span><i>✦</i><span>Real-life phrases</span><i>✦</i><span>Five-minute learning</span><i>✦</i><span>Made for Georgia</span><i>✦</i><span aria-hidden="true">ქართული</span><i aria-hidden="true">✦</i><span aria-hidden="true">Real-life phrases</span><i aria-hidden="true">✦</i></div></div>
    <section className="audience-section" id="why"><div className="section-kicker">Made for real life</div><h2>Not a textbook. A way into the conversation.</h2><div className="audience-grid"><article><Plane /><span><b>Visiting Georgia</b><p>Handle the moments that happen between landing and feeling at home.</p></span></article><article><Home /><span><b>Starting a life here</b><p>Keep useful words close while routines, places, and faces become familiar.</p></span></article><article><Users /><span><b>Connecting with people</b><p>Meet Georgian effort with effort of your own—even one good phrase matters.</p></span></article></div></section>
    <section className="demo-pricing" id="phrases"><div className="phrase-demo"><span className="section-kicker">Four-way phrasebook</span><h2>Search the way you think.</h2><p className="section-lead">Type Georgian, transliteration, English, or Russian. GEO keeps every form together.</p><div className="demo-card"><div><strong>მადლობა</strong><em>madloba</em><p>Thank you · Спасибо</p></div><AudioButton id="demo" playing={playing} onPlay={play} large /></div><p className="demo-caption"><Mic2 /> Native-reviewed audio is being prepared for launch.</p><a className="text-link" href="/phrasebook">Explore the phrasebook <ChevronRight /></a></div><div className="category-showcase"><span className="section-kicker">Six starting situations</span><h2>From first hello to finding your way.</h2><div>{categories.map(({name,icon:Icon,tone})=><button key={name} onClick={openApp}><span className={`mini-icon ${tone}`}><Icon /></span><b>{name}</b><ChevronRight /></button>)}</div></div></section>
    <section className="learning-story" id="learning"><div><span className="section-kicker light">Guided Learning</span><h2>Five minutes today.<br />A phrase you remember tomorrow.</h2><p>Meet a useful phrase, study the meaning, answer a quick check, and keep your progress synced. Your daily activity and streak use your own timezone.</p><a href="/guided-learning">See the learning method <ChevronRight /></a></div><div className="learning-metrics"><article><Flame /><b>Daily streak</b><span>Build consistency without marathon sessions.</span></article><article><Brain /><b>Practice record</b><span>Track phrases, answers, XP, and review timing.</span></article><article><Bookmark /><b>Saved for later</b><span>Your personal phrasebook follows your account.</span></article></div></section>
    <section className="how-section" id="how"><span className="section-kicker">How GEO works</span><h2>Useful from the first minute.</h2><div className="how-grid"><article><span>01</span><Search /><h3>Find a phrase</h3><p>Search across four written forms or browse the situation you’re in.</p></article><article><span>02</span><Bookmark /><h3>Make it yours</h3><p>Browse as a guest, or sign in to save phrases across devices.</p></article><article><span>03</span><BookOpen /><h3>Practice a little</h3><p>Complete a short lesson and keep your XP, activity, and streak.</p></article></div></section>
    <section className="pricing-section" id="pricing"><div className="pricing-heading"><span className="section-kicker">Simple pricing</span><h2>Start free. Pay only when the full products launch.</h2><p>Checkout is not active yet. These are GEO’s intended launch prices, shown early so there are no surprises.</p></div><div className="pricing-grid redesigned"><article><span className="plan-state live">Available now</span><h3>Free</h3><b>$0</b><p>Starter phrases, four-way search, saved phrases, accounts, and progress sync.</p><Button onClick={openApp}>Start free</Button></article><article><span className="plan-state">Planned</span><h3>Full phrasebook</h3><b>$19.99 <small>once</small></b><p>The complete reviewed library, native audio, and offline downloads.</p><a href="/pricing">See launch details</a></article><article className="popular"><span className="plan-state">Planned</span><h3>Guided Learning</h3><b>$6.99<small>/month</small></b><p>Daily plans, quizzes, smart review, analytics, and a seven-day trial.</p><a href="/pricing">See launch details</a></article></div></section>
    <section className="trust-section"><div><span className="section-kicker">Built with care</span><h2>Your learning belongs to you.</h2><p>Guest browsing stays open. When you sign in, database rules isolate your profile, saves, progress, activity, and streak from every other learner.</p></div><div className="trust-list"><span><ShieldCheck /> Row-level account protection</span><span><CheckCircle2 /> Honest beta feature status</span><span><Globe2 /> Content model ready for EN · RU · KA</span></div></section>
    <section className="faq-section"><span className="section-kicker">Questions, answered</span><h2>Before you begin.</h2><div><details><summary>Do I need an account?</summary><p>No. Browse and search as a guest. Sign in only when you want saved phrases and learning progress on more than one device.</p></details><details><summary>Is GEO fully offline and installable?</summary><p>Not yet. The browser app works now; the full PWA, offline phrase/audio downloads, and platform installation testing are still in development.</p></details><details><summary>Can I buy the paid plans?</summary><p>Not yet. The prices are the intended launch prices. GEO does not currently collect payment details or start trials.</p></details><details><summary>Is every phrase native-reviewed?</summary><p>The production editorial and recording workflow is still being established. The current library is a starter set, not the finished 1,000-phrase catalog.</p></details></div></section>
    <section className="final-cta"><img src="/batumi-line.png" alt="" /><span className="section-kicker light">Start where you are</span><h2>Your next Georgian phrase is one tap away.</h2><p>Open GEO, try a phrase, and make today’s conversation a little easier.</p><Button onClick={openApp}>Open GEO free <ChevronRight /></Button></section>
    <PublicFooter />
    <CookieNotice />
    <div className={`sticky-install ${showInstall ? 'visible' : ''}`}><span className="sticky-logo">GEO</span><div><b>Practical Georgian</b><small>Free in your browser</small></div><Button onClick={openApp}>Open app</Button></div>
  </main>;
}

function AppShell({ exitToSite, openModal, openAuth }: { exitToSite: () => void; openModal: (kind: 'install' | 'pricing') => void; openAuth: () => void }) {
  const [screen, setScreen] = useState<Screen>('explore'); const [category, setCategory] = useState<CategoryName>('Essentials'); const [playing, setPlaying] = useState<string | null>(null); const [saved, setSaved] = useState<string[]>([]); const [search, setSearch] = useState('');
  const [library, setLibrary] = useState<Record<CategoryName, Phrase[]>>(phrases);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [stats, setStats] = useState({ streak: 0, longest: 0, xp: 0, practiced: 0, activity: [] as { activity_date: string; xp_earned: number }[] });
  const supabase = useMemo(() => isSupabaseConfigured ? createClient() : null, []);
  const play = (id: string) => { setPlaying(id); window.setTimeout(() => setPlaying(null), 1100); };
  const phraseKey = (phrase: Phrase) => phrase.id ?? phrase.ka;
  const allPhrases = useMemo(() => Object.values(library).flat(), [library]);
  const filtered = search ? allPhrases.filter(p => `${p.ka} ${p.tr} ${p.en} ${p.ru}`.toLowerCase().includes(search.toLowerCase())) : [];
  const openCategory = (name: CategoryName) => { setCategory(name); setScreen('category'); };
  const learnNav = screen === 'daily' || screen === 'lesson' || screen === 'quiz';
  const basicsPercent = Math.min(100, Math.round((stats.practiced / 50) * 100));
  const weekActivity = useMemo(() => {
    const byDate = new Map(stats.activity.map(day => [day.activity_date, day.xp_earned]));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(); date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return { label: date.toLocaleDateString('en', { weekday: 'narrow' }), xp: byDate.get(key) ?? 0 };
    });
  }, [stats.activity]);

  const loadUserData = useCallback(async (activeUser: User | null) => {
    if (!supabase || !activeUser) {
      setSaved([]); setDisplayName(null); setStats({ streak: 0, longest: 0, xp: 0, practiced: 0, activity: [] }); return;
    }
    const [savedResult, profileResult, streakResult, activityResult, progressResult] = await Promise.all([
      supabase.from('saved_phrases').select('phrase_id'),
      supabase.from('profiles').select('display_name').maybeSingle(),
      supabase.from('streaks').select('current_streak,longest_streak').maybeSingle(),
      supabase.from('daily_activity').select('activity_date,xp_earned').order('activity_date', { ascending: false }).limit(30),
      supabase.from('learning_progress').select('phrase_id'),
    ]);
    setSaved((savedResult.data ?? []).map(item => item.phrase_id));
    setDisplayName(profileResult.data?.display_name ?? null);
    const activity = activityResult.data ?? [];
    setStats({
      streak: streakResult.data?.current_streak ?? 0,
      longest: streakResult.data?.longest_streak ?? 0,
      xp: activity.reduce((sum, day) => sum + day.xp_earned, 0),
      practiced: progressResult.data?.length ?? 0,
      activity,
    });
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.from('phrases').select('id,category_slug,georgian,transliteration,english,russian,audio_url').order('sort_order').then(({ data }) => {
      if (!active || !data?.length) return;
      const next = Object.fromEntries(categories.map(item => [item.name, []])) as unknown as Record<CategoryName, Phrase[]>;
      const namesBySlug: Record<string, CategoryName> = { essentials: 'Essentials', 'food-cafes': 'Food & Cafés', transport: 'Transport', shopping: 'Shopping', emergencies: 'Emergencies', 'meeting-people': 'Meeting People' };
      data.forEach(row => {
        const name = namesBySlug[row.category_slug];
        if (name) next[name].push({ id: row.id, category_slug: row.category_slug, ka: row.georgian, tr: row.transliteration, en: row.english, ru: row.russian, audio_url: row.audio_url });
      });
      setLibrary(next);
    });
    void supabase.auth.getUser().then(({ data }) => { if (active) { setUser(data.user); void loadUserData(data.user); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null); void loadUserData(session?.user ?? null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [supabase, loadUserData]);

  const toggleSaved = async (phrase: Phrase) => {
    const key = phraseKey(phrase);
    if (!supabase || !user || !phrase.id) { openAuth(); return; }
    const wasSaved = saved.includes(key);
    setSaved(items => wasSaved ? items.filter(value => value !== key) : [...items, key]);
    const result = wasSaved
      ? await supabase.from('saved_phrases').delete().eq('user_id', user.id).eq('phrase_id', phrase.id)
      : await supabase.from('saved_phrases').insert({ user_id: user.id, phrase_id: phrase.id });
    if (result.error) setSaved(items => wasSaved ? [...items, key] : items.filter(value => value !== key));
  };

  const completeQuiz = async () => {
    const quizPhrase = allPhrases.find(item => item.ka === 'მადლობა');
    if (!supabase || !user || !quizPhrase?.id) { openAuth(); return; }
    const { error } = await supabase.rpc('record_learning_activity', { p_phrase_id: quizPhrase.id, p_correct: true, p_lesson_completed: true, p_minutes: 5 });
    if (!error) { await loadUserData(user); setScreen('progress'); }
  };
  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown };
    const context = (document as Document & { modelContext?: { registerTool: (tool: Tool, options?: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const categoryNames = categories.map(item => item.name);
    void Promise.resolve(context.registerTool({
      name: 'open_phrase_category', title: 'Open phrase category',
      description: 'Open one of the visible Georgian phrase categories in the app.',
      inputSchema: { type: 'object', properties: { category: { type: 'string', enum: categoryNames } }, required: ['category'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = (input as { category?: unknown })?.category;
        if (typeof value !== 'string' || !categoryNames.includes(value as CategoryName)) throw new Error('Choose a valid phrase category.');
        setCategory(value as CategoryName); setScreen('category');
        return { screen: 'category', category: value };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({
      name: 'start_daily_lesson', title: 'Start daily lesson',
      description: 'Open the visible five-minute Georgian listening lesson.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { setScreen('lesson'); return { screen: 'lesson', lesson: 3, total: 10 }; },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  const renderPhrases = (items: typeof allPhrases) => <div className="phrase-list">{items.map((p, i) => <article className="phrase-card" key={phraseKey(p)}><div><strong>{p.ka}</strong><em>{p.tr}</em><p>{p.en} · {p.ru}</p></div><div className="phrase-actions"><button className={`save-button ${saved.includes(phraseKey(p)) ? 'saved' : ''}`} onClick={() => void toggleSaved(p)} aria-label={saved.includes(phraseKey(p)) ? 'Remove saved phrase' : 'Save phrase'}><Bookmark /></button><AudioButton id={`${p.ka}-${i}`} playing={playing} onPlay={play} /></div></article>)}</div>;
  return <main className="app-view"><aside className="app-sidebar"><Brand /><nav><button className={screen === 'explore' || screen === 'category' ? 'active' : ''} onClick={() => setScreen('explore')}><Compass />Explore</button><button className={learnNav ? 'active' : ''} onClick={() => setScreen('daily')}><BookOpen />Learn</button><button className={screen === 'saved' ? 'active' : ''} onClick={() => setScreen('saved')}><Bookmark />Saved</button><button className={screen === 'progress' ? 'active' : ''} onClick={() => setScreen('progress')}><BarChart3 />Progress</button></nav><button className="sidebar-premium" onClick={() => setScreen('premium')}><Star /><span><b>Guided Learning</b><small>Build a daily habit</small></span><ChevronRight /></button><button className="back-to-site" onClick={exitToSite}><ArrowLeft /> Website</button></aside><div className="app-main"><header className="app-topbar"><Brand /><div className="app-top-actions"><button onClick={exitToSite}>Website</button><button onClick={() => user && supabase ? void supabase.auth.signOut() : openAuth()}>{user ? <LogOut /> : <LogIn />}{user ? (displayName ?? user.email?.split('@')[0] ?? 'Sign out') : 'Sign in'}</button><button onClick={() => setScreen('premium')}><Sparkles /> Premium</button></div></header><div className="app-content">
    {screen === 'explore' && <section className="screen explore-screen"><div className="screen-heading"><div><span className="app-eyebrow">გამარჯობა · gamarjoba</span><h1>Learn Georgian</h1><p>{user ? `Welcome back${displayName ? `, ${displayName}` : ''}.` : 'Start as a guest. Sign in when you want to sync.'}</p></div><button className="streak-chip" onClick={() => setScreen('progress')}><Flame /> {stats.streak} day streak</button></div><label className="search-box"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Georgian, transliteration, English or Russian" /></label>{search ? <><div className="section-title"><h2>Search results</h2><span>{filtered.length} found</span></div>{filtered.length ? renderPhrases(filtered) : <div className="empty-card"><Search /><h3>No phrase found</h3><p>Try “coffee”, “hello” or “ticket”.</p></div>}</> : <><div className="free-progress"><div><b>{stats.practiced} of 50</b> free phrases practiced</div><Progress value={basicsPercent} /></div><div className="section-title"><h2>Browse by situation</h2><span>6 categories</span></div><div className="category-grid">{categories.map(({ name, icon: Icon, tone }) => <button className="category-card" key={name} onClick={() => openCategory(name)}><span className={`category-icon ${tone}`}><Icon /></span><span><b>{name}</b><small>{library[name].length} free phrases</small></span><ChevronRight /></button>)}</div><button className="learning-banner" onClick={() => setScreen('daily')}><img src="/batumi-line.png" alt="" /><span><small>Guided Learning</small><b>Ready for today?</b><em>5 min · 8 words</em></span><span className="banner-action">Start lesson <ChevronRight /></span></button></>}</section>}
    {screen === 'category' && <section className="screen category-screen"><button className="back-button" onClick={() => setScreen('explore')}><ArrowLeft /> All categories</button><div className="screen-heading"><div><span className="app-eyebrow">Practical Georgian</span><h1>{category}</h1><p>{library[category].length} free phrases</p></div></div>{renderPhrases(library[category])}<div className="locked-card"><span className="lock-orb"><LockKeyhole /></span><div><h2>More words & phrases are coming</h2><p>The content model is ready for the complete reviewed phrasebook and audio library.</p></div><Button onClick={() => openModal('pricing')}><LockKeyhole /> View learning plans</Button></div></section>}
    {screen === 'saved' && <section className="screen"><div className="screen-heading"><div><span className="app-eyebrow">Your phrasebook</span><h1>Saved phrases</h1><p>{user ? 'Synced securely across your devices.' : 'Sign in to save and sync phrases.'}</p></div></div>{saved.length ? renderPhrases(allPhrases.filter(p => saved.includes(phraseKey(p)))) : <div className="empty-card"><Bookmark /><h3>No saved phrases yet</h3><p>{user ? 'Tap the bookmark on any phrase to save it here.' : 'Create an account or sign in to keep phrases across devices.'}</p><Button onClick={user ? () => setScreen('explore') : openAuth}>{user ? 'Explore phrases' : 'Sign in to sync'}</Button></div>}</section>}
    {screen === 'premium' && <section className="screen premium-screen"><button className="back-button" onClick={() => setScreen('explore')}><ArrowLeft /> Back</button><div className="premium-hero"><span className="premium-orb"><Star /></span><h1>Go beyond<br />memorizing words</h1><p>Learn Georgian step by step.</p></div><div className="premium-layout"><div className="feature-list"><div><BookOpen /><span><b>1,000+ words & phrases</b><small>A complete practical library</small></span></div><div><CalendarDays /><span><b>Daily 5-minute learning plan</b><small>Small lessons that fit your day</small></span></div><div><Volume2 /><span><b>Pronunciation practice</b><small>Normal and slow listening modes</small></span></div><div><Brain /><span><b>Quizzes and smart review</b><small>Remember what you learn</small></span></div><div><Plane /><span><b>Use it anywhere</b><small>Designed for real life in Georgia</small></span></div></div><div className="premium-price-card"><span>7 days free</span><h2>$6.99 <small>/ month</small></h2><p>Cancel anytime</p><Button onClick={() => openModal('pricing')}>Start 7-day free trial</Button><hr /><button onClick={() => openModal('pricing')}>Only need the phrasebook? <b>$19.99 once</b><ChevronRight /></button></div></div></section>}
    {screen === 'daily' && <section className="screen daily-screen"><div className="daily-heading"><div><span className="app-eyebrow">დღის მშვიდობისა</span><h1>Ready for today?</h1><p>A little Georgian goes a long way.</p></div><span className="day-badge"><Flame /> {stats.streak}</span></div><img className="daily-skyline" src="/batumi-line.png" alt="Batumi skyline illustration" /><button className="daily-lesson-card" onClick={() => user ? setScreen('lesson') : openAuth()}><span className="daily-book"><BookOpen /></span><span><b>5 min · 8 words</b><small>{user ? 'Daily lesson' : 'Sign in to track progress'}</small></span><span className="start-lesson">{user ? 'Start lesson' : 'Sign in'} <ChevronRight /></span></button><div className="streak-card"><h3><Flame /> {stats.streak} day streak</h3><div className="week-row">{weekActivity.map((day,i) => <span key={`${day.label}-${i}`}><small>{day.label}</small><i className={day.xp > 0 ? 'done' : ''}>{day.xp > 0 ? <Check /> : null}</i></span>)}</div></div><button className="basics-progress" onClick={() => setScreen('progress')}><span className="progress-ring">{basicsPercent}%</span><span><b>Georgian basics</b><small>{stats.practiced ? 'Keep it up!' : 'Practice your first phrase'}</small><Progress value={basicsPercent} /></span><ChevronRight /></button></section>}
    {screen === 'lesson' && <section className="screen lesson-screen"><div className="lesson-top"><button onClick={() => setScreen('daily')}><ArrowLeft /></button><span>Lesson 3 of 10</span><b>250 XP</b></div><Progress value={34} /><div className="lesson-card"><span className="lesson-tag">Essentials</span><strong>გამარჯობა</strong><em>gamarjoba</em><p>Hello · Привет</p><div className="wave-row"><i /><i /><i /><AudioButton id="lesson" playing={playing} onPlay={play} large /><i /><i /><i /></div><div className="speed-row"><button>0.7×<small>Slow</small></button><button className="selected">1×<small>Normal</small></button></div></div><Button className="lesson-continue" onClick={() => setScreen('quiz')}>I know this <ChevronRight /></Button></section>}
    {screen === 'quiz' && <section className="screen quiz-screen"><div className="lesson-top"><button onClick={() => setScreen('lesson')}><X /></button><span>Quick check</span><b>{stats.xp} XP</b></div><Progress value={60} /><div className="quiz-panel"><span className="app-eyebrow">Choose the meaning</span><h1>What does this mean?</h1><strong>მადლობა</strong><div className="answers"><button>Hello</button><button className="correct">Thank you <CheckCircle2 /></button><button>Goodbye</button></div><p className="correct-note"><CheckCircle2 /> Correct! <b>+10 XP</b></p><Button onClick={() => void completeQuiz()}>Save progress <ChevronRight /></Button></div></section>}
    {screen === 'progress' && <section className="screen progress-screen"><div className="screen-heading"><div><span className="app-eyebrow">Your learning journey</span><h1>Progress & streak</h1><p>{user ? 'Your learning record is synced securely.' : 'Sign in to track progress across devices.'}</p></div><span className="xp-badge"><Trophy /> {stats.xp} XP</span></div><div className="stats-grid"><article><Flame /><b>{stats.streak}</b><span>day streak</span></article><article><BookOpen /><b>{basicsPercent}%</b><span>basics complete</span></article><article><Volume2 /><b>{stats.practiced}</b><span>phrases practiced</span></article></div><div className="progress-panel"><h2>Last 7 days</h2><div className="chart-bars">{weekActivity.map((day,i) => <span key={i}><i style={{height:`${Math.max(6, Math.min(100, day.xp))}%`}} /><small>{day.label}</small></span>)}</div></div>{user ? <div className="achievement-card"><span><Star /></span><div><b>Longest streak: {stats.longest} days</b><p>Keep practicing to build a lasting habit.</p></div><CheckCircle2 /></div> : <div className="empty-card"><UserRound /><h3>Keep your learning history</h3><p>Sign in to sync XP, streaks, saved phrases and reviews.</p><Button onClick={openAuth}>Sign in or create account</Button></div>}</section>}
  </div><nav className="bottom-nav" aria-label="App navigation"><button className={screen === 'explore' || screen === 'category' ? 'active' : ''} onClick={() => setScreen('explore')}><Home /><span>Home</span></button><button className={learnNav ? 'active' : ''} onClick={() => setScreen('daily')}><BookOpen /><span>Learn</span></button><button className={screen === 'saved' ? 'active' : ''} onClick={() => setScreen('saved')}><Bookmark /><span>Saved</span></button><button className={screen === 'progress' ? 'active' : ''} onClick={() => setScreen('progress')}><BarChart3 /><span>Progress</span></button></nav></div></main>;
}

function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState('');
  const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); setStatus('');
    if (!isSupabaseConfigured) { setStatus('Add the project publishable key to enable account access.'); return; }
    setBusy(true);
    const client = createClient();
    const result = mode === 'signin'
      ? await client.auth.signInWithPassword({ email, password })
      : await client.auth.signUp({ email, password, options: { data: { display_name: name.trim() || undefined } } });
    setBusy(false);
    if (result.error) { setStatus(result.error.message); return; }
    if (result.data.session) { onOpenChange(false); setStatus(''); return; }
    setStatus('Check your email to confirm your account, then sign in.');
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="auth-dialog"><DialogHeader><span className="dialog-icon"><UserRound /></span><DialogTitle>{mode === 'signin' ? 'Sign in to GEO' : 'Create your GEO account'}</DialogTitle><DialogDescription>Sync saved phrases, lessons, XP and streaks securely across your devices.</DialogDescription></DialogHeader><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Display name<input value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={80} /></label>}<label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required /></label>{status && <output className="auth-status">{status}</output>}<Button type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Button></form><button className="auth-switch" onClick={() => { setMode(value => value === 'signin' ? 'signup' : 'signin'); setStatus(''); }}>{mode === 'signin' ? 'New to GEO? Create an account' : 'Already have an account? Sign in'}</button></DialogContent></Dialog>;
}

export default function HomePage() {
  const [mode, setMode] = useState<'marketing' | 'app'>('marketing'); const [modal, setModal] = useState<'install' | 'pricing' | null>(null); const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => { if (window.matchMedia('(display-mode: standalone)').matches || location.hash === '#app') window.setTimeout(() => setMode('app'), 0); }, []);
  const openApp = () => { setMode('app'); history.replaceState(null, '', '#app'); window.scrollTo(0,0); };
  const exitToSite = () => { setMode('marketing'); history.replaceState(null, '', location.pathname); window.scrollTo(0,0); };
  return <>{mode === 'marketing' ? <Marketing openApp={openApp} /> : <AppShell exitToSite={exitToSite} openModal={setModal} openAuth={() => setAuthOpen(true)} />}<Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}><DialogContent className="mock-dialog"><DialogHeader><span className="dialog-icon">{modal === 'install' ? <Download /> : <Star />}</span><DialogTitle>{modal === 'install' ? 'Add GEO to your home screen' : 'Choose how you want to learn'}</DialogTitle><DialogDescription>{modal === 'install' ? 'In your browser menu, choose “Add to Home Screen”. This frontend demo does not install a service worker.' : 'Checkout is not enabled yet, so no payment will be processed.'}</DialogDescription></DialogHeader>{modal === 'pricing' && <div className="modal-plans"><button><span><b>Full phrasebook</b><small>Lifetime access</small></span><strong>$19.99</strong></button><button className="recommended"><span><b>Guided Learning</b><small>7 days free</small></span><strong>$6.99/mo</strong></button></div>}<Button className="dialog-done" onClick={() => setModal(null)}>{modal === 'install' ? 'Got it' : 'Continue preview'}</Button></DialogContent></Dialog><AuthDialog open={authOpen} onOpenChange={setAuthOpen} /></>;
}
