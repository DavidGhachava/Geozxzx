import { InfoPage } from '@/components/public-shell';

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal · Effective 4 September 2026"
      title="Privacy Policy"
      intro="This policy explains the information GEO handles. Contact: daviddavowo@gmail.com. Operator identity and jurisdiction will be added before commercial launch."
    >
      <section>
        <h2>Information we handle</h2>
        <p>
          You can browse phrases without an account. An account may contain your
          email, optional name and phone number, language preferences, saved
          phrases, progress, quiz results, XP, streaks, and daily activity.
          Infrastructure providers may process security logs such as timestamps,
          device information, and IP addresses. GEO never stores card or bank
          details.
        </p>
        <h2>Why we use it</h2>
        <p>
          We use this data to authenticate you, synchronize learning, provide
          access, secure the service, diagnose problems, and meet legal
          obligations. GEO does not sell personal information or use advertising
          cookies.
        </p>
        <h2>Providers and retention</h2>
        <p>
          Supabase provides authentication and application-data storage. OpenAI
          Sites and its infrastructure providers deliver the website. Account
          data is retained while your account is active and as reasonably
          required for security, disputes, and law.
        </p>
        <h2>Your controls</h2>
        <p>
          You can use the free phrasebook as a guest, edit profile details,
          remove saves, revoke other sessions, sign out, or permanently delete
          your account from Settings. Depending on your location, additional
          rights may apply.
        </p>
        <h2>Children and changes</h2>
        <p>
          GEO is not intentionally directed to children below their local
          digital-consent age. Material policy changes will be dated here.
        </p>
      </section>
    </InfoPage>
  );
}
