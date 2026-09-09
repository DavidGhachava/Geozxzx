"use client";
/* eslint-disable next/no-img-element */
/* eslint-disable next/no-html-link-for-pages */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  ArrowLeft,
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
  Share2,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CookieNotice } from "@/components/cookie-notice";
import { MarketingFooter } from "@/components/marketing-footer";
import wordAudioManifest from "@/lib/word-audio-manifest.json";
import { wordLibrary, type WordEntry } from "@/lib/word-library";
import {
  speakingUnit,
  speakingUnitTitles,
  type SpeakingStep,
} from "@/lib/speaking-unit";
import {
  LanguageMenu,
  type InterfaceLocale as Locale,
} from "@/components/language-menu";
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
} from "@/components/ui/alert-dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Screen =
  | "explore"
  | "words"
  | "all"
  | "category"
  | "saved"
  | "learn"
  | "lesson-preview"
  | "premium"
  | "daily"
  | "lesson"
  | "quiz"
  | "progress"
  | "settings";
type InstallPlatform = "ios" | "android" | "desktop";
type CategoryName =
  | "Essentials"
  | "Food & Cafés"
  | "Transport"
  | "Shopping"
  | "Emergencies"
  | "Meeting People";
type Phrase = {
  id?: string;
  category_slug?: string;
  ka: string;
  tr: string;
  en: string;
  ru: string;
  audio_url?: string | null;
};

type WordMemory = {
  wordId: string;
  unitNumber: number;
  timesPracticed: number;
  correctAnswers: number;
  mistakeCount: number;
  masteryLevel: number;
  lastResult: boolean | null;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
};

type LearningFocus =
  | "general_speaking"
  | "social"
  | "cafe"
  | "work"
  | "shopping"
  | "transport"
  | "home"
  | "health"
  | "services";
type ExperienceLevel = "brand_new" | "some_basics" | "conversational";
type LearningPace = "gentle" | "steady" | "intensive";
type DiscoverySource =
  "search" | "friend" | "social_media" | "community" | "work" | "other";

type LearnerPreferences = {
  primaryGoal: LearningFocus;
  focusAreas: LearningFocus[];
  experienceLevel: ExperienceLevel;
  learningPace: LearningPace;
  customFocus: string;
  discoverySource: DiscoverySource | "";
};

const defaultLearnerPreferences: LearnerPreferences = {
  primaryGoal: "general_speaking",
  focusAreas: ["social"],
  experienceLevel: "brand_new",
  learningPace: "steady",
  customFocus: "",
  discoverySource: "",
};

const focusUnits: Record<LearningFocus, number[]> = {
  general_speaking: [1, 2, 3, 4, 5, 6, 7, 8],
  social: [1, 8],
  cafe: [2, 1],
  work: [6, 1],
  shopping: [3, 1],
  transport: [4, 1],
  home: [5, 1],
  health: [7, 1],
  services: [6, 4, 1],
};

const focusLabels: Record<LearningFocus, Record<Locale, string>> = {
  general_speaking: {
    en: "Everyday speaking",
    ru: "Повседневная речь",
    ka: "ყოველდღიური საუბარი",
  },
  social: {
    en: "Talking with people",
    ru: "Общение с людьми",
    ka: "ადამიანებთან საუბარი",
  },
  cafe: {
    en: "Cafés and restaurants",
    ru: "Кафе и рестораны",
    ka: "კაფეები და რესტორნები",
  },
  work: { en: "Work", ru: "Работа", ka: "სამსახური" },
  shopping: { en: "Shopping", ru: "Покупки", ka: "საყიდლები" },
  transport: {
    en: "Transport and directions",
    ru: "Транспорт и дорога",
    ka: "ტრანსპორტი და გზა",
  },
  home: {
    en: "Home and neighbours",
    ru: "Дом и соседи",
    ka: "სახლი და მეზობლები",
  },
  health: {
    en: "Health and pharmacy",
    ru: "Здоровье и аптека",
    ka: "ჯანმრთელობა და აფთიაქი",
  },
  services: {
    en: "Services and appointments",
    ru: "Услуги и встречи",
    ka: "სერვისები და შეხვედრები",
  },
};

function splitIntoMicroLessons<T>(items: T[], maximum = 3) {
  if (!items.length) return [[]] as T[][];
  const lessonCount = Math.ceil(items.length / maximum);
  const baseSize = Math.floor(items.length / lessonCount);
  const largerLessons = items.length % lessonCount;
  const lessons: T[][] = [];
  let offset = 0;

  for (let index = 0; index < lessonCount; index += 1) {
    const size = baseSize + (index < largerLessons ? 1 : 0);
    lessons.push(items.slice(offset, offset + size));
    offset += size;
  }

  return lessons;
}

const reviewIntervals = [1, 3, 7, 14, 30];

function phraseMeaning(phrase: Phrase, locale: Locale) {
  return locale === "ru" ? phrase.ru : phrase.en;
}

function normalizeLessonAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLessonAnswerCorrect(
  answer: string,
  word: WordEntry,
  locale: Locale,
) {
  const expected = locale === "ru" ? word.ru : word.en;
  const accepted = expected
    .split("/")
    .flatMap((value) => [value, value.replace(/\([^)]*\)/g, "")]);
  const normalizedAnswer = normalizeLessonAnswer(answer);
  return accepted.some(
    (value) => normalizeLessonAnswer(value) === normalizedAnswer,
  );
}

const categories: {
  name: CategoryName;
  count: number;
  icon: typeof Heart;
  tone: string;
}[] = [
  { name: "Essentials", count: 14, icon: Heart, tone: "wine" },
  { name: "Food & Cafés", count: 9, icon: Coffee, tone: "coral" },
  { name: "Transport", count: 9, icon: Bus, tone: "sage" },
  { name: "Shopping", count: 7, icon: ShoppingBag, tone: "gold" },
  { name: "Emergencies", count: 6, icon: ShieldPlus, tone: "red" },
  { name: "Meeting People", count: 5, icon: Users, tone: "green" },
];

const phrases: Record<CategoryName, Phrase[]> = {
  Essentials: [
    { ka: "გამარჯობა", tr: "gamarjoba", en: "Hello", ru: "Привет" },
    { ka: "მადლობა", tr: "madloba", en: "Thank you", ru: "Спасибо" },
    { ka: "ნახვამდის", tr: "nakhvamdis", en: "Goodbye", ru: "До свидания" },
    { ka: "გთხოვთ", tr: "gtkhovt", en: "Please", ru: "Пожалуйста" },
    { ka: "დიახ", tr: "diakh", en: "Yes", ru: "Да" },
    { ka: "არა", tr: "ara", en: "No", ru: "Нет" },
    { ka: "ბოდიში", tr: "bodishi", en: "Excuse me / Sorry", ru: "Извините" },
    {
      ka: "დილა მშვიდობისა",
      tr: "dila mshvidobisa",
      en: "Good morning",
      ru: "Доброе утро",
    },
    {
      ka: "საღამო მშვიდობისა",
      tr: "saghamo mshvidobisa",
      en: "Good evening",
      ru: "Добрый вечер",
    },
    {
      ka: "არ მესმის",
      tr: "ar mesmis",
      en: "I do not understand",
      ru: "Я не понимаю",
    },
    {
      ka: "ინგლისურად საუბრობთ?",
      tr: "inglisurad saubrobt?",
      en: "Do you speak English?",
      ru: "Вы говорите по-английски?",
    },
    {
      ka: "რუსულად საუბრობთ?",
      tr: "rusulad saubrobt?",
      en: "Do you speak Russian?",
      ru: "Вы говорите по-русски?",
    },
    {
      ka: "შეგიძლიათ გაიმეოროთ?",
      tr: "shegidzliat gaimeorot?",
      en: "Can you repeat?",
      ru: "Можете повторить?",
    },
    {
      ka: "უფრო ნელა, გთხოვთ",
      tr: "upro nela, gtkhovt",
      en: "More slowly, please",
      ru: "Помедленнее, пожалуйста",
    },
  ],
  "Food & Cafés": [
    {
      ka: "ერთი ყავა, გთხოვთ",
      tr: "erti qava, gtkhovt",
      en: "One coffee, please",
      ru: "Один кофе, пожалуйста",
    },
    {
      ka: "მენიუ შეიძლება?",
      tr: "meniu sheidzleba?",
      en: "May I see the menu?",
      ru: "Можно меню?",
    },
    {
      ka: "უგემრიელესია",
      tr: "ugemrielesia",
      en: "It is delicious",
      ru: "Это очень вкусно",
    },
    {
      ka: "წყალი, გთხოვთ",
      tr: "tsqali, gtkhovt",
      en: "Water, please",
      ru: "Воду, пожалуйста",
    },
    {
      ka: "ანგარიში, გთხოვთ",
      tr: "angarishi, gtkhovt",
      en: "The bill, please",
      ru: "Счёт, пожалуйста",
    },
    {
      ka: "ვეგეტარიანული კერძი გაქვთ?",
      tr: "vegetarianuli kerzi gakvt?",
      en: "Do you have a vegetarian dish?",
      ru: "У вас есть вегетарианское блюдо?",
    },
    {
      ka: "უშაქროდ, გთხოვთ",
      tr: "ushakrod, gtkhovt",
      en: "Without sugar, please",
      ru: "Без сахара, пожалуйста",
    },
    {
      ka: "ალერგია მაქვს",
      tr: "alergia makvs",
      en: "I have an allergy",
      ru: "У меня аллергия",
    },
    {
      ka: "ცხარე არ მინდა",
      tr: "tskhare ar minda",
      en: "I do not want it spicy",
      ru: "Я не хочу острое",
    },
  ],
  Transport: [
    {
      ka: "ბათუმამდე, გთხოვთ",
      tr: "batumamde, gtkhovt",
      en: "To Batumi, please",
      ru: "До Батуми, пожалуйста",
    },
    {
      ka: "რა ღირს ბილეთი?",
      tr: "ra ghirs bileti?",
      en: "How much is the ticket?",
      ru: "Сколько стоит билет?",
    },
    {
      ka: "აქ გააჩერეთ",
      tr: "ak gaacheret",
      en: "Stop here",
      ru: "Остановите здесь",
    },
    {
      ka: "ავტობუსის გაჩერება სად არის?",
      tr: "avtobusis gachereba sad aris?",
      en: "Where is the bus stop?",
      ru: "Где автобусная остановка?",
    },
    {
      ka: "სადგური სად არის?",
      tr: "sadguri sad aris?",
      en: "Where is the station?",
      ru: "Где вокзал?",
    },
    {
      ka: "აეროპორტში, გთხოვთ",
      tr: "aeroportshi, gtkhovt",
      en: "To the airport, please",
      ru: "В аэропорт, пожалуйста",
    },
    {
      ka: "როდის გადის?",
      tr: "rodis gadis?",
      en: "When does it leave?",
      ru: "Когда отправляется?",
    },
    {
      ka: "ეს ავტობუსი ცენტრში მიდის?",
      tr: "es avtobusi tsentrshi midis?",
      en: "Does this bus go to the center?",
      ru: "Этот автобус идёт в центр?",
    },
    {
      ka: "მარჯვნივ თუ მარცხნივ?",
      tr: "marjvniv tu martskhniv?",
      en: "Right or left?",
      ru: "Направо или налево?",
    },
  ],
  Shopping: [
    {
      ka: "რა ღირს?",
      tr: "ra ghirs?",
      en: "How much is it?",
      ru: "Сколько это стоит?",
    },
    {
      ka: "ბარათით შეიძლება?",
      tr: "baratit sheidzleba?",
      en: "Can I pay by card?",
      ru: "Можно оплатить картой?",
    },
    { ka: "ეს მინდა", tr: "es minda", en: "I want this", ru: "Я хочу это" },
    {
      ka: "სხვა ზომა გაქვთ?",
      tr: "skhva zoma gakvt?",
      en: "Do you have another size?",
      ru: "У вас есть другой размер?",
    },
    {
      ka: "ნაღდი ფულით შეიძლება?",
      tr: "naghdi pulit sheidzleba?",
      en: "Can I pay in cash?",
      ru: "Можно наличными?",
    },
    {
      ka: "ქვითარი, გთხოვთ",
      tr: "kvitari, gtkhovt",
      en: "A receipt, please",
      ru: "Чек, пожалуйста",
    },
    {
      ka: "ძალიან ძვირია",
      tr: "dzalian dzviria",
      en: "It is very expensive",
      ru: "Это очень дорого",
    },
  ],
  Emergencies: [
    { ka: "დამეხმარეთ!", tr: "damekhmaret!", en: "Help me!", ru: "Помогите!" },
    {
      ka: "ექიმი მჭირდება",
      tr: "ekimi mchirdeba",
      en: "I need a doctor",
      ru: "Мне нужен врач",
    },
    {
      ka: "პოლიცია გამოიძახეთ",
      tr: "politsia gamoidzakhet",
      en: "Call the police",
      ru: "Вызовите полицию",
    },
    {
      ka: "სასწრაფო დახმარება გამოიძახეთ",
      tr: "sastsrapo dakhmareba gamoidzakhet",
      en: "Call an ambulance",
      ru: "Вызовите скорую помощь",
    },
    {
      ka: "დავიკარგე",
      tr: "davikarge",
      en: "I am lost",
      ru: "Я заблудился / заблудилась",
    },
    {
      ka: "აფთიაქი სად არის?",
      tr: "aptiaki sad aris?",
      en: "Where is the pharmacy?",
      ru: "Где аптека?",
    },
  ],
  "Meeting People": [
    {
      ka: "რა გქვიათ?",
      tr: "ra gkviat?",
      en: "What is your name?",
      ru: "Как вас зовут?",
    },
    {
      ka: "სასიამოვნოა",
      tr: "sasiamovnoa",
      en: "Nice to meet you",
      ru: "Приятно познакомиться",
    },
    { ka: "მე მქვია…", tr: "me mkvia…", en: "My name is…", ru: "Меня зовут…" },
    {
      ka: "საიდან ხართ?",
      tr: "saidan khart?",
      en: "Where are you from?",
      ru: "Откуда вы?",
    },
    {
      ka: "ქართულს ვსწავლობ",
      tr: "kartuls vstsavlob",
      en: "I am learning Georgian",
      ru: "Я учу грузинский",
    },
  ],
};

const categoryLabels: Record<Locale, Record<CategoryName, string>> = {
  en: {
    Essentials: "Essentials",
    "Food & Cafés": "Food & Cafés",
    Transport: "Transport",
    Shopping: "Shopping",
    Emergencies: "Emergencies",
    "Meeting People": "Meeting People",
  },
  ru: {
    Essentials: "Основы",
    "Food & Cafés": "Еда и кафе",
    Transport: "Транспорт",
    Shopping: "Покупки",
    Emergencies: "Экстренные ситуации",
    "Meeting People": "Знакомства",
  },
  ka: {
    Essentials: "ძირითადი ფრაზები",
    "Food & Cafés": "საკვები და კაფე",
    Transport: "ტრანსპორტი",
    Shopping: "შოპინგი",
    Emergencies: "გადაუდებელი შემთხვევები",
    "Meeting People": "გაცნობა",
  },
};

const localeCopy: Record<Locale, Record<string, string>> = {
  en: {
    language: "Language",
    menu: "Toggle navigation",
    why: "Why GEO",
    locations: "Batumi & Tbilisi",
    phrasebook: "Phrasebook",
    pricing: "Pricing",
    install: "Install",
    useWeb: "Use on web",
    heroEyebrow: "Learn Georgian in Batumi & Tbilisi",
    heroTitle: "Speak Georgian for real life.",
    heroBody:
      "Learn three useful words at a time, then practice the situations you actually face in Georgia.",
    openFree: "Try a 3-word lesson",
    installApp: "Install the app",
    freeAccess: "400 curated essentials",
    secureSync: "Secure saved phrases",
    threeLanguages: "English · Русский · ქართული",
    whyKicker: "Made for real life",
    whyTitle: "Useful Georgian, without the clutter.",
    visiting: "Visiting Georgia",
    visitingBody: "Handle cafés, transport, shopping, and directions.",
    living: "Living here",
    livingBody: "Keep everyday language ready when you need it.",
    connecting: "Meeting people",
    connectingBody: "Start conversations with clear, practical phrases.",
    localKicker: "Learn where you live",
    localTitle: "Made for Batumi, Tbilisi, and everyday Georgia.",
    localBody:
      "Search in English or Russian while learning Georgian script and pronunciation.",
    batumiTitle: "Georgian for life by the Black Sea",
    batumiBody: "Cafés, transport, shopping, directions, and neighbors.",
    batumiLink: "Georgian in Batumi",
    tbilisiTitle: "Speak through the capital",
    tbilisiBody: "Metro trips, restaurants, markets, services, and workdays.",
    tbilisiLink: "Georgian in Tbilisi",
    russianTitle: "Made approachable for Russian speakers",
    russianBody:
      "Use Russian meanings while learning Georgian script and sound.",
    russianLink: "For Russian speakers",
    teacherKicker: "Learn with a real teacher",
    teacherTitle: "Want personal help speaking Georgian?",
    teacherBody:
      "Kristina Beridze teaches Georgian to Russian-speaking students with calm explanations and practical conversation.",
    children: "Children and adults",
    online: "Online or in Batumi",
    fromPrice: "From 20 ₾ per lesson",
    meetTeacher: "Meet Kristina and check availability",
    teacherCard:
      "Georgian for Russian speakers, taught in Russian and Georgian. Individual, mini-group, and online formats.",
    searchKicker: "Four-way phrasebook",
    searchTitle: "Search the way you think.",
    searchBody:
      "Type Georgian, transliteration, English, or Russian. Every form stays together.",
    audioNote: "Tap the speaker to hear Georgian pronunciation.",
    explorePhrasebook: "Explore the phrasebook",
    situations: "Six useful situations",
    situationsTitle: "From your first hello to finding your way.",
    howKicker: "How GEO works",
    howTitle: "Useful from the first minute.",
    stepFree: "Start with trusted essentials",
    stepFreeBody: "Search 400 curated, translated, and recorded words.",
    stepSave: "Save what matters",
    stepSaveBody: "Sign in only when you want your saved list on every device.",
    stepLearn: "Follow your own plan",
    stepLearnBody:
      "Choose your goals and get tiny lessons weighted toward them.",
    pricingKicker: "Free public beta",
    pricingTitle:
      "Use the complete learning beta while we make it launch-ready.",
    pricingBody:
      "Payments are not active. The curated starter, extended dictionary, and eight learning units are open during beta.",
    freeForever: "Curated starter",
    practicalPhrasebook: "Practical phrasebook",
    freePlanBody:
      "400 curated words with translations, pronunciation, and saves.",
    openPhrasebook: "Open phrasebook",
    lifetime: "Lifetime access",
    proBody:
      "An extended 9,000-word reference dictionary, clearly separated from the curated core.",
    explorePro: "Search the dictionary",
    premium: "Personalized beta",
    guidedBody:
      "Eight practical units, tiny lessons, memory review, progress, XP, and streaks.",
    viewDetails: "Explore the course",
    trustKicker: "Private by design",
    trustTitle: "Your learning belongs to you.",
    trustBody:
      "Guest browsing stays open. Signed-in profiles, saves, progress, and streaks are isolated per account.",
    faqKicker: "Quick answers",
    faqTitle: "Before you begin.",
    faqFreeQ: "What can I use for free?",
    faqFreeA:
      "The current public beta includes 400 curated essentials, the extended dictionary, and all eight learning units.",
    faqProQ: "Are all 9,000 words curated?",
    faqProA:
      "No. The first 400 are reviewed and recorded. The extended dictionary is a useful reference and is clearly labeled as beta content.",
    faqGuidedQ: "How are daily lessons personalized?",
    faqGuidedA:
      "Your main goal shapes about two thirds of new words. Everyday speaking and overdue memory review always stay in the lesson.",
    faqInstallQ: "Can I install GEO?",
    faqInstallA:
      "Yes. GEO is an installable web app with a cached core interface and offline fallback.",
    finalTitle: "Your next Georgian phrase is one tap away.",
    finalBody: "Open the full free starter phrasebook now—no account required.",
    explore: "Explore",
    learn: "Learn",
    saved: "Saved",
    progress: "Progress",
    website: "Website",
    signIn: "Sign in",
    signOut: "Sign out",
    planActive: "Your plan is active",
    perMonth: "Free beta",
    learnGeorgian: "Learn Georgian",
    guestIntro:
      "Start with curated essentials or choose a real-life situation.",
    welcomeBack: "Welcome back",
    guidedProgress: "Guided progress",
    searchPlaceholder: "Search Georgian, transliteration, English or Russian",
    searchResults: "Search results",
    found: "found",
    noPhrase: "No phrase found",
    searchHint: "Try “coffee”, “morning” or “ticket”.",
    freeReady: "400 curated essentials ready",
    browseSituation: "Browse by situation",
    sixCategories: "6 categories",
    freePhrases: "free phrases",
    allCategories: "All categories",
    practicalGeorgian: "Practical Georgian",
    moreComing: "More words and phrases are coming",
    moreComingBody:
      "Continue in the extended dictionary or follow a personalized learning path.",
    viewPlans: "View plans",
    savedPhrases: "Saved phrases",
    savedSync: "Synced securely across your devices.",
    signToSave: "Sign in to save and sync phrases.",
    noSaved: "No saved phrases yet",
    removeSaved: "Remove saved phrase",
    savePhrase: "Save phrase",
    createAccount: "Create account",
    authTitleIn: "Sign in to GEO",
    authTitleUp: "Create your GEO account",
    authBody:
      "Save phrases, your learning plan, and lesson progress across devices.",
    displayName: "Display name",
    email: "Email",
    password: "Password",
    pleaseWait: "Please wait…",
    newAccount: "New to GEO? Create an account",
    existingAccount: "Already have an account? Sign in",
  },
  ru: {
    language: "Язык",
    menu: "Открыть навигацию",
    why: "Почему GEO",
    locations: "Батуми и Тбилиси",
    phrasebook: "Разговорник",
    pricing: "Цены",
    install: "Установить",
    useWeb: "Открыть в браузере",
    heroEyebrow: "Грузинский для жизни в Батуми и Тбилиси",
    heroTitle: "Говорите по-грузински в реальной жизни.",
    heroBody:
      "Найдите нужную фразу, послушайте произношение и сохраните её. Для русскоязычных жителей и гостей Грузии.",
    openFree: "Попробовать урок из 3 слов",
    installApp: "Установить приложение",
    freeAccess: "400 проверенных слов",
    secureSync: "Безопасная синхронизация",
    threeLanguages: "English · Русский · ქართული",
    whyKicker: "Для реальной жизни",
    whyTitle: "Полезный грузинский — без лишнего.",
    visiting: "В поездке по Грузии",
    visitingBody: "Кафе, транспорт, покупки и дорога.",
    living: "Для жизни здесь",
    livingBody: "Нужные слова всегда под рукой.",
    connecting: "Для общения",
    connectingBody: "Начните разговор с понятных практических фраз.",
    localKicker: "Учитесь там, где живёте",
    localTitle: "Для Батуми, Тбилиси и повседневной жизни в Грузии.",
    localBody:
      "Ищите на русском или английском и осваивайте грузинское письмо и произношение.",
    batumiTitle: "Грузинский для жизни у Чёрного моря",
    batumiBody: "Кафе, транспорт, покупки, дорога и соседи.",
    batumiLink: "Грузинский в Батуми",
    tbilisiTitle: "Говорите в столице",
    tbilisiBody: "Метро, рестораны, рынки, услуги и рабочие будни.",
    tbilisiLink: "Грузинский в Тбилиси",
    russianTitle: "Понятно для русскоязычных",
    russianBody:
      "Русские значения помогают освоить грузинское письмо и звучание.",
    russianLink: "Для русскоязычных",
    teacherKicker: "Занятия с преподавателем",
    teacherTitle: "Нужна личная помощь с грузинским?",
    teacherBody:
      "Кристина Беридзе обучает русскоязычных учеников: спокойные объяснения и живая разговорная практика.",
    children: "Дети и взрослые",
    online: "Онлайн или в Батуми",
    fromPrice: "От 20 ₾ за урок",
    meetTeacher: "Познакомиться с Кристиной",
    teacherCard:
      "Грузинский для русскоязычных. Индивидуальные, мини-групповые и онлайн-занятия на русском и грузинском.",
    searchKicker: "Разговорник в четырёх формах",
    searchTitle: "Ищите так, как думаете.",
    searchBody:
      "Введите грузинский текст, транслитерацию, английское или русское значение.",
    audioNote: "Нажмите на динамик, чтобы услышать произношение.",
    explorePhrasebook: "Открыть разговорник",
    situations: "Шесть ситуаций",
    situationsTitle: "От первого приветствия до поиска дороги.",
    howKicker: "Как работает GEO",
    howTitle: "Полезно с первой минуты.",
    stepFree: "Начните с проверенных основ",
    stepFreeBody: "Поиск по четырём формам без аккаунта и оплаты.",
    stepSave: "Сохраняйте нужное",
    stepSaveBody:
      "Войдите, только если хотите синхронизацию между устройствами.",
    stepLearn: "Следуйте своему плану",
    stepLearnBody:
      "Выберите цели и получайте короткие уроки по своим интересам.",
    pricingKicker: "Бесплатная публичная бета",
    pricingTitle: "Используйте всю учебную бету, пока мы готовим запуск.",
    pricingBody:
      "Оплата пока не работает. Все восемь разделов и словарь открыты в публичной бете.",
    freeForever: "Бесплатно навсегда",
    practicalPhrasebook: "Практический разговорник",
    freePlanBody: "400 проверенных слов с переводом, аудио и сохранением.",
    openPhrasebook: "Открыть разговорник",
    lifetime: "Навсегда",
    proBody:
      "Расширенный справочный словарь на 9 000 слов, отдельно от проверенной основы.",
    explorePro: "Искать в словаре",
    premium: "Персональная бета",
    guidedBody:
      "Восемь практических разделов, короткие уроки, повторение, прогресс и XP.",
    viewDetails: "Открыть курс",
    trustKicker: "Конфиденциальность",
    trustTitle: "Ваш прогресс принадлежит вам.",
    trustBody:
      "Гостевой просмотр открыт. Данные каждого вошедшего пользователя защищены отдельно.",
    faqKicker: "Короткие ответы",
    faqTitle: "Перед началом.",
    faqFreeQ: "Что доступно бесплатно?",
    faqFreeA:
      "Публичная бета включает 400 проверенных слов, расширенный словарь и восемь учебных разделов.",
    faqProQ: "Все 9 000 слов проверены?",
    faqProA:
      "Нет. Первые 400 проверены и озвучены. Расширенный словарь помечен как справочный бета-материал.",
    faqGuidedQ: "Как персонализируются уроки?",
    faqGuidedA:
      "Около двух третей новых слов связаны с вашей целью. Основы речи и повторение всегда остаются в уроке.",
    faqInstallQ: "Можно установить GEO?",
    faqInstallA:
      "Да. GEO устанавливается как веб-приложение и имеет офлайн-экран.",
    finalTitle: "Следующая грузинская фраза — в одном нажатии.",
    finalBody: "Откройте полный бесплатный набор из 50 фраз без регистрации.",
    explore: "Обзор",
    learn: "Учиться",
    saved: "Сохранённые",
    progress: "Прогресс",
    website: "Сайт",
    signIn: "Войти",
    signOut: "Выйти",
    planActive: "Подписка активна",
    perMonth: "Бесплатная бета",
    learnGeorgian: "Учить грузинский",
    guestIntro:
      "Все 50 бесплатных фраз готовы. Вход нужен только для сохранения.",
    welcomeBack: "С возвращением",
    guidedProgress: "Учебный прогресс",
    searchPlaceholder:
      "Поиск на грузинском, русском, английском или по транслитерации",
    searchResults: "Результаты поиска",
    found: "найдено",
    noPhrase: "Фраза не найдена",
    searchHint: "Попробуйте «кофе», «утро» или «билет».",
    freeReady: "400 проверенных слов готовы",
    browseSituation: "Выберите ситуацию",
    sixCategories: "6 категорий",
    freePhrases: "бесплатных фраз",
    allCategories: "Все категории",
    practicalGeorgian: "Практический грузинский",
    moreComing: "Скоро появятся новые слова и фразы",
    moreComingBody: "Бесплатный набор уже полный. Pro расширит каталог.",
    viewPlans: "Посмотреть тарифы",
    savedPhrases: "Сохранённые фразы",
    savedSync: "Безопасно синхронизируются на ваших устройствах.",
    signToSave: "Войдите, чтобы сохранять и синхронизировать фразы.",
    noSaved: "Пока нет сохранённых фраз",
    removeSaved: "Удалить из сохранённых",
    savePhrase: "Сохранить фразу",
    createAccount: "Создать аккаунт",
    authTitleIn: "Войти в GEO",
    authTitleUp: "Создать аккаунт GEO",
    authBody:
      "Сохраняйте фразы на всех устройствах. История обучения доступна с активной подпиской.",
    displayName: "Имя",
    email: "Электронная почта",
    password: "Пароль",
    pleaseWait: "Подождите…",
    newAccount: "Впервые в GEO? Создать аккаунт",
    existingAccount: "Уже есть аккаунт? Войти",
  },
  ka: {
    language: "ენა",
    menu: "ნავიგაციის გახსნა",
    why: "რატომ GEO",
    locations: "ბათუმი და თბილისი",
    phrasebook: "ფრაზები",
    pricing: "ფასები",
    install: "დაყენება",
    useWeb: "ვებვერსიის გახსნა",
    heroEyebrow: "ქართული ბათუმსა და თბილისში ცხოვრებისთვის",
    heroTitle: "ისაუბრეთ ქართულად ყოველდღიურ ცხოვრებაში.",
    heroBody:
      "იპოვეთ საჭირო ფრაზა, მოუსმინეთ გამოთქმას და შეინახეთ. შექმნილია საქართველოში მცხოვრები და ჩამოსული ადამიანებისთვის.",
    openFree: "სცადეთ 3-სიტყვიანი გაკვეთილი",
    installApp: "აპის დაყენება",
    freeAccess: "400 შემოწმებული სიტყვა",
    secureSync: "უსაფრთხო სინქრონიზაცია",
    threeLanguages: "English · Русский · ქართული",
    whyKicker: "რეალური ცხოვრებისთვის",
    whyTitle: "სასარგებლო ქართული ზედმეტის გარეშე.",
    visiting: "საქართველოში მოგზაურობა",
    visitingBody: "კაფე, ტრანსპორტი, საყიდლები და მიმართულებები.",
    living: "აქ ცხოვრება",
    livingBody: "საჭირო სიტყვები ყოველთვის ხელმისაწვდომია.",
    connecting: "ადამიანებთან ურთიერთობა",
    connectingBody: "დაიწყეთ საუბარი მარტივი და პრაქტიკული ფრაზებით.",
    localKicker: "ისწავლეთ იქ, სადაც ცხოვრობთ",
    localTitle: "ბათუმისთვის, თბილისისთვის და ყოველდღიური საქართველოსთვის.",
    localBody:
      "მოძებნეთ ინგლისურად ან რუსულად და ისწავლეთ ქართული დამწერლობა და გამოთქმა.",
    batumiTitle: "ქართული შავი ზღვისპირეთში ცხოვრებისთვის",
    batumiBody: "კაფე, ტრანსპორტი, საყიდლები, მიმართულებები და მეზობლები.",
    batumiLink: "ქართული ბათუმში",
    tbilisiTitle: "ისაუბრეთ დედაქალაქში",
    tbilisiBody: "მეტრო, რესტორნები, ბაზრები, მომსახურება და სამუშაო დღეები.",
    tbilisiLink: "ქართული თბილისში",
    russianTitle: "მარტივად რუსულენოვანთათვის",
    russianBody:
      "რუსული მნიშვნელობები ქართული დამწერლობისა და ჟღერადობის სწავლაში გეხმარებათ.",
    russianLink: "რუსულენოვანთათვის",
    teacherKicker: "ისწავლეთ მასწავლებელთან",
    teacherTitle: "გჭირდებათ პირადი დახმარება ქართულში?",
    teacherBody:
      "კრისტინა ბერიძე რუსულენოვან მოსწავლეებს ქართულს მშვიდი ახსნითა და პრაქტიკული საუბრით ასწავლის.",
    children: "ბავშვები და მოზრდილები",
    online: "ონლაინ ან ბათუმში",
    fromPrice: "გაკვეთილი 20 ₾-დან",
    meetTeacher: "გაიცანით კრისტინა",
    teacherCard:
      "ქართული რუსულენოვანთათვის. ინდივიდუალური, მცირე ჯგუფისა და ონლაინ გაკვეთილები რუსულ და ქართულ ენებზე.",
    searchKicker: "ოთხფორმიანი ფრაზების წიგნი",
    searchTitle: "მოძებნეთ ისე, როგორც ფიქრობთ.",
    searchBody:
      "შეიყვანეთ ქართული, ტრანსლიტერაცია, ინგლისური ან რუსული მნიშვნელობა.",
    audioNote: "გამოთქმის მოსასმენად დააჭირეთ დინამიკს.",
    explorePhrasebook: "ფრაზების გახსნა",
    situations: "ექვსი სიტუაცია",
    situationsTitle: "პირველი მისალმებიდან გზის პოვნამდე.",
    howKicker: "როგორ მუშაობს GEO",
    howTitle: "სასარგებლოა პირველივე წუთიდან.",
    stepFree: "დაიწყეთ შემოწმებული საფუძვლებით",
    stepFreeBody: "მოძებნეთ ოთხივე ფორმით ანგარიშისა და გადახდის გარეშე.",
    stepSave: "შეინახეთ საჭირო ფრაზები",
    stepSaveBody: "შედით მხოლოდ მოწყობილობებს შორის სინქრონიზაციისთვის.",
    stepLearn: "მიჰყევით საკუთარ გეგმას",
    stepLearnBody:
      "აირჩიეთ მიზნები და მიიღეთ თქვენს ინტერესებზე მორგებული მოკლე გაკვეთილები.",
    pricingKicker: "უფასო საჯარო ბეტა",
    pricingTitle: "გამოიყენეთ სრული სასწავლო ბეტა გაშვებამდე.",
    pricingBody:
      "გადახდა ჯერ არ მუშაობს. რვავე ნაწილი და ლექსიკონი საჯარო ბეტაში ღიაა.",
    freeForever: "უფასოდ სამუდამოდ",
    practicalPhrasebook: "პრაქტიკული ფრაზები",
    freePlanBody: "400 შემოწმებული სიტყვა თარგმანით, აუდიოთი და შენახვით.",
    openPhrasebook: "ფრაზების გახსნა",
    lifetime: "სამუდამო წვდომა",
    proBody:
      "9 000-სიტყვიანი გაფართოებული საცნობარო ლექსიკონი, შემოწმებული ბირთვისგან განცალკევებით.",
    explorePro: "ლექსიკონში ძიება",
    premium: "პერსონალური ბეტა",
    guidedBody:
      "რვა პრაქტიკული ნაწილი, მოკლე გაკვეთილები, გამეორება, პროგრესი და XP.",
    viewDetails: "კურსის გახსნა",
    trustKicker: "კონფიდენციალურობა",
    trustTitle: "თქვენი პროგრესი თქვენ გეკუთვნით.",
    trustBody:
      "სტუმრის რეჟიმი ღიაა. ავტორიზებული მომხმარებლების მონაცემები ერთმანეთისგან დაცულია.",
    faqKicker: "მოკლე პასუხები",
    faqTitle: "დაწყებამდე.",
    faqFreeQ: "რა არის უფასო?",
    faqFreeA:
      "საჯარო ბეტა მოიცავს 400 შემოწმებულ სიტყვას, გაფართოებულ ლექსიკონს და რვა სასწავლო ნაწილს.",
    faqProQ: "9 000-ვე სიტყვა შემოწმებულია?",
    faqProA:
      "არა. პირველი 400 სიტყვა შემოწმებული და გახმოვანებულია. გაფართოებული ლექსიკონი საცნობარო ბეტა მასალაა.",
    faqGuidedQ: "როგორ ხდება გაკვეთილების პერსონალიზაცია?",
    faqGuidedA:
      "ახალი სიტყვების დაახლოებით ორი მესამედი თქვენს მიზანს მიჰყვება. სასაუბრო საფუძვლები და გამეორება ყოველთვის რჩება.",
    faqInstallQ: "შემიძლია GEO-ს დაყენება?",
    faqInstallA:
      "დიახ. GEO დაყენებადი ვებაპია ქეშირებული ინტერფეისითა და ოფლაინ ეკრანით.",
    finalTitle: "შემდეგი ქართული ფრაზა ერთი შეხებითაა ხელმისაწვდომი.",
    finalBody: "გახსენით 50-ფრაზიანი უფასო ნაკრები რეგისტრაციის გარეშე.",
    explore: "ძიება",
    learn: "სწავლა",
    saved: "შენახული",
    progress: "პროგრესი",
    website: "ვებსაიტი",
    signIn: "შესვლა",
    signOut: "გასვლა",
    planActive: "გეგმა აქტიურია",
    perMonth: "უფასო ბეტა",
    learnGeorgian: "ისწავლეთ ქართული",
    guestIntro:
      "ყველა 50 უფასო ფრაზა მზადაა. შესვლა მხოლოდ შესანახადაა საჭირო.",
    welcomeBack: "კეთილი დაბრუნება",
    guidedProgress: "სასწავლო პროგრესი",
    searchPlaceholder: "ძიება ქართულად, ინგლისურად, რუსულად ან ტრანსლიტერაციით",
    searchResults: "ძიების შედეგები",
    found: "ნაპოვნია",
    noPhrase: "ფრაზა ვერ მოიძებნა",
    searchHint: "სცადეთ „ყავა“, „დილა“ ან „ბილეთი“.",
    freeReady: "400 შემოწმებული სიტყვა მზადაა",
    browseSituation: "აირჩიეთ სიტუაცია",
    sixCategories: "6 კატეგორია",
    freePhrases: "უფასო ფრაზა",
    allCategories: "ყველა კატეგორია",
    practicalGeorgian: "პრაქტიკული ქართული",
    moreComing: "მეტი სიტყვა და ფრაზა მალე დაემატება",
    moreComingBody:
      "უფასო საწყისი ნაკრები დასრულებულია. Pro კატალოგს გააფართოებს.",
    viewPlans: "გეგმების ნახვა",
    savedPhrases: "შენახული ფრაზები",
    savedSync: "უსაფრთხოდ სინქრონიზდება თქვენს მოწყობილობებზე.",
    signToSave: "ფრაზების შესანახად და სინქრონიზაციისთვის შედით.",
    noSaved: "შენახული ფრაზები ჯერ არ არის",
    removeSaved: "შენახულიდან წაშლა",
    savePhrase: "ფრაზის შენახვა",
    createAccount: "ანგარიშის შექმნა",
    authTitleIn: "GEO-ში შესვლა",
    authTitleUp: "GEO ანგარიშის შექმნა",
    authBody:
      "შეინახეთ ფრაზები ყველა მოწყობილობაზე. სწავლების ისტორია აქტიურ გამოწერას საჭიროებს.",
    displayName: "სახელი",
    email: "ელფოსტა",
    password: "პაროლი",
    pleaseWait: "დაელოდეთ…",
    newAccount: "ახალი ხართ GEO-ში? შექმენით ანგარიში",
    existingAccount: "უკვე გაქვთ ანგარიში? შედით",
  },
};

function getCopy(locale: Locale, key: string) {
  return localeCopy[locale][key] ?? localeCopy.en[key] ?? key;
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "GEO",
      description:
        "Practical Georgian learning for life in Batumi, Tbilisi, and across Georgia.",
      inLanguage: ["en", "ru", "ka"],
    },
    {
      "@type": "SoftwareApplication",
      name: "GEO — Learn Georgian",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web, Android, iOS, Windows, macOS",
      description:
        "Personalized Georgian speaking practice in three-word mini lessons, with a curated audio core and a larger reference dictionary.",
      inLanguage: ["en", "ru", "ka"],
      areaServed: [
        { "@type": "City", name: "Batumi" },
        { "@type": "City", name: "Tbilisi" },
        { "@type": "Country", name: "Georgia" },
      ],
      offers: {
        "@type": "Offer",
        name: "Public beta access",
        price: 0,
        priceCurrency: "GEL",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are all 9,000 dictionary entries curated lessons?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The 400-word speaking core is curated with audio and powers lessons. The larger 9,000-word dictionary is a beta reference tool for broader lookup.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need an account to use GEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Guests can browse the phrasebook and dictionary. An account lets GEO personalize the lesson path and synchronize saved words and progress.",
          },
        },
        {
          "@type": "Question",
          name: "Can I install GEO as an app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. GEO is an installable progressive web app on supported browsers and can be added to an iPhone or iPad home screen from Safari.",
          },
        },
        {
          "@type": "Question",
          name: "Is GEO useful for Russian speakers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Phrase entries include Russian meanings alongside Georgian, transliteration, and English.",
          },
        },
      ],
    },
  ],
};

const wordAudioIds = new Set(wordAudioManifest);

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
  onPrime,
  large = false,
}: {
  id: string;
  playing: string | null;
  onPlay: (id: string, text?: string, audioUrl?: string | null) => void;
  text?: string;
  audioUrl?: string | null;
  onPrime?: (audioUrl: string) => void;
  large?: boolean;
}) {
  const active = playing === id;
  return (
    <button
      className={`audio-button ${large ? "audio-large" : ""} ${active ? "is-playing" : ""}`}
      onClick={() => onPlay(id, text, audioUrl)}
      onFocus={() => audioUrl && onPrime?.(audioUrl)}
      onPointerDown={() => audioUrl && onPrime?.(audioUrl)}
      onPointerEnter={() => audioUrl && onPrime?.(audioUrl)}
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
  const play = (id: string, text?: string, audioUrl?: string | null) => {
    setPlaying(id);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener("ended", () => setPlaying(null), { once: true });
      void audio.play().catch(() => setPlaying(null));
    }
    window.setTimeout(() => setPlaying(null), 5000);
  };
  const goHome = () => {
    setMenuOpen(false);
    history.replaceState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header">
        <Brand onHome={goHome} />
        <nav className="desktop-nav" aria-label={t("menu")}>
          <a href="#why">{t("why")}</a>
          <a href="#locations">{t("locations")}</a>
          <a href="#phrases">{t("phrasebook")}</a>
          <a href="#pricing">{t("pricing")}</a>
        </nav>
        <div className="header-actions">
          <LanguageMenu
            locale={locale}
            onChange={onLocaleChange}
            label={t("language")}
          />
          <button
            className="marketing-account"
            onClick={user ? openAccount : openAuth}
          >
            <UserRound />
            {user
              ? (displayName ?? user.email?.split("@")[0] ?? "Account")
              : t("signIn")}
          </button>
          <button className="open-app-link" onClick={openApp}>
            {t("useWeb")} <ChevronRight />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("menu")}
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
              {t("why")}
            </a>
            <a href="#locations" onClick={() => setMenuOpen(false)}>
              {t("locations")}
            </a>
            <a href="#phrases" onClick={() => setMenuOpen(false)}>
              {t("phrasebook")}
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              {t("pricing")}
            </a>
            <button onClick={installApp}>{t("installApp")}</button>
            <button onClick={user ? openAccount : openAuth}>
              {user
                ? `${displayName ?? user.email?.split("@")[0] ?? "Account"} · Settings`
                : t("signIn")}
            </button>
            <button onClick={openApp}>{t("useWeb")}</button>
          </nav>
        )}
      </header>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">{t("heroEyebrow")}</span>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroBody")}</p>
          <div className="hero-buttons">
            <Button className="primary-cta shiny-button" onClick={openApp}>
              {t("openFree")} <ChevronRight />
            </Button>
            <button className="secondary-cta" onClick={installApp}>
              <Download /> {t("installApp")}
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <CheckCircle2 /> {t("freeAccess")}
            </span>
            <span>
              <ShieldCheck /> {t("secureSync")}
            </span>
            <span>
              <Globe2 /> {t("threeLanguages")}
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
            <span className="mini-pill">{t("audioNote")}</span>
            <div className="mini-phrase">
              <strong>გამარჯობა</strong>
              <em>gamarjoba</em>
              <p>{locale === "ru" ? "Привет" : "Hello"}</p>
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
        <div className="section-kicker">{t("whyKicker")}</div>
        <h2>{t("whyTitle")}</h2>
        <div className="audience-grid">
          <article>
            <Plane />
            <span>
              <b>{t("visiting")}</b>
              <p>{t("visitingBody")}</p>
            </span>
          </article>
          <article>
            <Home />
            <span>
              <b>{t("living")}</b>
              <p>{t("livingBody")}</p>
            </span>
          </article>
          <article>
            <Users />
            <span>
              <b>{t("connecting")}</b>
              <p>{t("connectingBody")}</p>
            </span>
          </article>
        </div>
      </section>
      <section className="local-section" id="locations">
        <div>
          <span className="section-kicker">{t("localKicker")}</span>
          <h2>{t("localTitle")}</h2>
          <p>{t("localBody")}</p>
        </div>
        <div className="local-grid">
          <article>
            <span>Batumi</span>
            <h3>{t("batumiTitle")}</h3>
            <p>{t("batumiBody")}</p>
            <a href="/learn-georgian-batumi">
              {t("batumiLink")} <ChevronRight />
            </a>
          </article>
          <article>
            <span>Tbilisi</span>
            <h3>{t("tbilisiTitle")}</h3>
            <p>{t("tbilisiBody")}</p>
            <a href="/learn-georgian-tbilisi">
              {t("tbilisiLink")} <ChevronRight />
            </a>
          </article>
          <article>
            <span>Русский → ქართული</span>
            <h3>{t("russianTitle")}</h3>
            <p>{t("russianBody")}</p>
            <a href="/learn-georgian-for-russian-speakers">
              {t("russianLink")} <ChevronRight />
            </a>
          </article>
        </div>
      </section>
      <section className="teacher-section" id="teacher">
        <div className="teacher-copy">
          <span className="section-kicker">{t("teacherKicker")}</span>
          <h2>{t("teacherTitle")}</h2>
          <p>{t("teacherBody")}</p>
          <div className="teacher-facts" aria-label="Lesson options">
            <span>
              <Users /> {t("children")}
            </span>
            <span>
              <Globe2 /> {t("online")}
            </span>
            <span>
              <CheckCircle2 /> {t("fromPrice")}
            </span>
          </div>
          <a
            className="teacher-cta"
            href="https://www.kristinalanguages.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("meetTeacher")} <ChevronRight />
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
            <p>{t("teacherCard")}</p>
          </div>
        </aside>
      </section>
      <section className="demo-pricing" id="phrases">
        <div className="phrase-demo">
          <span className="section-kicker">{t("searchKicker")}</span>
          <h2>{t("searchTitle")}</h2>
          <p className="section-lead">{t("searchBody")}</p>
          <div className="demo-card">
            <div>
              <strong>მადლობა</strong>
              <em>madloba</em>
              <p>{locale === "ru" ? "Спасибо" : "Thank you"}</p>
            </div>
            <AudioButton id="demo" playing={playing} onPlay={play} large />
          </div>
          <p className="demo-caption">
            <Mic2 /> {t("audioNote")}
          </p>
          <a className="text-link" href="/phrasebook">
            {t("explorePhrasebook")} <ChevronRight />
          </a>
        </div>
        <div className="category-showcase">
          <span className="section-kicker">{t("situations")}</span>
          <h2>{t("situationsTitle")}</h2>
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
        <span className="section-kicker">{t("howKicker")}</span>
        <h2>{t("howTitle")}</h2>
        <div className="how-grid">
          <article>
            <span>01</span>
            <Search />
            <h3>{t("stepFree")}</h3>
            <p>{t("stepFreeBody")}</p>
          </article>
          <article>
            <span>02</span>
            <Bookmark />
            <h3>{t("stepSave")}</h3>
            <p>{t("stepSaveBody")}</p>
          </article>
          <article>
            <span>03</span>
            <LockKeyhole />
            <h3>{t("stepLearn")}</h3>
            <p>{t("stepLearnBody")}</p>
          </article>
        </div>
      </section>
      <section className="pricing-section" id="pricing">
        <div className="pricing-heading">
          <span className="section-kicker">{t("pricingKicker")}</span>
          <h2>{t("pricingTitle")}</h2>
          <p>{t("pricingBody")}</p>
        </div>
        <div className="pricing-grid redesigned three-plans">
          <article>
            <span className="plan-state live">{t("freeForever")}</span>
            <h3>{t("practicalPhrasebook")}</h3>
            <b>Free</b>
            <p>{t("freePlanBody")}</p>
            <Button onClick={openApp}>{t("openPhrasebook")}</Button>
          </article>
          <article className="phrasebook-plan">
            <span className="plan-state pro">
              {locale === "ru"
                ? "Справочный словарь"
                : locale === "ka"
                  ? "საცნობარო ლექსიკონი"
                  : "Reference dictionary"}
            </span>
            <h3>
              {locale === "ru"
                ? "Расширенный словарь"
                : locale === "ka"
                  ? "გაფართოებული ლექსიკონი"
                  : "Extended dictionary"}
            </h3>
            <b>
              {locale === "ru" ? "Бета" : locale === "ka" ? "ბეტა" : "Beta"}
            </b>
            <p>{t("proBody")}</p>
            <button onClick={openApp}>{t("explorePro")}</button>
          </article>
          <article className="popular">
            <span className="plan-state">{t("premium")}</span>
            <h3>Guided Learning</h3>
            <b>
              {locale === "ru" ? "Открыто" : locale === "ka" ? "ღიაა" : "Open"}
            </b>
            <p>{t("guidedBody")}</p>
            <button onClick={openApp}>{t("viewDetails")}</button>
          </article>
        </div>
      </section>
      <section className="trust-section">
        <div>
          <span className="section-kicker">{t("trustKicker")}</span>
          <h2>{t("trustTitle")}</h2>
          <p>{t("trustBody")}</p>
        </div>
      </section>
      <section className="faq-section">
        <span className="section-kicker">{t("faqKicker")}</span>
        <h2>{t("faqTitle")}</h2>
        <div>
          <details>
            <summary>{t("faqFreeQ")}</summary>
            <p>{t("faqFreeA")}</p>
          </details>
          <details>
            <summary>{t("faqProQ")}</summary>
            <p>{t("faqProA")}</p>
          </details>
          <details>
            <summary>{t("faqGuidedQ")}</summary>
            <p>{t("faqGuidedA")}</p>
          </details>
          <details>
            <summary>{t("faqInstallQ")}</summary>
            <p>{t("faqInstallA")}</p>
          </details>
        </div>
      </section>
      <section className="final-cta">
        <span className="section-kicker light">{t("freeAccess")}</span>
        <h2>{t("finalTitle")}</h2>
        <p>{t("finalBody")}</p>
        <Button onClick={openApp}>
          {t("openFree")} <ChevronRight />
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
  openModal: (kind: "install" | "pricing") => void;
  openAuth: () => void;
  initialScreen?: Screen;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const t = (key: string) => getCopy(locale, key);
  const [screen, setScreen] = useState<Screen>(initialScreen ?? "words");
  const [learnSection, setLearnSection] = useState<"today" | "paths">("today");
  const [previewSource, setPreviewSource] = useState<"path" | "today">("path");
  const [todayWordIds, setTodayWordIds] = useState<string[]>([]);
  const [wordMemory, setWordMemory] = useState<Record<string, WordMemory>>({});
  const [dailyPlanStartedAt, setDailyPlanStartedAt] = useState(0);
  const [previewLessonNumber, setPreviewLessonNumber] = useState(1);
  const [previewWordIndex, setPreviewWordIndex] = useState(0);
  const [previewMicroLesson, setPreviewMicroLesson] = useState(0);
  const [previewAudioHeard, setPreviewAudioHeard] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "learn" | "test" | "scenario" | "complete"
  >("learn");
  const [dailyMicroLessonsCompleted, setDailyMicroLessonsCompleted] =
    useState(0);
  const [previewTestIndex, setPreviewTestIndex] = useState(0);
  const [previewAnswer, setPreviewAnswer] = useState("");
  const [previewResult, setPreviewResult] = useState<
    "idle" | "correct" | "wrong"
  >("idle");
  const [previewScenarioIndex, setPreviewScenarioIndex] = useState(0);
  const [previewScenarioChoice, setPreviewScenarioChoice] = useState<
    number | null
  >(null);
  const [completedSpeakingSteps, setCompletedSpeakingSteps] = useState<
    number[]
  >([]);
  const [category, setCategory] = useState<CategoryName>("Essentials");
  const [playing, setPlaying] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [visibleWords, setVisibleWords] = useState(50);
  const [allWords, setAllWords] = useState<WordEntry[]>(wordLibrary);
  const [library, setLibrary] =
    useState<Record<CategoryName, Phrase[]>>(phrases);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [settingsName, setSettingsName] = useState("");
  const [settingsStatus, setSettingsStatus] = useState("");
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [deviceLabel, setDeviceLabel] = useState("This browser");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [learnerPreferences, setLearnerPreferences] =
    useState<LearnerPreferences>(defaultLearnerPreferences);
  const dailyMicroLessonGoal =
    learnerPreferences.learningPace === "gentle"
      ? 1
      : learnerPreferences.learningPace === "intensive"
        ? 3
        : 2;
  const dailyWordTarget = dailyMicroLessonGoal * 3;
  useEffect(() => {
    const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const browser = /Edg\//.test(navigator.userAgent)
      ? "Edge"
      : /Chrome\//.test(navigator.userAgent)
        ? "Chrome"
        : /Safari\//.test(navigator.userAgent)
          ? "Safari"
          : "Browser";
    setDeviceLabel(`${mobile ? "Mobile device" : "Computer"} · ${browser}`);
    setDailyPlanStartedAt(Date.now());
  }, []);
  const [upgradeFocus, setUpgradeFocus] = useState<"phrasebook" | "guided">(
    "phrasebook",
  );
  const [, setHasLearningAccess] = useState(false);
  const canUseLearning = true; // Guided learning remains open during the public beta.
  const [, setHasPhrasebookProAccess] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    longest: 0,
    xp: 0,
    practiced: 0,
    activity: [] as { activity_date: string; xp_earned: number }[],
  });
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const audioSources = useRef(new Map<string, Promise<string>>());
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem("geo-daily-micro-lessons-v1");
    if (!stored) return;
    try {
      const progress = JSON.parse(stored) as { date?: string; count?: number };
      if (progress.date === today && Number.isFinite(progress.count))
        setDailyMicroLessonsCompleted(Math.max(0, progress.count ?? 0));
    } catch {
      localStorage.removeItem("geo-daily-micro-lessons-v1");
    }
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("geo-saved-words");
    window.setTimeout(() => {
      if (!stored) return;
      try {
        setSavedWords(JSON.parse(stored));
      } catch {
        localStorage.removeItem("geo-saved-words");
      }
    }, 0);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("geo-speaking-unit-progress-v2");
    window.setTimeout(() => {
      if (!stored) return;
      try {
        setCompletedSpeakingSteps(JSON.parse(stored));
      } catch {
        localStorage.removeItem("geo-speaking-unit-progress-v2");
      }
    }, 0);
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("geo-word-memory-v1");
    window.setTimeout(() => {
      if (!stored) return;
      try {
        setWordMemory(JSON.parse(stored));
      } catch {
        localStorage.removeItem("geo-word-memory-v1");
      }
    }, 0);
  }, []);
  useEffect(() => {
    let active = true;
    void fetch("/data/word-library-extended.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Expanded word library unavailable");
        return response.json() as Promise<{ words: string[][] }>;
      })
      .then(({ words }) => {
        if (!active) return;
        const expanded = words.map(([ka, tr, en, ru], index) => ({
          id: `word-${String(index + wordLibrary.length + 1).padStart(3, "0")}`,
          ka,
          tr,
          en,
          ru,
        }));
        setAllWords([...wordLibrary, ...expanded]);
      })
      .catch(() => {
        // The curated core remains fully usable if the extended catalog is offline.
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    void import("@/lib/supabase/client").then((supabaseModule) => {
      if (active && supabaseModule.isSupabaseConfigured)
        setSupabase(supabaseModule.createClient());
    });
    return () => {
      active = false;
    };
  }, []);
  const primeAudio = useCallback((audioUrl: string) => {
    const existing = audioSources.current.get(audioUrl);
    if (existing) return existing;
    const source = fetch(audioUrl, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Audio unavailable");
        return response.blob();
      })
      .then((blob) => URL.createObjectURL(blob))
      .catch(() => audioUrl);
    audioSources.current.set(audioUrl, source);
    return source;
  }, []);
  useEffect(
    () => () => {
      currentAudio.current?.pause();
      for (const source of audioSources.current.values()) {
        void source.then((url) => {
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        });
      }
    },
    [],
  );
  const play = async (id: string, text?: string, audioUrl?: string | null) => {
    setPlaying(id);
    const speakFallback = () => {
      if (!text || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ka-GE";
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    };
    if (audioUrl) {
      currentAudio.current?.pause();
      const audio = new Audio(await primeAudio(audioUrl));
      currentAudio.current = audio;
      audio.addEventListener("ended", () => setPlaying(null), { once: true });
      void audio.play().catch(speakFallback);
    } else speakFallback();
    window.setTimeout(() => setPlaying(null), 5000);
  };
  const phraseKey = (phrase: Phrase) => phrase.id ?? phrase.ka;
  const allPhrases = useMemo(() => Object.values(library).flat(), [library]);
  const normalizedSearch = search.trim().normalize("NFKC").toLocaleLowerCase();
  const searchTerms = useMemo(
    () => normalizedSearch.split(/\s+/).filter(Boolean),
    [normalizedSearch],
  );
  const filtered = normalizedSearch
    ? allPhrases.filter((p) => {
        const searchable = `${p.ka} ${p.tr} ${p.en} ${p.ru}`
          .normalize("NFKC")
          .toLocaleLowerCase();
        return searchTerms.every((term) => searchable.includes(term));
      })
    : [];
  const filteredWords = useMemo(
    () =>
      normalizedSearch
        ? allWords.filter((word) => {
            const searchable = `${word.ka} ${word.tr} ${word.en} ${word.ru}`
              .normalize("NFKC")
              .toLocaleLowerCase();
            return searchTerms.every((term) => searchable.includes(term));
          })
        : allWords,
    [allWords, normalizedSearch, searchTerms],
  );
  useEffect(() => {
    if (screen !== "words") return;
    const delay = normalizedSearch ? 150 : 900;
    const timer = window.setTimeout(() => {
      for (const word of filteredWords.slice(0, normalizedSearch ? 8 : 12)) {
        if (wordAudioIds.has(word.id))
          void primeAudio(`/audio/words/${word.id}.mp3`);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [filteredWords, normalizedSearch, primeAudio, screen]);
  const openCategory = (name: CategoryName) => {
    setCategory(name);
    setScreen("category");
  };
  const learnNav =
    screen === "learn" ||
    screen === "lesson-preview" ||
    screen === "premium" ||
    screen === "daily" ||
    screen === "lesson" ||
    screen === "quiz";
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
        label: date.toLocaleDateString("en", { weekday: "narrow" }),
        xp: byDate.get(key) ?? 0,
      };
    });
  }, [stats.activity]);

  const loadUserData = useCallback(
    async (activeUser: User | null) => {
      if (!supabase || !activeUser) {
        setSaved([]);
        setDisplayName(null);
        setPhoneNumber("");
        setSettingsName("");
        setHasLearningAccess(false);
        setHasPhrasebookProAccess(false);
        setOnboardingOpen(false);
        setLearnerPreferences(defaultLearnerPreferences);
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
        wordMemoryResult,
        pathProgressResult,
        learnerPreferencesResult,
      ] = await Promise.all([
        supabase.from("saved_phrases").select("phrase_id"),
        supabase
          .from("profiles")
          .select("display_name,interface_language,phone_number")
          .maybeSingle(),
        supabase
          .from("streaks")
          .select("current_streak,longest_streak")
          .maybeSingle(),
        supabase
          .from("daily_activity")
          .select("activity_date,xp_earned")
          .order("activity_date", { ascending: false })
          .limit(30),
        supabase.from("learning_progress").select("phrase_id"),
        supabase.rpc("has_guided_learning_access"),
        supabase.rpc("has_phrasebook_pro_access"),
        supabase.from("word_memory").select("*"),
        supabase.from("learning_path_progress").select("step_number"),
        supabase.from("learner_preferences").select("*").maybeSingle(),
      ]);
      setSaved((savedResult.data ?? []).map((item) => item.phrase_id));
      setDisplayName(profileResult.data?.display_name ?? null);
      setSettingsName(profileResult.data?.display_name ?? "");
      setPhoneNumber(profileResult.data?.phone_number ?? "");
      const savedLocale = profileResult.data?.interface_language;
      if (savedLocale === "en" || savedLocale === "ru" || savedLocale === "ka")
        onLocaleChange(savedLocale);
      setHasLearningAccess(accessResult.data === true);
      setHasPhrasebookProAccess(phrasebookAccessResult.data === true);
      if (learnerPreferencesResult.data) {
        const preferences: LearnerPreferences = {
          primaryGoal: learnerPreferencesResult.data.primary_goal,
          focusAreas: learnerPreferencesResult.data.focus_areas,
          experienceLevel: learnerPreferencesResult.data.experience_level,
          learningPace: learnerPreferencesResult.data.learning_pace,
          customFocus: learnerPreferencesResult.data.custom_focus ?? "",
          discoverySource: learnerPreferencesResult.data.discovery_source ?? "",
        };
        setLearnerPreferences(preferences);
        setOnboardingOpen(false);
      } else {
        setLearnerPreferences(defaultLearnerPreferences);
        setOnboardingOpen(true);
      }
      if (wordMemoryResult.data) {
        const remoteMemory: Record<string, WordMemory> = Object.fromEntries(
          wordMemoryResult.data.map((item) => [
            item.word_id,
            {
              wordId: item.word_id,
              unitNumber: item.unit_number,
              timesPracticed: item.times_practiced,
              correctAnswers: item.correct_answers,
              mistakeCount: item.mistake_count,
              masteryLevel: item.mastery_level,
              lastResult: item.last_result,
              lastReviewedAt: item.last_reviewed_at,
              nextReviewAt: item.next_review_at,
            },
          ]),
        );
        setWordMemory((localMemory) => {
          const merged = { ...remoteMemory };
          for (const [wordId, local] of Object.entries(localMemory)) {
            const remote = merged[wordId];
            if (!remote || local.timesPracticed > remote.timesPracticed)
              merged[wordId] = local;
          }
          localStorage.setItem("geo-word-memory-v1", JSON.stringify(merged));
          const rows = Object.values(merged).map((item) => ({
            user_id: activeUser.id,
            word_id: item.wordId,
            unit_number: item.unitNumber,
            times_practiced: item.timesPracticed,
            correct_answers: item.correctAnswers,
            mistake_count: item.mistakeCount,
            mastery_level: item.masteryLevel,
            last_result: item.lastResult,
            last_reviewed_at: item.lastReviewedAt,
            next_review_at: item.nextReviewAt,
          }));
          if (rows.length)
            void supabase
              .from("word_memory")
              .upsert(rows, { onConflict: "user_id,word_id" });
          return merged;
        });
      }
      if (pathProgressResult.data) {
        const remoteSteps = pathProgressResult.data.map(
          (item) => item.step_number,
        );
        setCompletedSpeakingSteps((localSteps) => {
          const merged = Array.from(new Set([...remoteSteps, ...localSteps]));
          localStorage.setItem(
            "geo-speaking-unit-progress-v2",
            JSON.stringify(merged),
          );
          const rows = merged.map((stepNumber) => ({
            user_id: activeUser.id,
            step_number: stepNumber,
            unit_number:
              speakingUnit.find((step) => step.number === stepNumber)?.unit ??
              1,
          }));
          if (rows.length)
            void supabase
              .from("learning_path_progress")
              .upsert(rows, { onConflict: "user_id,step_number" });
          return merged;
        });
      }
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
        .from("profiles")
        .update({ interface_language: nextLocale })
        .eq("id", user.id);
  };

  const saveLearnerPreferences = async (next: LearnerPreferences) => {
    if (!supabase || !user) return "Sign in to save your learning plan.";
    const { error } = await supabase.from("learner_preferences").upsert(
      {
        user_id: user.id,
        primary_goal: next.primaryGoal,
        focus_areas: next.focusAreas,
        experience_level: next.experienceLevel,
        learning_pace: next.learningPace,
        custom_focus: next.customFocus.trim() || null,
        discovery_source: next.discoverySource || null,
        onboarding_version: 1,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) return error.message;
    setLearnerPreferences(next);
    setOnboardingOpen(false);
    setDailyPlanStartedAt(Date.now());
    return null;
  };

  const navigateInApp = (next: Screen) => {
    setScreen(next);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase
      .from("phrases")
      .select(
        "id,category_slug,georgian,transliteration,english,russian,audio_url",
      )
      .order("sort_order")
      .then(({ data }) => {
        if (!active || !data?.length) return;
        const next = Object.fromEntries(
          categories.map((item) => [item.name, []]),
        ) as unknown as Record<CategoryName, Phrase[]>;
        const namesBySlug: Record<string, CategoryName> = {
          essentials: "Essentials",
          "food-cafes": "Food & Cafés",
          transport: "Transport",
          shopping: "Shopping",
          emergencies: "Emergencies",
          "meeting-people": "Meeting People",
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
          .from("saved_phrases")
          .delete()
          .eq("user_id", user.id)
          .eq("phrase_id", phrase.id)
      : await supabase
          .from("saved_phrases")
          .insert({ user_id: user.id, phrase_id: phrase.id });
    if (result.error)
      setSaved((items) =>
        wasSaved ? [...items, key] : items.filter((value) => value !== key),
      );
  };
  const toggleSavedWord = (word: WordEntry) => {
    const next = savedWords.includes(word.id)
      ? savedWords.filter((id) => id !== word.id)
      : [...savedWords, word.id];
    setSavedWords(next);
    localStorage.setItem("geo-saved-words", JSON.stringify(next));
  };

  const openLearning = () => {
    setScreen("learn");
  };
  const openProgress = () => {
    setUpgradeFocus("guided");
    setScreen(canUseLearning ? "progress" : "premium");
  };

  const saveSettings = async () => {
    if (!supabase || !user) {
      openAuth();
      return;
    }
    setSettingsBusy(true);
    setSettingsStatus("");
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: settingsName.trim() || null,
        phone_number: phoneNumber.trim() || null,
        interface_language: locale,
      })
      .eq("id", user.id);
    setSettingsBusy(false);
    if (error) {
      setSettingsStatus(error.message);
      return;
    }
    setDisplayName(settingsName.trim() || null);
    setSettingsStatus("Account details saved.");
  };

  const signOutOtherDevices = async () => {
    if (!supabase || !user) return;
    setSettingsBusy(true);
    setSettingsStatus("");
    const { error } = await supabase.auth.signOut({ scope: "others" });
    setSettingsBusy(false);
    setSettingsStatus(
      error
        ? error.message
        : "Other sessions have been signed out. Their access tokens may remain valid briefly until expiry.",
    );
  };

  const updatePassword = async () => {
    if (!supabase || !user || newPassword.length < 8) {
      setSettingsStatus("Use at least 8 characters for the new password.");
      return;
    }
    setSettingsBusy(true);
    setSettingsStatus("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSettingsBusy(false);
    if (error) {
      setSettingsStatus(error.message);
      return;
    }
    setNewPassword("");
    setSettingsStatus("Password updated securely.");
  };

  const deleteAccount = async () => {
    if (!supabase || !user) return;
    setSettingsBusy(true);
    const { error } = await supabase.functions.invoke("delete-account", {
      body: {},
    });
    if (error) {
      setSettingsBusy(false);
      setSettingsStatus(error.message);
      return;
    }
    await supabase.auth.signOut({ scope: "global" });
    setSettingsBusy(false);
    setScreen("explore");
  };

  useEffect(() => {
    if (
      !canUseLearning &&
      ["daily", "lesson", "quiz", "progress"].includes(screen)
    ) {
      const redirect = window.setTimeout(() => setScreen("premium"), 0);
      return () => window.clearTimeout(redirect);
    }
  }, [canUseLearning, screen]);

  const completeQuiz = async () => {
    if (!canUseLearning) {
      setScreen("premium");
      return;
    }
    const quizPhrase = allPhrases.find((item) => item.ka === "მადლობა");
    if (!supabase || !user || !quizPhrase?.id) {
      openAuth();
      return;
    }
    const { error } = await supabase.rpc("record_learning_activity", {
      p_phrase_id: quizPhrase.id,
      p_correct: true,
      p_lesson_completed: true,
      p_minutes: 5,
    });
    if (!error) {
      await loadUserData(user);
      setScreen("progress");
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
          name: "open_phrase_category",
          title: "Open phrase category",
          description:
            "Open one of the visible Georgian phrase categories in the app.",
          inputSchema: {
            type: "object",
            properties: { category: { type: "string", enum: categoryNames } },
            required: ["category"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input) {
            const value = (input as { category?: unknown })?.category;
            if (
              typeof value !== "string" ||
              !categoryNames.includes(value as CategoryName)
            )
              throw new Error("Choose a valid phrase category.");
            setCategory(value as CategoryName);
            setScreen("category");
            return { screen: "category", category: value };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    void Promise.resolve(
      context.registerTool(
        {
          name: "start_daily_lesson",
          title: "Start daily lesson",
          description:
            "Open the guided Georgian beta course at the learner’s next available step.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute() {
            setScreen("learn");
            return { screen: "learn", total: speakingUnit.length };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
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
              className={`save-button ${saved.includes(phraseKey(p)) ? "saved" : ""}`}
              onClick={() => void toggleSaved(p)}
              aria-label={
                saved.includes(phraseKey(p))
                  ? t("removeSaved")
                  : t("savePhrase")
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
  const renderWords = (items: WordEntry[]) => (
    <div className="word-list">
      {items.map((word) => {
        const hasAudio = wordAudioIds.has(word.id);
        return (
          <article className="word-card" key={word.id}>
            <div>
              <strong>{word.ka}</strong>
              <em>{word.tr}</em>
              <p>{locale === "ru" ? word.ru || word.en : word.en}</p>
            </div>
            <div className="word-actions">
              <button
                className={`save-button ${savedWords.includes(word.id) ? "saved" : ""}`}
                onClick={() => toggleSavedWord(word)}
                aria-label={
                  savedWords.includes(word.id)
                    ? t("removeSaved")
                    : t("savePhrase")
                }
              >
                <Bookmark />
              </button>
              {hasAudio ? (
                <AudioButton
                  id={`word-audio-${word.id}`}
                  playing={playing}
                  onPlay={play}
                  onPrime={primeAudio}
                  text={word.ka}
                  audioUrl={`/audio/words/${word.id}.mp3`}
                />
              ) : (
                <button
                  className="audio-button audio-pending"
                  disabled
                  title="Audio coming soon"
                  aria-label="Audio coming soon"
                >
                  <Volume2 />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
  const appHome = () => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setScreen("words");
      window.scrollTo(0, 0);
      return;
    }
    exitToSite();
  };
  const openSpeakingStep = (lesson: (typeof speakingUnit)[number]) => {
    setPreviewSource("path");
    setPreviewLessonNumber(lesson.number);
    setPreviewWordIndex(0);
    setPreviewMicroLesson(0);
    setPreviewAudioHeard(false);
    setPreviewMode(
      lesson.kind === "review"
        ? "test"
        : lesson.kind === "scenario" || lesson.kind === "mission"
          ? "scenario"
          : "learn",
    );
    setPreviewTestIndex(0);
    setPreviewAnswer("");
    setPreviewResult("idle");
    setPreviewScenarioIndex(0);
    setPreviewScenarioChoice(null);
    setScreen("lesson-preview");
    window.scrollTo(0, 0);
  };
  const learningWords = useMemo(() => {
    const seen = new Set<string>();
    return speakingUnit.flatMap((step) =>
      step.words.flatMap((ka) => {
        const word = allWords.find((entry) => entry.ka === ka);
        if (!word || seen.has(word.id)) return [];
        seen.add(word.id);
        return [{ word, unitNumber: step.unit }];
      }),
    );
  }, [allWords]);
  const activeUnits = useMemo(() => {
    const units = new Set(
      speakingUnit
        .filter((step) => completedSpeakingSteps.includes(step.number))
        .map((step) => step.unit),
    );
    if (!units.size) units.add(1);
    return units;
  }, [completedSpeakingSteps]);
  const preferredUnits = useMemo(() => {
    const goals = Array.from(
      new Set([
        learnerPreferences.primaryGoal,
        ...learnerPreferences.focusAreas,
      ]),
    );
    const units = new Set(goals.flatMap((goal) => focusUnits[goal]));
    units.add(1);
    return units;
  }, [learnerPreferences]);
  const dailyPlan = useMemo(() => {
    const now = dailyPlanStartedAt;
    const records = Object.values(wordMemory);
    const weak = records
      .filter(
        (item) =>
          item.lastResult === false ||
          (item.mistakeCount > 0 && item.masteryLevel < 3),
      )
      .sort(
        (a, b) =>
          b.mistakeCount - a.mistakeCount || a.masteryLevel - b.masteryLevel,
      );
    const due = records
      .filter(
        (item) =>
          item.nextReviewAt &&
          new Date(item.nextReviewAt).getTime() <= now &&
          !weak.some((weakItem) => weakItem.wordId === item.wordId),
      )
      .sort(
        (a, b) =>
          new Date(a.nextReviewAt ?? 0).getTime() -
          new Date(b.nextReviewAt ?? 0).getTime(),
      );
    const reviewIds = [...weak, ...due]
      .map((item) => item.wordId)
      .filter((id) => allWords.some((word) => word.id === id))
      .slice(0, Math.min(3, Math.max(1, dailyWordTarget - 2)));
    const focusedNew = learningWords.filter(
      ({ word, unitNumber }) =>
        preferredUnits.has(unitNumber) && !wordMemory[word.id],
    );
    const universalNew = learningWords.filter(
      ({ word, unitNumber }) =>
        unitNumber === 1 &&
        !wordMemory[word.id] &&
        !focusedNew.some((item) => item.word.id === word.id),
    );
    const activeNew = learningWords.filter(
      ({ word, unitNumber }) =>
        activeUnits.has(unitNumber) &&
        !wordMemory[word.id] &&
        !focusedNew.some((item) => item.word.id === word.id) &&
        !universalNew.some((item) => item.word.id === word.id),
    );
    const fallbackNew = learningWords.filter(
      ({ word }) =>
        !wordMemory[word.id] &&
        !focusedNew.some((item) => item.word.id === word.id) &&
        !universalNew.some((item) => item.word.id === word.id) &&
        !activeNew.some((item) => item.word.id === word.id),
    );
    const remaining = Math.max(2, dailyWordTarget - reviewIds.length);
    const focusQuota = Math.ceil(remaining * 0.67);
    const candidates = [
      ...focusedNew.slice(0, focusQuota),
      ...universalNew,
      ...focusedNew.slice(focusQuota),
      ...activeNew,
      ...fallbackNew,
    ];
    const newIds = Array.from(
      new Set(candidates.map(({ word }) => word.id)),
    ).slice(0, remaining);
    return {
      ids: [...reviewIds, ...newIds].slice(0, dailyWordTarget),
      reviewCount: reviewIds.length,
      newCount: Math.min(newIds.length, dailyWordTarget - reviewIds.length),
      focusLabel: focusLabels[learnerPreferences.primaryGoal][locale],
    };
  }, [
    activeUnits,
    allWords,
    dailyPlanStartedAt,
    dailyWordTarget,
    learnerPreferences,
    learningWords,
    locale,
    preferredUnits,
    wordMemory,
  ]);
  const startTodayLesson = () => {
    if (!dailyPlan.ids.length) return;
    setTodayWordIds(dailyPlan.ids);
    setPreviewSource("today");
    setPreviewLessonNumber(0);
    setPreviewWordIndex(0);
    setPreviewMicroLesson(0);
    setPreviewAudioHeard(false);
    setPreviewMode("learn");
    setPreviewTestIndex(0);
    setPreviewAnswer("");
    setPreviewResult("idle");
    setScreen("lesson-preview");
    window.scrollTo(0, 0);
  };
  const recordWordResult = (
    word: WordEntry,
    unitNumber: number,
    correct: boolean,
  ) => {
    const now = new Date();
    setWordMemory((current) => {
      const previous = current[word.id];
      const masteryLevel = Math.min(
        5,
        Math.max(0, (previous?.masteryLevel ?? 0) + (correct ? 1 : -1)),
      );
      const nextReview = new Date(now);
      if (correct)
        nextReview.setDate(
          nextReview.getDate() + reviewIntervals[Math.max(0, masteryLevel - 1)],
        );
      else nextReview.setHours(nextReview.getHours() + 4);
      const next: Record<string, WordMemory> = {
        ...current,
        [word.id]: {
          wordId: word.id,
          unitNumber,
          timesPracticed: (previous?.timesPracticed ?? 0) + 1,
          correctAnswers: (previous?.correctAnswers ?? 0) + (correct ? 1 : 0),
          mistakeCount: (previous?.mistakeCount ?? 0) + (correct ? 0 : 1),
          masteryLevel,
          lastResult: correct,
          lastReviewedAt: now.toISOString(),
          nextReviewAt: nextReview.toISOString(),
        },
      };
      localStorage.setItem("geo-word-memory-v1", JSON.stringify(next));
      return next;
    });
    if (supabase && user)
      void supabase.rpc("record_word_learning_activity", {
        p_word_id: word.id,
        p_unit_number: unitNumber,
        p_correct: correct,
      });
  };
  return (
    <main
      className={`app-view ${screen === "lesson-preview" ? "immersive-lesson" : ""}`}
    >
      <aside className="app-sidebar">
        <Brand onHome={appHome} />
        <nav>
          <button
            className={
              screen === "explore" || screen === "all" || screen === "category"
                ? "active"
                : ""
            }
            onClick={() => setScreen("explore")}
          >
            <Compass />
            {t("explore")}
          </button>
          <button
            className={screen === "words" ? "active" : ""}
            onClick={() => setScreen("words")}
          >
            <Search />
            {locale === "ru" ? "Слова" : locale === "ka" ? "სიტყვები" : "Words"}
          </button>
          <button
            className={screen === "saved" ? "active" : ""}
            onClick={() => setScreen("saved")}
          >
            <Bookmark />
            {t("saved")}
          </button>
          <button
            className={screen === "progress" || learnNav ? "active" : ""}
            onClick={openLearning}
          >
            <BookOpen />
            {t("learn")}
          </button>
          <button
            className={screen === "settings" ? "active" : ""}
            onClick={() => setScreen("settings")}
          >
            <Settings />
            Settings
          </button>
        </nav>
        <button
          className="sidebar-premium"
          onClick={() => setOnboardingOpen(true)}
        >
          <Star />
          <span>
            <b>Your learning plan</b>
            <small>{focusLabels[learnerPreferences.primaryGoal][locale]}</small>
          </span>
          <ChevronRight />
        </button>
        <button className="back-to-site" onClick={exitToSite}>
          <ArrowLeft /> {t("website")}
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button
            className="mobile-app-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={
              locale === "ru"
                ? "Открыть меню"
                : locale === "ka"
                  ? "მენიუს გახსნა"
                  : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-app-menu"
          >
            <Menu />
          </button>
          <Brand onHome={appHome} />
          <div className="app-top-actions">
            <LanguageMenu
              locale={locale}
              onChange={changeLocale}
              label={t("language")}
            />
            <button
              className="account-button"
              onClick={() => (user ? setScreen("settings") : openAuth())}
            >
              {user ? <UserRound /> : <LogIn />}
              {user
                ? (displayName ?? user.email?.split("@")[0] ?? "Account")
                : t("signIn")}
            </button>
          </div>
        </header>
        {mobileMenuOpen && (
          <div className="mobile-app-menu-layer">
            <button
              className="mobile-app-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside
              id="mobile-app-menu"
              className="mobile-app-menu"
              aria-label="App menu"
            >
              <div className="mobile-app-menu-head">
                <Brand onHome={appHome} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>
              <nav>
                <button onClick={() => navigateInApp("explore")}>
                  <Compass />
                  {t("explore")}
                </button>
                <button onClick={() => navigateInApp("learn")}>
                  <BookOpen />
                  {t("learn")}
                </button>
                <button onClick={() => navigateInApp("words")}>
                  <Search />
                  {locale === "ru"
                    ? "Слова"
                    : locale === "ka"
                      ? "სიტყვები"
                      : "Words"}
                </button>
                <button onClick={() => navigateInApp("saved")}>
                  <Bookmark />
                  {t("saved")}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openProgress();
                  }}
                >
                  <Trophy />
                  {locale === "ru"
                    ? "Прогресс"
                    : locale === "ka"
                      ? "პროგრესი"
                      : "Progress"}
                </button>
                <button onClick={() => navigateInApp("settings")}>
                  <Settings />
                  {locale === "ru"
                    ? "Настройки"
                    : locale === "ka"
                      ? "პარამეტრები"
                      : "Settings"}
                </button>
              </nav>
              <div className="mobile-app-menu-secondary">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal("install");
                  }}
                >
                  <Download />
                  {locale === "ru"
                    ? "Установить приложение"
                    : locale === "ka"
                      ? "აპის დაყენება"
                      : "Install app"}
                </button>
                <a href="/help">
                  <MessageCircle />
                  {locale === "ru"
                    ? "Помощь"
                    : locale === "ka"
                      ? "დახმარება"
                      : "Help"}
                </a>
                <button onClick={exitToSite}>
                  <ArrowLeft />
                  {t("website")}
                </button>
              </div>
            </aside>
          </div>
        )}
        <div className="app-content">
          {screen === "words" && (
            <section className="screen words-screen">
              <div className="words-heading">
                <span className="app-eyebrow">
                  {locale === "ru"
                    ? `400 проверенных основ · словарь на ${allWords.length.toLocaleString("ru-RU")} слов`
                    : locale === "ka"
                      ? `400 შემოწმებული ძირითადი სიტყვა · ${allWords.length.toLocaleString("ka-GE")}-სიტყვიანი ლექსიკონი`
                      : `400 curated essentials · ${allWords.length.toLocaleString("en-US")}-word dictionary`}
                </span>
                <h1>{t("learnGeorgian")}</h1>
              </div>
              <search className="search-box word-search">
                <Search />
                <input
                  type="search"
                  aria-label={t("searchPlaceholder")}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setVisibleWords(50);
                  }}
                  placeholder={t("searchPlaceholder")}
                  enterKeyHint="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {search && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X />
                  </button>
                )}
              </search>
              <div className="word-result-count">
                <span>
                  {normalizedSearch
                    ? `${filteredWords.length} ${t("found")}`
                    : `${Math.min(visibleWords, filteredWords.length)} of ${filteredWords.length}`}
                </span>
              </div>
              {filteredWords.length ? (
                <>
                  {renderWords(filteredWords.slice(0, visibleWords))}
                  {visibleWords < filteredWords.length && (
                    <Button
                      className="load-more-words"
                      variant="outline"
                      onClick={() => setVisibleWords((count) => count + 50)}
                    >
                      {locale === "ru"
                        ? "Загрузить ещё 50"
                        : locale === "ka"
                          ? "კიდევ 50-ის ჩატვირთვა"
                          : "Load 50 more"}
                    </Button>
                  )}
                </>
              ) : (
                <div className="empty-card">
                  <Search />
                  <h3>{t("noPhrase")}</h3>
                  <p>{t("searchHint")}</p>
                </div>
              )}
            </section>
          )}
          {screen === "explore" && (
            <section className="screen explore-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">გამარჯობა · gamarjoba</span>
                  <h1>{t("learnGeorgian")}</h1>
                  <p>
                    {user
                      ? `${t("welcomeBack")}${displayName ? `, ${displayName}` : ""}.`
                      : locale === "ru"
                        ? "Найдите нужную ситуацию или начните короткий урок."
                        : locale === "ka"
                          ? "იპოვეთ საჭირო სიტუაცია ან დაიწყეთ მოკლე გაკვეთილი."
                          : "Find the situation you need or start a tiny lesson."}
                  </p>
                </div>
                <button className="streak-chip" onClick={openProgress}>
                  <LockKeyhole /> {t("guidedProgress")}
                </button>
              </div>
              <search className="search-box">
                <Search />
                <input
                  type="search"
                  aria-label={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  enterKeyHint="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {search && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X />
                  </button>
                )}
              </search>
              {normalizedSearch ? (
                <>
                  <div className="section-title">
                    <h2>{t("searchResults")}</h2>
                    <span>
                      {filtered.length} {t("found")} “{search.trim()}”
                    </span>
                  </div>
                  {filtered.length ? (
                    renderPhrases(filtered)
                  ) : (
                    <div className="empty-card">
                      <Search />
                      <h3>{t("noPhrase")}</h3>
                      <p>{t("searchHint")}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="explore-continue-card">
                    <span className="explore-continue-icon">
                      <Brain />
                    </span>
                    <span className="explore-continue-copy">
                      <small>
                        {locale === "ru"
                          ? "ВАШ ПЛАН НА СЕГОДНЯ"
                          : locale === "ka"
                            ? "თქვენი დღევანდელი გეგმა"
                            : "YOUR PLAN TODAY"}
                      </small>
                      <b>
                        {locale === "ru"
                          ? `${dailyMicroLessonGoal} ${dailyMicroLessonGoal === 1 ? "короткий урок" : "коротких урока"} · по 3 слова`
                          : locale === "ka"
                            ? `${dailyMicroLessonGoal} მოკლე გაკვეთილი · თითო 3 სიტყვა`
                            : `${dailyMicroLessonGoal} ${dailyMicroLessonGoal === 1 ? "tiny lesson" : "tiny lessons"} · 3 words each`}
                      </b>
                      <em>
                        {dailyPlan.focusLabel} · {dailyPlan.reviewCount}{" "}
                        {locale === "ru"
                          ? "на повторение"
                          : locale === "ka"
                            ? "გასამეორებელი"
                            : "to review"}
                      </em>
                    </span>
                    <button
                      onClick={startTodayLesson}
                      disabled={!dailyPlan.ids.length}
                    >
                      {locale === "ru"
                        ? "Начать"
                        : locale === "ka"
                          ? "დაწყება"
                          : "Start"}{" "}
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="library-overview">
                    <div className="library-status">
                      <CheckCircle2 />{" "}
                      <b>
                        {locale === "ru"
                          ? "400 основных слов проверены и озвучены"
                          : locale === "ka"
                            ? "400 ძირითადი სიტყვა შემოწმებულია და გახმოვანებული"
                            : "400 core words curated with audio"}
                      </b>
                    </div>
                    <div className="library-quick-actions">
                      <button onClick={() => setScreen("all")}>
                        <BookOpen />
                        {locale === "ru"
                          ? "Все 50 фраз"
                          : locale === "ka"
                            ? "50-ვე ფრაზა"
                            : "View all 50"}
                      </button>
                      <button
                        className="library-pro-action"
                        onClick={() => setScreen("words")}
                      >
                        <Search />
                        {locale === "ru"
                          ? "Словарь 9 000"
                          : locale === "ka"
                            ? "9 000-სიტყვიანი ლექსიკონი"
                            : "9,000-word dictionary"}
                      </button>
                    </div>
                  </div>
                  <div className="section-title">
                    <h2>{t("browseSituation")}</h2>
                    <span>{t("sixCategories")}</span>
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
                            {library[name].length} {t("freePhrases")}
                          </small>
                        </span>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                  <button className="learning-banner" onClick={openLearning}>
                    <span>
                      <small>
                        {locale === "ru"
                          ? "Структурированный курс · бесплатная бета"
                          : locale === "ka"
                            ? "სტრუქტურირებული კურსი · უფასო ბეტა"
                            : "Structured course · free beta"}
                      </small>
                      <b>
                        {locale === "ru"
                          ? "Короткие уроки, повторение и разговорные миссии."
                          : locale === "ka"
                            ? "მოკლე გაკვეთილები, გამეორება და სასაუბრო მისიები."
                            : "Tiny lessons, memory review, and speaking missions."}
                      </b>
                      <em>
                        {locale === "ru"
                          ? "8 разделов готовы"
                          : locale === "ka"
                            ? "8 ნაწილი მზადაა"
                            : "8 units ready"}
                      </em>
                    </span>
                    <span className="banner-action">
                      <BookOpen />{" "}
                      {locale === "ru"
                        ? "Учиться"
                        : locale === "ka"
                          ? "სწავლა"
                          : "Start learning"}
                    </span>
                  </button>
                </>
              )}
            </section>
          )}
          {screen === "all" && (
            <section className="screen all-phrases-screen">
              <button
                className="back-button"
                onClick={() => setScreen("explore")}
              >
                <ArrowLeft />
                {locale === "ru"
                  ? "Назад к обзору"
                  : locale === "ka"
                    ? "უკან მიმოხილვაზე"
                    : "Back to Explore"}
              </button>
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">{t("phrasebook")}</span>
                  <h1>
                    {locale === "ru"
                      ? "Все 50 бесплатных фраз"
                      : locale === "ka"
                        ? "50 უფასო ფრაზა"
                        : "All 50 free phrases"}
                  </h1>
                  <p>
                    {locale === "ru"
                      ? "Нажмите на динамик, чтобы услышать грузинское произношение."
                      : locale === "ka"
                        ? "ქართული გამოთქმის მოსასმენად დააჭირეთ დინამიკს."
                        : "Tap the speaker to hear the Georgian pronunciation."}
                  </p>
                </div>
              </div>
              {renderPhrases(allPhrases)}
            </section>
          )}
          {screen === "category" && (
            <section className="screen category-screen">
              <button
                className="back-button"
                onClick={() => setScreen("explore")}
              >
                <ArrowLeft /> {t("allCategories")}
              </button>
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">{t("practicalGeorgian")}</span>
                  <h1>{categoryLabels[locale][category]}</h1>
                  <p>
                    {library[category].length} {t("freePhrases")}
                  </p>
                </div>
              </div>
              {renderPhrases(library[category])}
              <div className="locked-card">
                <span className="lock-orb">
                  <LockKeyhole />
                </span>
                <div>
                  <h2>{t("moreComing")}</h2>
                  <p>{t("moreComingBody")}</p>
                </div>
                <Button onClick={() => setScreen("words")}>
                  <Search /> Search dictionary
                </Button>
              </div>
            </section>
          )}
          {screen === "saved" && (
            <section className="screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">{t("phrasebook")}</span>
                  <h1>{t("savedPhrases")}</h1>
                  <p>
                    {locale === "ru"
                      ? "Ваши сохранённые слова на этом устройстве."
                      : locale === "ka"
                        ? "ამ მოწყობილობაზე შენახული სიტყვები."
                        : "Your saved words on this device."}
                  </p>
                </div>
              </div>
              {savedWords.length ? (
                renderWords(
                  allWords.filter((word) => savedWords.includes(word.id)),
                )
              ) : (
                <div className="empty-card">
                  <Bookmark />
                  <h3>{t("noSaved")}</h3>
                  <p>
                    {user
                      ? "Tap the bookmark on any phrase to save it here."
                      : "Create an account or sign in to keep phrases across devices."}
                  </p>
                  <Button onClick={() => setScreen("words")}>
                    {locale === "ru"
                      ? "Найти слова"
                      : locale === "ka"
                        ? "სიტყვების ნახვა"
                        : "Browse words"}
                  </Button>
                </div>
              )}
            </section>
          )}
          {screen === "learn" && (
            <section className="screen lesson-path-screen">
              <div className="lesson-path-heading">
                <div>
                  <span className="app-eyebrow">
                    {locale === "ru"
                      ? "Бета-курс · 4 реальные ситуации"
                      : locale === "ka"
                        ? "ბეტა კურსი · 4 რეალური სიტუაცია"
                        : "Personalized speaking beta"}
                  </span>
                  <h1>
                    {locale === "ru"
                      ? "Говорите с первого дня"
                      : locale === "ka"
                        ? "ისაუბრეთ პირველივე დღიდან"
                        : "Learn what you need today"}
                  </h1>
                  <p>
                    {locale === "ru"
                      ? "Короткие уроки соединяют полезные слова в настоящую речь."
                      : locale === "ka"
                        ? "მოკლე გაკვეთილები საჭირო სიტყვებს რეალურ საუბრად აერთიანებს."
                        : "Today strengthens weak words. Paths let you choose the situations that matter to you."}
                  </p>
                </div>
                <span className="lesson-path-count">
                  <BookOpen />{" "}
                  {
                    completedSpeakingSteps.filter(
                      (step) => step <= speakingUnit.length,
                    ).length
                  }{" "}
                  / {speakingUnit.length}
                </span>
              </div>

              <div className="learn-section-tabs" role="tablist">
                <button
                  className={learnSection === "today" ? "active" : ""}
                  onClick={() => setLearnSection("today")}
                  role="tab"
                  aria-selected={learnSection === "today"}
                >
                  <Brain />
                  {locale === "ru"
                    ? "Сегодня"
                    : locale === "ka"
                      ? "დღეს"
                      : "Today"}
                </button>
                <button
                  className={learnSection === "paths" ? "active" : ""}
                  onClick={() => setLearnSection("paths")}
                  role="tab"
                  aria-selected={learnSection === "paths"}
                >
                  <Compass />
                  {locale === "ru"
                    ? "Направления"
                    : locale === "ka"
                      ? "მიმართულებები"
                      : "Paths"}
                </button>
              </div>

              {learnSection === "today" && (
                <div className="today-learning-panel">
                  <div className="today-learning-copy">
                    <span className="today-learning-icon">
                      <Brain />
                    </span>
                    <span>
                      <small>
                        {locale === "ru"
                          ? "ПЕРСОНАЛЬНАЯ ПРАКТИКА"
                          : locale === "ka"
                            ? "პერსონალური პრაქტიკა"
                            : "PERSONAL PRACTICE"}
                      </small>
                      <b>
                        {locale === "ru"
                          ? "Урок на сегодня"
                          : locale === "ka"
                            ? "დღევანდელი გაკვეთილი"
                            : "Today's lesson"}
                      </b>
                      <p>
                        {dailyPlan.reviewCount
                          ? locale === "ru"
                            ? "Сначала сложные и просроченные слова, затем немного нового."
                            : locale === "ka"
                              ? "ჯერ რთული და გასამეორებელი სიტყვები, შემდეგ ცოტა ახალი."
                              : "Weak and due words first, then a small amount of new language."
                          : locale === "ru"
                            ? `${dailyMicroLessonGoal === 1 ? "Один короткий урок" : `${dailyMicroLessonGoal} коротких урока`}. По три слова, затем мягкая проверка.`
                            : locale === "ka"
                              ? `${dailyMicroLessonGoal} მოკლე გაკვეთილი. სამი სიტყვა, შემდეგ მსუბუქი შემოწმება.`
                              : `${dailyMicroLessonGoal === 1 ? "One tiny lesson" : `${dailyMicroLessonGoal} tiny lessons`}. Learn three words, check them gently, then continue when you are ready.`}
                      </p>
                      <small className="today-focus-note">
                        {locale === "ru"
                          ? `Основной фокус: ${dailyPlan.focusLabel}. Общая разговорная речь и повторение всегда остаются в плане.`
                          : locale === "ka"
                            ? `მთავარი ფოკუსი: ${dailyPlan.focusLabel}. ზოგადი საუბარი და გამეორება ყოველთვის რჩება გეგმაში.`
                            : `Main focus: ${dailyPlan.focusLabel}. Everyday speaking and memory review always stay in the mix.`}
                      </small>
                    </span>
                  </div>
                  <div className="today-learning-mix">
                    <span>
                      <b>{dailyPlan.reviewCount}</b>
                      {locale === "ru"
                        ? "повторить"
                        : locale === "ka"
                          ? "გასამეორებელი"
                          : "review"}
                    </span>
                    <span>
                      <b>{dailyPlan.newCount}</b>
                      {locale === "ru"
                        ? "новых"
                        : locale === "ka"
                          ? "ახალი"
                          : "new"}
                    </span>
                    <span>
                      <b>{dailyMicroLessonGoal}</b>
                      {locale === "ru"
                        ? "мини-урока"
                        : locale === "ka"
                          ? "მინი გაკვეთილი"
                          : "mini lessons"}
                    </span>
                  </div>
                  <button
                    className="today-learning-start"
                    onClick={startTodayLesson}
                    disabled={!dailyPlan.ids.length}
                  >
                    {locale === "ru"
                      ? "Начать урок на сегодня"
                      : locale === "ka"
                        ? "დღევანდელი გაკვეთილის დაწყება"
                        : "Start today's lesson"}
                    <ChevronRight />
                  </button>
                  <button
                    className="today-view-paths"
                    onClick={() => setLearnSection("paths")}
                  >
                    {locale === "ru"
                      ? "Выбрать другое направление"
                      : locale === "ka"
                        ? "სხვა მიმართულების არჩევა"
                        : "Choose a different path"}
                  </button>
                </div>
              )}

              {learnSection === "today" && (
                <div className="daily-learning-rhythm today-explainer">
                  <span className="daily-learning-time">
                    <Flame />
                  </span>
                  <span>
                    <b>
                      {locale === "ru"
                        ? "Каждый ответ улучшает следующий урок"
                        : locale === "ka"
                          ? "ყოველი პასუხი შემდეგ გაკვეთილს აუმჯობესებს"
                          : "Every answer improves the next lesson"}
                    </b>
                    <small>
                      {locale === "ru"
                        ? "Ошибки возвращаются раньше. Уверенные слова — позже."
                        : locale === "ka"
                          ? "შეცდომები მალე ბრუნდება. კარგად ნასწავლი სიტყვები — მოგვიანებით."
                          : "Mistakes return sooner. Strong words wait longer."}
                    </small>
                  </span>
                </div>
              )}

              {learnSection === "paths" && (
                <div className="lesson-units">
                  {Object.keys(speakingUnitTitles).map((unitKey) => {
                    const unitNumber = Number(unitKey);
                    const unitLessons = speakingUnit.filter(
                      (lesson) => lesson.unit === unitNumber,
                    );
                    const firstStep = unitLessons[0]?.number ?? 1;

                    return (
                      <section className="lesson-unit" key={unitNumber}>
                        <div className="lesson-unit-heading">
                          <span>
                            {locale === "ru"
                              ? `Раздел ${unitNumber}`
                              : locale === "ka"
                                ? `ნაწილი ${unitNumber}`
                                : `Unit ${unitNumber}`}
                          </span>
                          <b>{speakingUnitTitles[unitNumber][locale]}</b>
                          <small>
                            {
                              completedSpeakingSteps.filter((stepNumber) =>
                                unitLessons.some(
                                  (step) => step.number === stepNumber,
                                ),
                              ).length
                            }
                            /{unitLessons.length}
                          </small>
                        </div>
                        <div className="lesson-path-list">
                          {unitLessons.map((lesson) => {
                            const complete = completedSpeakingSteps.includes(
                              lesson.number,
                            );
                            const locked =
                              !complete &&
                              lesson.number !== firstStep &&
                              !completedSpeakingSteps.includes(
                                lesson.number - 1,
                              );
                            const current = !complete && !locked;

                            return (
                              <button
                                className={`lesson-path-card ${lesson.kind} ${complete ? "complete" : ""} ${current ? "current" : ""} ${locked ? "locked" : ""}`}
                                key={lesson.number}
                                disabled={locked}
                                onClick={() => openSpeakingStep(lesson)}
                              >
                                <span className="lesson-path-number">
                                  {complete ? (
                                    <Check />
                                  ) : locked ? (
                                    <LockKeyhole />
                                  ) : lesson.kind === "review" ? (
                                    <Brain />
                                  ) : lesson.kind === "mission" ? (
                                    <Trophy />
                                  ) : lesson.kind === "scenario" ? (
                                    <Coffee />
                                  ) : (
                                    lesson.number
                                  )}
                                </span>
                                <span className="lesson-path-copy">
                                  <b>{lesson.title[locale]}</b>
                                  <small>
                                    {lesson.minutes} min ·{" "}
                                    {lesson.kind === "review"
                                      ? locale === "ru"
                                        ? "повторение"
                                        : locale === "ka"
                                          ? "გამეორება"
                                          : "memory review"
                                      : lesson.kind === "scenario" ||
                                          lesson.kind === "mission"
                                        ? locale === "ru"
                                          ? "разговор"
                                          : locale === "ka"
                                            ? "საუბარი"
                                            : "speaking mission"
                                        : locale === "ru"
                                          ? `${splitIntoMicroLessons(lesson.words).length} коротких урока · до 3 слов`
                                          : locale === "ka"
                                            ? `${splitIntoMicroLessons(lesson.words).length} მოკლე გაკვეთილი · მაქს. 3 სიტყვა`
                                            : `${splitIntoMicroLessons(lesson.words).length} short ${splitIntoMicroLessons(lesson.words).length === 1 ? "lesson" : "lessons"} · up to 3 words`}
                                  </small>
                                </span>
                                <span className="lesson-path-action">
                                  {locked
                                    ? locale === "ru"
                                      ? "Закрыто"
                                      : locale === "ka"
                                        ? "ჩაკეტილია"
                                        : "Locked"
                                    : complete
                                      ? locale === "ru"
                                        ? "Ещё раз"
                                        : locale === "ka"
                                          ? "თავიდან"
                                          : "Replay"
                                      : lesson.kind === "review"
                                        ? locale === "ru"
                                          ? "Повторить"
                                          : locale === "ka"
                                            ? "გამეორება"
                                            : "Review"
                                        : locale === "ru"
                                          ? "Начать"
                                          : locale === "ka"
                                            ? "დაწყება"
                                            : "Start"}
                                  {locked ? <LockKeyhole /> : <ChevronRight />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}

              {learnSection === "paths" && (
                <div className="lesson-path-footer">
                  <span>
                    {locale === "ru"
                      ? "Проверки памяти возвращают старые слова до того, как они забудутся."
                      : locale === "ka"
                        ? "მეხსიერების შემოწმება ძველ სიტყვებს დავიწყებამდე აბრუნებს."
                        : "Memory checks return older language before it fades."}
                  </span>
                </div>
              )}
            </section>
          )}
          {screen === "lesson-preview" &&
            (() => {
              const todayLesson: SpeakingStep = {
                number: 0,
                unit: 1,
                kind: "lesson",
                minutes: 7,
                title: {
                  en: "Today's lesson",
                  ru: "Урок на сегодня",
                  ka: "დღევანდელი გაკვეთილი",
                },
                subtitle: {
                  en: "Personalized memory practice",
                  ru: "Персональная тренировка памяти",
                  ka: "პერსონალური მეხსიერების ვარჯიში",
                },
                words: [],
              };
              const lesson =
                previewSource === "today"
                  ? todayLesson
                  : (speakingUnit.find(
                      (item) => item.number === previewLessonNumber,
                    ) ?? speakingUnit[0]);
              const previewWords =
                previewSource === "today"
                  ? todayWordIds
                      .map((id) => allWords.find((word) => word.id === id))
                      .filter((word): word is WordEntry => Boolean(word))
                  : lesson.words
                      .map((ka) => allWords.find((word) => word.ka === ka))
                      .filter((word): word is WordEntry => Boolean(word));
              const microLessons = splitIntoMicroLessons(previewWords);
              const segmentWords =
                microLessons[previewMicroLesson] ?? microLessons[0];
              const currentWord =
                segmentWords[
                  previewMode === "learn" ? previewWordIndex : previewTestIndex
                ] ?? segmentWords[0];
              const isLastLearningWord =
                previewWordIndex === segmentWords.length - 1;
              const isLastTestWord =
                previewTestIndex === segmentWords.length - 1;
              const hasAudio = currentWord
                ? wordAudioIds.has(currentWord.id)
                : false;
              const progressTotal =
                previewMode === "scenario"
                  ? (lesson.scenarios?.length ?? 1)
                  : lesson.kind === "review"
                    ? previewWords.length
                    : segmentWords.length * 2;
              const progressStep =
                previewMode === "complete"
                  ? progressTotal
                  : previewMode === "scenario"
                    ? previewScenarioIndex + 1
                    : lesson.kind === "review"
                      ? previewTestIndex + 1
                      : previewMode === "learn"
                        ? previewWordIndex + 1
                        : segmentWords.length + previewTestIndex + 1;
              const finishStep = (returnToLearn = true) => {
                if (previewSource === "today") {
                  localStorage.setItem(
                    "geo-last-daily-lesson",
                    new Date().toISOString(),
                  );
                  if (returnToLearn) {
                    setLearnSection("today");
                    setScreen("learn");
                  }
                  return;
                }
                const next = Array.from(
                  new Set([...completedSpeakingSteps, lesson.number]),
                );
                setCompletedSpeakingSteps(next);
                localStorage.setItem(
                  "geo-speaking-unit-progress-v2",
                  JSON.stringify(next),
                );
                if (supabase && user)
                  void supabase.from("learning_path_progress").upsert(
                    {
                      user_id: user.id,
                      step_number: lesson.number,
                      unit_number: lesson.unit,
                    },
                    { onConflict: "user_id,step_number" },
                  );
                if (returnToLearn) setScreen("learn");
              };
              const completeMicroLesson = () => {
                const nextDailyCount = dailyMicroLessonsCompleted + 1;
                setDailyMicroLessonsCompleted(nextDailyCount);
                localStorage.setItem(
                  "geo-daily-micro-lessons-v1",
                  JSON.stringify({
                    date: new Date().toISOString().slice(0, 10),
                    count: nextDailyCount,
                  }),
                );
                if (previewMicroLesson === microLessons.length - 1)
                  finishStep(false);
                setPreviewMode("complete");
              };
              const startNextMicroLesson = () => {
                setPreviewMicroLesson((index) => index + 1);
                setPreviewWordIndex(0);
                setPreviewTestIndex(0);
                setPreviewAnswer("");
                setPreviewResult("idle");
                setPreviewAudioHeard(false);
                setPreviewMode(lesson.kind === "review" ? "test" : "learn");
              };
              const continueLearning = () => {
                setPreviewAudioHeard(false);
                if (!isLastLearningWord) {
                  setPreviewWordIndex((index) => index + 1);
                  return;
                }
                setPreviewMode("test");
                setPreviewTestIndex(0);
                setPreviewAnswer("");
                setPreviewResult("idle");
              };
              const continueTest = () => {
                if (!isLastTestWord) {
                  setPreviewTestIndex((index) => index + 1);
                  setPreviewAnswer("");
                  setPreviewResult("idle");
                  return;
                }
                completeMicroLesson();
              };
              const answerLabel = currentWord
                ? locale === "ru"
                  ? currentWord.ru
                  : currentWord.en
                : "";
              const currentScenario = lesson.scenarios?.[previewScenarioIndex];
              const continueScenario = () => {
                if (
                  previewScenarioIndex <
                  (lesson.scenarios?.length ?? 1) - 1
                ) {
                  setPreviewScenarioIndex((index) => index + 1);
                  setPreviewScenarioChoice(null);
                  return;
                }
                finishStep();
              };
              return (
                <section className="screen lesson-preview-screen">
                  <div className="lesson-focus-topbar">
                    <button
                      onClick={() => setScreen("learn")}
                      aria-label={
                        locale === "ru"
                          ? "Выйти из урока"
                          : locale === "ka"
                            ? "გაკვეთილიდან გასვლა"
                            : "Leave lesson"
                      }
                    >
                      <X />
                    </button>
                    <Progress value={(progressStep / progressTotal) * 100} />
                    <span>
                      {previewMode === "scenario"
                        ? `${progressStep}/${progressTotal}`
                        : `${previewMicroLesson + 1}/${microLessons.length} · ${Math.min(
                            previewMode === "learn"
                              ? previewWordIndex + 1
                              : previewTestIndex + 1,
                            segmentWords.length,
                          )}/${segmentWords.length}`}
                    </span>
                  </div>

                  {currentWord && previewMode === "learn" && (
                    <div className="lesson-focus-stage">
                      <span className="lesson-focus-label">
                        {previewSource === "today"
                          ? locale === "ru"
                            ? "Сегодня · Практика"
                            : locale === "ka"
                              ? "დღეს · პრაქტიკა"
                              : "Today · Practice"
                          : locale === "ru"
                            ? `Урок ${lesson.number} · Новое`
                            : locale === "ka"
                              ? `გაკვეთილი ${lesson.number} · ახალი`
                              : `Lesson ${lesson.number} · Learn`}
                      </span>
                      <div className="lesson-native-meaning">
                        <small>
                          {locale === "ru"
                            ? "Значение"
                            : locale === "ka"
                              ? "მნიშვნელობა"
                              : "Meaning"}
                        </small>
                        <strong>
                          {locale === "ru" ? currentWord.ru : currentWord.en}
                        </strong>
                      </div>
                      <h1>{currentWord.ka}</h1>
                      <p>{currentWord.tr}</p>
                      {hasAudio ? (
                        <AudioButton
                          id={`lesson-preview-${currentWord.id}`}
                          playing={playing}
                          onPlay={(id, text, audioUrl) => {
                            setPreviewAudioHeard(true);
                            void play(id, text, audioUrl);
                          }}
                          onPrime={primeAudio}
                          text={currentWord.ka}
                          audioUrl={`/audio/words/${currentWord.id}.mp3`}
                          large
                        />
                      ) : (
                        <button
                          className="audio-button audio-large audio-pending"
                          disabled
                          title="Audio coming soon"
                          aria-label="Audio coming soon"
                        >
                          <Volume2 />
                        </button>
                      )}
                      <small className="lesson-learn-audio-hint">
                        {locale === "ru"
                          ? "Послушайте и повторите два раза"
                          : locale === "ka"
                            ? "მოუსმინეთ და ორჯერ გაიმეორეთ"
                            : "Listen and repeat it twice"}
                      </small>
                    </div>
                  )}

                  {currentWord && previewMode === "test" && (
                    <div className="lesson-focus-stage lesson-test-stage">
                      <span className="lesson-focus-label">
                        {locale === "ru"
                          ? lesson.kind === "review"
                            ? "Проверка памяти"
                            : "Закрепление"
                          : locale === "ka"
                            ? lesson.kind === "review"
                              ? "მეხსიერების შემოწმება"
                              : "გამყარება"
                            : lesson.kind === "review"
                              ? "Memory check"
                              : "Lock it in"}
                      </span>
                      <h2>
                        {locale === "ru"
                          ? "Что означает это слово?"
                          : locale === "ka"
                            ? "რას ნიშნავს ეს სიტყვა?"
                            : "What does this word mean?"}
                      </h2>
                      {hasAudio ? (
                        <AudioButton
                          id={`lesson-test-${currentWord.id}`}
                          playing={playing}
                          onPlay={play}
                          onPrime={primeAudio}
                          text={currentWord.ka}
                          audioUrl={`/audio/words/${currentWord.id}.mp3`}
                          large
                        />
                      ) : (
                        <button
                          className="audio-button audio-large audio-pending"
                          disabled
                          title="Audio coming soon"
                          aria-label="Audio coming soon"
                        >
                          <Volume2 />
                        </button>
                      )}
                      <small className="lesson-listen-hint">
                        {locale === "ru"
                          ? "Нажмите, чтобы услышать ещё раз"
                          : locale === "ka"
                            ? "კიდევ მოსასმენად დააჭირეთ"
                            : "Tap to hear it again"}
                      </small>
                      {previewResult === "idle" && (
                        <form
                          className="lesson-answer-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            if (!previewAnswer.trim()) return;
                            const correct = isLessonAnswerCorrect(
                              previewAnswer,
                              currentWord,
                              locale,
                            );
                            setPreviewResult(correct ? "correct" : "wrong");
                            const wordUnit =
                              learningWords.find(
                                (item) => item.word.id === currentWord.id,
                              )?.unitNumber ?? lesson.unit;
                            recordWordResult(currentWord, wordUnit, correct);
                            if (hasAudio) {
                              void play(
                                `lesson-test-${currentWord.id}`,
                                currentWord.ka,
                                `/audio/words/${currentWord.id}.mp3`,
                              );
                            }
                          }}
                        >
                          <input
                            value={previewAnswer}
                            onChange={(event) =>
                              setPreviewAnswer(event.target.value)
                            }
                            placeholder={
                              locale === "ru"
                                ? "Введите значение по-русски"
                                : "Type the meaning in English"
                            }
                            aria-label={
                              locale === "ru"
                                ? "Значение слова"
                                : "Meaning of the word"
                            }
                          />
                          <button
                            type="submit"
                            disabled={!previewAnswer.trim()}
                          >
                            {locale === "ru"
                              ? "Проверить"
                              : locale === "ka"
                                ? "შემოწმება"
                                : "Check"}
                          </button>
                        </form>
                      )}
                      {previewResult !== "idle" && (
                        <div
                          className={`lesson-answer-result ${previewResult}`}
                          aria-live="polite"
                        >
                          <span className="lesson-result-icon">
                            {previewResult === "correct" ? (
                              <CheckCircle2 />
                            ) : (
                              <X />
                            )}
                          </span>
                          <span className="lesson-result-copy">
                            <strong>
                              {previewResult === "correct"
                                ? locale === "ru"
                                  ? "Правильно!"
                                  : locale === "ka"
                                    ? "სწორია!"
                                    : "Correct!"
                                : locale === "ru"
                                  ? "Почти — запомните ответ"
                                  : locale === "ka"
                                    ? "თითქმის — დაიმახსოვრეთ პასუხი"
                                    : "Not quite — remember this"}
                            </strong>
                            <span>{answerLabel}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {currentScenario && previewMode === "scenario" && (
                    <div className="lesson-focus-stage scenario-stage">
                      <span className="lesson-focus-label">
                        {lesson.kind === "mission"
                          ? locale === "ru"
                            ? "Финальный разговор"
                            : locale === "ka"
                              ? "საბოლოო საუბარი"
                              : "Final conversation"
                          : locale === "ru"
                            ? "Ситуация в кафе"
                            : locale === "ka"
                              ? "სიტუაცია კაფეში"
                              : "Café situation"}
                      </span>
                      <h2>{currentScenario.prompt[locale]}</h2>
                      <div className="scenario-options">
                        {currentScenario.options.map((option, index) => (
                          <button
                            key={option}
                            className={
                              previewScenarioChoice === null
                                ? ""
                                : index === currentScenario.correct
                                  ? "correct"
                                  : previewScenarioChoice === index
                                    ? "wrong"
                                    : ""
                            }
                            disabled={previewScenarioChoice !== null}
                            onClick={() => setPreviewScenarioChoice(index)}
                          >
                            <span>{option}</span>
                            {previewScenarioChoice !== null &&
                              index === currentScenario.correct && <Check />}
                          </button>
                        ))}
                      </div>
                      {previewScenarioChoice !== null && (
                        <div
                          className={`scenario-feedback ${previewScenarioChoice === currentScenario.correct ? "correct" : "wrong"}`}
                          aria-live="polite"
                        >
                          <strong>
                            {previewScenarioChoice === currentScenario.correct
                              ? locale === "ru"
                                ? "Отлично!"
                                : locale === "ka"
                                  ? "შესანიშნავია!"
                                  : "Great choice!"
                              : locale === "ru"
                                ? "Попробуйте запомнить этот вариант:"
                                : locale === "ka"
                                  ? "დაიმახსოვრეთ ეს ვარიანტი:"
                                  : "Remember this response:"}
                          </strong>
                          <span>{currentScenario.meaning[locale]}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {previewMode === "complete" && (
                    <div className="lesson-focus-stage lesson-complete-stage">
                      <span className="lesson-complete-mark">
                        <Check />
                      </span>
                      <span className="lesson-focus-label">
                        {dailyMicroLessonsCompleted >= dailyMicroLessonGoal
                          ? locale === "ru"
                            ? "Цель на сегодня выполнена"
                            : locale === "ka"
                              ? "დღევანდელი მიზანი შესრულებულია"
                              : "Today's goal is complete"
                          : locale === "ru"
                            ? "Мини-урок завершён"
                            : locale === "ka"
                              ? "მინი გაკვეთილი დასრულებულია"
                              : "Mini lesson complete"}
                      </span>
                      <h2>
                        {locale === "ru"
                          ? `Вы закрепили ${segmentWords.length} слова.`
                          : locale === "ka"
                            ? `${segmentWords.length} სიტყვა განამტკიცეთ.`
                            : `You learned ${segmentWords.length} words.`}
                      </h2>
                      <p>
                        {dailyMicroLessonsCompleted >= dailyMicroLessonGoal
                          ? locale === "ru"
                            ? "На сегодня достаточно. Сложные слова вернутся в следующем уроке."
                            : locale === "ka"
                              ? "დღეისთვის საკმარისია. რთული სიტყვები შემდეგ გაკვეთილზე დაბრუნდება."
                              : "That is enough for today. Tricky words will return in your next lesson."
                          : locale === "ru"
                            ? "Короткие уроки помогают запоминать без перегрузки."
                            : locale === "ka"
                              ? "მოკლე გაკვეთილები გადატვირთვის გარეშე დამახსოვრებაში გეხმარებათ."
                              : "Short lessons help the words stick without overload."}
                      </p>
                      <small>
                        {Math.min(
                          dailyMicroLessonsCompleted,
                          dailyMicroLessonGoal,
                        )}
                        /{dailyMicroLessonGoal}{" "}
                        {locale === "ru"
                          ? "мини-урока сегодня"
                          : locale === "ka"
                            ? "მინი გაკვეთილი დღეს"
                            : "mini lessons today"}
                      </small>
                    </div>
                  )}

                  <div className="lesson-focus-actions">
                    {previewMode === "complete" ? (
                      <>
                        {dailyMicroLessonsCompleted >= dailyMicroLessonGoal ? (
                          <button
                            className="lesson-next-button"
                            onClick={() => {
                              setLearnSection("today");
                              setScreen("learn");
                            }}
                          >
                            {locale === "ru"
                              ? "Закончить на сегодня"
                              : locale === "ka"
                                ? "დღეისთვის დასრულება"
                                : "Finish for today"}
                            <Check />
                          </button>
                        ) : previewMicroLesson < microLessons.length - 1 ? (
                          <button
                            className="lesson-next-button"
                            onClick={startNextMicroLesson}
                          >
                            {locale === "ru"
                              ? "Следующий мини-урок"
                              : locale === "ka"
                                ? "შემდეგი მინი გაკვეთილი"
                                : "Next mini lesson"}
                            <ChevronRight />
                          </button>
                        ) : (
                          <button
                            className="lesson-next-button"
                            onClick={() => setScreen("learn")}
                          >
                            {locale === "ru"
                              ? "Вернуться к урокам"
                              : locale === "ka"
                                ? "გაკვეთილებზე დაბრუნება"
                                : "Back to lessons"}
                            <ChevronRight />
                          </button>
                        )}
                        {dailyMicroLessonsCompleted >= dailyMicroLessonGoal &&
                          previewMicroLesson < microLessons.length - 1 && (
                            <button
                              className="lesson-leave-button"
                              onClick={startNextMicroLesson}
                            >
                              {locale === "ru"
                                ? "Продолжить обучение"
                                : locale === "ka"
                                  ? "სწავლის გაგრძელება"
                                  : "Keep learning"}
                            </button>
                          )}
                      </>
                    ) : previewMode === "learn" ? (
                      <button
                        className={`lesson-next-button ${hasAudio && !previewAudioHeard ? "waiting-for-audio" : ""}`}
                        disabled={hasAudio && !previewAudioHeard}
                        onClick={continueLearning}
                      >
                        {hasAudio && !previewAudioHeard
                          ? locale === "ru"
                            ? "Сначала послушайте"
                            : locale === "ka"
                              ? "ჯერ მოუსმინეთ"
                              : "Listen first"
                          : locale === "ru"
                            ? isLastLearningWord
                              ? "Начать проверку"
                              : "Следующее слово"
                            : locale === "ka"
                              ? isLastLearningWord
                                ? "ტესტის დაწყება"
                                : "შემდეგი სიტყვა"
                              : isLastLearningWord
                                ? "Start test"
                                : "Next word"}
                        {hasAudio && !previewAudioHeard ? (
                          <Volume2 />
                        ) : (
                          <ChevronRight />
                        )}
                      </button>
                    ) : previewMode === "test" && previewResult !== "idle" ? (
                      <button
                        className={`lesson-next-button ${playing === `lesson-test-${currentWord?.id}` ? "waiting-for-audio" : ""}`}
                        disabled={playing === `lesson-test-${currentWord?.id}`}
                        onClick={continueTest}
                      >
                        {playing === `lesson-test-${currentWord?.id}`
                          ? locale === "ru"
                            ? "Слушайте ещё раз"
                            : locale === "ka"
                              ? "კიდევ ერთხელ მოუსმინეთ"
                              : "Listen once more"
                          : locale === "ru"
                            ? isLastTestWord
                              ? "Завершить этап"
                              : "Следующий вопрос"
                            : locale === "ka"
                              ? isLastTestWord
                                ? "ეტაპის დასრულება"
                                : "შემდეგი კითხვა"
                              : isLastTestWord
                                ? "Complete step"
                                : "Next question"}
                        {playing === `lesson-test-${currentWord?.id}` ? (
                          <Volume2 />
                        ) : (
                          <ChevronRight />
                        )}
                      </button>
                    ) : previewMode === "scenario" &&
                      previewScenarioChoice !== null ? (
                      <button
                        className="lesson-next-button"
                        onClick={continueScenario}
                      >
                        {locale === "ru"
                          ? previewScenarioIndex ===
                            (lesson.scenarios?.length ?? 1) - 1
                            ? "Завершить миссию"
                            : "Продолжить разговор"
                          : locale === "ka"
                            ? previewScenarioIndex ===
                              (lesson.scenarios?.length ?? 1) - 1
                              ? "მისიის დასრულება"
                              : "საუბრის გაგრძელება"
                            : previewScenarioIndex ===
                                (lesson.scenarios?.length ?? 1) - 1
                              ? "Complete mission"
                              : "Continue conversation"}
                        <ChevronRight />
                      </button>
                    ) : null}
                    <button
                      className="lesson-leave-button"
                      onClick={() => setScreen("learn")}
                    >
                      {locale === "ru"
                        ? "Выйти из урока"
                        : locale === "ka"
                          ? "გაკვეთილიდან გასვლა"
                          : "Leave lesson"}
                    </button>
                  </div>
                </section>
              );
            })()}
          {screen === "premium" && (
            <section className="screen premium-screen">
              <button
                className="back-button"
                onClick={() =>
                  setScreen(upgradeFocus === "guided" ? "learn" : "words")
                }
              >
                <ArrowLeft />{" "}
                {upgradeFocus === "guided"
                  ? "Back to lesson path"
                  : "Back to words"}
              </button>
              <div className="premium-hero">
                <span className="premium-orb">
                  <LockKeyhole />
                </span>
                <h1>
                  {upgradeFocus === "phrasebook"
                    ? "Find the Georgian you need"
                    : "Keep your learning moving"}
                </h1>
                <p>
                  {upgradeFocus === "phrasebook"
                    ? "Search the extended 9,000-word reference dictionary during the public beta."
                    : "Build speaking confidence in three-word lessons shaped around your goals."}
                </p>
              </div>
              <div className="premium-layout">
                <div className="feature-list">
                  {upgradeFocus === "phrasebook" ? (
                    <>
                      <div>
                        <Search />
                        <span>
                          <b>9,000-word reference dictionary</b>
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
                          <b>Open during the public beta</b>
                          <small>No payment method is collected</small>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <CalendarDays />
                        <span>
                          <b>Three-word mini lessons</b>
                          <small>
                            Choose a gentle, steady, or intensive pace
                          </small>
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
                          <b>Personalized, not isolated</b>
                          <small>
                            Your goals lead while general speaking stays in the
                            plan
                          </small>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="premium-plan-stack">
                  {upgradeFocus === "phrasebook" ? (
                    <div className="premium-price-card phrasebook-pro-card">
                      <span>Reference dictionary</span>
                      <h2>9,000+</h2>
                      <h3>Extended dictionary</h3>
                      <p>
                        Search Georgian, English, Russian, or transliteration.
                        Use it as a broad beta reference beside the curated
                        400-word audio core.
                      </p>
                      <Button onClick={() => setScreen("words")}>
                        Search the dictionary
                      </Button>
                    </div>
                  ) : (
                    <div className="premium-price-card">
                      <span>Free public beta</span>
                      <h2>8 units</h2>
                      <h3>Guided Learning</h3>
                      <p>
                        Daily lessons, quizzes, smart review, progress, XP, and
                        streaks for learners who want structure.
                      </p>
                      <Button
                        onClick={
                          canUseLearning
                            ? () => setScreen("daily")
                            : user
                              ? () => openModal("pricing")
                              : openAuth
                        }
                      >
                        Open today’s lesson
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
                    {locale === "ru"
                      ? "Живые занятия"
                      : locale === "ka"
                        ? "ცოცხალი გაკვეთილები"
                        : "Learn with a teacher"}
                  </span>
                  <h2>Kristina Beridze</h2>
                  <p>
                    {locale === "ru"
                      ? "Грузинский для русскоговорящих — онлайн или в Батуми, от 20 ₾ за занятие."
                      : locale === "ka"
                        ? "ქართული რუსულენოვანთათვის და რუსული ქართულენოვანთათვის — ონლაინ ან ბათუმში."
                        : "Georgian lessons for Russian speakers, online or in Batumi, from ₾20 per lesson."}
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
                      {locale === "ru" ? "Подробнее" : "View details"}{" "}
                      <ChevronRight />
                    </a>
                  </div>
                </div>
              </aside>
            </section>
          )}
          {screen === "daily" && canUseLearning && (
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
                onClick={() => setScreen("lesson")}
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
                      <i className={day.xp > 0 ? "done" : ""}>
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
                      ? "Keep it up!"
                      : "Practice your first phrase"}
                  </small>
                  <Progress value={basicsPercent} />
                </span>
                <ChevronRight />
              </button>
            </section>
          )}
          {screen === "lesson" && canUseLearning && (
            <section className="screen lesson-screen">
              <div className="lesson-top">
                <button onClick={() => setScreen("daily")}>
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
                <p>{locale === "ru" ? "Привет" : "Hello"}</p>
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
                onClick={() => setScreen("quiz")}
              >
                I know this <ChevronRight />
              </Button>
            </section>
          )}
          {screen === "quiz" && canUseLearning && (
            <section className="screen quiz-screen">
              <div className="lesson-top">
                <button onClick={() => setScreen("lesson")}>
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
                  <button>{locale === "ru" ? "Привет" : "Hello"}</button>
                  <button className="correct">
                    {locale === "ru" ? "Спасибо" : "Thank you"} <CheckCircle2 />
                  </button>
                  <button>{locale === "ru" ? "До свидания" : "Goodbye"}</button>
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
          {screen === "progress" && canUseLearning && (
            <section className="screen progress-screen">
              <div className="screen-heading">
                <div>
                  <span className="app-eyebrow">Your learning journey</span>
                  <h1>Progress & streak</h1>
                  <p>
                    {user
                      ? "Your learning record is synced securely."
                      : "Sign in to track progress across devices."}
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
          {screen === "settings" && (
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
                        value={user.email ?? ""}
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

                  <article className="settings-card learner-plan-card">
                    <div className="settings-card-heading">
                      <Brain />
                      <span>
                        <b>Your learning plan</b>
                        <small>Controls what appears in daily lessons</small>
                      </span>
                    </div>
                    <div className="learner-plan-summary">
                      <span>Primary focus</span>
                      <b>
                        {focusLabels[learnerPreferences.primaryGoal][locale]}
                      </b>
                      <small>
                        {learnerPreferences.learningPace === "gentle"
                          ? "Gentle pace · one mini-lesson"
                          : learnerPreferences.learningPace === "intensive"
                            ? "Intensive pace · three mini-lessons"
                            : "Steady pace · two mini-lessons"}
                      </small>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setOnboardingOpen(true)}
                    >
                      Adjust my learning plan
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
                    <label>
                      New password
                      <input
                        type="password"
                        value={newPassword}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        onChange={(event) => setNewPassword(event.target.value)}
                      />
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => void updatePassword()}
                      disabled={settingsBusy || newPassword.length < 8}
                    >
                      Update password
                    </Button>
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
                        void supabase.auth.signOut({ scope: "local" })
                      }
                    >
                      <LogOut /> Sign out this device
                    </button>
                  </article>

                  <article className="settings-card settings-billing">
                    <div className="settings-card-heading">
                      <CreditCard />
                      <span>
                        <b>Beta access</b>
                        <small>Everything currently available is open</small>
                      </span>
                    </div>
                    <div className="plan-status">
                      <span>
                        <b>Curated speaking core</b>
                        <small>400 words with lesson audio</small>
                      </span>
                      <i className="active">Included</i>
                    </div>
                    <div className="plan-status">
                      <span>
                        <b>Guided Learning</b>
                        <small>8 personalized units</small>
                      </span>
                      <i className={canUseLearning ? "active" : ""}>
                        {canUseLearning ? "Free beta access" : "Not active"}
                      </i>
                    </div>
                    <p className="settings-note">
                      No payment method is collected during the public beta, and
                      opening the app cannot create a charge.
                    </p>
                    <Button onClick={() => setScreen("learn")}>
                      Open the learning path
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
              screen === "explore" || screen === "all" || screen === "category"
                ? "active"
                : ""
            }
            onClick={() => setScreen("explore")}
          >
            <Home />
            <span>{t("explore")}</span>
          </button>
          <button
            className={screen === "words" ? "active" : ""}
            onClick={() => setScreen("words")}
          >
            <Search />
            <span>
              {locale === "ru"
                ? "Слова"
                : locale === "ka"
                  ? "სიტყვები"
                  : "Words"}
            </span>
          </button>
          <button
            className={screen === "saved" ? "active" : ""}
            onClick={() => setScreen("saved")}
          >
            <Bookmark />
            <span>{t("saved")}</span>
          </button>
          <button
            className={screen === "progress" || learnNav ? "active" : ""}
            onClick={openLearning}
          >
            <BookOpen />
            <span>{t("learn")}</span>
          </button>
        </nav>
      </div>
      {onboardingOpen && (
        <LearnerOnboardingDialog
          open
          locale={locale}
          initialValue={learnerPreferences}
          onOpenChange={setOnboardingOpen}
          onSave={saveLearnerPreferences}
        />
      )}
    </main>
  );
}

function LearnerOnboardingDialog({
  open,
  locale,
  initialValue,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  locale: Locale;
  initialValue: LearnerPreferences;
  onOpenChange: (open: boolean) => void;
  onSave: (value: LearnerPreferences) => Promise<string | null>;
}) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const copy = {
    en: {
      eyebrow: "BUILD YOUR LEARNING PLAN",
      title: [
        "What do you want Georgian for?",
        "What should we prioritize?",
        "Choose your pace",
        "One last question",
      ],
      intro: [
        "Pick the situation that matters most. You can change it whenever life changes.",
        "Choose up to five supporting interests and tell us what language you need right now.",
        "We will adapt the amount of new language—not remove essential speaking practice.",
        "This helps us improve where new learners discover the app.",
      ],
      back: "Back",
      next: "Continue",
      finish: "Build my daily plan",
      later: "Do this later",
      custom: "Anything specific you want to learn?",
      customPlaceholder: "For example: talking to customers at my café…",
      discovery: "How did you find us?",
    },
    ru: {
      eyebrow: "СОЗДАЙТЕ СВОЙ ПЛАН",
      title: [
        "Для чего вам грузинский?",
        "Что поставить в приоритет?",
        "Выберите темп",
        "Последний вопрос",
      ],
      intro: [
        "Выберите самую важную ситуацию. Цель можно изменить в любое время.",
        "Выберите до пяти интересов и напишите, какие слова нужны вам сейчас.",
        "Мы изменим объём нового материала, сохранив основы разговорной речи.",
        "Это помогает нам понять, как новые ученики находят приложение.",
      ],
      back: "Назад",
      next: "Продолжить",
      finish: "Создать мой план",
      later: "Сделать позже",
      custom: "Что именно вы хотите выучить?",
      customPlaceholder: "Например: общение с клиентами в моём кафе…",
      discovery: "Как вы нас нашли?",
    },
    ka: {
      eyebrow: "შექმენით თქვენი სასწავლო გეგმა",
      title: [
        "რისთვის გჭირდებათ ქართული?",
        "რას მივანიჭოთ უპირატესობა?",
        "აირჩიეთ ტემპი",
        "ბოლო კითხვა",
      ],
      intro: [
        "აირჩიეთ ყველაზე მნიშვნელოვანი სიტუაცია. მიზნის შეცვლა ყოველთვის შეგიძლიათ.",
        "აირჩიეთ მაქსიმუმ ხუთი ინტერესი და დაწერეთ, რა გჭირდებათ ახლა.",
        "ახალი მასალის რაოდენობას შევცვლით, სასაუბრო საფუძვლებს კი შევინარჩუნებთ.",
        "ეს გვეხმარება გავიგოთ, როგორ პოულობენ აპს ახალი მოსწავლეები.",
      ],
      back: "უკან",
      next: "გაგრძელება",
      finish: "ჩემი გეგმის შექმნა",
      later: "მოგვიანებით",
      custom: "კონკრეტულად რისი სწავლა გსურთ?",
      customPlaceholder: "მაგალითად: ჩემს კაფეში კლიენტებთან საუბარი…",
      discovery: "როგორ გვიპოვეთ?",
    },
  }[locale];
  const focusChoices = (Object.keys(focusLabels) as LearningFocus[]).filter(
    (focus) => focus !== "general_speaking",
  );
  const toggleFocus = (focus: LearningFocus) => {
    setDraft((current) => {
      const selected = current.focusAreas.includes(focus);
      if (!selected && current.focusAreas.length >= 5) return current;
      return {
        ...current,
        focusAreas: selected
          ? current.focusAreas.filter((item) => item !== focus)
          : [...current.focusAreas, focus],
      };
    });
  };
  const finish = async () => {
    if (!draft.focusAreas.length) {
      setStatus("Choose at least one supporting interest.");
      return;
    }
    setBusy(true);
    setStatus("");
    const error = await onSave(draft);
    setBusy(false);
    if (error) setStatus(error);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="onboarding-dialog">
        <div
          className="onboarding-progress"
          aria-label={`Step ${step + 1} of 4`}
        >
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={index <= step ? "active" : ""} />
          ))}
        </div>
        <DialogHeader>
          <span className="onboarding-eyebrow">{copy.eyebrow}</span>
          <DialogTitle>{copy.title[step]}</DialogTitle>
          <DialogDescription>{copy.intro[step]}</DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="onboarding-choice-grid primary-goal-grid">
            {(Object.keys(focusLabels) as LearningFocus[]).map((focus) => (
              <button
                key={focus}
                className={draft.primaryGoal === focus ? "selected" : ""}
                onClick={() =>
                  setDraft((current) => ({ ...current, primaryGoal: focus }))
                }
              >
                <span>
                  {focus === "general_speaking"
                    ? "💬"
                    : focus === "cafe"
                      ? "☕"
                      : focus === "work"
                        ? "💼"
                        : focus === "health"
                          ? "✚"
                          : focus === "transport"
                            ? "🚌"
                            : focus === "shopping"
                              ? "🛍️"
                              : focus === "home"
                                ? "🏠"
                                : focus === "services"
                                  ? "📅"
                                  : "👋"}
                </span>
                <b>{focusLabels[focus][locale]}</b>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="onboarding-fields">
            <div className="onboarding-chip-grid">
              {focusChoices.map((focus) => (
                <button
                  key={focus}
                  className={draft.focusAreas.includes(focus) ? "selected" : ""}
                  onClick={() => toggleFocus(focus)}
                >
                  {draft.focusAreas.includes(focus) && <Check />}
                  {focusLabels[focus][locale]}
                </button>
              ))}
            </div>
            <label>
              {copy.custom}
              <textarea
                value={draft.customFocus}
                maxLength={240}
                placeholder={copy.customPlaceholder}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    customFocus: event.target.value,
                  }))
                }
              />
              <small>{draft.customFocus.length}/240</small>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-fields onboarding-two-columns">
            <fieldset>
              <legend>
                {locale === "ru"
                  ? "Ваш уровень"
                  : locale === "ka"
                    ? "თქვენი დონე"
                    : "Your experience"}
              </legend>
              {(
                [
                  [
                    "brand_new",
                    locale === "ru"
                      ? "Начинаю с нуля"
                      : locale === "ka"
                        ? "ნულიდან ვიწყებ"
                        : "Starting from zero",
                  ],
                  [
                    "some_basics",
                    locale === "ru"
                      ? "Знаю основы"
                      : locale === "ka"
                        ? "საფუძვლები ვიცი"
                        : "I know some basics",
                  ],
                  [
                    "conversational",
                    locale === "ru"
                      ? "Уже немного говорю"
                      : locale === "ka"
                        ? "უკვე ცოტას ვსაუბრობ"
                        : "I can already speak a little",
                  ],
                ] as [ExperienceLevel, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={draft.experienceLevel === value ? "selected" : ""}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      experienceLevel: value,
                    }))
                  }
                >
                  {label}
                </button>
              ))}
            </fieldset>
            <fieldset>
              <legend>
                {locale === "ru"
                  ? "Скорость"
                  : locale === "ka"
                    ? "სწავლის ტემპი"
                    : "Learning pace"}
              </legend>
              {(
                [
                  [
                    "gentle",
                    locale === "ru"
                      ? "Легко · 3 слова в день"
                      : locale === "ka"
                        ? "მსუბუქი · 3 სიტყვა დღეში"
                        : "Gentle · 3 words a day",
                  ],
                  [
                    "steady",
                    locale === "ru"
                      ? "Ровно · 6 слов в день"
                      : locale === "ka"
                        ? "სტაბილური · 6 სიტყვა დღეში"
                        : "Steady · 6 words a day",
                  ],
                  [
                    "intensive",
                    locale === "ru"
                      ? "Быстро · 9 слов в день"
                      : locale === "ka"
                        ? "სწრაფი · 9 სიტყვა დღეში"
                        : "Intensive · 9 words a day",
                  ],
                ] as [LearningPace, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={draft.learningPace === value ? "selected" : ""}
                  onClick={() =>
                    setDraft((current) => ({ ...current, learningPace: value }))
                  }
                >
                  {label}
                </button>
              ))}
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-fields">
            <label>
              {copy.discovery}
              <select
                value={draft.discoverySource}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    discoverySource: event.target.value as DiscoverySource | "",
                  }))
                }
              >
                <option value="">
                  {locale === "ru"
                    ? "Выберите ответ"
                    : locale === "ka"
                      ? "აირჩიეთ პასუხი"
                      : "Choose an answer"}
                </option>
                <option value="search">
                  {locale === "ru"
                    ? "Поиск"
                    : locale === "ka"
                      ? "ძიება"
                      : "Search"}
                </option>
                <option value="friend">
                  {locale === "ru"
                    ? "Друг"
                    : locale === "ka"
                      ? "მეგობარი"
                      : "Friend or family"}
                </option>
                <option value="social_media">
                  {locale === "ru"
                    ? "Социальные сети"
                    : locale === "ka"
                      ? "სოციალური ქსელი"
                      : "Social media"}
                </option>
                <option value="community">
                  {locale === "ru"
                    ? "Сообщество"
                    : locale === "ka"
                      ? "თემი"
                      : "Community group"}
                </option>
                <option value="work">
                  {locale === "ru"
                    ? "Работа"
                    : locale === "ka"
                      ? "სამსახური"
                      : "Work"}
                </option>
                <option value="other">
                  {locale === "ru"
                    ? "Другое"
                    : locale === "ka"
                      ? "სხვა"
                      : "Other"}
                </option>
              </select>
            </label>
            <div className="onboarding-summary">
              <Brain />
              <span>
                <small>
                  {locale === "ru"
                    ? "ГЛАВНЫЙ ФОКУС"
                    : locale === "ka"
                      ? "მთავარი ფოკუსი"
                      : "MAIN FOCUS"}
                </small>
                <b>{focusLabels[draft.primaryGoal][locale]}</b>
                <p>
                  {locale === "ru"
                    ? "Примерно две трети нового материала будут связаны с вашим фокусом. Остальное — основы речи и слова для повторения."
                    : locale === "ka"
                      ? "ახალი მასალის დაახლოებით ორი მესამედი თქვენს ფოკუსს დაეთმობა. დანარჩენი — ზოგადი საუბარი და გამეორებაა."
                      : "About two thirds of new material will follow your focus. The rest stays dedicated to everyday speaking and memory review."}
                </p>
              </span>
            </div>
          </div>
        )}

        {status && <output className="auth-status">{status}</output>}
        <div className="onboarding-actions">
          {step > 0 ? (
            <Button
              variant="outline"
              onClick={() => setStep((value) => value - 1)}
            >
              {copy.back}
            </Button>
          ) : (
            <button
              className="onboarding-later"
              onClick={() => onOpenChange(false)}
            >
              {copy.later}
            </button>
          )}
          <Button
            disabled={busy}
            onClick={() =>
              step < 3 ? setStep((value) => value + 1) : void finish()
            }
          >
            {busy ? "…" : step < 3 ? copy.next : copy.finish}
            <ChevronRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
  const [mode, setMode] = useState<"signin" | "signup" | "recovery">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setStatus("");
    const supabaseModule = await import("@/lib/supabase/client");
    if (!supabaseModule.isSupabaseConfigured) {
      setStatus("Add the project publishable key to enable account access.");
      return;
    }
    setBusy(true);
    const client = supabaseModule.createClient();
    if (mode === "recovery") {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?mode=app#app`,
      });
      setBusy(false);
      setStatus(
        error
          ? error.message
          : "Check your email for a secure password-reset link.",
      );
      return;
    }
    const result =
      mode === "signin"
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
      setStatus("");
      return;
    }
    setStatus("Check your email to confirm your account, then sign in.");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="auth-dialog">
        <DialogHeader>
          <span className="dialog-icon">
            <UserRound />
          </span>
          <DialogTitle>
            {mode === "signin"
              ? t("authTitleIn")
              : mode === "signup"
                ? t("authTitleUp")
                : "Reset your password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "recovery"
              ? "We will email you a secure link. After returning, set a new password in Account settings."
              : "Save words, sync progress, and keep your personalized learning plan on every device."}
          </DialogDescription>
        </DialogHeader>
        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <label>
              {t("displayName")}
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={80}
              />
            </label>
          )}
          <label>
            {t("email")}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {mode !== "recovery" && (
            <label>
              {t("password")}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />
            </label>
          )}
          {mode === "signin" && (
            <button
              type="button"
              className="forgot-password"
              onClick={() => {
                setMode("recovery");
                setStatus("");
              }}
            >
              Forgot your password?
            </button>
          )}
          {status && <output className="auth-status">{status}</output>}
          <Button type="submit" disabled={busy}>
            {busy
              ? t("pleaseWait")
              : mode === "signin"
                ? t("signIn")
                : mode === "signup"
                  ? t("createAccount")
                  : "Email reset link"}
          </Button>
        </form>
        <button
          className="auth-switch"
          onClick={() => {
            setMode((value) => (value === "signin" ? "signup" : "signin"));
            setStatus("");
          }}
        >
          {mode === "signin" ? t("newAccount") : t("existingAccount")}
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<"marketing" | "app">("marketing");
  const [initialAppScreen, setInitialAppScreen] = useState<Screen>("explore");
  const [siteUser, setSiteUser] = useState<User | null>(null);
  const [siteDisplayName, setSiteDisplayName] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [languageChoiceOpen, setLanguageChoiceOpen] = useState(false);
  const [modal, setModal] = useState<"install" | "pricing" | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installPlatform, setInstallPlatform] =
    useState<InstallPlatform>("desktop");
  const [installLinkCopied, setInstallLinkCopied] = useState(false);
  const changeLocale = useCallback((nextLocale: Locale) => {
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    localStorage.setItem("geo-interface-language", nextLocale);
  }, []);
  useEffect(() => {
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    window.setTimeout(
      () =>
        setInstallPlatform(
          isIos
            ? "ios"
            : /Android/i.test(navigator.userAgent)
              ? "android"
              : "desktop",
        ),
      0,
    );
    const savedLocale = localStorage.getItem("geo-interface-language");
    const preferredLocale = (navigator.languages?.[0] ?? navigator.language)
      .toLowerCase()
      .split("-")[0];
    const browserLocale: Locale =
      preferredLocale === "ru" ? "ru" : preferredLocale === "ka" ? "ka" : "en";
    window.setTimeout(() => {
      if (
        savedLocale === "ru" ||
        savedLocale === "ka" ||
        savedLocale === "en"
      ) {
        changeLocale(savedLocale);
      } else {
        setLocale(browserLocale);
        document.documentElement.lang = browserLocale;
        setLanguageChoiceOpen(true);
      }
    }, 0);
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      location.hash === "#app" ||
      new URLSearchParams(location.search).get("mode") === "app"
    )
      window.setTimeout(() => setMode("app"), 0);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production")
      void navigator.serviceWorker.register("/sw.js", { scope: "/" });
    const captureInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const installed = () => {
      setInstallPrompt(null);
      setMode("app");
    };
    window.addEventListener("beforeinstallprompt", captureInstall);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstall);
      window.removeEventListener("appinstalled", installed);
    };
  }, [changeLocale]);
  useEffect(() => {
    if (
      mode === "app" ||
      window.matchMedia("(display-mode: standalone)").matches ||
      location.hash === "#app" ||
      new URLSearchParams(location.search).get("mode") === "app"
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
        .from("profiles")
        .select("display_name")
        .eq("id", activeUser.id)
        .maybeSingle();
      if (active) setSiteDisplayName(data?.display_name ?? null);
    };
    const timer = window.setTimeout(() => {
      void import("@/lib/supabase/client").then(async (supabaseModule) => {
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
    document.documentElement.dataset.appMode = "true";
    setInitialAppScreen("explore");
    setMode("app");
    history.replaceState(null, "", "#app");
    window.scrollTo(0, 0);
  };
  const openAccount = () => {
    document.documentElement.dataset.appMode = "true";
    setInitialAppScreen("settings");
    setMode("app");
    history.replaceState(null, "", "#app");
    window.scrollTo(0, 0);
  };
  const installApp = async () => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      openApp();
      return;
    }
    if (!installPrompt) {
      setModal("install");
      return;
    }
    const prompt = installPrompt;
    setModal(null);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "dismissed") setModal("install");
    } catch {
      setInstallPrompt(null);
      setModal("install");
    }
  };
  const shareInstallLink = async () => {
    const appUrl = `${location.origin}/?mode=app#app`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "GEO Georgian phrasebook",
          text: "Install GEO for fast access to Georgian phrases.",
          url: appUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(appUrl);
      setInstallLinkCopied(true);
      window.setTimeout(() => setInstallLinkCopied(false), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(appUrl);
        setInstallLinkCopied(true);
        window.setTimeout(() => setInstallLinkCopied(false), 2500);
      } catch {
        window.prompt(
          "Copy this link and open it in Safari or Chrome:",
          appUrl,
        );
      }
    }
  };
  const exitToSite = () => {
    delete document.documentElement.dataset.appMode;
    setMode("marketing");
    history.replaceState(null, "", location.pathname);
    window.scrollTo(0, 0);
  };
  return (
    <>
      {mode === "marketing" ? (
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
              {modal === "install" ? <Download /> : <Star />}
            </span>
            <DialogTitle>
              {modal === "install"
                ? installPlatform === "ios"
                  ? "Install GEO on iPhone or iPad"
                  : installPlatform === "android"
                    ? "Install GEO on Android"
                    : "Install GEO on this device"
                : "Public beta access"}
            </DialogTitle>
            <DialogDescription>
              {modal === "install"
                ? installPlatform === "ios"
                  ? "Apple requires web apps to be added from Safari. It takes three quick taps and GEO will then open like a normal app without the homepage."
                  : installPlatform === "android"
                    ? "Your current browser has not offered the native install window yet. Open GEO in Chrome and follow these steps."
                    : "Install GEO from Chrome or Edge for a fast, app-like phrasebook with essential offline access."
                : "The curated speaking core, extended dictionary, and guided learning path are open during the public beta. No payment details are collected."}
            </DialogDescription>
          </DialogHeader>
          {modal === "install" && (
            <div className="install-guide">
              {installPlatform === "ios" ? (
                <>
                  <div className="install-step">
                    <span>1</span>
                    <p>
                      Open this page in <b>Safari</b>.
                    </p>
                  </div>
                  <div className="install-step">
                    <span>2</span>
                    <p>
                      Tap the <b>Share</b> button <Share2 />.
                    </p>
                  </div>
                  <div className="install-step">
                    <span>3</span>
                    <p>
                      Choose <b>Add to Home Screen</b>, then tap <b>Add</b>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="install-step">
                    <span>1</span>
                    <p>
                      Open this page in{" "}
                      <b>
                        {installPlatform === "android"
                          ? "Chrome"
                          : "Chrome or Edge"}
                      </b>
                      .
                    </p>
                  </div>
                  <div className="install-step">
                    <span>2</span>
                    <p>
                      Open the browser menu and choose <b>Install app</b> or{" "}
                      <b>Add to Home screen</b>.
                    </p>
                  </div>
                  <div className="install-step">
                    <span>3</span>
                    <p>
                      Confirm <b>Install</b>. GEO will appear with your other
                      apps.
                    </p>
                  </div>
                </>
              )}
              <p className="install-note">
                GEO is a secure web app, so there is no App Store or Play Store
                download file.
              </p>
            </div>
          )}
          {modal === "pricing" && (
            <div className="modal-plans">
              <div className="phrasebook-choice">
                <span>
                  <b>Curated speaking core</b>
                  <small>400 words · Audio · Lesson-ready</small>
                </span>
                <strong>Included</strong>
              </div>
              <div className="recommended">
                <span>
                  <b>Guided Learning</b>
                  <small>8 units · Personalized daily plan</small>
                </span>
                <strong>Open beta</strong>
              </div>
            </div>
          )}
          <div className="dialog-actions">
            {modal === "install" && (
              <>
                {installPrompt && (
                  <Button onClick={() => void installApp()}>
                    <Download /> Install now
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => void shareInstallLink()}
                >
                  <Share2 />{" "}
                  {installLinkCopied ? "Link copied" : "Share install link"}
                </Button>
                <Button variant="outline" onClick={openApp}>
                  Use on web
                </Button>
              </>
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
              className={locale === "en" ? "selected" : ""}
              onClick={() => {
                changeLocale("en");
                setLanguageChoiceOpen(false);
              }}
            >
              <b>English</b>
              <span>Hello</span>
            </button>
            <button
              className={locale === "ru" ? "selected" : ""}
              onClick={() => {
                changeLocale("ru");
                setLanguageChoiceOpen(false);
              }}
            >
              <b>Русский</b>
              <span>Привет</span>
            </button>
            <button
              className={locale === "ka" ? "selected" : ""}
              onClick={() => {
                changeLocale("ka");
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
