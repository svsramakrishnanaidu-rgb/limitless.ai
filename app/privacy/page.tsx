import type { Metadata } from "next";
import Link from "next/link";
import { Glass, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LIMITLESS handles health information, AI requests, location and device storage.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Written to describe what this build actually does, not what a template promises."
      />
      <Glass className="card-pad med-prose">
        <p className="tiny muted">Last updated: 16 November 2026</p>

        <h2 className="section-title mt-4">1. Who we are</h2>
        <p>
          LIMITLESS is a health education and personal wellness application. This policy covers the web application you are using. It does not cover
          third-party services you choose to open from it. LIMITLESS is not a healthcare provider and is not a covered entity or a registered medical
          device.
        </p>

        <h2 className="section-title mt-4">2. What stays on your device</h2>
        <p>
          The following are stored in your browser&apos;s local storage and are not transmitted to a LIMITLESS server: your profile (name, blood group,
          height, allergies, conditions, medicines), emergency contacts, tracker measurements (water, sleep, steps, exercise, weight, blood pressure,
          glucose, mood, habits), reminders, journal entries, saved items, learning progress, and AI conversation history stored locally.
        </p>
        <p>
          This data is readable by anyone with access to your browser profile on this device. It is not encrypted at rest by LIMITLESS. If you clear site
          data, it is deleted permanently. Export a copy from Settings if you need one.
        </p>

        <h2 className="section-title mt-4">3. What is sent to other services</h2>
        <ul>
          <li>
            <strong>AI messages.</strong> When you use LIMITLESS AI, the messages in the current conversation are sent through our server to the configured
            AI provider to generate a reply. Do not include information you are unwilling to share with that provider. Provider identity is shown in the
            assistant panel.
          </li>
          <li>
            <strong>Plant photos.</strong> When you use the scanner, the resized photo is sent through our server to a vision-capable AI provider. LIMITLESS
            does not retain the image after the request completes. Provider retention policies apply.
          </li>
          <li>
            <strong>Hospital search.</strong> Your coordinates or search text are sent to OpenStreetMap services (Overpass API and Nominatim) to find nearby
            facilities. The app requests location permission only when you press &ldquo;Use my location&rdquo;.
          </li>
          <li>
            <strong>Website delivery.</strong> Our hosting provider processes standard request data such as IP address and user agent to serve the site and
            protect it from abuse.
          </li>
        </ul>
        <p>
          LIMITLESS does not operate advertising, analytics or cross-site tracking scripts. No advertising identifiers are collected.
        </p>

        <h2 className="section-title mt-4">4. Medical information and AI</h2>
        <p>
          LIMITLESS AI receives the text you write into the assistant and may receive conversation context from the same session. It is instructed not to
          diagnose or prescribe, and to prioritise emergency guidance. AI output can be wrong. Never rely on it for a medical decision, and never delay
          emergency care to use the app.
        </p>

        <h2 className="section-title mt-4">5. Cookies and local storage</h2>
        <p>
          LIMITLESS uses browser local storage and a service worker cache, not advertising cookies. These are used for preferences, saved content and
          offline reading. There is no consent banner because no non-essential tracking is performed; if advertising or analytics is added later, this
          policy and the consent mechanism must change first.
        </p>

        <h2 className="section-title mt-4">6. Retention</h2>
        <p>
          Device data remains until you delete it or clear site data. AI requests are not stored by LIMITLESS beyond in-memory processing for the request;
          provider-side retention is governed by the provider&apos;s terms. Server logs, where enabled by hosting, are retained only as long as needed for
          security and operations.
        </p>

        <h2 className="section-title mt-4">7. Your choices and rights</h2>
        <ul>
          <li>Export a machine-readable copy of device data from Settings → Privacy and data.</li>
          <li>Delete all device data from the same panel, or clear site data in your browser.</li>
          <li>Decline location or microphone permission; the related features simply remain unavailable.</li>
          <li>Stop using AI features and rely on the offline library instead.</li>
        </ul>
        <p>
          Depending on where you live, data protection law may give you rights of access, correction, erasure, portability and objection. Because LIMITLESS
          does not hold an account or a server-side copy of your health records in this build, most such requests are satisfied directly through the export
          and delete controls.
        </p>

        <h2 className="section-title mt-4">8. Children</h2>
        <p>
          LIMITLESS is intended for adults and older adolescents. It is not directed at children under 13, and no account or cloud profile is created for
          any user. Parents and guardians should supervise any health application used by a minor.
        </p>

        <h2 className="section-title mt-4">9. International transfers</h2>
        <p>
          AI providers and mapping services may process data in countries other than yours. Where you use those features, the relevant provider&apos;s
          safeguards apply. If you need to avoid international transfer, do not use the AI, scanner or hospital search features.
        </p>

        <h2 className="section-title mt-4">10. Security</h2>
        <p>
          The app is served over HTTPS in production. AI credentials are stored server-side and are never included in the browser bundle. No system can
          guarantee absolute security; treat your device passcode and browser profile as part of your protection.
        </p>

        <h2 className="section-title mt-4">11. Changes and contact</h2>
        <p>
          Material changes will be reflected in the date above. This build has no support desk configured; a monitored privacy contact must be published
          with the production domain before launch. Do not send medical information to an unverified address.
        </p>

        <p className="mt-4">
          See also the <Link href="/terms">Terms and Conditions</Link> and the medical disclaimer on the <Link href="/help">Help page</Link>.
        </p>
      </Glass>
    </div>
  );
}
