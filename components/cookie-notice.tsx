'use client';
/* eslint-disable next/no-html-link-for-pages */

import { useEffect, useState } from 'react';

export function CookieNotice({
  locale = 'en',
}: {
  locale?: 'en' | 'ru' | 'ka';
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    window.setTimeout(
      () => setVisible(localStorage.getItem('geo-cookie-choice') === null),
      0,
    );
  }, []);
  if (!visible) return null;
  const choose = (value: string) => {
    localStorage.setItem('geo-cookie-choice', value);
    setVisible(false);
  };
  const copy = {
    en: {
      label: 'Cookie preferences',
      title: 'Your privacy, plainly',
      body: 'GEO uses essential browser storage for account sessions and this preference. No advertising cookies or analytics are active.',
      policy: 'Read the Cookie Policy',
      essential: 'Essential only',
      accept: 'Accept',
    },
    ru: {
      label: 'Настройки cookie',
      title: 'О конфиденциальности — просто',
      body: 'GEO использует только необходимое хранилище браузера для сеансов аккаунта и этой настройки. Рекламных cookie и аналитики нет.',
      policy: 'Политика cookie',
      essential: 'Только необходимые',
      accept: 'Принять',
    },
    ka: {
      label: 'Cookie პარამეტრები',
      title: 'კონფიდენციალურობა მარტივად',
      body: 'GEO იყენებს მხოლოდ აუცილებელ ბრაუზერის საცავს ანგარიშის სესიისა და ამ არჩევანისთვის. სარეკლამო cookie და ანალიტიკა გამორთულია.',
      policy: 'Cookie პოლიტიკის ნახვა',
      essential: 'მხოლოდ აუცილებელი',
      accept: 'მიღება',
    },
  }[locale];
  return (
    <aside className="cookie-notice" aria-label={copy.label}>
      <div>
        <b>{copy.title}</b>
        <p>{copy.body}</p>
        <a href="/cookies">{copy.policy}</a>
      </div>
      <div>
        <button onClick={() => choose('essential')}>{copy.essential}</button>
        <button className="cookie-accept" onClick={() => choose('accepted')}>
          {copy.accept}
        </button>
      </div>
    </aside>
  );
}
