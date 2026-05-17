export const metadata = {
  title: "Privacy policy — PropertyCheck",
};

const BUSINESS_NAME = "PropertyCheck";
const CONTACT_EMAIL = "kristinazhi97@gmail.com";
const LAST_UPDATED = "17 May 2026";

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <p>
        This policy explains how {BUSINESS_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles your
        personal data when you use the {BUSINESS_NAME} web application. It is designed to comply
        with the UK GDPR and the Data Protection Act 2018.
      </p>

      <h2 className="text-xl font-semibold">1. Data controller</h2>
      <p>
        For UK GDPR purposes, the controller of your personal data is {BUSINESS_NAME}, contactable at{" "}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2 className="text-xl font-semibold">2. Where your data lives</h2>
      <p>
        {BUSINESS_NAME} does <strong>not</strong> store your inspection data on our servers. Property
        folders, photos, JSON reports, PDF reports, branding settings, and per-tenancy usage
        counters are written directly to <em>your own</em> Microsoft OneDrive under a folder named{" "}
        <code>Properties/</code>. We never copy them to a database we control. When you sign out, we
        lose access until you sign in again.
      </p>

      <h2 className="text-xl font-semibold">3. Microsoft Graph permissions</h2>
      <p>When you sign in with Microsoft, you grant {BUSINESS_NAME} two delegated permissions:</p>
      <ul className="list-disc pl-6">
        <li>
          <code>Files.ReadWrite</code> — to create folders and upload reports to your OneDrive on
          your behalf.
        </li>
        <li>
          <code>User.Read</code> — to read your display name so it can be shown in the app header
          and on PDF reports as the inspector name.
        </li>
      </ul>
      <p>
        You can revoke these permissions at any time at{" "}
        <a
          className="underline"
          href="https://myaccount.microsoft.com/consent"
          target="_blank"
          rel="noopener noreferrer"
        >
          myaccount.microsoft.com/consent
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold">4. Third-party processing — Google Gemini</h2>
      <p>
        Inspection photos and structured inspection data are transmitted to{" "}
        <strong>Google Gemini</strong> for room/item categorisation (Gemini 2.5 Flash) and
        deposit-comparison reasoning (Gemini 2.5 Pro). Photos and data transit through our server
        to Google&apos;s API. We do not retain copies. Google&apos;s data-handling terms apply to
        that processing — see{" "}
        <a
          className="underline"
          href="https://ai.google.dev/gemini-api/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          ai.google.dev/gemini-api/terms
        </a>
        . Do not upload photos of identifiable people or sensitive personal data.
      </p>

      <h2 className="text-xl font-semibold">5. Cookies and tracking</h2>
      <p>
        We use <code>sessionStorage</code> (for the Microsoft sign-in token cache) and{" "}
        <code>IndexedDB</code> (for unfinalised report drafts). Both are stored in your browser and
        never sent to us. We do not set tracking cookies, run analytics scripts, or share data with
        advertisers.
      </p>

      <h2 className="text-xl font-semibold">6. Your rights under UK GDPR</h2>
      <p>You have the right to:</p>
      <ul className="list-disc pl-6">
        <li>Access the personal data we hold about you (note: we hold almost none — see §2).</li>
        <li>Correct or erase your personal data.</li>
        <li>Restrict or object to processing.</li>
        <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO).</li>
      </ul>
      <p>
        Send rights requests to{" "}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2 className="text-xl font-semibold">7. Changes to this policy</h2>
      <p>
        We&apos;ll update the &ldquo;Last updated&rdquo; date at the top whenever this policy
        changes. Material changes will also be highlighted in-app on your next sign-in.
      </p>

      <h2 className="text-xl font-semibold">8. Contact</h2>
      <p>
        Questions about this policy or your data:{" "}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </article>
  );
}
