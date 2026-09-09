/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';

export const metadata = {
  title: 'Georgian Learning App Beta Access',
  description:
    'Use the curated Georgian starter, extended dictionary, and personalized learning course during the free public beta.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <InfoPage
      eyebrow="Free public beta"
      title="Learn freely while we finish the launch experience."
      intro="Payments are not active. The current beta lets you test the complete learning loop and tell us what needs improving."
    >
      <section>
        <div className="legal-plans three-plans">
          <article>
            <span>Curated core</span>
            <h2>400 essentials</h2>
            <strong>Included</strong>
            <p>
              Reviewed Georgian words with transliteration, English and Russian
              meanings, pronunciation, search, and saved favorites.
            </p>
            <a href="/#app">Open the app</a>
          </article>
          <article className="phrasebook-plan">
            <span>Reference beta</span>
            <h2>Extended dictionary</h2>
            <strong>9,000 words</strong>
            <p>
              A broad searchable reference for discovery. Extended entries are
              clearly separated from the 400-word curated and recorded core.
            </p>
          </article>
          <article>
            <span>Personalized beta</span>
            <h2>Guided Learning</h2>
            <strong>8 units</strong>
            <p>
              Three-word mini-lessons, learner goals, focus-weighted daily
              plans, memory review, speaking missions, synchronized progress,
              and XP.
            </p>
          </article>
        </div>
        <h2>No payment is collected</h2>
        <p>
          Pricing and paid entitlements will be announced only after the course,
          account recovery, content review, and mobile experience are ready.
          Existing beta access does not create a subscription or future charge.
        </p>
      </section>
    </InfoPage>
  );
}
