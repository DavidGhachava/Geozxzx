import { InfoPage } from '@/components/public-shell';

export const metadata = {
  title: 'About GEO Georgian Learning',
  description:
    'GEO helps international residents, Russian speakers, expats, and visitors use practical Georgian in everyday life.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title="Language for belonging, not just visiting."
      intro="GEO is being built for tourists, new residents, expats, and anyone who wants Georgian to feel usable in daily life."
    >
      <section>
        <h2>The mission</h2>
        <p>
          Make the first useful Georgian words easy to find, understand,
          practice, and remember—without turning a real conversation into a
          grammar exercise.
        </p>
        <h2>Vocabulary sources and licensing</h2>
        <p>
          GEO’s expanded vocabulary is ranked using the{' '}
          <a href="https://easygeorgian.com/spoken-georgian-frequency/">
            Spoken Georgian Frequency List v2026.07
          </a>{' '}
          by EasyGeorgian Research (Lasse N. and Tamar N.), licensed under CC BY
          4.0. Russian dictionary meanings are adapted from Russian Wiktionary
          data distributed through{' '}
          <a href="https://kaikki.org/ruwiktionary/%D0%93%D1%80%D1%83%D0%B7%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9/index.html">
            Kaikki.org
          </a>
          . GEO reordered, filtered, merged, and shortened parts of these
          sources. The combined open vocabulary dataset is available under{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            CC BY-SA 4.0
          </a>
          ; GEO’s interface and original recordings are separate works.
        </p>
        <p>
          Frequency data is a starting point, not a guarantee. Meanings and
          transliterations can be incomplete or context-dependent and will be
          refined through native-speaker editorial review.
        </p>
        <h2>Product principles</h2>
        <p>
          Be honest about feature status. Respect personal data. Make guest use
          easy. Keep practice short. Design for touch, keyboard, screen readers,
          Georgian script, and Cyrillic text.
        </p>
      </section>
    </InfoPage>
  );
}
