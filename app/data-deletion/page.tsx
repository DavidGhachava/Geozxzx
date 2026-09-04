import { InfoPage } from '@/components/public-shell';

export default function DataDeletionPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Data deletion"
      intro="Signed-in users can permanently delete their GEO account from the app settings."
    >
      <section>
        <h2>Delete in the app</h2>
        <p>
          Open GEO, choose your account, open Settings, and select Delete my
          account. Confirming removes the authentication account and its linked
          profile, saved phrases, progress, activity, streaks, subscriptions,
          and entitlements through database cascades.
        </p>
        <h2>If you cannot sign in</h2>
        <p>
          Email daviddavowo@gmail.com from the address linked to the account.
          Identity verification may be required before a manual request can be
          completed.
        </p>
        <h2>Guest use</h2>
        <p>
          The public phrasebook does not require an account. Browser-only
          language and cookie choices can be removed with the browser’s
          site-data controls.
        </p>
      </section>
    </InfoPage>
  );
}
