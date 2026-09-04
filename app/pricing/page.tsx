/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';
export const metadata = {
  title: 'Georgian Learning App Pricing',
  description:
    'Use GEO’s 50-phrase Georgian phrasebook free, or unlock lessons, quizzes, progress, XP, and streaks with Guided Learning for $6.99 a month.',
  alternates: { canonical: '/pricing' },
};
export default function PricingPage() {
  return (
    <InfoPage
      eyebrow="Simple pricing"
      title="The phrasebook is free. Guided learning is $6.99/month."
      intro="Learn useful Georgian immediately, then subscribe when you want a structured daily learning habit."
    >
      <section>
        <div className="legal-plans">
          <article>
            <span>Free forever</span>
            <h2>Phrasebook</h2>
            <strong>$0</strong>
            <p>
              All 50 practical phrases, Georgian and transliteration search,
              English and Russian meanings, category browsing, and saved
              favorites with a free account.
            </p>
            <a href="/#app">Open the free phrasebook</a>
          </article>
          <article>
            <span>Subscription</span>
            <h2>Guided Learning</h2>
            <strong>$6.99/month</strong>
            <p>
              Daily lessons, quizzes, smart review, synchronized progress, XP,
              daily activity, and streaks. Access requires a confirmed active
              subscription.
            </p>
          </article>
        </div>
        <h2>No surprise charges</h2>
        <p>
          The subscription gate is active, but checkout is still being
          connected, so GEO does not currently collect payment details or
          process purchases. Renewal, cancellation, taxes, invoices, refunds,
          and purchase restoration will be shown clearly before payments launch.
        </p>
      </section>
    </InfoPage>
  );
}
