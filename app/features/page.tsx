import { InfoPage } from '@/components/public-shell';

export const metadata = {
  title: 'Georgian Learning App Features',
  description:
    'Search a curated Georgian core, explore a broad dictionary, and follow personalized three-word lessons.',
  alternates: { canonical: '/features' },
};

export default function FeaturesPage() {
  return (
    <InfoPage
      eyebrow="Product"
      title="Useful Georgian, built around real moments."
      intro="Search a trusted core, explore a broad reference dictionary, and learn three words at a time through situations that matter to you."
    >
      <section>
        <h2>50 practical phrases, free</h2>
        <p>
          Start with the situations people need most: greetings, cafés,
          transport, shopping, emergencies, and meeting people.
        </p>
        <h2>A 9,000-word reference dictionary</h2>
        <p>
          Phrasebook Pro unlocks the broader catalog for fast lookup by
          Georgian, transliteration, English, or Russian.
        </p>
        <h2>A learning plan built around you</h2>
        <p>
          Choose why you are learning, the situations you care about, your
          experience, and your pace. Daily lessons emphasize that focus while
          keeping everyday speaking and overdue review in the mix.
        </p>
        <h2>Three words, then a win</h2>
        <p>
          Each mini-lesson teaches at most three words, checks them gently, and
          ends with a clear completion moment. Mistakes schedule extra practice;
          they do not fail the lesson.
        </p>
        <h2>Install or use the web</h2>
        <p>
          Use the app in any browser or install it for a standalone window,
          branded icon, cached interface, and offline fallback.
        </p>
        <h2>What is still being prepared</h2>
        <p>
          Extended-dictionary editorial review, complete native audio coverage,
          social sign-in, and payment checkout remain launch-stage work. Paid
          content is already hidden behind account entitlements.
        </p>
      </section>
    </InfoPage>
  );
}
