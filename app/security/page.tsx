import { InfoPage } from '@/components/public-shell';

export default function SecurityPage() {
  return (
    <InfoPage
      eyebrow="Trust"
      title="Security at GEO"
      intro="GEO is designed so signed-in learners can access only their own private records."
    >
      <section>
        <h2>Current protections</h2>
        <p>
          Supabase Auth protects sign-in. Database row-level security ties
          profiles, saves, progress, streaks, and daily activity to the
          authenticated owner. Paid access is checked server-side.
        </p>
        <h2>Account controls</h2>
        <p>
          Settings can revoke every other session and permanently delete the
          account. Account deletion uses a JWT-protected server function and
          never accepts another user ID from the browser.
        </p>
        <h2>Payments</h2>
        <p>
          GEO does not store bank or card details. A certified payment provider
          will manage those details when checkout launches.
        </p>
        <h2>Report a concern</h2>
        <p>
          Email security concerns privately to daviddavowo@gmail.com. Do not
          include passwords, payment details, or unnecessary personal data.
        </p>
      </section>
    </InfoPage>
  );
}
