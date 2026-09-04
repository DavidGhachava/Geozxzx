'use client';
/* eslint-disable next/no-html-link-for-pages */
/* eslint-disable next/no-img-element */
import { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { LanguageMenu, type InterfaceLocale } from '@/components/language-menu';

export function PublicHeader({
  locale = 'en',
  onLocaleChange,
}: {
  locale?: InterfaceLocale;
  onLocaleChange?: (locale: InterfaceLocale) => void;
}) {
  const nav = {
    en: ['Features', 'Phrasebook', 'Pricing', 'Open app'],
    ru: ['Возможности', 'Разговорник', 'Цены', 'Открыть'],
    ka: ['შესაძლებლობები', 'ფრაზები', 'ფასები', 'აპის გახსნა'],
  }[locale];
  return (
    <header className="legal-header">
      <a className="brand" href="/" aria-label="GEO home">
        <img src="/brand/geo-wave.svg" alt="" width="36" height="36" />
        <span className="brand-word">GEO</span>
      </a>
      <nav aria-label="Public navigation">
        <a href="/features">{nav[0]}</a>
        <a href="/phrasebook">{nav[1]}</a>
        <a href="/pricing">{nav[2]}</a>
        {onLocaleChange && (
          <LanguageMenu locale={locale} onChange={onLocaleChange} />
        )}
        <a className="header-open" href="/#app">
          {nav[3]} <ChevronRight />
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
          <img src="/brand/geo-wave.svg" alt="" width="36" height="36" />
          <span className="brand-word">GEO</span>
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
        <a href="mailto:daviddavowo@gmail.com">daviddavowo@gmail.com</a>
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

type LocalizedPage = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

const pageTranslations: Record<
  string,
  { ru: LocalizedPage; ka: LocalizedPage }
> = {
  '/privacy': {
    ru: {
      title: 'Конфиденциальность',
      intro: 'Какие данные GEO использует и как вы ими управляете.',
      sections: [
        {
          heading: 'Что мы храним',
          body: 'Для аккаунта мы храним имя, email, необязательный телефон, сохранённые фразы и учебный прогресс. Платёжные и банковские данные GEO не хранит.',
        },
        {
          heading: 'Ваш контроль',
          body: 'В настройках можно выйти с других устройств или безвозвратно удалить аккаунт. По вопросам данных: daviddavowo@gmail.com.',
        },
      ],
    },
    ka: {
      title: 'კონფიდენციალურობა',
      intro: 'რა მონაცემებს იყენებს GEO და როგორ მართავთ მათ.',
      sections: [
        {
          heading: 'რას ვინახავთ',
          body: 'ანგარიშისთვის ვინახავთ სახელს, ელფოსტას, სურვილისამებრ ტელეფონს, შენახულ ფრაზებსა და სასწავლო პროგრესს. GEO არ ინახავს საბანკო ან ბარათის მონაცემებს.',
        },
        {
          heading: 'თქვენი კონტროლი',
          body: 'პარამეტრებიდან შეგიძლიათ სხვა მოწყობილობებიდან გასვლა ან ანგარიშის საბოლოოდ წაშლა. მონაცემების საკითხებზე: daviddavowo@gmail.com.',
        },
      ],
    },
  },
  '/terms': {
    ru: {
      title: 'Условия использования',
      intro: 'Простые правила использования GEO.',
      sections: [
        {
          heading: 'Сервис',
          body: 'Бесплатный разговорник доступен без оплаты. Pro — разовая покупка, а Guided Learning — ежемесячная подписка после подключения оплаты.',
        },
        {
          heading: 'Ответственность',
          body: 'Материалы предназначены для изучения языка и не заменяют профессиональный перевод в медицинских, юридических или экстренных ситуациях.',
        },
      ],
    },
    ka: {
      title: 'გამოყენების პირობები',
      intro: 'GEO-ს გამოყენების მარტივი წესები.',
      sections: [
        {
          heading: 'სერვისი',
          body: 'უფასო ფრაზების კრებული ხელმისაწვდომია გადახდის გარეშე. Pro ერთჯერადი შენაძენია, Guided Learning კი ყოველთვიური გამოწერა იქნება გადახდის ჩართვის შემდეგ.',
        },
        {
          heading: 'პასუხისმგებლობა',
          body: 'მასალა ენის შესასწავლადაა და სამედიცინო, იურიდიულ ან საგანგებო სიტუაციაში პროფესიონალ თარჯიმანს არ ცვლის.',
        },
      ],
    },
  },
  '/cookies': {
    ru: {
      title: 'Cookie',
      intro: 'GEO использует только необходимые технологии хранения.',
      sections: [
        {
          heading: 'Необходимые данные',
          body: 'Локальное хранилище запоминает язык, согласие с cookie и состояние установки приложения. Сессия входа поддерживается Supabase.',
        },
        {
          heading: 'Выбор',
          body: 'Необязательная рекламная слежка не включена. Настройки браузера позволяют очистить локальные данные в любой момент.',
        },
      ],
    },
    ka: {
      title: 'Cookie ფაილები',
      intro: 'GEO იყენებს მხოლოდ საჭირო შენახვის ტექნოლოგიებს.',
      sections: [
        {
          heading: 'აუცილებელი მონაცემები',
          body: 'ლოკალური საცავი იმახსოვრებს ენას, cookie-ს არჩევანსა და აპის დაყენების მდგომარეობას. ავტორიზაციის სესიას Supabase იცავს.',
        },
        {
          heading: 'არჩევანი',
          body: 'სარეკლამო თვალთვალი ჩართული არ არის. ბრაუზერიდან ლოკალური მონაცემების გასუფთავება ნებისმიერ დროს შეგიძლიათ.',
        },
      ],
    },
  },
  '/acceptable-use': {
    ru: {
      title: 'Допустимое использование',
      intro: 'Используйте GEO честно и безопасно.',
      sections: [
        {
          heading: 'Разрешено',
          body: 'Учитесь, ищите фразы и синхронизируйте личный прогресс.',
        },
        {
          heading: 'Запрещено',
          body: 'Нельзя взламывать сервис, обходить оплату, массово копировать каталог, преследовать пользователей или использовать GEO незаконно.',
        },
      ],
    },
    ka: {
      title: 'მისაღები გამოყენება',
      intro: 'გამოიყენეთ GEO პატიოსნად და უსაფრთხოდ.',
      sections: [
        {
          heading: 'დაშვებულია',
          body: 'ისწავლეთ, მოძებნეთ ფრაზები და დაასინქრონეთ პირადი პროგრესი.',
        },
        {
          heading: 'აკრძალულია',
          body: 'დაუშვებელია სერვისის გატეხვა, გადახდის გვერდის ავლა, კატალოგის მასობრივი კოპირება, მომხმარებლების შევიწროება ან უკანონო გამოყენება.',
        },
      ],
    },
  },
  '/data-deletion': {
    ru: {
      title: 'Удаление данных',
      intro: 'Удалить аккаунт можно прямо в настройках.',
      sections: [
        {
          heading: 'Как удалить',
          body: 'Откройте приложение → Настройки → Удалить аккаунт. Будут удалены профиль, сохранённые фразы, прогресс, серии и активность.',
        },
        {
          heading: 'Помощь',
          body: 'Если войти не получается, напишите с адреса аккаунта на daviddavowo@gmail.com.',
        },
      ],
    },
    ka: {
      title: 'მონაცემების წაშლა',
      intro: 'ანგარიშის წაშლა პირდაპირ პარამეტრებიდან შეგიძლიათ.',
      sections: [
        {
          heading: 'როგორ წავშალო',
          body: 'გახსენით აპი → პარამეტრები → ანგარიშის წაშლა. წაიშლება პროფილი, შენახული ფრაზები, პროგრესი, სერია და აქტივობა.',
        },
        {
          heading: 'დახმარება',
          body: 'თუ შესვლა ვერ ხერხდება, ანგარიშის ელფოსტიდან მოგვწერეთ: daviddavowo@gmail.com.',
        },
      ],
    },
  },
  '/refunds': {
    ru: {
      title: 'Возвраты',
      intro: 'Понятные правила до запуска платежей.',
      sections: [
        {
          heading: 'До подключения оплаты',
          body: 'Сейчас покупка недоступна, поэтому списаний и возвратов нет.',
        },
        {
          heading: 'После запуска',
          body: 'Условия возврата, отмена подписки и чеки будут доступны до покупки и в настройках аккаунта.',
        },
      ],
    },
    ka: {
      title: 'თანხის დაბრუნება',
      intro: 'გასაგები წესები გადახდების დაწყებამდე.',
      sections: [
        {
          heading: 'გადახდის ჩართვამდე',
          body: 'ამჟამად შეძენა შეუძლებელია, ამიტომ ჩამოჭრა და დაბრუნება არ არსებობს.',
        },
        {
          heading: 'გაშვების შემდეგ',
          body: 'დაბრუნების პირობები, გამოწერის გაუქმება და ქვითრები შეძენამდე და ანგარიშის პარამეტრებში გამოჩნდება.',
        },
      ],
    },
  },
  '/security': {
    ru: {
      title: 'Безопасность',
      intro: 'Как GEO защищает аккаунты и учебные данные.',
      sections: [
        {
          heading: 'Защита доступа',
          body: 'Вход работает через Supabase Auth, а правила RLS ограничивают данные владельцем аккаунта. В настройках можно завершить другие сессии.',
        },
        {
          heading: 'Платежи',
          body: 'GEO не хранит номера карт или банковские реквизиты. После запуска их будет обрабатывать сертифицированный платёжный провайдер.',
        },
      ],
    },
    ka: {
      title: 'უსაფრთხოება',
      intro: 'როგორ იცავს GEO ანგარიშებსა და სასწავლო მონაცემებს.',
      sections: [
        {
          heading: 'წვდომის დაცვა',
          body: 'შესვლა Supabase Auth-ით მუშაობს, RLS წესები კი მონაცემებს მხოლოდ ანგარიშის მფლობელისთვის ხსნის. სხვა სესიების დასრულება პარამეტრებიდან შეგიძლიათ.',
        },
        {
          heading: 'გადახდები',
          body: 'GEO არ ინახავს ბარათის ნომრებს ან საბანკო დეტალებს. გაშვების შემდეგ მათ სერტიფიცირებული გადახდის პროვაიდერი დაამუშავებს.',
        },
      ],
    },
  },
  '/accessibility': {
    ru: {
      title: 'Доступность',
      intro: 'GEO стремится быть удобным для разных пользователей.',
      sections: [
        {
          heading: 'Интерфейс',
          body: 'Поддерживаются клавиатура, подписи для элементов, заметный фокус, адаптивная верстка и режим уменьшенного движения.',
        },
        {
          heading: 'Обратная связь',
          body: 'Сообщить о препятствии можно по адресу daviddavowo@gmail.com.',
        },
      ],
    },
    ka: {
      title: 'ხელმისაწვდომობა',
      intro: 'GEO ცდილობს სხვადასხვა მომხმარებლისთვის მოსახერხებელი იყოს.',
      sections: [
        {
          heading: 'ინტერფეისი',
          body: 'მხარდაჭერილია კლავიატურა, ელემენტების სახელები, მკაფიო ფოკუსი, ადაპტიური განლაგება და შემცირებული მოძრაობის რეჟიმი.',
        },
        {
          heading: 'უკუკავშირი',
          body: 'ხელმისაწვდომობის პრობლემის შესახებ მოგვწერეთ: daviddavowo@gmail.com.',
        },
      ],
    },
  },
};

const guideTranslations: Record<
  InterfaceLocale,
  { back: string; note: string; steps: string[] }
> = {
  en: { back: 'Back to GEO', note: '', steps: [] },
  ru: {
    back: 'Назад в GEO',
    note: 'Короткая локализованная версия этой страницы.',
    steps: [
      'Начните с бесплатных 50 фраз и ищите на русском, английском, грузинском или латиницей.',
      'Phrasebook Pro открывает 1 000 современных разговорных слов за ₾60 один раз.',
      'Guided Learning добавляет уроки, прогресс и серии за ₾19.99 в месяц.',
    ],
  },
  ka: {
    back: 'GEO-ზე დაბრუნება',
    note: 'ამ გვერდის მოკლე ლოკალიზებული ვერსია.',
    steps: [
      'დაიწყეთ 50 უფასო ფრაზით და მოძებნეთ ქართულად, ინგლისურად, რუსულად ან ლათინური ასოებით.',
      'Phrasebook Pro ხსნის 1 000 თანამედროვე სასაუბრო სიტყვას ერთჯერადად ₾60-ად.',
      'Guided Learning ამატებს გაკვეთილებს, პროგრესსა და სერიებს ₾19.99-ად თვეში.',
    ],
  },
};

const guideTitles: Record<string, { ru: string; ka: string }> = {
  '/about': { ru: 'О GEO', ka: 'GEO-ს შესახებ' },
  '/changelog': { ru: 'Что нового', ka: 'რა არის ახალი' },
  '/features': { ru: 'Возможности GEO', ka: 'GEO-ს შესაძლებლობები' },
  '/guided-learning': { ru: 'Пошаговое обучение', ka: 'ეტაპობრივი სწავლა' },
  '/help': { ru: 'Центр помощи', ka: 'დახმარების ცენტრი' },
  '/install': { ru: 'Установить GEO', ka: 'GEO-ს დაყენება' },
  '/learn-english-for-georgians': {
    ru: 'Английский для грузин',
    ka: 'ინგლისური ქართველებისთვის',
  },
  '/learn-georgian': {
    ru: 'Как начать учить грузинский',
    ka: 'როგორ დავიწყოთ ქართულის სწავლა',
  },
  '/learn-georgian-batumi': {
    ru: 'Грузинский для жизни в Батуми',
    ka: 'ქართული ბათუმში ცხოვრებისთვის',
  },
  '/learn-georgian-for-russian-speakers': {
    ru: 'Грузинский для русскоязычных',
    ka: 'ქართული რუსულენოვანთათვის',
  },
  '/learn-georgian-tbilisi': {
    ru: 'Грузинский для жизни в Тбилиси',
    ka: 'ქართული თბილისში ცხოვრებისთვის',
  },
  '/phrasebook': {
    ru: 'Практический грузинский разговорник',
    ka: 'პრაქტიკული ქართული ფრაზები',
  },
  '/pricing': { ru: 'Простые цены в лари', ka: 'მარტივი ფასები ლარში' },
};

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
  const [locale, setLocale] = useState<InterfaceLocale>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = window.localStorage.getItem('geo-interface-language');
    if (stored === 'ru' || stored === 'ka' || stored === 'en') return stored;
    const browserLanguage = (
      window.navigator.languages?.[0] ?? window.navigator.language
    )
      .toLowerCase()
      .split('-')[0];
    return browserLanguage === 'ru'
      ? 'ru'
      : browserLanguage === 'ka'
        ? 'ka'
        : 'en';
  });
  const [pathname] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : window.location.pathname.replace(/\/$/, '') || '/',
  );
  const changeLocale = (next: InterfaceLocale) => {
    setLocale(next);
    document.documentElement.lang = next;
    window.localStorage.setItem('geo-interface-language', next);
  };
  const translated =
    locale === 'en' ? undefined : pageTranslations[pathname]?.[locale];
  const guide = guideTranslations[locale];
  const localizedTitle =
    translated?.title ??
    (locale === 'en' ? title : (guideTitles[pathname]?.[locale] ?? title));
  return (
    <main className="legal-page">
      <PublicHeader locale={locale} onLocaleChange={changeLocale} />
      <article lang={locale === 'en' ? lang : locale}>
        <a className="back-home" href="/">
          <ArrowLeft /> {guide.back}
        </a>
        <span className="legal-eyebrow">{eyebrow}</span>
        <h1>{localizedTitle}</h1>
        <p className="legal-intro">
          {translated?.intro ?? (locale === 'en' ? intro : guide.note)}
        </p>
        {locale === 'en' ? (
          children
        ) : translated ? (
          translated.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))
        ) : (
          <section>
            <h2>{locale === 'ru' ? 'Как это работает' : 'როგორ მუშაობს'}</h2>
            <ul>
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <p>
              <a href="mailto:daviddavowo@gmail.com">daviddavowo@gmail.com</a>
            </p>
          </section>
        )}
      </article>
      <PublicFooter locale={locale} />
    </main>
  );
}
