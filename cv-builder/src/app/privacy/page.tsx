export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 text-neutral-800">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-base">1. What we collect</h2>
          <p className="mt-1">
            When you create an account we collect your name, email address, and authentication identifier.
            When you build a CV, we store the content you enter (work history, education, skills, and any
            other details you add) and which template you used. We also keep a record of when you export a
            PDF, to enforce the daily export limit.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">2. How it&apos;s stored</h2>
          <p className="mt-1">
            Your data is stored using Firebase (Google Cloud) — specifically Firebase Authentication,
            Firestore, and Firebase Storage. Data is encrypted in transit and at rest by Firebase&apos;s
            infrastructure. We do not run our own database servers.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">3. Third parties</h2>
          <p className="mt-1">
            We use Firebase (Google) for authentication, data storage, and file storage. PDF generation
            happens in your browser and is not sent to a third-party rendering service. We do not sell your
            data or share it with advertisers.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">4. Retention</h2>
          <p className="mt-1">
            Your CVs and profile data are retained until you delete them or delete your account. Deleting
            your account removes your profile, all CVs, and export history.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">5. Your rights</h2>
          <p className="mt-1">
            You can edit or delete any CV at any time from your dashboard. You can download or delete your
            account data from Settings. If you have questions about your data, contact us at the email
            below.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">6. Cookies</h2>
          <p className="mt-1">
            We use essential cookies/local storage only to keep you signed in. We do not use tracking or
            advertising cookies.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-base">7. Contact</h2>
          <p className="mt-1">Questions about this policy? Contact us via the support link in Settings.</p>
        </section>
      </div>
    </div>
  );
}
