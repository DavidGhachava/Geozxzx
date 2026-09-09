/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';

export const metadata = {
  title: 'Georgian Learning App Pricing',
  description:
    'Start with 50 Georgian phrases free, unlock the 9,000-word dictionary for life, or follow personalized guided lessons.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <InfoPage
      eyebrow="Simple access"
      title="Start free. Unlock the part that moves you forward."
      intro="Use the practical starter forever. Choose the complete dictionary when you need instant answers, or Guided Learning when you want a daily speaking system."
    >
      <section>
        <div className="legal-plans three-plans">
          <article>
            <span>Free forever</span>
            <h2>Practical starter</h2>
            <strong>50 phrases</strong>
            <p>
              Useful Georgian for greetings, cafés, transport, shopping,
              emergencies, and meeting people—with pronunciation.
            </p>
            <a href="/#app">Open the app</a>
          </article>
          <article className="phrasebook-plan">
            <span>Pay once</span>
            <h2>Phrasebook Pro</h2>
            <strong>₾60 lifetime</strong>
            <p>
              Search 9,000 Georgian words by Georgian, English, Russian, or
              transliteration. Keep access without a recurring fee.
            </p>
          </article>
          <article>
            <span>Complete learning</span>
            <h2>Guided Learning</h2>
            <strong>₾19 / month</strong>
            <p>
              Three-word mini-lessons, learner goals, focus-weighted daily
              plans, memory review, speaking missions, synchronized progress,
              XP, and access to the extended dictionary.
            </p>
          </article>
        </div>
        <h2>Checkout is the next launch step</h2>
        <p>
          Paid areas are already protected by account entitlements. Checkout is
          not connected yet, so the app cannot charge anyone today. The prices
          above describe the intended product structure before payment launch.
        </p>
      </section>
    </InfoPage>
  );
}
