import Link from "next/link";
import { TEMPLATES } from "@/data/templates";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Build a CV that fits <span className="text-blue-600">exactly</span> what you&apos;re applying for
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
          {TEMPLATES.length}+ guided templates for every field — tech, healthcare, trades, academia, and more.
          Each one tells you exactly what to include and why.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/templates" className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700">
            Browse templates
          </Link>
          <Link href="/signup" className="rounded-md border border-neutral-300 px-6 py-3 font-medium hover:bg-neutral-100">
            Create free account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 text-xl font-semibold">Why CVBuilder</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="font-semibold">Guided, not generic</h3>
            <p className="mt-2 text-sm text-neutral-600">Every field tells you what to write and why, tailored to the type of work or course you&apos;re pursuing.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="font-semibold">25+ templates</h3>
            <p className="mt-2 text-sm text-neutral-600">From first-CV students to PhD applicants to C-suite executives — a template built for your situation.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h3 className="font-semibold">Your data, your control</h3>
            <p className="mt-2 text-sm text-neutral-600">One account across your CVs. Export to PDF whenever you&apos;re ready (up to 5 times a day).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
