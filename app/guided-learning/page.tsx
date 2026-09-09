/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';

export const metadata = {
  title: 'Personalized Georgian Lessons',
  description:
    'Build practical Georgian with personalized three-word lessons, memory review, speaking missions, and adjustable pace.',
  alternates: { canonical: '/guided-learning' },
};

export default function GuidedLearningPage() {
  return (
    <InfoPage
      eyebrow="Guided Learning"
      title="Build speaking confidence three words at a time."
      intro="Choose your goals and pace. GEO balances your priority situations with everyday speaking and memory review."
    >
      <section>
        <h2>One small win at a time</h2>
        <p>
          Each mini-lesson introduces no more than three words, lets you hear
          and repeat them, checks recall gently, and finishes with a clear
          stopping point.
        </p>
        <h2>Focused, not narrow</h2>
        <p>
          About two thirds of new language follows your chosen goal. The rest
          maintains universal conversation skills and brings back weak or
          overdue words.
        </p>
        <h2>Eight real-life units</h2>
        <p>
          Practice first conversations, cafés, shopping, transport, home, work
          and services, health, and making plans with friends.
        </p>
        <h2>Built for consistent learners</h2>
        <p>
          Guided Learning is the ₾19 monthly membership. It includes the
          personalized eight-unit course, synchronized progress, and the
          extended dictionary. Checkout is coming next; access is already
          protected by account entitlement.
        </p>
        <p>
          <a className="inline-cta" href="/#app">
            Preview Guided Learning →
          </a>
        </p>
      </section>
    </InfoPage>
  );
}
