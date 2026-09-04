import { InfoPage } from '@/components/public-shell';

export default function ChangelogPage() {
  return (
    <InfoPage
      eyebrow="Product"
      title="Changelog"
      intro="A plain-language record of what is real in GEO today—and what is still being built."
    >
      <section>
        <h2>4 September 2026</h2>
        <ul>
          <li>
            Added a working installable PWA with branded icons, standalone
            launch, service-worker caching, and an offline fallback.
          </li>
          <li>
            Added locally focused Georgian-learning pages for Batumi, Tbilisi,
            and Russian-speaking residents.
          </li>
          <li>
            Improved loading with a much smaller skyline asset, deferred
            animation and database code, long-lived static caching, and
            off-screen rendering containment.
          </li>
          <li>
            Added the public product website, pricing explanation, usage guide,
            help content, and legal information.
          </li>
          <li>Expanded the free practical phrasebook to 50 phrases.</li>
          <li>
            Added secure $6.99/month Guided Learning entitlement checks for
            lessons, quizzes, progress, XP, daily activity, and streaks.
          </li>
          <li>
            Added the $20 one-time Phrasebook Pro tier and a separate secure
            lifetime entitlement for its future 1,000+ lookup catalog.
          </li>
          <li>
            Improved four-way phrase search and added real browser pronunciation
            playback when native audio is not yet available.
          </li>
        </ul>
        <h2>Public beta</h2>
        <p>
          Payment checkout, editorial review, native recordings, and
          self-service data tools remain launch work.
        </p>
      </section>
    </InfoPage>
  );
}
