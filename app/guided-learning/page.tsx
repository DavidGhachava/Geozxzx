/* eslint-disable next/no-html-link-for-pages */
import { InfoPage } from '@/components/public-shell';
export const metadata = {
  title: 'Five-Minute Georgian Lessons',
  description:
    'Build a practical Georgian habit with short daily lessons, saved progress, activity tracking, quizzes, XP, and streaks.',
  alternates: { canonical: '/guided-learning' },
};
export default function GuidedLearningPage() {
  return (
    <InfoPage
      eyebrow="Guided Learning · $6.99/month"
      title="A daily habit that fits into real life."
      intro="Guided Learning is GEO’s premium plan. An active subscription unlocks lessons, quizzes, smart review, progress, XP, and streaks."
    >
      <section>
        <h2>What subscribers unlock</h2>
        <ol>
          <li>Open a focused daily lesson.</li>
          <li>Study a practical Georgian phrase and transliteration.</li>
          <li>Answer a meaning check.</li>
          <li>Save XP, progress, activity, and your timezone-aware streak.</li>
        </ol>
        <h2>Free still means useful</h2>
        <p>
          Everyone can browse and search the complete 50-phrase starter
          phrasebook. Create a free account to save favorites across devices.
        </p>
        <h2>Secure access</h2>
        <p>
          The app verifies subscription access on the server before recording
          lesson progress. Checkout is still being connected, so the current
          beta does not collect payment details.
        </p>
        <p>
          <a className="inline-cta" href="/#app">
            Open GEO and view the plan →
          </a>
        </p>
      </section>
    </InfoPage>
  );
}
