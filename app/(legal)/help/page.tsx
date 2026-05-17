import Link from "next/link";

export const metadata = {
  title: "Help & support — PropertyCheck",
};

const CONTACT_EMAIL = "kristinazhi97@gmail.com";

export default function HelpPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-bold">Help & support</h1>
      <p className="text-sm text-muted-foreground">
        Most issues are answered below. If not, email us — we usually reply within one working day.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Quick troubleshooting</h2>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">Sign-in says &ldquo;OneDrive not enabled&rdquo;</summary>
          <p className="mt-2 text-muted-foreground">
            The Microsoft account you used doesn&apos;t have OneDrive provisioned. Sign in with a
            personal account (outlook.com / hotmail.com / live.com) or a work/school account that
            has a Microsoft 365 license including OneDrive.
          </p>
        </details>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">Photos won&apos;t upload</summary>
          <p className="mt-2 text-muted-foreground">
            Max 60 photos per inspection, 15 MB per photo. Check your network. If a single chunk
            fails, the upload retries automatically up to 4 times. Refresh the page if it&apos;s
            stuck, then resume.
          </p>
        </details>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">Categorisation says &ldquo;rate limit reached&rdquo;</summary>
          <p className="mt-2 text-muted-foreground">
            Each tenancy can be re-categorised up to 10 times. If you need more (e.g. retesting
            after a big edit), delete and recreate the tenancy folder in OneDrive — usage counter
            resets.
          </p>
        </details>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">Comparison says check-in or check-out missing</summary>
          <p className="mt-2 text-muted-foreground">
            Both phases must be <strong>finalised</strong> (PDF generated) before you can run a
            comparison. If either phase shows &ldquo;review pending&rdquo;, click &ldquo;Finalise&rdquo; first.
          </p>
        </details>
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-medium">Where is my data stored?</summary>
          <p className="mt-2 text-muted-foreground">
            Everything lives in <em>your</em> OneDrive under <code>Properties/</code>. We never copy
            it. Sign out at any time — your files stay where they are.
          </p>
        </details>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Email <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with a
          screenshot and the property/tenancy name. We typically reply within one working day.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Related</h2>
        <ul className="list-disc pl-6">
          <li><Link href="/privacy" className="underline">Privacy policy</Link></li>
          <li><Link href="/terms" className="underline">Terms of service</Link></li>
        </ul>
      </section>
    </article>
  );
}
