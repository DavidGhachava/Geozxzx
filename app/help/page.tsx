import { InfoPage } from '@/components/public-shell';
export const metadata = {
  title: 'GEO Help Center',
  description:
    'Get help using the GEO Georgian phrasebook, account sync, saved phrases, learning progress, and installable web app.',
  alternates: { canonical: '/help' },
};
export default function HelpPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Help with GEO."
      intro="Find quick answers, report content, or check the current product status."
    >
      <section>
        <h2>Free accounts</h2>
        <p>
          You can browse the dictionary and try learning as a guest. Sign in to
          synchronize saved words, memory, completed lessons, and your learning
          plan.
        </p>
        <h2>Curated and extended words</h2>
        <p>
          The first 400 words are the curated core with complete translations
          and audio. The larger 9,000-word dictionary is reference beta content
          and does not yet have the same editorial and audio coverage.
        </p>
        <h2>Guided Learning</h2>
        <p>
          Guided Learning is open during beta. After signing in, answer the
          short learning-plan questions so daily lessons can prioritize your
          situations and pace.
        </p>
        <h2>Install GEO</h2>
        <p>
          Use the Install button in GEO or your Chrome or Edge browser menu. On
          iPhone and iPad, open GEO in Safari, tap Share, and choose Add to Home
          Screen.
        </p>
        <h2>Saved phrases</h2>
        <p>
          Select the bookmark beside a word. Guest saves stay on that device;
          after sign-in, local progress is merged with protected account data.
        </p>
        <h2 id="report">Report an incorrect phrase</h2>
        <p>
          Do not rely on GEO for medical, legal, emergency, or safety-critical
          interpretation. A public content-report form and support address will
          be added before general launch. Until then, do not submit personal or
          sensitive information through the app.
        </p>
        <h2 id="status">System status</h2>
        <p>
          The website, 400-word curated core, extended dictionary, personalized
          eight-unit course, account sync, password recovery, and installable
          PWA are online. Payments, full extended-dictionary review, social
          sign-in, and the editorial CMS are not yet launched.
        </p>
      </section>
    </InfoPage>
  );
}
