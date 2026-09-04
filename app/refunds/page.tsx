import { InfoPage } from '@/components/public-shell';
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
        <h2>Intended products</h2>
        <p>
          Phrasebook Pro is listed at ₾60 as a one-time lifetime-access
          purchase. Guided Learning is listed at ₾19.99 per month. The 50-phrase
          practical phrasebook remains free. These terms will be confirmed
          before checkout launches.
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
