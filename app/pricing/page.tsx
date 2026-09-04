/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';
export const metadata = {
  title: 'Georgian Learning App Pricing',
  description:
    'Search 50 Georgian phrases free, get a growing 1,000+ word and sentence Phrasebook Pro catalog for $20 once, or choose Guided Learning for $6.99 a month.',
  alternates: { canonical: '/pricing' },
};
export default function PricingPage() {
  return (
    <InfoPage
      eyebrow="Simple pricing"
      title="Start free. Pay once for lookup power—or monthly for a course."
      intro="Phrasebook Pro and Guided Learning solve different needs: instant real-world answers versus a structured learning habit."
    >
      <section>
        <div className="legal-plans three-plans">
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
          <article className="phrasebook-plan">
            <span>One-time purchase</span>
            <h2>Phrasebook Pro</h2>
            <strong>$20 once</strong>
            <p>
              Lifetime access to a growing catalog of 1,000+ useful Georgian
              words and practical sentences, with four-way search, real-life
              examples, richer usage notes, pronunciation, and downloadable
              offline packs.
            </p>
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
          Both access gates are active, but checkout is still being connected,
          so GEO does not currently collect payment details or process
          purchases. The beta currently contains 50 searchable entries; the
          expanded 1,000+ Pro catalog, purchase restoration, renewal,
          cancellation, taxes, invoices, and refunds will be shown clearly
          before payments launch.
        </p>
      </section>
    </InfoPage>
  );
}
