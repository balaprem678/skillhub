import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Flame, Phone } from "lucide-react";
import { site } from "@/data/site";
import { Images } from "@/utilis/Images";

const navItems = [
  { label: "Home", href: "/", route: true },
  { label: "Courses", href: "/courses", route: true },
  { label: "Why Us", href: "/#why" },
  { label: "Admission", href: "/#admission" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="hidden bg-foreground py-2 text-xs text-background md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span>{site.address}</span>
          <span className="flex items-center gap-5">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent">📞 {site.phone}</a>
            <a href={`mailto:${site.email}`} className="hover:text-accent">✉️ {site.email}</a>
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          {/* <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
            <Flame className="h-5 w-5 text-primary-foreground" />
          </span> */}
          <img src={Images.logo} alt="Skill Hub Logo" width={80}/>
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold tracking-tight sm:text-lg">Skill Hub</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Skill-Based Career Courses</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.route ? (
              <Link key={item.href} to={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-sm font-semibold text-foreground" }}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
            <Phone className="h-4 w-4" /> Call / WhatsApp
          </a>
        </div>

        <button aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden absolute text-center w-full">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) =>
              item.route ? (
                <Link key={item.href} to={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary">
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary">
                  {item.label}
                </a>
              ),
            )}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-2 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              Call / WhatsApp {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
