export const metadata = {
  title: "Terms of service — PropertyCheck",
};

const BUSINESS_NAME = "PropertyCheck";
const CONTACT_EMAIL = "kristinazhi97@gmail.com";
const JURISDICTION = "England and Wales";
const LAST_UPDATED = "17 May 2026";

export default function TermsPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <p>
        These terms govern your use of the {BUSINESS_NAME} web application (the
        &ldquo;Service&rdquo;). By signing in, you agree to them. If you don&apos;t agree, please
        don&apos;t use the Service.
      </p>

      <h2 className="text-xl font-semibold">1. What the Service does</h2>
      <p>
        {BUSINESS_NAME} helps property managers run rental inspections. It uses AI (Google Gemini)
        to categorise inspection photos and produce condition and deposit-comparison PDF reports.
        All your inspection data is stored in your own Microsoft OneDrive — see our{" "}
        <a className="underline" href="/privacy">Privacy Policy</a>.
      </p>

      <h2 className="text-xl font-semibold">2. Your account</h2>
      <p>
        You sign in with your own Microsoft account. You are responsible for keeping that account
        secure. If you suspect unauthorised access, sign out and change your Microsoft password
        immediately.
      </p>

      <h2 className="text-xl font-semibold">3. Acceptable use</h2>
      <ul className="list-disc pl-6">
        <li>You must own or be authorised to upload the photos and data you submit.</li>
        <li>
          You must not upload illegal content or photos depicting identifiable people without their
          consent.
        </li>
        <li>
          You must not attempt to abuse the Service (e.g. excessive automated requests, attempts to
          exhaust AI quota).
        </li>
        <li>You must not use the Service in jurisdictions where rental-inspection AI tools are restricted.</li>
      </ul>

      <h2 className="text-xl font-semibold">4. AI output disclaimer</h2>
      <p>
        AI categorisation and comparison results may contain errors, omissions, or biases. Reports
        produced by the AI are <strong>not legal advice</strong> and are not a substitute for a
        professional inventory clerk. You are solely responsible for reviewing and approving every
        report before sharing it with tenants, agents, deposit-protection schemes (TDS, DPS,
        mydeposits), or any other party. {BUSINESS_NAME} accepts no liability for decisions taken
        on the basis of AI output.
      </p>

      <h2 className="text-xl font-semibold">5. Service limits</h2>
      <p>The Service enforces the following per-tenancy quotas to protect against abuse:</p>
      <ul className="list-disc pl-6">
        <li>Up to 60 photos per inspection phase (check-in or check-out).</li>
        <li>Up to 15 MB per photo.</li>
        <li>Up to 10 AI categorisations per tenancy.</li>
        <li>Up to 5 AI comparisons per tenancy.</li>
        <li>30-second cooldown between AI calls on the same tenancy.</li>
      </ul>

      <h2 className="text-xl font-semibold">6. No warranty</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. {BUSINESS_NAME}{" "}
        makes no warranties about availability, accuracy, completeness, or fitness for a particular
        purpose. To the maximum extent permitted by law, our liability for any claim arising from
        your use of the Service is limited to the fees you paid in the twelve months preceding the
        claim (or zero if the Service is free).
      </p>

      <h2 className="text-xl font-semibold">7. Termination</h2>
      <p>
        You can stop using the Service at any time by signing out and revoking the Microsoft
        permissions at{" "}
        <a
          className="underline"
          href="https://myaccount.microsoft.com/consent"
          target="_blank"
          rel="noopener noreferrer"
        >
          myaccount.microsoft.com/consent
        </a>
        . Your data remains in your own OneDrive. We may suspend or terminate access for users who
        breach these terms.
      </p>

      <h2 className="text-xl font-semibold">8. Changes to these terms</h2>
      <p>
        We&apos;ll update the &ldquo;Last updated&rdquo; date when these terms change. Continued use
        after a change means you accept the new terms.
      </p>

      <h2 className="text-xl font-semibold">9. Governing law</h2>
      <p>
        These terms are governed by the law of {JURISDICTION}. Any disputes are subject to the
        exclusive jurisdiction of the courts of {JURISDICTION}.
      </p>

      <h2 className="text-xl font-semibold">10. Contact</h2>
      <p>
        Questions:{" "}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </article>
  );
}
