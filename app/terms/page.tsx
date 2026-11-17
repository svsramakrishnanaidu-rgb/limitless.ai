import type { Metadata } from "next";
import Link from "next/link";
import { Glass, PageHeader, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms that govern use of LIMITLESS, including medical limitations and AI behaviour.",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Terms and Conditions" description="Plain terms for a health education tool." />
      <div className="flex flex-col gap-4">
        <Callout tone="danger" title="Emergency notice">
          LIMITLESS is not an emergency service. It does not monitor you, call for help, or dispatch assistance. In an emergency, call your local emergency
          number immediately — 112 in India, 911 in the United States, 999 in the United Kingdom, 112 in the European Union.
        </Callout>

        <Glass className="card-pad med-prose">
          <p className="tiny muted">Last updated: 16 November 2026</p>

          <h2 className="section-title mt-4">1. Acceptance</h2>
          <p>
            By using LIMITLESS you agree to these terms. If you do not agree, do not use the application. If you use LIMITLESS on behalf of someone else, you
            confirm you are authorised to do so.
          </p>

          <h2 className="section-title mt-4">2. Educational purpose only</h2>
          <p>
            LIMITLESS provides general health education and tools for personal record-keeping. It does not provide medical advice, diagnosis, treatment,
            prescribing, or a second opinion, and using it does not create a clinician-patient relationship. Content about traditional systems is presented
            for education and context, not as a recommendation to self-treat.
          </p>

          <h2 className="section-title mt-4">3. No substitute for professional care</h2>
          <p>
            Always seek the advice of a qualified healthcare professional for a medical condition. Never delay care, disregard advice, or stop prescribed
            treatment because of something you read here. If you use herbs, supplements or traditional preparations, tell your clinician and pharmacist.
          </p>

          <h2 className="section-title mt-4">4. AI limitations</h2>
          <p>
            LIMITLESS AI is a language model. It can be inaccurate, incomplete or out of date, and it may produce plausible-sounding errors. It is instructed
            not to diagnose or prescribe and to flag emergencies, but it can still fail. You are responsible for verifying any health information with a
            qualified professional. Automated plant identification is similarly unreliable and must never be used as the basis for eating, preparing or
            applying a plant.
          </p>

          <h2 className="section-title mt-4">5. Your responsibilities</h2>
          <ul>
            <li>Enter accurate information; do not use the app to record another person&apos;s data without their consent.</li>
            <li>Do not use LIMITLESS to make emergency decisions or to self-prescribe.</li>
            <li>Do not attempt to extract, scrape, reverse engineer or overload the service, or use it for unlawful purposes.</li>
            <li>Keep your own backups; device data can be lost when browser storage is cleared.</li>
            <li>Do not present the in-app learning record as a professional qualification.</li>
          </ul>

          <h2 className="section-title mt-4">6. Third-party data and services</h2>
          <p>
            Hospital and place data comes from OpenStreetMap contributors and is available under the Open Database Licence. It may be incomplete or out of
            date, and LIMITLESS does not verify facility services, opening hours or availability. AI responses come from third-party providers whose terms
            also apply. External links are provided for convenience and are not endorsements.
          </p>

          <h2 className="section-title mt-4">7. No warranties</h2>
          <p>
            LIMITLESS is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including accuracy,
            fitness for a particular purpose, or uninterrupted availability. Health content is reviewed periodically but may become outdated.
          </p>

          <h2 className="section-title mt-4">8. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, LIMITLESS and its contributors are not liable for indirect, incidental or consequential damages, or for
            decisions made in reliance on the application. Nothing in these terms excludes liability that cannot lawfully be excluded, including for death or
            personal injury caused by negligence where such exclusion is prohibited.
          </p>

          <h2 className="section-title mt-4">9. Availability and changes</h2>
          <p>
            Features may change or be withdrawn. AI features depend on third-party providers and may be unavailable without notice. Material changes to these
            terms will be reflected in the date above.
          </p>

          <h2 className="section-title mt-4">10. Intellectual property</h2>
          <p>
            The LIMITLESS name, mark and original interface are the property of their creator. Quoted facts and linked sources remain the property of their
            respective publishers. OpenStreetMap data is © OpenStreetMap contributors, ODbL. You may not copy the application in whole as your own product.
          </p>

          <h2 className="section-title mt-4">11. Governing law</h2>
          <p>
            These terms are governed by the laws of India, without prejudice to mandatory consumer protections in your country of residence. Disputes are
            subject to the jurisdiction of Indian courts unless local law requires otherwise.
          </p>

          <h2 className="section-title mt-4">12. Contact</h2>
          <p>
            A monitored contact address must be published with the production domain before launch. Until then, this build has no support desk. Do not send
            medical information to an unverified address.
          </p>

          <p className="mt-4">
            See also the <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </Glass>
      </div>
    </div>
  );
}
