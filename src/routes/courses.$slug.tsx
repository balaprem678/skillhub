import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  GraduationCap,
  IndianRupee,
  Laptop,
  Phone,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { courses, site } from "@/data/site";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Course not found — Skill Hub" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.course;
    const title = `${c.title} Course in Ambattur, Chennai — Skill Hub`;
    const description = `${c.desc} Duration ${c.duration}, ${c.mode}. Certificate + 100% placement assistance at Skill Hub, Chennai.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CourseDetailPage,
  notFoundComponent: CourseNotFound,
});

function CourseNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-extrabold">Course not found</h1>
        <p className="mt-3 text-muted-foreground">This course page doesn't exist. Browse all our running courses instead.</p>
        <Link to="/courses" className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <ArrowLeft className="h-4 w-4" /> All courses
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const others = courses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link to="/courses" className="hover:text-foreground">Courses</Link>
              <span>/</span>
              <span className="text-foreground">{course.title}</span>
            </nav>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Admissions open — limited seats
            </span>

            <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-2 font-tamil text-lg text-primary">{course.ta}</p>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{course.desc}</p>

            <dl className="mt-8 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Clock, label: "Duration", value: course.duration },
                { icon: Laptop, label: "Mode", value: course.mode },
                { icon: CalendarClock, label: "Batches", value: "Regular & Weekend" },
                { icon: IndianRupee, label: "Fees from", value: course.fee },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                  <s.icon className="h-4 w-4 text-primary" />
                  <dt className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-bold leading-snug">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" hash="admission" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
                <GraduationCap className="h-4 w-4" /> Enroll now
              </Link>
              <a href={tel} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-secondary">
                <Phone className="h-4 w-4 text-primary" /> Call / WhatsApp
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <img src={course.img} alt={`${course.title} training at Skill Hub`} width={1200} height={800} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              {course.topics.map((t) => (
                <span key={t} className="rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-foreground">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SYLLABUS + SIDEBAR */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Course syllabus</h2>
            <p className="mt-3 text-muted-foreground">Module-wise, practical-first training with assignments and a live project in every module.</p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.syllabus.map((s, i) => (
                <li key={s} className="flex gap-3 rounded-2xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug">{s}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 font-display text-2xl font-bold sm:text-3xl">Career opportunities</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {course.jobs.map((j) => (
                <span key={j} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
                  <Briefcase className="h-4 w-4 text-primary" /> {j}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-display text-lg font-bold">Eligibility</h3>
              <ul className="mt-4 space-y-3">
                {course.eligibility.map((e) => (
                  <li key={e} className="flex gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-display text-lg font-bold">What you get</h3>
              <ul className="mt-4 space-y-3">
                {["Industry-recognized certificate", "Hands-on live project internship", "Experienced industry mentors", "Resume & interview training", "100% placement assistance"].map((e) => (
                  <li key={e} className="flex gap-2.5 text-sm text-muted-foreground">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
              <h3 className="font-display text-lg font-bold">Talk to our advisor</h3>
              <p className="mt-2 text-sm text-primary-foreground/85">Get the batch timing, fee structure and syllabus PDF on WhatsApp.</p>
              <p className="mt-4 font-display text-xl font-extrabold">{site.phone}</p>
              <a href={tel} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-foreground">
                <Phone className="h-4 w-4" /> Call now
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* OTHER COURSES */}
      <section className="bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Other courses you may like</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((c) => (
              <Link key={c.slug} to="/courses/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={c.img} alt={c.title} width={800} height={500} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold leading-snug">{c.title}</h3>
                  <p className="mt-1 font-tamil text-sm text-muted-foreground">{c.ta}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-primary">View details →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all courses
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
