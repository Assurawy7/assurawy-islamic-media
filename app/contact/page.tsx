"use client";

import { useState } from "react";
export const dynamic = 'force-dynamic';
export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="bg-deep py-16 text-cream">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Questions about a course, registration or the platform? Send us a message.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-deep">Reach Us Directly</h2>
          <ul className="mt-5 space-y-4 text-sm text-ink/75">
            <li><span className="font-semibold text-deep">Location:</span> Kano, Nigeria</li>
            <li><span className="font-semibold text-deep">Email:</span> hello@assurawy.org</li>
            <li>
              <span className="font-semibold text-deep">WhatsApp:</span>{" "}
              <a href="https://wa.me/000000000000" className="text-emerald hover:text-deep">
                Chat with our support team
              </a>
            </li>
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-xl2 border border-deep/10 bg-white p-6 shadow-card"
        >
          {sent ? (
            <p className="text-sm font-medium text-emerald">
              Message sent. We&apos;ll reply within one business day.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Name</label>
                <input required type="text" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Email</label>
                <input required type="email" className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-deep">Message</label>
                <textarea required rows={4} className="focus-ring w-full rounded-lg border border-deep/15 px-3 py-2.5 text-sm" />
              </div>
              <button
                type="submit"
                className="focus-ring w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-deep hover:bg-goldLight"
              >
                Send Message
              </button>
            </div>
          )}
        </form>
      </section>
    </>
  );
}
