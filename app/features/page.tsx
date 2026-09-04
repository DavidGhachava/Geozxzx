import { InfoPage } from '@/components/public-shell';
export const metadata = {
  title: 'Georgian Learning App Features',
  description:
    'Search Georgian phrases in four forms, save useful expressions, practice short lessons, and sync progress securely across devices.',
  alternates: { canonical: '/features' },
};
export default function FeaturesPage() {
  return (
    <InfoPage
      eyebrow="Product"
      title="Useful Georgian, built around real moments."
      intro="GEO starts with a free 50-phrase Georgian phrasebook, adds a powerful lifetime lookup pack, and offers structured learning as a separate subscription."
    >
      <section>
        <h2>50 phrases, free</h2>
        <p>
          Search Georgian spelling, transliteration, English, or Russian. Browse
          practical situations including essentials, food, transport, shopping,
          emergencies, and meeting people.
        </p>
        <h2>Keep a personal phrasebook</h2>
        <p>
          Use GEO immediately as a guest. Create a free account when you want
          saved favorites synchronized securely across devices.
        </p>
        <h2>Phrasebook Pro · $20 once</h2>
        <p>
          Built for instant real-world answers: a growing 1,000+ word and
          sentence catalog, examples, richer context, pronunciation, and
          downloadable offline packs with lifetime access.
        </p>
        <h2>Guided Learning · $6.99/month</h2>
        <p>
          Subscribers unlock five-minute lessons, quizzes, smart review,
          synchronized progress, XP, daily activity, and streaks. Lesson
          progress can only be recorded for an account with active access.
        </p>
        <h2>Install or use the web</h2>
        <p>
          GEO can be installed as a progressive web app with a standalone
          window, branded icon, cached core interface, and offline fallback. It
          also remains fully usable in the browser.
        </p>
        <h2>What is still being prepared</h2>
        <p>
          Native-speaker audio, deeper spaced repetition, public social sign-in,
          and payment checkout are launch-stage work—not features we claim are
          complete today.
        </p>
      </section>
    </InfoPage>
  );
}
