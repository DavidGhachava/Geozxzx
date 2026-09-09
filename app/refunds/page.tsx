import { InfoPage } from "@/components/public-shell";
export default function RefundsPage() {
  return (
    <InfoPage
      eyebrow="Legal · Effective 4 September 2026"
      title="Refund and Cancellation Policy"
      intro="GEO does not currently accept payments. No renewal, charge, cancellation, or refund can be created in the current beta."
    >
      <section>
        <h2>Before paid launch</h2>
        <p>
          This page will be updated with the merchant’s legal identity,
          supported currencies, taxes, renewal timing, cancellation method,
          refund eligibility, statutory withdrawal rights, failed-payment
          handling, and purchase-restoration process.
        </p>
        <h2>Current beta access</h2>
        <p>
          The phrasebook, reference dictionary, and guided learning experience
          are currently available as a public beta. No purchase can be made, so
          there is no current charge to refund. Commercial terms will be
          confirmed before checkout launches.
        </p>
        <h2>Consumer rights</h2>
        <p>
          Nothing in a future commercial policy will exclude rights that cannot
          legally be excluded. Digital-content and subscription rights can vary
          by location, so the launch policy will be reviewed for the markets GEO
          actually serves.
        </p>
      </section>
    </InfoPage>
  );
}
