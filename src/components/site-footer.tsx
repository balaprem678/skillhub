import { Flame, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { site, courses } from "@/data/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Flame className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold">{site.name}</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">{site.tagline}</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-background/70">
              Job-oriented skill training institute in Ambattur, Chennai. Experienced industry mentors, live project internship and 100% placement assistance.
            </p>
            <p className="mt-4 font-tamil text-sm text-accent">
              உங்கள் திறமையை வளர்த்து, உங்கள் கனவு வேலையை பெறுங்கள்!
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="grid h-9 w-9 place-items-center rounded-full border border-background/20 transition-colors hover:bg-background/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-background/60">Courses</h4>
            <ul className="mt-4 space-y-3">
              {courses.map((c) => (
                <li key={c.title}>
                  <Link to="/courses" className="text-sm text-background/80 transition-colors hover:text-background">{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-background/60">Contact</h4>
            <ul className="mt-4 space-y-4 text-sm text-background/80">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{site.name}<br />{site.address}</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>Call / WhatsApp: {site.whatsapp}<br />Mobile: {site.mobile}</span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${site.email}`} className="hover:text-background">{site.email}</a></li>
              <li className="flex gap-3"><Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>{site.website}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="italic">"Learn Skills. Build Confidence. Launch Your Career."</p>
        </div>
      </div>
    </footer>
  );
}
