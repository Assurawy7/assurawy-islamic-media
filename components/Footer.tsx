import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-deep text-cream/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-gold">
              Assurawy Islamic Media
            </p>
            <p className="mt-3 font-arabic text-lg text-cream/70">
              تصميم الدعوة بإتقان
            </p>
            <p className="mt-1 text-sm italic text-cream/60">
              Designing Da&apos;wah with Excellence
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-gold">Courses</Link></li>
              <li><Link href="/quran-academy" className="hover:text-gold">Qur&apos;an Academy</Link></li>
              <li><Link href="/teachers" className="hover:text-gold">Teachers</Link></li>
              <li><Link href="/articles" className="hover:text-gold">Islamic Articles</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Account
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-gold">Register</Link></li>
              <li><Link href="/login" className="hover:text-gold">Log In</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold">Student Dashboard</Link></li>
              <li><Link href="/verify" className="hover:text-gold">Verify Certificate</Link></li>
              <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>Kano, Nigeria</li>
              <li>hello@assurawy.org</li>
              <li>
                <a
                  href="https://wa.me/000000000000"
                  className="inline-flex items-center gap-2 hover:text-gold"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="geo-divider mt-10">
          <span className="geo-mark">✦</span>
        </div>

        <p className="pt-6 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} Assurawy Islamic Media. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
