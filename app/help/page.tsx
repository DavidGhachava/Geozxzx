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
          You can browse all 50 free phrases as a guest. Sign in with email to
          synchronize saved favorites. If email confirmation is enabled, confirm
          the message before signing in.
        </p>
        <h2>Phrasebook Pro</h2>
        <p>
          Phrasebook Pro is the ₾60 one-time lookup upgrade. It is designed for
          a growing 1,000+ word and practical-sentence catalog, examples, richer
          context, pronunciation, and downloadable offline packs. The current
          beta has 50 searchable entries while the expanded catalog and checkout
          are completed.
        </p>
        <h2>Guided Learning</h2>
        <p>
          Lessons, quizzes, progress, XP, daily activity, and streaks require an
          active ₾19.99/month subscription. The access gate is active; payment
          checkout is still being connected.
        </p>
        <h2>Install GEO</h2>
        <p>
          Use the Install button in GEO or your Chrome or Edge browser menu. On
          iPhone and iPad, open GEO in Safari, tap Share, and choose Add to Home
          Screen.
        </p>
        <h2>Saved phrases</h2>
        <p>
          Open any category and select the bookmark. Signed-in saves are tied to
          your account and protected so other users cannot read or change them.
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
          The website, 50-phrase search, account sync, product entitlement
          enforcement, and installable PWA are online. Payments, the 1,000+ Pro
          catalog, a complete native-audio library, social sign-in, and the
          editorial CMS are not yet launched.
        </p>
      </section>
    </InfoPage>
  );
}
