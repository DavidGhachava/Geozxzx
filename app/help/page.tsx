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
          You can browse 50 practical phrases as a guest. Phrasebook Pro and
          Guided Learning require an account with the matching access. Sign in
          to synchronize saved phrases, memory, lessons, and your learning plan.
        </p>
        <h2>Curated and extended words</h2>
        <p>
          The free starter contains 50 practical phrases. Phrasebook Pro opens
          the broader 9,000-word reference dictionary, whose extended entries do
          not yet have the same editorial and audio coverage as the curated
          core.
        </p>
        <h2>Guided Learning</h2>
        <p>
          Guided Learning is the planned ₾19 monthly membership. Its short
          learning-plan questions personalize daily lessons around your
          situations and pace without neglecting general speaking ability.
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
          The website, 50-phrase free starter, protected extended dictionary,
          protected eight-unit course, account sync, password recovery, and
          installable PWA are online. Checkout, full extended-dictionary review,
          social sign-in, and the editorial CMS are not yet launched.
        </p>
      </section>
    </InfoPage>
  );
}
