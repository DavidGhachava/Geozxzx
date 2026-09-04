import { InfoPage } from '@/components/public-shell';

export default function AccessibilityPage() {
  return (
    <InfoPage
      eyebrow="Trust"
      title="Accessibility Statement"
      intro="GEO is being designed toward WCAG 2.2 Level AA; this is a goal, not yet a formal conformance claim."
    >
      <section>
        <h2>Current support</h2>
        <p>
          Semantic structure, keyboard-operable controls, visible focus, labeled
          icon actions, written equivalents for audio, responsive layouts,
          reduced-motion preferences, and color-plus-icon feedback are built
          into the current experience.
        </p>
        <h2>Testing still required</h2>
        <p>
          Before claiming conformance, GEO needs manual keyboard and
          screen-reader testing, 200% text zoom, contrast and target-size
          review, and assistive-technology testing in English, Russian, and
          Georgian.
        </p>
        <h2>Feedback</h2>
        <p>Report an accessibility barrier to daviddavowo@gmail.com.</p>
      </section>
    </InfoPage>
  );
}
