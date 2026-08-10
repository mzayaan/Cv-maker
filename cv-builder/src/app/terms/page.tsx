export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-neutral-800">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-base">1. Using the service</h2>
          <p className="mt-1">
            CVBuilder lets you create and export CVs using guided templates. You must provide accurate
            account information and are responsible for the content you enter into your CVs.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">2. Export limits</h2>
          <p className="mt-1">
            Free accounts may export a CV to PDF up to 5 times per day. This limit resets at midnight UTC.
            Attempting to bypass this limit (e.g. via multiple accounts or automated requests) is not
            permitted.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">3. Account security</h2>
          <p className="mt-1">
            You are responsible for keeping your login credentials secure. Notify us if you suspect
            unauthorized access to your account.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">4. Content ownership</h2>
          <p className="mt-1">
            You own the content of your CVs. We only use it to provide the service (rendering, storing, and
            exporting your CV).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">5. Termination</h2>
          <p className="mt-1">
            You may delete your account at any time from Settings. We may suspend accounts that abuse the
            service or violate these terms.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">6. Disclaimer</h2>
          <p className="mt-1">
            The service is provided &quot;as is&quot; without warranties. We are not responsible for how
            your CV is received by employers or institutions.
          </p>
        </section>
      </div>
    </div>
  );
}
