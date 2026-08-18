import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Clock, Laptop, Phone, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { courses, site } from "@/data/site";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "All Courses — Skill Hub, Chennai" },
      { name: "description", content: "Full course list at Skill Hub: AI digital marketing, website development, graphic design & video editing, corporate PPT design, Office Secretaryship, medical coding and fire & safety officer training." },
      { property: "og:title", content: "All Courses — Skill Hub, Chennai" },
      { property: "og:description", content: "7 running skill courses plus new batches coming soon. Offline & online, 3–6 months, placement assistance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursesPage,
});

const comingSoon = [
  { title: "Tally & Accounting with GST", ta: "டேலி & அக்கவுண்டிங்", eta: "Next batch soon" },
  { title: "Spoken English & Interview Skills", ta: "ஸ்போக்கன் இங்கிலிஷ்", eta: "Next batch soon" },
  { title: "Data Analytics with Excel & Power BI", ta: "டேட்டா அனலிட்டிக்ஸ்", eta: "Coming soon" },
  { title: "Hardware & Networking (CCNA)", ta: "ஹார்ட்வேர் & நெட்வொர்க்கிங்", eta: "Coming soon" },
];

function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
        <div className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Admissions open — limited seats
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            All courses at{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>Skill Hub</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Seven job-oriented programmes running now, plus new batches launching soon. Offline & online, regular & weekend, 3–6 months.
          </p>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Phone className="h-4 w-4" /> Call / WhatsApp {site.phone}
          </a>
        </div>
      </section>

      {/* RUNNING COURSES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Courses offered now</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Link key={c.title} to="/courses/$slug" params={{ slug: c.slug }} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={c.img} alt={c.title} width={1200} height={750} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-bold text-primary">0{i + 1}</span>
                <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{c.duration}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold leading-snug">{c.title}</h3>
                <p className="mt-1 font-tamil text-sm text-muted-foreground">{c.ta}</p>
                <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.topics.map((t) => (
                    <li key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{t}</li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Laptop className="h-3.5 w-3.5" /> {c.mode}</span>
                  <Link to="/courses/$slug" params={{ slug: c.slug }} className="text-sm font-semibold text-primary hover:underline">View details →</Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMING SOON */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Coming soon</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">New batches launching next</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Join the waitlist and we'll inform you first when admissions open.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoon.map((c) => (
              <div key={c.title} className="relative overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-card p-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Clock className="h-3 w-3" /> {c.eta}
                </span>
                <h3 className="mt-4 font-display text-base font-bold leading-snug">{c.title}</h3>
                <p className="mt-1 font-tamil text-sm text-muted-foreground">{c.ta}</p>
                <button disabled className="mt-5 w-full cursor-not-allowed rounded-full border border-border bg-secondary py-2.5 text-sm font-semibold text-muted-foreground">
                  Enrolment opens soon
                </button>
              </div>
            ))}
          </div>

          <form className="mx-auto mt-12 flex max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input type="tel" required placeholder="Your mobile number" aria-label="Mobile number" className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary" />
            <button className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
              <Bell className="h-4 w-4" /> Notify me
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
