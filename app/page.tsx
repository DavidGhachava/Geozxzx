'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BarChart3, Bookmark, BookOpen, Brain, Bus, CalendarDays,
  Check, CheckCircle2, ChevronRight, Coffee, Compass, Download, Flame,
  Globe2, Heart, Home, LockKeyhole, Menu, Mic2, Plane, Search,
  ShieldCheck, ShieldPlus, ShoppingBag, Sparkles, Star, Trophy, Users,
  Volume2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

type Screen = 'explore' | 'category' | 'saved' | 'premium' | 'daily' | 'lesson' | 'quiz' | 'progress';
type CategoryName = 'Essentials' | 'Food & Cafés' | 'Transport' | 'Shopping' | 'Emergencies' | 'Meeting People';

const categories: { name: CategoryName; count: number; icon: typeof Heart; tone: string }[] = [
  { name: 'Essentials', count: 12, icon: Heart, tone: 'wine' },
  { name: 'Food & Cafés', count: 10, icon: Coffee, tone: 'coral' },
  { name: 'Transport', count: 8, icon: Bus, tone: 'sage' },
  { name: 'Shopping', count: 8, icon: ShoppingBag, tone: 'gold' },
  { name: 'Emergencies', count: 6, icon: ShieldPlus, tone: 'red' },
  { name: 'Meeting People', count: 6, icon: Users, tone: 'green' },
];

const phrases: Record<CategoryName, { ka: string; tr: string; en: string; ru: string }[]> = {
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

function Marketing({ openApp, openModal }: { openApp: () => void; openModal: (kind: 'install' | 'pricing') => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => setShowInstall(window.scrollY > Math.min(620, window.innerHeight * .65));
    onScroll(); window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const play = (id: string) => { setPlaying(id); window.setTimeout(() => setPlaying(null), 1100); };
  return <main className="marketing">
    <header className="site-header"><Brand /><nav className="desktop-nav" aria-label="Main navigation"><a href="#phrases">Phrases</a><a href="#how">How it works</a><a href="#pricing">Premium</a></nav><div className="header-actions"><button className="lang-button">EN <ChevronRight /></button><span className="nav-rule" /><button className="open-app-link" onClick={openApp}>Open app</button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <div className="mobile-menu"><a href="#phrases" onClick={() => setMenuOpen(false)}>Phrases</a><a href="#how" onClick={() => setMenuOpen(false)}>How it works</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Premium</a><button onClick={openApp}>Open app</button></div>}</header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">Georgian for everyday life</span><h1>Speak Georgian<br />in real life.</h1><p>Essential words, native pronunciation and simple daily lessons—made for life in Georgia.</p><div className="hero-buttons"><Button className="primary-cta" onClick={openApp}>Start free <ChevronRight /></Button><Button className="secondary-cta" variant="outline" onClick={() => openModal('install')}><Download /> Install app</Button></div><div className="offline-note"><ShieldCheck /> No App Store needed · Works offline</div></div><div className="hero-visual" aria-label="GEO app preview"><img className="skyline" src="/batumi-line.png" alt="Line illustration of the Batumi waterfront" /><div className="phone phone-back"><div className="phone-notch" /><div className="mini-status">9:41 <span>•••</span></div><h4>Categories</h4>{categories.slice(0, 5).map(({ name, icon: Icon, tone }) => <div className="mini-category" key={name}><span className={`mini-icon ${tone}`}><Icon /></span><b>{name}</b><ChevronRight /></div>)}</div><div className="phone phone-front"><div className="phone-notch" /><div className="mini-status">9:41 <span>•••</span></div><span className="mini-back">‹ Back</span><span className="mini-pill">Essentials</span><div className="mini-phrase"><strong>გამარჯობა</strong><em>gamarjoba</em><p>Hello · Привет</p><AudioButton id="hero-phone" playing={playing} onPlay={play} large /></div></div></div></section>
    <section className="demo-pricing" id="phrases"><div className="phrase-demo"><h2>Try your first phrase</h2><div className="demo-card"><div><strong>მადლობა</strong><em>madloba</em><p>Thank you · Спасибо</p></div><AudioButton id="demo" playing={playing} onPlay={play} large /></div><p className="demo-caption"><Mic2 /> Recorded by a native Georgian speaker.</p></div><div className="pricing-preview" id="pricing"><h2>Start free. Upgrade when you’re ready.</h2><div className="pricing-grid"><article><h3>Free</h3><p>50 essential<br />phrases</p><Button onClick={openApp}>Start free</Button></article><article><h3>Full phrasebook</h3><b>$19.99 <small>once</small></b><p>1,000+ words, audio<br />and offline access</p><Button variant="outline" onClick={() => openModal('pricing')}>Unlock forever</Button></article><article className="popular"><span>Most popular</span><h3>Guided learning</h3><b>$6.99<small>/month</small></b><p>Daily plan, quizzes<br />and smart review</p><Button onClick={() => openModal('pricing')}>Try 7 days free</Button></article></div></div></section>
    <section className="benefits" aria-label="Benefits"><article><Search /><div><h3>Find words instantly</h3><p>Search and save useful phrases right when you need them.</p></div></article><article><Volume2 /><div><h3>Listen and repeat</h3><p>Native-style pronunciation controls help you speak confidently.</p></div></article><article><Plane /><div><h3>Use it anywhere</h3><p>A practical phrasebook designed for everyday life in Georgia.</p></div></article></section>
    <section className="install-steps" id="how"><div><span>1</span><Globe2 /><b>Open website</b></div><ChevronRight /><div><span>2</span><Download /><b>Tap Install</b></div><ChevronRight /><div><span>3</span><BookOpen /><b>Learn anywhere</b></div></section>
    <footer><Brand /><p>Useful Georgian, one real-life phrase at a time.</p><button onClick={openApp}>Open phrasebook <ChevronRight /></button></footer>
    <div className={`sticky-install ${showInstall ? 'visible' : ''}`}><span className="sticky-logo">GEO</span><div><b>GEO · Learn anywhere</b><small>No App Store needed</small></div><Button onClick={() => openModal('install')}>Install</Button></div>
  </main>;
}

function AppShell({ exitToSite, openModal }: { exitToSite: () => void; openModal: (kind: 'install' | 'pricing') => void }) {
  const [screen, setScreen] = useState<Screen>('explore'); const [category, setCategory] = useState<CategoryName>('Essentials'); const [playing, setPlaying] = useState<string | null>(null); const [saved, setSaved] = useState<string[]>(['მადლობა']); const [search, setSearch] = useState('');
  const play = (id: string) => { setPlaying(id); window.setTimeout(() => setPlaying(null), 1100); };
  const toggleSaved = (ka: string) => setSaved(x => x.includes(ka) ? x.filter(v => v !== ka) : [...x, ka]);
  const allPhrases = useMemo(() => Object.values(phrases).flat(), []);
  const filtered = search ? allPhrases.filter(p => `${p.ka} ${p.tr} ${p.en} ${p.ru}`.toLowerCase().includes(search.toLowerCase())) : [];
  const openCategory = (name: CategoryName) => { setCategory(name); setScreen('category'); };
  const learnNav = screen === 'daily' || screen === 'lesson' || screen === 'quiz';
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
  const renderPhrases = (items: typeof allPhrases) => <div className="phrase-list">{items.map((p, i) => <article className="phrase-card" key={`${p.ka}-${i}`}><div><strong>{p.ka}</strong><em>{p.tr}</em><p>{p.en} · {p.ru}</p></div><div className="phrase-actions"><button className={`save-button ${saved.includes(p.ka) ? 'saved' : ''}`} onClick={() => toggleSaved(p.ka)} aria-label="Save phrase"><Bookmark /></button><AudioButton id={`${p.ka}-${i}`} playing={playing} onPlay={play} /></div></article>)}</div>;
  return <main className="app-view"><aside className="app-sidebar"><Brand /><nav><button className={screen === 'explore' || screen === 'category' ? 'active' : ''} onClick={() => setScreen('explore')}><Compass />Explore</button><button className={learnNav ? 'active' : ''} onClick={() => setScreen('daily')}><BookOpen />Learn</button><button className={screen === 'saved' ? 'active' : ''} onClick={() => setScreen('saved')}><Bookmark />Saved</button><button className={screen === 'progress' ? 'active' : ''} onClick={() => setScreen('progress')}><BarChart3 />Progress</button></nav><button className="sidebar-premium" onClick={() => setScreen('premium')}><Star /><span><b>Guided Learning</b><small>Build a daily habit</small></span><ChevronRight /></button><button className="back-to-site" onClick={exitToSite}><ArrowLeft /> Website</button></aside><div className="app-main"><header className="app-topbar"><Brand /><div className="app-top-actions"><button onClick={exitToSite}>Website</button><button onClick={() => setScreen('premium')}><Sparkles /> Premium</button></div></header><div className="app-content">
    {screen === 'explore' && <section className="screen explore-screen"><div className="screen-heading"><div><span className="app-eyebrow">გამარჯობა · gamarjoba</span><h1>Learn Georgian</h1><p>Speak confidently in Batumi.</p></div><button className="streak-chip" onClick={() => setScreen('progress')}><Flame /> 6 day streak</button></div><label className="search-box"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search words or phrases" /></label>{search ? <><div className="section-title"><h2>Search results</h2><span>{filtered.length} found</span></div>{filtered.length ? renderPhrases(filtered) : <div className="empty-card"><Search /><h3>No phrase found</h3><p>Try “coffee”, “hello” or “ticket”.</p></div>}</> : <><div className="free-progress"><div><b>12 of 50</b> free phrases explored</div><Progress value={24} /></div><div className="section-title"><h2>Browse by situation</h2><span>6 categories</span></div><div className="category-grid">{categories.map(({ name, count, icon: Icon, tone }) => <button className="category-card" key={name} onClick={() => openCategory(name)}><span className={`category-icon ${tone}`}><Icon /></span><span><b>{name}</b><small>{count} free phrases</small></span><ChevronRight /></button>)}</div><button className="learning-banner" onClick={() => setScreen('daily')}><img src="/batumi-line.png" alt="" /><span><small>Guided Learning</small><b>Ready for today?</b><em>5 min · 8 words</em></span><span className="banner-action">Start lesson <ChevronRight /></span></button></>}</section>}
    {screen === 'category' && <section className="screen category-screen"><button className="back-button" onClick={() => setScreen('explore')}><ArrowLeft /> All categories</button><div className="screen-heading"><div><span className="app-eyebrow">Practical Georgian</span><h1>{category}</h1><p>{phrases[category].length} free phrases</p></div></div>{renderPhrases(phrases[category])}<div className="locked-card"><span className="lock-orb"><LockKeyhole /></span><div><h2>938 more words & phrases</h2><p>Unlock the complete phrasebook for every situation in Georgia.</p></div><Button onClick={() => openModal('pricing')}><LockKeyhole /> Unlock full library · $19.99</Button></div></section>}
    {screen === 'saved' && <section className="screen"><div className="screen-heading"><div><span className="app-eyebrow">Your phrasebook</span><h1>Saved phrases</h1><p>Keep the words you want close at hand.</p></div></div>{saved.length ? renderPhrases(allPhrases.filter(p => saved.includes(p.ka))) : <div className="empty-card"><Bookmark /><h3>No saved phrases yet</h3><p>Tap the bookmark on any phrase to save it here.</p><Button onClick={() => setScreen('explore')}>Explore phrases</Button></div>}</section>}
    {screen === 'premium' && <section className="screen premium-screen"><button className="back-button" onClick={() => setScreen('explore')}><ArrowLeft /> Back</button><div className="premium-hero"><span className="premium-orb"><Star /></span><h1>Go beyond<br />memorizing words</h1><p>Learn Georgian step by step.</p></div><div className="premium-layout"><div className="feature-list"><div><BookOpen /><span><b>1,000+ words & phrases</b><small>A complete practical library</small></span></div><div><CalendarDays /><span><b>Daily 5-minute learning plan</b><small>Small lessons that fit your day</small></span></div><div><Volume2 /><span><b>Pronunciation practice</b><small>Normal and slow listening modes</small></span></div><div><Brain /><span><b>Quizzes and smart review</b><small>Remember what you learn</small></span></div><div><Plane /><span><b>Use it anywhere</b><small>Designed for real life in Georgia</small></span></div></div><div className="premium-price-card"><span>7 days free</span><h2>$6.99 <small>/ month</small></h2><p>Cancel anytime</p><Button onClick={() => openModal('pricing')}>Start 7-day free trial</Button><hr /><button onClick={() => openModal('pricing')}>Only need the phrasebook? <b>$19.99 once</b><ChevronRight /></button></div></div></section>}
    {screen === 'daily' && <section className="screen daily-screen"><div className="daily-heading"><div><span className="app-eyebrow">დღის მშვიდობისა</span><h1>Ready for today?</h1><p>A little Georgian goes a long way.</p></div><span className="day-badge"><Flame /> 6</span></div><img className="daily-skyline" src="/batumi-line.png" alt="Batumi skyline illustration" /><button className="daily-lesson-card" onClick={() => setScreen('lesson')}><span className="daily-book"><BookOpen /></span><span><b>5 min · 8 words</b><small>Daily lesson</small></span><span className="start-lesson">Start lesson <ChevronRight /></span></button><div className="streak-card"><h3><Flame /> 6 day streak</h3><div className="week-row">{['M','T','W','T','F','S','S'].map((d,i) => <span key={`${d}-${i}`}><small>{d}</small><i className={i < 6 ? 'done' : ''}>{i < 6 ? <Check /> : null}</i></span>)}</div></div><button className="basics-progress" onClick={() => setScreen('progress')}><span className="progress-ring">42%</span><span><b>Georgian basics</b><small>Keep it up!</small><Progress value={42} /></span><ChevronRight /></button></section>}
    {screen === 'lesson' && <section className="screen lesson-screen"><div className="lesson-top"><button onClick={() => setScreen('daily')}><ArrowLeft /></button><span>Lesson 3 of 10</span><b>250 XP</b></div><Progress value={34} /><div className="lesson-card"><span className="lesson-tag">Essentials</span><strong>გამარჯობა</strong><em>gamarjoba</em><p>Hello · Привет</p><div className="wave-row"><i /><i /><i /><AudioButton id="lesson" playing={playing} onPlay={play} large /><i /><i /><i /></div><div className="speed-row"><button>0.7×<small>Slow</small></button><button className="selected">1×<small>Normal</small></button></div></div><Button className="lesson-continue" onClick={() => setScreen('quiz')}>I know this <ChevronRight /></Button></section>}
    {screen === 'quiz' && <section className="screen quiz-screen"><div className="lesson-top"><button onClick={() => setScreen('lesson')}><X /></button><span>Quick check</span><b>250 XP</b></div><Progress value={60} /><div className="quiz-panel"><span className="app-eyebrow">Choose the meaning</span><h1>What does this mean?</h1><strong>მადლობა</strong><div className="answers"><button>Hello</button><button className="correct">Thank you <CheckCircle2 /></button><button>Goodbye</button></div><p className="correct-note"><CheckCircle2 /> Correct! <b>+10 XP</b></p><Button onClick={() => setScreen('progress')}>Continue <ChevronRight /></Button></div></section>}
    {screen === 'progress' && <section className="screen progress-screen"><div className="screen-heading"><div><span className="app-eyebrow">Your learning journey</span><h1>Progress & streak</h1><p>Every phrase brings Georgia a little closer.</p></div><span className="xp-badge"><Trophy /> 260 XP</span></div><div className="stats-grid"><article><Flame /><b>6</b><span>day streak</span></article><article><BookOpen /><b>42%</b><span>basics complete</span></article><article><Volume2 /><b>38</b><span>phrases practiced</span></article></div><div className="progress-panel"><h2>This week</h2><div className="chart-bars">{[45,70,55,92,68,86,28].map((h,i) => <span key={i}><i style={{height:`${h}%`}} /><small>{['M','T','W','T','F','S','S'][i]}</small></span>)}</div></div><div className="achievement-card"><span><Star /></span><div><b>Explorer</b><p>You practiced in three different categories.</p></div><CheckCircle2 /></div></section>}
  </div><nav className="bottom-nav" aria-label="App navigation"><button className={screen === 'explore' || screen === 'category' ? 'active' : ''} onClick={() => setScreen('explore')}><Home /><span>Home</span></button><button className={learnNav ? 'active' : ''} onClick={() => setScreen('daily')}><BookOpen /><span>Learn</span></button><button className={screen === 'saved' ? 'active' : ''} onClick={() => setScreen('saved')}><Bookmark /><span>Saved</span></button><button className={screen === 'progress' ? 'active' : ''} onClick={() => setScreen('progress')}><BarChart3 /><span>Progress</span></button></nav></div></main>;
}

export default function HomePage() {
  const [mode, setMode] = useState<'marketing' | 'app'>('marketing'); const [modal, setModal] = useState<'install' | 'pricing' | null>(null);
  useEffect(() => { if (window.matchMedia('(display-mode: standalone)').matches || location.hash === '#app') setMode('app'); }, []);
  const openApp = () => { setMode('app'); history.replaceState(null, '', '#app'); window.scrollTo(0,0); };
  const exitToSite = () => { setMode('marketing'); history.replaceState(null, '', location.pathname); window.scrollTo(0,0); };
  return <>{mode === 'marketing' ? <Marketing openApp={openApp} openModal={setModal} /> : <AppShell exitToSite={exitToSite} openModal={setModal} />}<Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}><DialogContent className="mock-dialog"><DialogHeader><span className="dialog-icon">{modal === 'install' ? <Download /> : <Star />}</span><DialogTitle>{modal === 'install' ? 'Add GEO to your home screen' : 'Choose how you want to learn'}</DialogTitle><DialogDescription>{modal === 'install' ? 'In your browser menu, choose “Add to Home Screen”. This frontend demo does not install a service worker.' : 'This is a frontend preview. No payment will be processed.'}</DialogDescription></DialogHeader>{modal === 'pricing' && <div className="modal-plans"><button><span><b>Full phrasebook</b><small>Lifetime access</small></span><strong>$19.99</strong></button><button className="recommended"><span><b>Guided Learning</b><small>7 days free</small></span><strong>$6.99/mo</strong></button></div>}<Button className="dialog-done" onClick={() => setModal(null)}>{modal === 'install' ? 'Got it' : 'Continue preview'}</Button></DialogContent></Dialog></>;
}
