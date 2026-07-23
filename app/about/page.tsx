export const metadata = { title: "About Us — Assurawy Islamic Media" };

const values = [
  { title: "Authenticity", text: "Every lesson is sourced from established scholars and classical texts, with references students can verify themselves." },
  { title: "Excellence", text: "From curriculum design to certificate issuance, every part of the student experience is held to a professional standard." },
  { title: "Accessibility", text: "Structured Islamic education delivered online, in Arabic, English and Hausa, so distance is never a barrier to learning." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-deep py-20 text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            About Us
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Designing Da&apos;wah with Excellence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-cream/80">
            Assurawy Islamic Media builds structured, university-quality
            Islamic education — curricula, courses and assessments rooted in
            classical scholarship and delivered through a modern learning
            platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-deep">
              Our Mission
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              To make sound Islamic knowledge structured, accessible and
              verifiable — connecting students anywhere in the world to
              curricula built on classical texts, taught by qualified
              instructors, and assessed with academic rigor.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-deep">
              Our Approach
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              Each course is developed the way a traditional Islamic
              curriculum is built: a clear chain of sources, a logical
              progression of modules, and assessment that reflects genuine
              understanding rather than memorization alone.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-deep">
            What guides our work
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl2 bg-white p-7 shadow-card">
                <div className="mb-4 h-1 w-10 rounded-full bg-gold" />
                <h3 className="font-display text-xl font-semibold text-deep">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
