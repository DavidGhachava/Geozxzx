import { InfoPage } from '@/components/public-shell';

export default function ChangelogPage() {
  return (
    <InfoPage
      eyebrow="Product"
      title="Changelog"
      intro="A plain-language record of what is real in GEO today—and what is still being built."
    >
      <section>
        <h2>9 September 2026</h2>
        <ul>
          <li>
            Defined the launch access model: 50 phrases free, Phrasebook Pro as
            a lifetime dictionary unlock, and Guided Learning as a membership.
          </li>
          <li>
            Connected every dictionary and learning entry point to the existing
            account-entitlement checks.
          </li>
          <li>
            Added a first-sign-in questionnaire for goals, situations,
            experience, pace, and discovery source.
          </li>
          <li>
            Daily lessons now emphasize the learner’s focus while preserving
            everyday speaking and memory review.
          </li>
          <li>
            Expanded Guided Learning to eight complete situation-based units.
          </li>
          <li>
            Added complete mobile app navigation, rebuilt mobile Explore, and
            corrected mini-lesson progress.
          </li>
          <li>
            Added password recovery, secure password updates, and
            local-to-account progress merging.
          </li>
          <li>
            Separated the free starter from the 9,000-word reference dictionary.
          </li>
        </ul>
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
          <li>Expanded the practical situation collection to 50 phrases.</li>
          <li>
            Added the first server-side Guided Learning entitlement model for
            future commercial access.
          </li>
          <li>Added a separate future product-entitlement model.</li>
          <li>
            Improved four-way phrase search and added real browser pronunciation
            playback when native audio is not yet available.
          </li>
        </ul>
        <h2>Before checkout launches</h2>
        <p>
          Payment checkout, complete extended-dictionary editorial review,
          native recordings beyond the curated core, and self-service data
          export remain launch work.
        </p>
      </section>
    </InfoPage>
  );
}
