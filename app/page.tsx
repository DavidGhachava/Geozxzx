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
  Star,
  Trophy,
  Users,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  CreditCard,
  Settings,
  Trash2,
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
import { MarketingFooter } from '@/components/marketing-footer';
import {
  LanguageMenu,
  type InterfaceLocale as Locale,
} from '@/components/language-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  | 'progress'
  | 'settings';
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

function phraseMeaning(phrase: Phrase, locale: Locale) {
  return locale === 'ru' ? phrase.ru : phrase.en;
}

const categories: {
  name: CategoryName;
  count: number;
  icon: typeof Heart;
  tone: string;
}[] = [
  { name: 'Essentials', count: 14, icon: Heart, tone: 'wine' },
  { name: 'Food & Cafés', count: 9, icon: Coffee, tone: 'coral' },
  { name: 'Transport', count: 9, icon: Bus, tone: 'sage' },
  { name: 'Shopping', count: 7, icon: ShoppingBag, tone: 'gold' },
  { name: 'Emergencies', count: 6, icon: ShieldPlus, tone: 'red' },
  { name: 'Meeting People', count: 5, icon: Users, tone: 'green' },
];

const phrases: Record<CategoryName, Phrase[]> = {
  Essentials: [
    { ka: 'გამარჯობა', tr: 'gamarjoba', en: 'Hello', ru: 'Привет' },
    { ka: 'მადლობა', tr: 'madloba', en: 'Thank you', ru: 'Спасибо' },
    { ka: 'ნახვამდის', tr: 'nakhvamdis', en: 'Goodbye', ru: 'До свидания' },
    { ka: 'გთხოვთ', tr: 'gtkhovt', en: 'Please', ru: 'Пожалуйста' },
    { ka: 'დიახ', tr: 'diakh', en: 'Yes', ru: 'Да' },
    { ka: 'არა', tr: 'ara', en: 'No', ru: 'Нет' },
    { ka: 'ბოდიში', tr: 'bodishi', en: 'Excuse me / Sorry', ru: 'Извините' },
    {
      ka: 'დილა მშვიდობისა',
      tr: 'dila mshvidobisa',
      en: 'Good morning',
      ru: 'Доброе утро',
    },
    {
      ka: 'საღამო მშვიდობისა',
      tr: 'saghamo mshvidobisa',
      en: 'Good evening',
      ru: 'Добрый вечер',
    },
    {
      ka: 'არ მესმის',
      tr: 'ar mesmis',
      en: 'I do not understand',
      ru: 'Я не понимаю',
    },
    {
      ka: 'ინგლისურად საუბრობთ?',
      tr: 'inglisurad saubrobt?',
      en: 'Do you speak English?',
      ru: 'Вы говорите по-английски?',
    },
    {
      ka: 'რუსულად საუბრობთ?',
      tr: 'rusulad saubrobt?',
      en: 'Do you speak Russian?',
      ru: 'Вы говорите по-русски?',
    },
    {
      ka: 'შეგიძლიათ გაიმეოროთ?',
      tr: 'shegidzliat gaimeorot?',
      en: 'Can you repeat?',
      ru: 'Можете повторить?',
    },
    {
      ka: 'უფრო ნელა, გთხოვთ',
      tr: 'upro nela, gtkhovt',
      en: 'More slowly, please',
      ru: 'Помедленнее, пожалуйста',
    },
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
    {
      ka: 'წყალი, გთხოვთ',
      tr: 'tsqali, gtkhovt',
      en: 'Water, please',
      ru: 'Воду, пожалуйста',
    },
    {
      ka: 'ანგარიში, გთხოვთ',
      tr: 'angarishi, gtkhovt',
      en: 'The bill, please',
      ru: 'Счёт, пожалуйста',
    },
    {
      ka: 'ვეგეტარიანული კერძი გაქვთ?',
      tr: 'vegetarianuli kerzi gakvt?',
      en: 'Do you have a vegetarian dish?',
      ru: 'У вас есть вегетарианское блюдо?',
    },
    {
      ka: 'უშაქროდ, გთხოვთ',
      tr: 'ushakrod, gtkhovt',
      en: 'Without sugar, please',
      ru: 'Без сахара, пожалуйста',
    },
    {
      ka: 'ალერგია მაქვს',
      tr: 'alergia makvs',
      en: 'I have an allergy',
      ru: 'У меня аллергия',
    },
    {
      ka: 'ცხარე არ მინდა',
      tr: 'tskhare ar minda',
      en: 'I do not want it spicy',
      ru: 'Я не хочу острое',
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
    {
      ka: 'ავტობუსის გაჩერება სად არის?',
      tr: 'avtobusis gachereba sad aris?',
      en: 'Where is the bus stop?',
      ru: 'Где автобусная остановка?',
    },
    {
      ka: 'სადგური სად არის?',
      tr: 'sadguri sad aris?',
      en: 'Where is the station?',
      ru: 'Где вокзал?',
    },
    {
      ka: 'აეროპორტში, გთხოვთ',
      tr: 'aeroportshi, gtkhovt',
      en: 'To the airport, please',
      ru: 'В аэропорт, пожалуйста',
    },
    {
      ka: 'როდის გადის?',
      tr: 'rodis gadis?',
      en: 'When does it leave?',
      ru: 'Когда отправляется?',
    },
    {
      ka: 'ეს ავტობუსი ცენტრში მიდის?',
      tr: 'es avtobusi tsentrshi midis?',
      en: 'Does this bus go to the center?',
      ru: 'Этот автобус идёт в центр?',
    },
    {
      ka: 'მარჯვნივ თუ მარცხნივ?',
      tr: 'marjvniv tu martskhniv?',
      en: 'Right or left?',
      ru: 'Направо или налево?',
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
    { ka: 'ეს მინდა', tr: 'es minda', en: 'I want this', ru: 'Я хочу это' },
    {
      ka: 'სხვა ზომა გაქვთ?',
      tr: 'skhva zoma gakvt?',
      en: 'Do you have another size?',
      ru: 'У вас есть другой размер?',
    },
    {
      ka: 'ნაღდი ფულით შეიძლება?',
      tr: 'naghdi pulit sheidzleba?',
      en: 'Can I pay in cash?',
      ru: 'Можно наличными?',
    },
    {
      ka: 'ქვითარი, გთხოვთ',
      tr: 'kvitari, gtkhovt',
      en: 'A receipt, please',
      ru: 'Чек, пожалуйста',
    },
    {
      ka: 'ძალიან ძვირია',
      tr: 'dzalian dzviria',
      en: 'It is very expensive',
      ru: 'Это очень дорого',
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
    {
      ka: 'პოლიცია გამოიძახეთ',
      tr: 'politsia gamoidzakhet',
      en: 'Call the police',
      ru: 'Вызовите полицию',
    },
    {
      ka: 'სასწრაფო დახმარება გამოიძახეთ',
      tr: 'sastsrapo dakhmareba gamoidzakhet',
      en: 'Call an ambulance',
      ru: 'Вызовите скорую помощь',
    },
    {
      ka: 'დავიკარგე',
      tr: 'davikarge',
      en: 'I am lost',
      ru: 'Я заблудился / заблудилась',
    },
    {
      ka: 'აფთიაქი სად არის?',
      tr: 'aptiaki sad aris?',
      en: 'Where is the pharmacy?',
      ru: 'Где аптека?',
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
    { ka: 'მე მქვია…', tr: 'me mkvia…', en: 'My name is…', ru: 'Меня зовут…' },
    {
      ka: 'საიდან ხართ?',
      tr: 'saidan khart?',
      en: 'Where are you from?',
      ru: 'Откуда вы?',
    },
    {
      ka: 'ქართულს ვსწავლობ',
      tr: 'kartuls vstsavlob',
      en: 'I am learning Georgian',
      ru: 'Я учу грузинский',
    },
  ],
};

const categoryLabels: Record<Locale, Record<CategoryName, string>> = {
  en: {
    Essentials: 'Essentials',
    'Food & Cafés': 'Food & Cafés',
    Transport: 'Transport',
    Shopping: 'Shopping',
    Emergencies: 'Emergencies',
    'Meeting People': 'Meeting People',
  },
  ru: {
    Essentials: 'Основы',
    'Food & Cafés': 'Еда и кафе',
    Transport: 'Транспорт',
    Shopping: 'Покупки',
    Emergencies: 'Экстренные ситуации',
    'Meeting People': 'Знакомства',
  },
  ka: {
    Essentials: 'ძირითადი ფრაზები',
    'Food & Cafés': 'საკვები და კაფე',
    Transport: 'ტრანსპორტი',
    Shopping: 'შოპინგი',
    Emergencies: 'გადაუდებელი შემთხვევები',
    'Meeting People': 'გაცნობა',
  },
};

const localeCopy: Record<Locale, Record<string, string>> = {
  en: {
    language: 'Language',
    menu: 'Toggle navigation',
    why: 'Why GEO',
    locations: 'Batumi & Tbilisi',
    phrasebook: 'Phrasebook',
    pricing: 'Pricing',
    install: 'Install',
    useWeb: 'Use on web',
    heroEyebrow: 'Learn Georgian in Batumi & Tbilisi',
    heroTitle: 'Speak Georgian for real life.',
    heroBody:
      'Find the phrase you need, hear it, and save it. Built for international residents, Russian speakers, and visitors in Georgia.',
    openFree: 'Open 50 free phrases',
    installApp: 'Install the app',
    freeAccess: '50 phrases free',
    secureSync: 'Secure saved phrases',
    threeLanguages: 'English · Русский · ქართული',
    whyKicker: 'Made for real life',
    whyTitle: 'Useful Georgian, without the clutter.',
    visiting: 'Visiting Georgia',
    visitingBody: 'Handle cafés, transport, shopping, and directions.',
    living: 'Living here',
    livingBody: 'Keep everyday language ready when you need it.',
    connecting: 'Meeting people',
    connectingBody: 'Start conversations with clear, practical phrases.',
    localKicker: 'Learn where you live',
    localTitle: 'Made for Batumi, Tbilisi, and everyday Georgia.',
    localBody:
      'Search in English or Russian while learning Georgian script and pronunciation.',
    batumiTitle: 'Georgian for life by the Black Sea',
    batumiBody: 'Cafés, transport, shopping, directions, and neighbors.',
    batumiLink: 'Georgian in Batumi',
    tbilisiTitle: 'Speak through the capital',
    tbilisiBody: 'Metro trips, restaurants, markets, services, and workdays.',
    tbilisiLink: 'Georgian in Tbilisi',
    russianTitle: 'Made approachable for Russian speakers',
    russianBody:
      'Use Russian meanings while learning Georgian script and sound.',
    russianLink: 'For Russian speakers',
    teacherKicker: 'Learn with a real teacher',
    teacherTitle: 'Want personal help speaking Georgian?',
    teacherBody:
      'Kristina Beridze teaches Georgian to Russian-speaking students with calm explanations and practical conversation.',
    children: 'Children and adults',
    online: 'Online or in Batumi',
    fromPrice: 'From 20 ₾ per lesson',
    meetTeacher: 'Meet Kristina and check availability',
    teacherCard:
      'Georgian for Russian speakers, taught in Russian and Georgian. Individual, mini-group, and online formats.',
    searchKicker: 'Four-way phrasebook',
    searchTitle: 'Search the way you think.',
    searchBody:
      'Type Georgian, transliteration, English, or Russian. Every form stays together.',
    audioNote: 'Tap the speaker to hear Georgian pronunciation.',
    explorePhrasebook: 'Explore the phrasebook',
    situations: 'Six useful situations',
    situationsTitle: 'From your first hello to finding your way.',
    howKicker: 'How GEO works',
    howTitle: 'Useful from the first minute.',
    stepFree: 'Use 50 phrases free',
    stepFreeBody: 'Search all four forms without an account or payment.',
    stepSave: 'Save what matters',
    stepSaveBody: 'Sign in only when you want your saved list on every device.',
    stepLearn: 'Add guided practice',
    stepLearnBody: 'Subscribe for lessons, quizzes, progress, and streaks.',
    pricingKicker: 'Simple pricing',
    pricingTitle: 'Start free. Upgrade only for what you need.',
    pricingBody:
      'The practical phrasebook is free. Lookup power and guided lessons are separate upgrades.',
    freeForever: 'Free forever',
    practicalPhrasebook: 'Practical phrasebook',
    freePlanBody: '50 phrases, four-way search, pronunciation, and saves.',
    openPhrasebook: 'Open phrasebook',
    lifetime: 'Lifetime access',
    proBody:
      'A growing 1,000+ word and sentence catalog with examples, context, and offline packs.',
    explorePro: 'Explore Phrasebook Pro',
    premium: 'Premium',
    guidedBody: 'Daily lessons, quizzes, review, progress, XP, and streaks.',
    viewDetails: 'View subscription details',
    trustKicker: 'Private by design',
    trustTitle: 'Your learning belongs to you.',
    trustBody:
      'Guest browsing stays open. Signed-in profiles, saves, progress, and streaks are isolated per account.',
    faqKicker: 'Quick answers',
    faqTitle: 'Before you begin.',
    faqFreeQ: 'What can I use for free?',
    faqFreeA:
      'All 50 phrases, four-way search, browsing, and pronunciation. Sign in only to sync saved phrases.',
    faqProQ: 'What is Phrasebook Pro?',
    faqProA:
      'A ₾60 one-time upgrade for the growing 1,000+ word and sentence lookup library.',
    faqGuidedQ: 'What requires ₾19.99/month?',
    faqGuidedA:
      'Daily lessons, quizzes, smart review, XP, progress, and streaks.',
    faqInstallQ: 'Can I install GEO?',
    faqInstallA:
      'Yes. GEO is an installable web app with a cached core interface and offline fallback.',
    finalTitle: 'Your next Georgian phrase is one tap away.',
    finalBody: 'Open the full free starter phrasebook now—no account required.',
    explore: 'Explore',
    learn: 'Learn',
    saved: 'Saved',
    progress: 'Progress',
    website: 'Website',
    signIn: 'Sign in',
    signOut: 'Sign out',
    planActive: 'Your plan is active',
    perMonth: '₾19.99 per month',
    learnGeorgian: 'Learn Georgian',
    guestIntro: 'All 50 free phrases are ready. Sign in only to save them.',
    welcomeBack: 'Welcome back',
    guidedProgress: 'Guided progress',
    searchPlaceholder: 'Search Georgian, transliteration, English or Russian',
    searchResults: 'Search results',
    found: 'found',
    noPhrase: 'No phrase found',
    searchHint: 'Try “coffee”, “morning” or “ticket”.',
    freeReady: '50 free phrases ready',
    browseSituation: 'Browse by situation',
    sixCategories: '6 categories',
    freePhrases: 'free phrases',
    allCategories: 'All categories',
    practicalGeorgian: 'Practical Georgian',
    moreComing: 'More words and phrases are coming',
    moreComingBody:
      'The free starter set is complete. Pro expands the catalog.',
    viewPlans: 'View plans',
    savedPhrases: 'Saved phrases',
    savedSync: 'Synced securely across your devices.',
    signToSave: 'Sign in to save and sync phrases.',
    noSaved: 'No saved phrases yet',
    removeSaved: 'Remove saved phrase',
    savePhrase: 'Save phrase',
    createAccount: 'Create account',
    authTitleIn: 'Sign in to GEO',
    authTitleUp: 'Create your GEO account',
    authBody:
      'Save phrases across devices. Guided Learning history requires an active subscription.',
    displayName: 'Display name',
    email: 'Email',
    password: 'Password',
    pleaseWait: 'Please wait…',
    newAccount: 'New to GEO? Create an account',
    existingAccount: 'Already have an account? Sign in',
  },
  ru: {
    language: 'Язык',
    menu: 'Открыть навигацию',
    why: 'Почему GEO',
    locations: 'Батуми и Тбилиси',
    phrasebook: 'Разговорник',
    pricing: 'Цены',
    install: 'Установить',
    useWeb: 'Открыть в браузере',
    heroEyebrow: 'Грузинский для жизни в Батуми и Тбилиси',
    heroTitle: 'Говорите по-грузински в реальной жизни.',
    heroBody:
      'Найдите нужную фразу, послушайте произношение и сохраните её. Для русскоязычных жителей и гостей Грузии.',
    openFree: 'Открыть 50 бесплатных фраз',
    installApp: 'Установить приложение',
    freeAccess: '50 фраз бесплатно',
    secureSync: 'Безопасная синхронизация',
    threeLanguages: 'English · Русский · ქართული',
    whyKicker: 'Для реальной жизни',
    whyTitle: 'Полезный грузинский — без лишнего.',
    visiting: 'В поездке по Грузии',
    visitingBody: 'Кафе, транспорт, покупки и дорога.',
    living: 'Для жизни здесь',
    livingBody: 'Нужные слова всегда под рукой.',
    connecting: 'Для общения',
    connectingBody: 'Начните разговор с понятных практических фраз.',
    localKicker: 'Учитесь там, где живёте',
    localTitle: 'Для Батуми, Тбилиси и повседневной жизни в Грузии.',
    localBody:
      'Ищите на русском или английском и осваивайте грузинское письмо и произношение.',
    batumiTitle: 'Грузинский для жизни у Чёрного моря',
    batumiBody: 'Кафе, транспорт, покупки, дорога и соседи.',
    batumiLink: 'Грузинский в Батуми',
    tbilisiTitle: 'Говорите в столице',
    tbilisiBody: 'Метро, рестораны, рынки, услуги и рабочие будни.',
    tbilisiLink: 'Грузинский в Тбилиси',
    russianTitle: 'Понятно для русскоязычных',
    russianBody:
      'Русские значения помогают освоить грузинское письмо и звучание.',
    russianLink: 'Для русскоязычных',
    teacherKicker: 'Занятия с преподавателем',
    teacherTitle: 'Нужна личная помощь с грузинским?',
    teacherBody:
      'Кристина Беридзе обучает русскоязычных учеников: спокойные объяснения и живая разговорная практика.',
    children: 'Дети и взрослые',
    online: 'Онлайн или в Батуми',
    fromPrice: 'От 20 ₾ за урок',
    meetTeacher: 'Познакомиться с Кристиной',
    teacherCard:
      'Грузинский для русскоязычных. Индивидуальные, мини-групповые и онлайн-занятия на русском и грузинском.',
    searchKicker: 'Разговорник в четырёх формах',
    searchTitle: 'Ищите так, как думаете.',
    searchBody:
      'Введите грузинский текст, транслитерацию, английское или русское значение.',
    audioNote: 'Нажмите на динамик, чтобы услышать произношение.',
    explorePhrasebook: 'Открыть разговорник',
    situations: 'Шесть ситуаций',
    situationsTitle: 'От первого приветствия до поиска дороги.',
    howKicker: 'Как работает GEO',
    howTitle: 'Полезно с первой минуты.',
    stepFree: '50 фраз бесплатно',
    stepFreeBody: 'Поиск по четырём формам без аккаунта и оплаты.',
    stepSave: 'Сохраняйте нужное',
    stepSaveBody:
      'Войдите, только если хотите синхронизацию между устройствами.',
    stepLearn: 'Добавьте обучение',
    stepLearnBody: 'Уроки, тесты, прогресс и серии занятий по подписке.',
    pricingKicker: 'Простые цены',
    pricingTitle: 'Начните бесплатно. Платите только за нужное.',
    pricingBody:
      'Практический разговорник бесплатный. Расширенный поиск и курс приобретаются отдельно.',
    freeForever: 'Бесплатно навсегда',
    practicalPhrasebook: 'Практический разговорник',
    freePlanBody: '50 фраз, поиск, произношение и сохранение.',
    openPhrasebook: 'Открыть разговорник',
    lifetime: 'Навсегда',
    proBody:
      'Растущий каталог 1000+ слов и предложений с примерами и офлайн-пакетами.',
    explorePro: 'Подробнее о Phrasebook Pro',
    premium: 'Премиум',
    guidedBody: 'Ежедневные уроки, тесты, повторение, прогресс, XP и серии.',
    viewDetails: 'Условия подписки',
    trustKicker: 'Конфиденциальность',
    trustTitle: 'Ваш прогресс принадлежит вам.',
    trustBody:
      'Гостевой просмотр открыт. Данные каждого вошедшего пользователя защищены отдельно.',
    faqKicker: 'Короткие ответы',
    faqTitle: 'Перед началом.',
    faqFreeQ: 'Что доступно бесплатно?',
    faqFreeA:
      'Все 50 фраз, поиск, просмотр и произношение. Вход нужен только для синхронизации сохранённого.',
    faqProQ: 'Что такое Phrasebook Pro?',
    faqProA:
      'Разовая покупка за ₾60 для растущего каталога из 1000+ слов и предложений.',
    faqGuidedQ: 'Для чего нужна подписка ₾19.99?',
    faqGuidedA:
      'Ежедневные уроки, тесты, умное повторение, XP, прогресс и серии занятий.',
    faqInstallQ: 'Можно установить GEO?',
    faqInstallA:
      'Да. GEO устанавливается как веб-приложение и имеет офлайн-экран.',
    finalTitle: 'Следующая грузинская фраза — в одном нажатии.',
    finalBody: 'Откройте полный бесплатный набор из 50 фраз без регистрации.',
    explore: 'Обзор',
    learn: 'Учиться',
    saved: 'Сохранённые',
    progress: 'Прогресс',
    website: 'Сайт',
    signIn: 'Войти',
    signOut: 'Выйти',
    planActive: 'Подписка активна',
    perMonth: '₾19.99 в месяц',
    learnGeorgian: 'Учить грузинский',
    guestIntro:
      'Все 50 бесплатных фраз готовы. Вход нужен только для сохранения.',
    welcomeBack: 'С возвращением',
    guidedProgress: 'Учебный прогресс',
    searchPlaceholder:
      'Поиск на грузинском, русском, английском или по транслитерации',
    searchResults: 'Результаты поиска',
    found: 'найдено',
    noPhrase: 'Фраза не найдена',
    searchHint: 'Попробуйте «кофе», «утро» или «билет».',
    freeReady: '50 бесплатных фраз готовы',
    browseSituation: 'Выберите ситуацию',
    sixCategories: '6 категорий',
    freePhrases: 'бесплатных фраз',
    allCategories: 'Все категории',
    practicalGeorgian: 'Практический грузинский',
    moreComing: 'Скоро появятся новые слова и фразы',
    moreComingBody: 'Бесплатный набор уже полный. Pro расширит каталог.',
    viewPlans: 'Посмотреть тарифы',
    savedPhrases: 'Сохранённые фразы',
    savedSync: 'Безопасно синхронизируются на ваших устройствах.',
    signToSave: 'Войдите, чтобы сохранять и синхронизировать фразы.',
    noSaved: 'Пока нет сохранённых фраз',
    removeSaved: 'Удалить из сохранённых',
    savePhrase: 'Сохранить фразу',
    createAccount: 'Создать аккаунт',
    authTitleIn: 'Войти в GEO',
    authTitleUp: 'Создать аккаунт GEO',
    authBody:
      'Сохраняйте фразы на всех устройствах. История обучения доступна с активной подпиской.',
    displayName: 'Имя',
    email: 'Электронная почта',
    password: 'Пароль',
    pleaseWait: 'Подождите…',
    newAccount: 'Впервые в GEO? Создать аккаунт',
    existingAccount: 'Уже есть аккаунт? Войти',
  },
  ka: {
    language: 'ენა',
    menu: 'ნავიგაციის გახსნა',
    why: 'რატომ GEO',
    locations: 'ბათუმი და თბილისი',
    phrasebook: 'ფრაზები',
    pricing: 'ფასები',
    install: 'დაყენება',
    useWeb: 'ვებვერსიის გახსნა',
    heroEyebrow: 'ქართული ბათუმსა და თბილისში ცხოვრებისთვის',
    heroTitle: 'ისაუბრეთ ქართულად ყოველდღიურ ცხოვრებაში.',
    heroBody:
      'იპოვეთ საჭირო ფრაზა, მოუსმინეთ გამოთქმას და შეინახეთ. შექმნილია საქართველოში მცხოვრები და ჩამოსული ადამიანებისთვის.',
    openFree: 'გახსენით 50 უფასო ფრაზა',
    installApp: 'აპის დაყენება',
    freeAccess: '50 ფრაზა უფასოდ',
    secureSync: 'უსაფრთხო სინქრონიზაცია',
    threeLanguages: 'English · Русский · ქართული',
    whyKicker: 'რეალური ცხოვრებისთვის',
    whyTitle: 'სასარგებლო ქართული ზედმეტის გარეშე.',
    visiting: 'საქართველოში მოგზაურობა',
    visitingBody: 'კაფე, ტრანსპორტი, საყიდლები და მიმართულებები.',
    living: 'აქ ცხოვრება',
    livingBody: 'საჭირო სიტყვები ყოველთვის ხელმისაწვდომია.',
    connecting: 'ადამიანებთან ურთიერთობა',
    connectingBody: 'დაიწყეთ საუბარი მარტივი და პრაქტიკული ფრაზებით.',
    localKicker: 'ისწავლეთ იქ, სადაც ცხოვრობთ',
    localTitle: 'ბათუმისთვის, თბილისისთვის და ყოველდღიური საქართველოსთვის.',
    localBody:
      'მოძებნეთ ინგლისურად ან რუსულად და ისწავლეთ ქართული დამწერლობა და გამოთქმა.',
    batumiTitle: 'ქართული შავი ზღვისპირეთში ცხოვრებისთვის',
    batumiBody: 'კაფე, ტრანსპორტი, საყიდლები, მიმართულებები და მეზობლები.',
    batumiLink: 'ქართული ბათუმში',
    tbilisiTitle: 'ისაუბრეთ დედაქალაქში',
    tbilisiBody: 'მეტრო, რესტორნები, ბაზრები, მომსახურება და სამუშაო დღეები.',
    tbilisiLink: 'ქართული თბილისში',
    russianTitle: 'მარტივად რუსულენოვანთათვის',
    russianBody:
      'რუსული მნიშვნელობები ქართული დამწერლობისა და ჟღერადობის სწავლაში გეხმარებათ.',
    russianLink: 'რუსულენოვანთათვის',
    teacherKicker: 'ისწავლეთ მასწავლებელთან',
    teacherTitle: 'გჭირდებათ პირადი დახმარება ქართულში?',
    teacherBody:
      'კრისტინა ბერიძე რუსულენოვან მოსწავლეებს ქართულს მშვიდი ახსნითა და პრაქტიკული საუბრით ასწავლის.',
    children: 'ბავშვები და მოზრდილები',
    online: 'ონლაინ ან ბათუმში',
    fromPrice: 'გაკვეთილი 20 ₾-დან',
    meetTeacher: 'გაიცანით კრისტინა',
    teacherCard:
      'ქართული რუსულენოვანთათვის. ინდივიდუალური, მცირე ჯგუფისა და ონლაინ გაკვეთილები რუსულ და ქართულ ენებზე.',
    searchKicker: 'ოთხფორმიანი ფრაზების წიგნი',
    searchTitle: 'მოძებნეთ ისე, როგორც ფიქრობთ.',
    searchBody:
      'შეიყვანეთ ქართული, ტრანსლიტერაცია, ინგლისური ან რუსული მნიშვნელობა.',
    audioNote: 'გამოთქმის მოსასმენად დააჭირეთ დინამიკს.',
    explorePhrasebook: 'ფრაზების გახსნა',
    situations: 'ექვსი სიტუაცია',
    situationsTitle: 'პირველი მისალმებიდან გზის პოვნამდე.',
    howKicker: 'როგორ მუშაობს GEO',
    howTitle: 'სასარგებლოა პირველივე წუთიდან.',
    stepFree: '50 ფრაზა უფასოდ',
    stepFreeBody: 'მოძებნეთ ოთხივე ფორმით ანგარიშისა და გადახდის გარეშე.',
    stepSave: 'შეინახეთ საჭირო ფრაზები',
    stepSaveBody: 'შედით მხოლოდ მოწყობილობებს შორის სინქრონიზაციისთვის.',
    stepLearn: 'დაამატეთ სწავლება',
    stepLearnBody: 'გამოიწერეთ გაკვეთილები, ტესტები, პროგრესი და სერიები.',
    pricingKicker: 'მარტივი ფასები',
    pricingTitle: 'დაიწყეთ უფასოდ. გადაიხადეთ მხოლოდ საჭიროებისთვის.',
    pricingBody:
      'პრაქტიკული ფრაზები უფასოა. გაფართოებული ძიება და კურსი ცალკე პროდუქტებია.',
    freeForever: 'უფასოდ სამუდამოდ',
    practicalPhrasebook: 'პრაქტიკული ფრაზები',
    freePlanBody: '50 ფრაზა, ძიება, გამოთქმა და შენახვა.',
    openPhrasebook: 'ფრაზების გახსნა',
    lifetime: 'სამუდამო წვდომა',
    proBody:
      '1000-ზე მეტი სიტყვისა და წინადადების მზარდი კატალოგი მაგალითებითა და ოფლაინ პაკეტებით.',
    explorePro: 'Phrasebook Pro-ს ნახვა',
    premium: 'პრემიუმი',
    guidedBody: 'ყოველდღიური გაკვეთილები, ტესტები, გამეორება, პროგრესი და XP.',
    viewDetails: 'გამოწერის პირობები',
    trustKicker: 'კონფიდენციალურობა',
    trustTitle: 'თქვენი პროგრესი თქვენ გეკუთვნით.',
    trustBody:
      'სტუმრის რეჟიმი ღიაა. ავტორიზებული მომხმარებლების მონაცემები ერთმანეთისგან დაცულია.',
    faqKicker: 'მოკლე პასუხები',
    faqTitle: 'დაწყებამდე.',
    faqFreeQ: 'რა არის უფასო?',
    faqFreeA:
      'ყველა 50 ფრაზა, ძიება, დათვალიერება და გამოთქმა. შესვლა მხოლოდ შენახულის სინქრონიზაციისთვისაა საჭირო.',
    faqProQ: 'რა არის Phrasebook Pro?',
    faqProA:
      '₾60-იანი ერთჯერადი განახლება 1000-ზე მეტი სიტყვისა და წინადადების მზარდი კატალოგისთვის.',
    faqGuidedQ: 'რას სჭირდება ₾19.99-იანი გამოწერა?',
    faqGuidedA:
      'ყოველდღიური გაკვეთილები, ტესტები, გამეორება, XP, პროგრესი და სერიები.',
    faqInstallQ: 'შემიძლია GEO-ს დაყენება?',
    faqInstallA:
      'დიახ. GEO დაყენებადი ვებაპია ქეშირებული ინტერფეისითა და ოფლაინ ეკრანით.',
    finalTitle: 'შემდეგი ქართული ფრაზა ერთი შეხებითაა ხელმისაწვდომი.',
    finalBody: 'გახსენით 50-ფრაზიანი უფასო ნაკრები რეგისტრაციის გარეშე.',
    explore: 'ძიება',
    learn: 'სწავლა',
    saved: 'შენახული',
    progress: 'პროგრესი',
    website: 'ვებსაიტი',
    signIn: 'შესვლა',
    signOut: 'გასვლა',
    planActive: 'გეგმა აქტიურია',
    perMonth: '₾19.99 თვეში',
    learnGeorgian: 'ისწავლეთ ქართული',
    guestIntro:
      'ყველა 50 უფასო ფრაზა მზადაა. შესვლა მხოლოდ შესანახადაა საჭირო.',
    welcomeBack: 'კეთილი დაბრუნება',
    guidedProgress: 'სასწავლო პროგრესი',
    searchPlaceholder: 'ძიება ქართულად, ინგლისურად, რუსულად ან ტრანსლიტერაციით',
    searchResults: 'ძიების შედეგები',
    found: 'ნაპოვნია',
    noPhrase: 'ფრაზა ვერ მოიძებნა',
    searchHint: 'სცადეთ „ყავა“, „დილა“ ან „ბილეთი“.',
    freeReady: '50 უფასო ფრაზა მზადაა',
    browseSituation: 'აირჩიეთ სიტუაცია',
    sixCategories: '6 კატეგორია',
    freePhrases: 'უფასო ფრაზა',
    allCategories: 'ყველა კატეგორია',
    practicalGeorgian: 'პრაქტიკული ქართული',
    moreComing: 'მეტი სიტყვა და ფრაზა მალე დაემატება',
    moreComingBody:
      'უფასო საწყისი ნაკრები დასრულებულია. Pro კატალოგს გააფართოებს.',
    viewPlans: 'გეგმების ნახვა',
    savedPhrases: 'შენახული ფრაზები',
    savedSync: 'უსაფრთხოდ სინქრონიზდება თქვენს მოწყობილობებზე.',
    signToSave: 'ფრაზების შესანახად და სინქრონიზაციისთვის შედით.',
    noSaved: 'შენახული ფრაზები ჯერ არ არის',
    removeSaved: 'შენახულიდან წაშლა',
    savePhrase: 'ფრაზის შენახვა',
    createAccount: 'ანგარიშის შექმნა',
    authTitleIn: 'GEO-ში შესვლა',
    authTitleUp: 'GEO ანგარიშის შექმნა',
    authBody:
      'შეინახეთ ფრაზები ყველა მოწყობილობაზე. სწავლების ისტორია აქტიურ გამოწერას საჭიროებს.',
    displayName: 'სახელი',
    email: 'ელფოსტა',
    password: 'პაროლი',
    pleaseWait: 'დაელოდეთ…',
    newAccount: 'ახალი ხართ GEO-ში? შექმენით ანგარიში',
    existingAccount: 'უკვე გაქვთ ანგარიში? შედით',
  },
};

function getCopy(locale: Locale, key: string) {
  return localeCopy[locale][key] ?? localeCopy.en[key] ?? key;
}

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
          priceCurrency: 'GEL',
        },
        {
          '@type': 'Offer',
          name: 'Phrasebook Pro Lifetime Access',
          price: 60,
          priceCurrency: 'GEL',
        },
        {
          '@type': 'Offer',
          name: 'Guided Learning Monthly Subscription',
          price: 19.99,
          priceCurrency: 'GEL',
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
            text: 'Phrasebook Pro is a ₾60 one-time upgrade designed to provide lifetime access to a growing catalog of 1,000+ Georgian words and practical sentences with richer lookup tools.',
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
      <img src="/brand/geo-wave.svg" alt="" width="36" height="36" />
      <span className="brand-word">GEO</span>
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
  openAuth,
  openAccount,
  user,
  displayName,
  locale,
  onLocaleChange,
}: {
  openApp: () => void;
  installApp: () => void;
  openAuth: () => void;
  openAccount: () => void;
  user: User | null;
  displayName: string | null;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const t = (key: string) => getCopy(locale, key);
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
        <nav className="desktop-nav" aria-label={t('menu')}>
          <a href="#why">{t('why')}</a>
          <a href="#locations">{t('locations')}</a>
          <a href="#phrases">{t('phrasebook')}</a>
          <a href="#pricing">{t('pricing')}</a>
        </nav>
        <div className="header-actions">
          <LanguageMenu
            locale={locale}
            onChange={onLocaleChange}
            label={t('language')}
          />
          <button
            className="marketing-account"
            onClick={user ? openAccount : openAuth}
          >
            <UserRound />
            {user
              ? (displayName ?? user.email?.split('@')[0] ?? 'Account')
              : t('signIn')}
          </button>
          <button className="open-app-link" onClick={openApp}>
            {t('useWeb')} <ChevronRight />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t('menu')}
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
              {t('why')}
            </a>
            <a href="#locations" onClick={() => setMenuOpen(false)}>
              {t('locations')}
            </a>
            <a href="#phrases" onClick={() => setMenuOpen(false)}>
              {t('phrasebook')}
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              {t('pricing')}
            </a>
            <button onClick={installApp}>{t('installApp')}</button>
            <button onClick={user ? openAccount : openAuth}>
              {user
                ? `${displayName ?? user.email?.split('@')[0] ?? 'Account'} · Settings`
                : t('signIn')}
            </button>
            <button onClick={openApp}>{t('useWeb')}</button>
          </nav>
        )}
      </header>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{t('heroEyebrow')}</span>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroBody')}</p>
          <div className="hero-buttons">
            <Button className="primary-cta shiny-button" onClick={openApp}>
              {t('openFree')} <ChevronRight />
            </Button>
            <button className="secondary-cta" onClick={installApp}>
              <Download /> {t('installApp')}
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <CheckCircle2 /> {t('freeAccess')}
            </span>
            <span>
              <ShieldCheck /> {t('secureSync')}
            </span>
            <span>
              <Globe2 /> {t('threeLanguages')}
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-label="GEO app preview">
          <div className="phone phone-front">
            <div className="phone-notch" />
            <div className="mini-status">
              9:41 <span>•••</span>
            </div>
            <span className="mini-back">
              ‹ {categoryLabels[locale].Essentials}
            </span>
            <span className="mini-pill">{t('audioNote')}</span>
            <div className="mini-phrase">
              <strong>გამარჯობა</strong>
              <em>gamarjoba</em>
              <p>{locale === 'ru' ? 'Привет' : 'Hello'}</p>
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
      <section className="audience-section" id="why">
        <div className="section-kicker">{t('whyKicker')}</div>
        <h2>{t('whyTitle')}</h2>
        <div className="audience-grid">
          <article>
            <Plane />
            <span>
              <b>{t('visiting')}</b>
              <p>{t('visitingBody')}</p>
            </span>
          </article>
          <article>
            <Home />
            <span>
              <b>{t('living')}</b>
              <p>{t('livingBody')}</p>
            </span>
          </article>
          <article>
            <Users />
            <span>
              <b>{t('connecting')}</b>
              <p>{t('connectingBody')}</p>
            </span>
          </article>
        </div>
      </section>
      <section className="local-section" id="locations">
        <div>
          <span className="section-kicker">{t('localKicker')}</span>
          <h2>{t('localTitle')}</h2>
          <p>{t('localBody')}</p>
        </div>
        <div className="local-grid">
          <article>
            <span>Batumi</span>
            <h3>{t('batumiTitle')}</h3>
            <p>{t('batumiBody')}</p>
            <a href="/learn-georgian-batumi">
              {t('batumiLink')} <ChevronRight />
            </a>
          </article>
          <article>
            <span>Tbilisi</span>
            <h3>{t('tbilisiTitle')}</h3>
            <p>{t('tbilisiBody')}</p>
            <a href="/learn-georgian-tbilisi">
              {t('tbilisiLink')} <ChevronRight />
            </a>
          </article>
          <article>
            <span>Русский → ქართული</span>
            <h3>{t('russianTitle')}</h3>
            <p>{t('russianBody')}</p>
            <a href="/learn-georgian-for-russian-speakers">
              {t('russianLink')} <ChevronRight />
            </a>
          </article>
        </div>
      </section>
      <section className="teacher-section" id="teacher">
        <div className="teacher-copy">
          <span className="section-kicker">{t('teacherKicker')}</span>
          <h2>{t('teacherTitle')}</h2>
          <p>{t('teacherBody')}</p>
          <div className="teacher-facts" aria-label="Lesson options">
            <span>
              <Users /> {t('children')}
            </span>
            <span>
              <Globe2 /> {t('online')}
            </span>
            <span>
              <CheckCircle2 /> {t('fromPrice')}
            </span>
          </div>
          <a
            className="teacher-cta"
            href="https://www.kristinalanguages.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('meetTeacher')} <ChevronRight />
          </a>
        </div>
        <aside className="teacher-card" aria-label="About Kristina Beridze">
          <picture className="teacher-portrait">
            <source
              type="image/avif"
              srcSet="/kristina-beridze-640.avif 640w, /kristina-beridze-960.avif 960w"
              sizes="(max-width: 1050px) 100vw, 390px"
            />
            <img
              src="/kristina-beridze-640.webp"
              srcSet="/kristina-beridze-640.webp 640w, /kristina-beridze-960.webp 960w"
              sizes="(max-width: 1050px) 100vw, 390px"
              alt="Kristina Beridze, Georgian language teacher in Batumi"
              width="960"
              height="640"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="teacher-card-copy">
            <small>ქართული · Русский</small>
            <h3>Kristina Beridze</h3>
            <p>{t('teacherCard')}</p>
          </div>
        </aside>
      </section>
      <section className="demo-pricing" id="phrases">
        <div className="phrase-demo">
          <span className="section-kicker">{t('searchKicker')}</span>
          <h2>{t('searchTitle')}</h2>
          <p className="section-lead">{t('searchBody')}</p>
          <div className="demo-card">
            <div>
              <strong>მადლობა</strong>
              <em>madloba</em>
              <p>{locale === 'ru' ? 'Спасибо' : 'Thank you'}</p>
            </div>
            <AudioButton id="demo" playing={playing} onPlay={play} large />
          </div>
          <p className="demo-caption">
            <Mic2 /> {t('audioNote')}
          </p>
          <a className="text-link" href="/phrasebook">
            {t('explorePhrasebook')} <ChevronRight />
          </a>
        </div>
        <div className="category-showcase">
          <span className="section-kicker">{t('situations')}</span>
          <h2>{t('situationsTitle')}</h2>
          <div>
            {categories.map(({ name, icon: Icon, tone }) => (
              <button key={name} onClick={openApp}>
                <span className={`mini-icon ${tone}`}>
                  <Icon />
                </span>
                <b>{categoryLabels[locale][name]}</b>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="how-section" id="how">
        <span className="section-kicker">{t('howKicker')}</span>
        <h2>{t('howTitle')}</h2>
        <div className="how-grid">
          <article>
            <span>01</span>
            <Search />
            <h3>{t('stepFree')}</h3>
            <p>{t('stepFreeBody')}</p>
          </article>
          <article>
            <span>02</span>
            <Bookmark />
            <h3>{t('stepSave')}</h3>
            <p>{t('stepSaveBody')}</p>
          </article>
          <article>
            <span>03</span>
            <LockKeyhole />
            <h3>{t('stepLearn')}</h3>
            <p>{t('stepLearnBody')}</p>
          </article>
        </div>
      </section>
      <section className="pricing-section" id="pricing">
        <div className="pricing-heading">
          <span className="section-kicker">{t('pricingKicker')}</span>
          <h2>{t('pricingTitle')}</h2>
          <p>{t('pricingBody')}</p>
        </div>
        <div className="pricing-grid redesigned three-plans">
          <article>
            <span className="plan-state live">{t('freeForever')}</span>
            <h3>{t('practicalPhrasebook')}</h3>
            <b>Free</b>
            <p>{t('freePlanBody')}</p>
            <Button onClick={openApp}>{t('openPhrasebook')}</Button>
          </article>
          <article className="phrasebook-plan">
            <span className="plan-state pro">{t('lifetime')}</span>
            <h3>Phrasebook Pro</h3>
            <b>₾60</b>
            <p>{t('proBody')}</p>
            <a href="/pricing">{t('explorePro')}</a>
          </article>
          <article className="popular">
            <span className="plan-state">{t('premium')}</span>
            <h3>Guided Learning</h3>
            <b>
              ₾19.99<small>/month</small>
            </b>
            <p>{t('guidedBody')}</p>
            <a href="/pricing">{t('viewDetails')}</a>
          </article>
        </div>
      </section>
      <section className="trust-section">
        <div>
          <span className="section-kicker">{t('trustKicker')}</span>
          <h2>{t('trustTitle')}</h2>
          <p>{t('trustBody')}</p>
        </div>
      </section>
      <section className="faq-section">
        <span className="section-kicker">{t('faqKicker')}</span>
        <h2>{t('faqTitle')}</h2>
        <div>
          <details>
            <summary>{t('faqFreeQ')}</summary>
            <p>{t('faqFreeA')}</p>
          </details>
          <details>
            <summary>{t('faqProQ')}</summary>
            <p>{t('faqProA')}</p>
          </details>
          <details>
            <summary>{t('faqGuidedQ')}</summary>
            <p>{t('faqGuidedA')}</p>
          </details>
          <details>
            <summary>{t('faqInstallQ')}</summary>
            <p>{t('faqInstallA')}</p>
          </details>
        </div>
      </section>
      <section className="final-cta">
        <span className="section-kicker light">{t('freeAccess')}</span>
        <h2>{t('finalTitle')}</h2>
        <p>{t('finalBody')}</p>
        <Button onClick={openApp}>
          {t('openFree')} <ChevronRight />
        </Button>
      </section>
      <MarketingFooter locale={locale} />
      <CookieNotice locale={locale} />
    </main>
  );
}

function AppShell({
  exitToSite,
  openModal,
  openAuth,
  initialScreen,
  locale,
  onLocaleChange,
}: {
  exitToSite: () => void;
  openModal: (kind: 'install' | 'pricing') => void;
  openAuth: () => void;
  initialScreen?: Screen;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const t = (key: string) => getCopy(locale, key);
  const [screen, setScreen] = useState<Screen>(initialScreen ?? 'explore');
  const [category, setCategory] = useState<CategoryName>('Essentials');
  const [playing, setPlaying] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [library, setLibrary] =
    useState<Record<CategoryName, Phrase[]>>(phrases);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [settingsName, setSettingsName] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [deviceLabel] = useState(() => {
    if (typeof navigator === 'undefined') return 'This browser';
    const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const browser = /Edg\//.test(navigator.userAgent)
      ? 'Edge'
      : /Chrome\//.test(navigator.userAgent)
        ? 'Chrome'
        : /Safari\//.test(navigator.userAgent)
          ? 'Safari'
          : 'Browser';
    return `${mobile ? 'Mobile device' : 'Computer'} · ${browser}`;
  });
  const [upgradeFocus, setUpgradeFocus] = useState<'phrasebook' | 'guided'>(
    'phrasebook',
  );
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
        setPhoneNumber('');
        setSettingsName('');
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
        supabase
          .from('profiles')
          .select('display_name,interface_language,phone_number')
          .maybeSingle(),
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
      setSettingsName(profileResult.data?.display_name ?? '');
      setPhoneNumber(profileResult.data?.phone_number ?? '');
      const savedLocale = profileResult.data?.interface_language;
      if (savedLocale === 'en' || savedLocale === 'ru' || savedLocale === 'ka')
        onLocaleChange(savedLocale);
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
    [supabase, onLocaleChange],
  );

  const changeLocale = (nextLocale: Locale) => {
    onLocaleChange(nextLocale);
    if (supabase && user)
      void supabase
        .from('profiles')
        .update({ interface_language: nextLocale })
        .eq('id', user.id);
  };

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

  const openLearning = () => {
    setUpgradeFocus('phrasebook');
    setScreen(hasPhrasebookProAccess ? 'explore' : 'premium');
  };
  const openProgress = () => {
    setUpgradeFocus('guided');
    setScreen(hasLearningAccess ? 'progress' : 'premium');
  };

  const saveSettings = async () => {
    if (!supabase || !user) {
      openAuth();
      return;
    }
    setSettingsBusy(true);
    setSettingsStatus('');
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: settingsName.trim() || null,
        phone_number: phoneNumber.trim() || null,
        interface_language: locale,
      })
      .eq('id', user.id);
    setSettingsBusy(false);
    if (error) {
      setSettingsStatus(error.message);
      return;
    }
    setDisplayName(settingsName.trim() || null);
    setSettingsStatus('Account details saved.');
  };

  const signOutOtherDevices = async () => {
    if (!supabase || !user) return;
    setSettingsBusy(true);
    setSettingsStatus('');
    const { error } = await supabase.auth.signOut({ scope: 'others' });
    setSettingsBusy(false);
    setSettingsStatus(
      error
        ? error.message
        : 'Other sessions have been signed out. Their access tokens may remain valid briefly until expiry.',
    );
  };

  const deleteAccount = async () => {
    if (!supabase || !user) return;
    setSettingsBusy(true);
    const { error } = await supabase.functions.invoke('delete-account', {
      body: {},
    });
    if (error) {
      setSettingsBusy(false);
      setSettingsStatus(error.message);
      return;
    }
    await supabase.auth.signOut({ scope: 'global' });
    setSettingsBusy(false);
    setScreen('explore');
  };

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
            <p>{phraseMeaning(p, locale)}</p>
          </div>
          <div className="phrase-actions">
            <button
              className={`save-button ${saved.includes(phraseKey(p)) ? 'saved' : ''}`}
              onClick={() => void toggleSaved(p)}
              aria-label={
                saved.includes(phraseKey(p))
                  ? t('removeSaved')
                  : t('savePhrase')
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
  const appHome = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setScreen('explore');
      window.scrollTo(0, 0);
      return;
    }
    exitToSite();
  };
  return (
    <main className="app-view">
      <aside className="app-sidebar">
        <Brand onHome={appHome} />
        <nav>
          <button
            className={
              screen === 'explore' || screen === 'category' ? 'active' : ''
            }
            onClick={() => setScreen('explore')}
          >
            <Compass />
            {t('explore')}
          </button>
          <button className={learnNav ? 'active' : ''} onClick={openLearning}>
            <BookOpen />
            {t('learn')}
          </button>
          <button
            className={screen === 'saved' ? 'active' : ''}
            onClick={() => setScreen('saved')}
          >
            <Bookmark />
            {t('saved')}
          </button>
          <button
            className={screen === 'progress' ? 'active' : ''}
            onClick={openProgress}
          >
            <BarChart3 />
            {t('progress')}
          </button>
          <button
            className={screen === 'settings' ? 'active' : ''}
            onClick={() => setScreen('settings')}
          >
            <Settings />
            Settings
          </button>
        </nav>
        <button
          className="sidebar-premium"
          onClick={() => {
            setUpgradeFocus('guided');
            setScreen('premium');
          }}
        >
          <Star />
          <span>
            <b>{t('stepLearn')}</b>
            <small>{hasLearningAccess ? t('planActive') : t('perMonth')}</small>
          </span>
          <ChevronRight />
        </button>
        <button className="back-to-site" onClick={exitToSite}>
          <ArrowLeft /> {t('website')}
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <Brand onHome={appHome} />
          <div className="app-top-actions">
            <LanguageMenu
              locale={locale}
              onChange={changeLocale}
              label={t('language')}
            />
            <button
              className="account-button"
              onClick={() => (user ? setScreen('settings') : openAuth())}
            >
              {user ? <UserRound /> : <LogIn />}
              {user
                ? (displayName ?? user.email?.split('@')[0] ?? 'Account')
                : t('signIn')}
            </button>
          </div>
        </header>
        <div className="app-content">
          {screen === 'explore' && (
            <section className="screen explore-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">გამარჯობა · gamarjoba</span>
                  <h1>{t('learnGeorgian')}</h1>
                  <p>
                    {user
                      ? `${t('welcomeBack')}${displayName ? `, ${displayName}` : ''}.`
                      : t('guestIntro')}
                  </p>
                </div>
                <button className="streak-chip" onClick={openProgress}>
                  <LockKeyhole /> {t('guidedProgress')}
                </button>
              </div>
              <search className="search-box">
                <Search />
                <input
                  type="search"
                  aria-label={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  enterKeyHint="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
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
                    <h2>{t('searchResults')}</h2>
                    <span>
                      {filtered.length} {t('found')} “{search.trim()}”
                    </span>
                  </div>
                  {filtered.length ? (
                    renderPhrases(filtered)
                  ) : (
                    <div className="empty-card">
                      <Search />
                      <h3>{t('noPhrase')}</h3>
                      <p>{t('searchHint')}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="library-status">
                    <CheckCircle2 /> <b>{t('freeReady')}</b>
                  </div>
                  <div className="section-title">
                    <h2>{t('browseSituation')}</h2>
                    <span>{t('sixCategories')}</span>
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
                          <b>{categoryLabels[locale][name]}</b>
                          <small>
                            {library[name].length} {t('freePhrases')}
                          </small>
                        </span>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                  <button
                    className="learning-banner locked-learning"
                    onClick={openProgress}
                  >
                    <span>
                      <small>
                        {t('stepLearn')} · {t('premium')}
                      </small>
                      <b>{t('guidedBody')}</b>
                      <em>{t('perMonth')}</em>
                    </span>
                    <span className="banner-action">
                      <LockKeyhole /> {t('viewPlans')}
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
                <ArrowLeft /> {t('allCategories')}
              </button>
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">{t('practicalGeorgian')}</span>
                  <h1>{categoryLabels[locale][category]}</h1>
                  <p>
                    {library[category].length} {t('freePhrases')}
                  </p>
                </div>
              </div>
              {renderPhrases(library[category])}
              <div className="locked-card">
                <span className="lock-orb">
                  <LockKeyhole />
                </span>
                <div>
                  <h2>{t('moreComing')}</h2>
                  <p>{t('moreComingBody')}</p>
                </div>
                <Button onClick={() => openModal('pricing')}>
                  <LockKeyhole /> {t('viewPlans')}
                </Button>
              </div>
            </section>
          )}
          {screen === 'saved' && (
            <section className="screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">{t('phrasebook')}</span>
                  <h1>{t('savedPhrases')}</h1>
                  <p>{user ? t('savedSync') : t('signToSave')}</p>
                </div>
              </div>
              {saved.length ? (
                renderPhrases(
                  allPhrases.filter((p) => saved.includes(phraseKey(p))),
                )
              ) : (
                <div className="empty-card">
                  <Bookmark />
                  <h3>{t('noSaved')}</h3>
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
                  {upgradeFocus === 'phrasebook'
                    ? 'Find the Georgian you need'
                    : 'Keep your learning moving'}
                </h1>
                <p>
                  {upgradeFocus === 'phrasebook'
                    ? 'Unlock the practical 1,000-word lookup library once and keep it.'
                    : 'Progress, streaks, lessons, quizzes, and smart review belong to Guided Learning.'}
                </p>
              </div>
              <div className="premium-layout">
                <div className="feature-list">
                  {upgradeFocus === 'phrasebook' ? (
                    <>
                      <div>
                        <Search />
                        <span>
                          <b>1,000 modern spoken entries</b>
                          <small>
                            Built from current conversational Georgian
                          </small>
                        </span>
                      </div>
                      <div>
                        <Globe2 />
                        <span>
                          <b>Search English, Russian, Georgian, or Latin</b>
                          <small>Get to the useful phrase quickly</small>
                        </span>
                      </div>
                      <div>
                        <Download />
                        <span>
                          <b>Pay once and keep access</b>
                          <small>No subscription for the phrase library</small>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <CalendarDays />
                        <span>
                          <b>Five-minute daily lessons</b>
                          <small>A clear next step every day</small>
                        </span>
                      </div>
                      <div>
                        <Brain />
                        <span>
                          <b>Progress, XP, quizzes, and streaks</b>
                          <small>Your learning record syncs securely</small>
                        </span>
                      </div>
                      <div>
                        <ShieldCheck />
                        <span>
                          <b>Cancel from account settings</b>
                          <small>
                            Simple billing controls when checkout launches
                          </small>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="premium-plan-stack">
                  {upgradeFocus === 'phrasebook' ? (
                    <div className="premium-price-card phrasebook-pro-card">
                      <span>
                        {hasPhrasebookProAccess
                          ? 'Lifetime access active'
                          : 'Pay once · Keep forever'}
                      </span>
                      <h2>
                        ₾60 <small>once</small>
                      </h2>
                      <h3>Phrasebook Pro</h3>
                      <p>
                        1,000+ searchable words and practical sentences,
                        examples, context, pronunciation, and offline packs as
                        the expanded catalog launches.
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
                  ) : (
                    <div className="premium-price-card">
                      <span>
                        {hasLearningAccess ? 'Active subscription' : 'Premium'}
                      </span>
                      <h2>
                        ₾19.99 <small>/ month</small>
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
                            ? 'Subscribe for ₾19.99'
                            : 'Sign in to subscribe'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <aside className="app-teacher-card">
                <img
                  src="/kristina-beridze-640.avif"
                  width="640"
                  height="427"
                  loading="lazy"
                  decoding="async"
                  alt="Kristina Beridze, Georgian and Russian language teacher in Batumi"
                />
                <div>
                  <span>
                    {locale === 'ru'
                      ? 'Живые занятия'
                      : locale === 'ka'
                        ? 'ცოცხალი გაკვეთილები'
                        : 'Learn with a teacher'}
                  </span>
                  <h2>Kristina Beridze</h2>
                  <p>
                    {locale === 'ru'
                      ? 'Грузинский для русскоговорящих — онлайн или в Батуми, от 20 ₾ за занятие.'
                      : locale === 'ka'
                        ? 'ქართული რუსულენოვანთათვის და რუსული ქართულენოვანთათვის — ონლაინ ან ბათუმში.'
                        : 'Georgian lessons for Russian speakers, online or in Batumi, from ₾20 per lesson.'}
                  </p>
                  <div className="app-teacher-actions">
                    <a
                      className="teacher-whatsapp"
                      href="https://wa.me/995571010750"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle /> WhatsApp
                    </a>
                    <a
                      href="https://www.kristinalanguages.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {locale === 'ru' ? 'Подробнее' : 'View details'}{' '}
                      <ChevronRight />
                    </a>
                  </div>
                </div>
              </aside>
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
                <p>{locale === 'ru' ? 'Привет' : 'Hello'}</p>
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
                  <button>{locale === 'ru' ? 'Привет' : 'Hello'}</button>
                  <button className="correct">
                    {locale === 'ru' ? 'Спасибо' : 'Thank you'} <CheckCircle2 />
                  </button>
                  <button>{locale === 'ru' ? 'До свидания' : 'Goodbye'}</button>
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
          {screen === 'settings' && (
            <section className="screen settings-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">Simple, secure, yours</span>
                  <h1>Account settings</h1>
                  <p>
                    Manage your profile, access, sessions, and billing status.
                  </p>
                </div>
              </div>
              {!user ? (
                <div className="empty-card settings-signin">
                  <UserRound />
                  <h3>Sign in to manage your account</h3>
                  <p>Your free phrasebook works without an account.</p>
                  <Button onClick={openAuth}>Sign in or create account</Button>
                </div>
              ) : (
                <div className="settings-grid">
                  <article className="settings-card settings-profile">
                    <div className="settings-card-heading">
                      <UserRound />
                      <span>
                        <b>Profile</b>
                        <small>Your contact details</small>
                      </span>
                    </div>
                    <label>
                      Display name
                      <input
                        value={settingsName}
                        maxLength={80}
                        onChange={(event) =>
                          setSettingsName(event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <Mail /> Email
                      <input
                        value={user.email ?? ''}
                        readOnly
                        aria-readonly="true"
                      />
                      <small>
                        Email changes require a secure confirmation flow.
                      </small>
                    </label>
                    <label>
                      <Phone /> Phone number <span>optional</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        maxLength={30}
                        autoComplete="tel"
                        placeholder="+995 5xx xxx xxx"
                        onChange={(event) => setPhoneNumber(event.target.value)}
                      />
                    </label>
                    <div className="settings-field">
                      Interface language
                      <LanguageMenu locale={locale} onChange={changeLocale} />
                    </div>
                    <Button
                      onClick={() => void saveSettings()}
                      disabled={settingsBusy}
                    >
                      Save changes
                    </Button>
                  </article>

                  <article className="settings-card">
                    <div className="settings-card-heading">
                      <MonitorSmartphone />
                      <span>
                        <b>Sessions & security</b>
                        <small>Control account access</small>
                      </span>
                    </div>
                    <div className="device-row">
                      <span className="device-icon">
                        <MonitorSmartphone />
                      </span>
                      <span>
                        <b>{deviceLabel}</b>
                        <small>Current signed-in session</small>
                      </span>
                      <i>Active</i>
                    </div>
                    <p className="settings-note">
                      For privacy, GEO does not build a device-history profile.
                      You can still remotely sign out every other active
                      session.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => void signOutOtherDevices()}
                      disabled={settingsBusy}
                    >
                      Sign out other devices
                    </Button>
                    <button
                      className="settings-text-action"
                      onClick={() =>
                        supabase &&
                        void supabase.auth.signOut({ scope: 'local' })
                      }
                    >
                      <LogOut /> Sign out this device
                    </button>
                  </article>

                  <article className="settings-card settings-billing">
                    <div className="settings-card-heading">
                      <CreditCard />
                      <span>
                        <b>Plans & billing</b>
                        <small>Clear, no hidden products</small>
                      </span>
                    </div>
                    <div className="plan-status">
                      <span>
                        <b>Phrasebook Pro</b>
                        <small>₾60 one-time</small>
                      </span>
                      <i className={hasPhrasebookProAccess ? 'active' : ''}>
                        {hasPhrasebookProAccess ? 'Active' : 'Not owned'}
                      </i>
                    </div>
                    <div className="plan-status">
                      <span>
                        <b>Guided Learning</b>
                        <small>₾19.99 / month</small>
                      </span>
                      <i className={hasLearningAccess ? 'active' : ''}>
                        {hasLearningAccess ? 'Active' : 'Not active'}
                      </i>
                    </div>
                    <p className="settings-note">
                      GEO never stores card or bank details. When checkout is
                      connected, payment methods, invoices, and cancellation
                      will be managed through the secure billing provider.
                    </p>
                    <Button
                      onClick={() => {
                        setUpgradeFocus(
                          hasPhrasebookProAccess ? 'guided' : 'phrasebook',
                        );
                        setScreen('premium');
                      }}
                    >
                      View available plan
                    </Button>
                  </article>

                  <article className="settings-card danger-card">
                    <div className="settings-card-heading">
                      <Trash2 />
                      <span>
                        <b>Delete account</b>
                        <small>Permanent and irreversible</small>
                      </span>
                    </div>
                    <p>
                      This removes your profile, saved phrases, progress,
                      streaks, and activity.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger className="delete-account-trigger">
                        Delete my account
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete your GEO account?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently deletes your account and learning
                            data. It cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep account</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => void deleteAccount()}
                            disabled={settingsBusy}
                          >
                            Delete permanently
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </article>
                  {settingsStatus && (
                    <output className="settings-status">
                      {settingsStatus}
                    </output>
                  )}
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
            <span>{t('explore')}</span>
          </button>
          <button className={learnNav ? 'active' : ''} onClick={openLearning}>
            <BookOpen />
            <span>{t('learn')}</span>
          </button>
          <button
            className={screen === 'saved' ? 'active' : ''}
            onClick={() => setScreen('saved')}
          >
            <Bookmark />
            <span>{t('saved')}</span>
          </button>
          <button
            className={screen === 'progress' ? 'active' : ''}
            onClick={openProgress}
          >
            <BarChart3 />
            <span>{t('progress')}</span>
          </button>
        </nav>
      </div>
    </main>
  );
}

function AuthDialog({
  open,
  onOpenChange,
  locale,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
}) {
  const t = (key: string) => getCopy(locale, key);
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
            {mode === 'signin' ? t('authTitleIn') : t('authTitleUp')}
          </DialogTitle>
          <DialogDescription>{t('authBody')}</DialogDescription>
        </DialogHeader>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              {t('displayName')}
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={80}
              />
            </label>
          )}
          <label>
            {t('email')}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            {t('password')}
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
              ? t('pleaseWait')
              : mode === 'signin'
                ? t('signIn')
                : t('createAccount')}
          </Button>
        </form>
        <button
          className="auth-switch"
          onClick={() => {
            setMode((value) => (value === 'signin' ? 'signup' : 'signin'));
            setStatus('');
          }}
        >
          {mode === 'signin' ? t('newAccount') : t('existingAccount')}
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<'marketing' | 'app'>('marketing');
  const [initialAppScreen, setInitialAppScreen] = useState<Screen>('explore');
  const [siteUser, setSiteUser] = useState<User | null>(null);
  const [siteDisplayName, setSiteDisplayName] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [languageChoiceOpen, setLanguageChoiceOpen] = useState(false);
  const [modal, setModal] = useState<'install' | 'pricing' | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const changeLocale = useCallback((nextLocale: Locale) => {
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    localStorage.setItem('geo-interface-language', nextLocale);
  }, []);
  useEffect(() => {
    const savedLocale = localStorage.getItem('geo-interface-language');
    const preferredLocale = (navigator.languages?.[0] ?? navigator.language)
      .toLowerCase()
      .split('-')[0];
    const browserLocale: Locale =
      preferredLocale === 'ru' ? 'ru' : preferredLocale === 'ka' ? 'ka' : 'en';
    window.setTimeout(() => {
      if (
        savedLocale === 'ru' ||
        savedLocale === 'ka' ||
        savedLocale === 'en'
      ) {
        changeLocale(savedLocale);
      } else {
        setLocale(browserLocale);
        document.documentElement.lang = browserLocale;
        setLanguageChoiceOpen(true);
      }
    }, 0);
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      location.hash === '#app' ||
      new URLSearchParams(location.search).get('mode') === 'app'
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
  }, [changeLocale]);
  useEffect(() => {
    if (
      mode === 'app' ||
      window.matchMedia('(display-mode: standalone)').matches ||
      location.hash === '#app' ||
      new URLSearchParams(location.search).get('mode') === 'app'
    )
      return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const syncPublicAccount = async (
      activeUser: User | null,
      client: SupabaseClient,
    ) => {
      if (!active) return;
      setSiteUser(activeUser);
      if (!activeUser) {
        setSiteDisplayName(null);
        return;
      }
      const { data } = await client
        .from('profiles')
        .select('display_name')
        .eq('id', activeUser.id)
        .maybeSingle();
      if (active) setSiteDisplayName(data?.display_name ?? null);
    };
    const timer = window.setTimeout(() => {
      void import('@/lib/supabase/client').then(async (supabaseModule) => {
        if (!active || !supabaseModule.isSupabaseConfigured) return;
        const client = supabaseModule.createClient();
        const { data } = await client.auth.getUser();
        await syncPublicAccount(data.user, client);
        const { data: listener } = client.auth.onAuthStateChange(
          (_event, session) => {
            void syncPublicAccount(session?.user ?? null, client);
          },
        );
        unsubscribe = () => listener.subscription.unsubscribe();
      });
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
      unsubscribe?.();
    };
  }, [mode]);
  const openApp = () => {
    document.documentElement.dataset.appMode = 'true';
    setInitialAppScreen('explore');
    setMode('app');
    history.replaceState(null, '', '#app');
    window.scrollTo(0, 0);
  };
  const openAccount = () => {
    document.documentElement.dataset.appMode = 'true';
    setInitialAppScreen('settings');
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
    delete document.documentElement.dataset.appMode;
    setMode('marketing');
    history.replaceState(null, '', location.pathname);
    window.scrollTo(0, 0);
  };
  return (
    <>
      {mode === 'marketing' ? (
        <Marketing
          openApp={openApp}
          installApp={() => void installApp()}
          openAuth={() => setAuthOpen(true)}
          openAccount={openAccount}
          user={siteUser}
          displayName={siteDisplayName}
          locale={locale}
          onLocaleChange={changeLocale}
        />
      ) : (
        <AppShell
          exitToSite={exitToSite}
          openModal={setModal}
          openAuth={() => setAuthOpen(true)}
          initialScreen={initialAppScreen}
          locale={locale}
          onLocaleChange={changeLocale}
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
                <strong>₾60</strong>
              </div>
              <div className="recommended">
                <span>
                  <b>Guided Learning</b>
                  <small>Structured learning and progress</small>
                </span>
                <strong>₾19.99/mo</strong>
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
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} locale={locale} />
      <Dialog open={languageChoiceOpen}>
        <DialogContent
          className="language-choice-dialog"
          showCloseButton={false}
        >
          <DialogHeader>
            <span className="dialog-icon">
              <Globe2 />
            </span>
            <DialogTitle>Choose your language</DialogTitle>
            <DialogDescription>
              Select the translation you want to see under Georgian phrases.
              We’ll remember it on this device.
            </DialogDescription>
          </DialogHeader>
          <div className="language-choice-grid">
            <button
              className={locale === 'en' ? 'selected' : ''}
              onClick={() => {
                changeLocale('en');
                setLanguageChoiceOpen(false);
              }}
            >
              <b>English</b>
              <span>Hello</span>
            </button>
            <button
              className={locale === 'ru' ? 'selected' : ''}
              onClick={() => {
                changeLocale('ru');
                setLanguageChoiceOpen(false);
              }}
            >
              <b>Русский</b>
              <span>Привет</span>
            </button>
            <button
              className={locale === 'ka' ? 'selected' : ''}
              onClick={() => {
                changeLocale('ka');
                setLanguageChoiceOpen(false);
              }}
            >
              <b>ქართული</b>
              <span>ინტერფეისი ქართულად</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
