export const metadata = { title: "Qur'an Academy — Assurawy Islamic Media" };

const features = [
  {
    title: "Memorization Tracker",
    text: "Log every juz', surah and ayah you've memorized, and watch your progress build page by page.",
  },
  {
    title: "Tajweed Lessons",
    text: "Structured lessons on the rules of recitation, from makharij al-huruf to the rules of noon and meem.",
  },
  {
    title: "Recitation Submission",
    text: "Record and submit your recitation directly from your dashboard for teacher review.",
  },
  {
    title: "Teacher Feedback",
    text: "Receive detailed, ayah-by-ayah feedback from a qualified teacher within your student portal.",
  },
];

export default function QuranAcademyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-deep py-20 text-cream">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('/arabesque.svg')", backgroundSize: "200px" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <p className="font-arabic text-2xl text-gold/90">القرآن الكريم</p>
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
            Qur&apos;an Academy
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-cream/80">
            A dedicated track for memorization, tajweed and recitation —
            guided by qualified teachers, tracked one ayah at a time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl2 border border-deep/10 bg-white p-7 shadow-card">
              <div className="mb-4 h-1 w-10 rounded-full bg-gold" />
              <h3 className="font-display text-xl font-semibold text-deep">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-parchment py-20">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="font-display text-3xl font-semibold text-deep">
            Track your memorization journey
          </h2>
          <p className="mt-3 text-ink/70">
            An example of the progress view students see on their dashboard.
          </p>
          <div className="mt-8 rounded-xl2 bg-white p-6 text-left shadow-card">
            {[
              { name: "Juz' 'Amma", pct: 100 },
              { name: "Juz' 29", pct: 65 },
              { name: "Juz' 28", pct: 20 },
            ].map((j) => (
              <div key={j.name} className="mb-5 last:mb-0">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-deep">{j.name}</span>
                  <span className="text-ink/60">{j.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-emerald"
                    style={{ width: `${j.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
