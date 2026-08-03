import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Award, BadgeCheck, BriefcaseBusiness, CalendarClock, CheckCircle2, Clock,
  GraduationCap, Laptop, Mail, MapPin, MessageCircle, Phone, Quote, Users, Sparkles, Globe,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlider } from "@/components/hero-slider";
import { courses, site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ambattur Skill Hub — Skill-Based Career Courses in Chennai" },
      { name: "description", content: "Job-oriented skill courses in Ambattur, Chennai: AI digital marketing, web development, graphic design & video editing, PPT design, office secretariat, medical coding, fire & safety. 100% placement assistance." },
      { property: "og:title", content: "Ambattur Skill Hub — Skill-Based Career Courses in Chennai" },
      { property: "og:description", content: "Offline & online batches, 3–6 months, live project internship, industry-recognized certificate and 100% placement assistance. Admissions open now." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const why = [
  { icon: Users, title: "Experienced Industry Mentors", text: "Learn from professionals working in agencies, IT companies and industrial safety roles." },
  { icon: BriefcaseBusiness, title: "Hands-on Live Project Internship", text: "Work on real client projects and build a portfolio employers actually trust." },
  { icon: Laptop, title: "Job-Oriented Practical Training", text: "80% practical, 20% theory — tools, tasks and workflows used on the job every day." },
  { icon: BadgeCheck, title: "Industry-Recognized Certificate", text: "Get certified on completion, valid for job applications and higher studies." },
  { icon: Award, title: "100% Placement Assistance", text: "Resume building, mock interviews and continuous interview referrals until placed." },
  { icon: CalendarClock, title: "Regular & Weekend Batches", text: "Flexible timings for college students, job seekers and working professionals." },
];

const steps = [
  { n: "01", title: "Free Career Counselling", text: "Call or WhatsApp us and pick the course that matches your goal." },
  { n: "02", title: "Choose Batch & Mode", text: "Offline at Ambattur or online live classes — regular or weekend." },
  { n: "03", title: "Train on Live Projects", text: "3–6 months of practical training plus internship on real work." },
  { n: "04", title: "Get Certified & Placed", text: "Certificate, interview prep and 100% placement assistance." },
];

const testimonials = [
  { name: "Praveen K.", role: "Digital Marketing Executive", text: "B.Com முடித்து வேலை கிடைக்காமல் இருந்தேன். 3 மாத AI digital marketing course முடித்ததும் Chennai-ல் வேலை கிடைத்தது." },
  { name: "Divya R.", role: "Junior Web Developer", text: "The live projects made all the difference. I built 4 real websites during the course and got placed within a month." },
  { name: "Sathish M.", role: "Safety Officer", text: "Practical fire drills and site documentation training helped me clear my interview at the first attempt." },
];

const faqs = [
  { q: "Who can join these courses?", a: "Anyone from 12th pass to degree holders and working professionals. No prior technical background is needed for most courses." },
  { q: "What is the course duration?", a: "All programmes run for 3 to 6 months depending on the course, with regular and weekend batch options." },
  { q: "Are classes offline or online?", a: "Both. You can attend offline at our Ambattur centre or join live online classes. Fire & Safety is practical-focused and offline." },
  { q: "Do you provide placement support?", a: "Yes. We offer 100% placement assistance including resume preparation, mock interviews and continuous job referrals." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSlider />

      {/* HIGHLIGHT STATS */}
      <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4" style={{ boxShadow: "var(--shadow-card)" }}>
          {[
            { icon: GraduationCap, n: "7", l: "Career Courses" },
            { icon: Clock, n: "3–6", l: "Months Duration" },
            { icon: Laptop, n: "Offline + Online", l: "Class Modes" },
            { icon: Award, n: "100%", l: "Placement Assistance" },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </span>
              <div>
                <div className="font-display text-lg font-bold leading-tight">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">About Skill Hub</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              A skill training centre built for real jobs, not just certificates
            </h2>
            <p className="mt-5 text-muted-foreground">
              Ambattur Skill Hub trains students and job seekers in Chennai with practical, industry-mapped
              digital and professional skills. Every course is delivered by working mentors, taught on live
              projects, and backed by placement support — so you finish job-ready, not just course-completed.
            </p>
            <p className="mt-4 font-tamil text-base font-medium text-foreground">
              டிகிரி படித்தும் தகுதிக்கேற்ற வேலை கிடைக்கவில்லையா? உங்கள் Career-ஐ Digital Skills மூலம் மாற்றுங்கள்.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Offline & Online Classes", "Regular & Weekend Batches", "Duration: 3–6 Months", "Limited Seats per Batch"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {courses.slice(0, 4).map((c) => (
              <div key={c.title} className="overflow-hidden rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
                <img src={c.img} alt={c.title} width={1200} height={750} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-3 text-xs font-semibold">{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Courses Offered
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">7 job-oriented career courses</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Every programme includes live project internship, industry-recognized certification and placement assistance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <article key={c.title} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={c.img} alt={c.title} width={1200} height={750} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-bold text-primary">0{i + 1}</span>
                  <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{c.duration}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary">{c.title}</h3>
                  <p className="mt-1 font-tamil text-sm text-muted-foreground">{c.ta}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.topics.map((t) => (
                      <li key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Laptop className="h-3.5 w-3.5" /> {c.mode}</span>
                    <a href="#admission" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Enquire <ArrowRight className="h-3.5 w-3.5" /></a>
                  </div>
                </div>
              </article>
            ))}

            <article className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8">
              <h3 className="font-display text-lg font-bold">More batches launching soon</h3>
              <p className="text-sm text-muted-foreground">Tally & accounting, spoken English and data analytics tracks are opening next. See the full catalogue.</p>
              <Link to="/courses" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                All courses <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Why choose us</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Why Ambattur Skill Hub?</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {why.map((w) => (
            <div key={w.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                <w.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-foreground py-20 text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">How it works</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">From enquiry to placement in 4 steps</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-background/15 bg-background/5 p-6">
                <div className="font-display text-3xl font-black text-accent">{s.n}</div>
                <h3 className="mt-3 font-display text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-background/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Student results</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Careers launched from Ambattur</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <Quote className="h-7 w-7 text-primary/40" />
              <blockquote className="mt-4 text-sm text-muted-foreground">{t.text}</blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="font-display text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ADMISSION / CONTACT */}
      <section id="admission" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2" style={{ boxShadow: "var(--shadow-card)" }}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>
              🎯 Admissions Open Now
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">Limited seats available — enroll today</h2>
            <p className="mt-4 font-tamil text-base font-medium text-foreground">
              இன்றே சேருங்கள்... நாளைய வெற்றிகரமான Career-ஐ உருவாக்குங்கள்!
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong>Call / WhatsApp:</strong> {site.whatsapp}<br /><strong>Mobile:</strong> {site.mobile}</span></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{site.name}, {site.address}</span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{site.email}</span></li>
              <li className="flex gap-3"><Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{site.website}</span></li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
                <Phone className="h-4 w-4" /> Call now
              </a>
              <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <form className="rounded-2xl bg-secondary/50 p-6" onSubmit={(e) => e.preventDefault()}>
            <h3 className="font-display text-lg font-bold">Book a free career counselling</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Full name</label>
                <input id="name" required className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Mobile number</label>
                <input id="phone" type="tel" required className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="+91" />
              </div>
              <div>
                <label htmlFor="course" className="text-xs font-semibold text-muted-foreground">Course interested in</label>
                <select id="course" className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary">
                  {courses.map((c) => <option key={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="mode" className="text-xs font-semibold text-muted-foreground">Preferred mode</label>
                <select id="mode" className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option>Offline — Ambattur centre</option>
                  <option>Online live classes</option>
                  <option>Weekend batch</option>
                </select>
              </div>
              <button className="w-full rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                Request callback
              </button>
              <p className="text-center text-xs text-muted-foreground">We'll call you back within 24 hours.</p>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-display text-sm font-bold marker:content-none">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
