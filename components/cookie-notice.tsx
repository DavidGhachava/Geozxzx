'use client';
/* eslint-disable next/no-html-link-for-pages */

import { useEffect, useState } from 'react';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { window.setTimeout(() => setVisible(localStorage.getItem('geo-cookie-choice') === null), 0); }, []);
  if (!visible) return null;
  const choose = (value: string) => { localStorage.setItem('geo-cookie-choice', value); setVisible(false); };
  return <aside className="cookie-notice" aria-label="Cookie preferences"><div><b>Your privacy, plainly</b><p>GEO currently uses only essential browser storage for account sessions and this preference. No advertising cookies or analytics are active.</p><a href="/cookies">Read the Cookie Policy</a></div><div><button onClick={() => choose('essential')}>Essential only</button><button className="cookie-accept" onClick={() => choose('accepted')}>Accept</button></div></aside>;
}
