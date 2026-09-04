import { InfoPage } from '@/components/public-shell';
export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal · Effective 4 September 2026"
      title="Terms of Service"
      intro="These beta terms govern GEO’s free phrasebook and paid-feature gates. Contact: daviddavowo@gmail.com. Operator identity and jurisdiction will be completed before commercial launch."
    >
      <section>
        <h2>Using GEO</h2>
        <p>
          You may use GEO for personal language learning and everyday reference.
          You are responsible for your account credentials, the accuracy of
          information you provide, and activity under your account. Do not
          misuse the service, probe or bypass security, automate abusive
          traffic, infringe content rights, or interfere with other users.
        </p>
        <h2>Language and safety limitations</h2>
        <p>
          GEO is an educational aid, not a certified interpreter or emergency,
          medical, legal, immigration, or financial service. Translations can be
          incomplete, context-dependent, or wrong. In urgent or high-stakes
          situations, use a qualified interpreter or the appropriate local
          service.
        </p>
        <h2>Accounts</h2>
        <p>
          Guest access is available for the free phrasebook. Saved-phrase
          synchronization requires an account. Phrasebook Pro content requires
          its lifetime entitlement. Lessons, quizzes, progress, XP, activity,
          and streaks require an active Guided Learning subscription. GEO may
          suspend access needed to protect users, investigate abuse, comply with
          law, or maintain the service.
        </p>
        <h2>Content and intellectual property</h2>
        <p>
          The GEO name, interface, original learning materials, and recordings
          are protected by applicable intellectual-property laws. You may not
          redistribute, sell, scrape at scale, or train models on the content
          without permission. Georgian words and facts themselves are not
          claimed as proprietary.
        </p>
        <h2>Beta availability</h2>
        <p>
          Features may change, be corrected, or be unavailable during the beta.
          The current service is provided without a promise of uninterrupted
          availability. To the extent permitted by law, GEO is not liable for
          indirect or consequential losses arising from use of the beta.
        </p>
        <h2>Paid services</h2>
        <p>
          Phrasebook Pro is listed at ₾60 once and Guided Learning at ₾19.99 per
          month, but checkout is not active and the beta does not accept
          payments. Product scope, billing entity, taxes, cancellation controls,
          refunds, and purchase restoration will be presented before paid
          activation.
        </p>
        <h2>Changes and termination</h2>
        <p>
          These terms may change as GEO moves toward launch. Material changes
          will be dated and, where required, communicated before they take
          effect.
        </p>
      </section>
    </InfoPage>
  );
}
