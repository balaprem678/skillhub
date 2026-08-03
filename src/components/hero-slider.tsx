import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";

const slides = [
  {
    img: banner1,
    kicker: "Admissions Open 2026",
    ta: "டிகிரி படித்தும் இன்னும் உங்கள் தகுதிக்கேற்ற வேலை கிடைக்கவில்லையா?",
    title: "Learn Skills. Build Confidence.",
    highlight: "Launch Your Career.",
    text: "Job-oriented digital & professional skill courses in Ambattur, Chennai — offline and online batches with live project internship.",
  },
  {
    img: banner2,
    kicker: "AI Powered Digital Skills",
    ta: "உங்கள் Career-ஐ Digital Skills மூலம் மாற்ற விரும்புகிறீர்களா?",
    title: "Industry mentors.",
    highlight: "Real live projects.",
    text: "Practical training on AI marketing tools, websites, design and video editing — taught by working industry professionals.",
  },
  {
    img: banner3,
    kicker: "100% Placement Assistance",
    ta: "இன்றே சேருங்கள்... நாளைய வெற்றிகரமான Career-ஐ உருவாக்குங்கள்!",
    title: "Certified training.",
    highlight: "Dream job ready.",
    text: "Industry-recognized certificate, interview preparation and placement support until you get placed. Limited seats available.",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  return (
    <section className="relative isolate overflow-hidden bg-foreground">
      <div className="relative h-[560px] w-full sm:h-[620px] lg:h-[680px]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <img
              src={s.img}
              alt={s.title}
              width={1920}
              height={1088}
              loading={idx === 0 ? "eager" : "lazy"}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${idx === i ? "scale-110" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/92 via-foreground/70 to-foreground/25" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div key={i} className="max-w-2xl animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-background backdrop-blur">
                {slides[i].kicker}
              </span>
              <p className="mt-5 font-tamil text-base font-medium text-accent sm:text-lg">{slides[i].ta}</p>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-background sm:text-5xl lg:text-6xl">
                {slides[i].title}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                  {slides[i].highlight}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm text-background/80 sm:text-base">{slides[i].text}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
                >
                  View courses <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#admission"
                  className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-6 py-3 text-sm font-semibold text-background backdrop-blur transition-colors hover:bg-background/20"
                >
                  <Phone className="h-4 w-4" /> Enquire now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* controls */}
        <button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-background/25 bg-background/10 text-background backdrop-blur transition-colors hover:bg-background/25 sm:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-background/25 bg-background/10 text-background backdrop-blur transition-colors hover:bg-background/25 sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-background" : "w-4 bg-background/40"}`}
            />
          ))}
        </div>
      </div>

      {/* marquee strip */}
      <div className="border-t border-background/10 bg-background/5 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-semibold uppercase tracking-wider text-background/70 sm:text-sm">
          <span>Offline & Online Classes</span>
          <span className="hidden sm:inline">•</span>
          <span>Regular & Weekend Batches</span>
          <span className="hidden sm:inline">•</span>
          <span>Duration 3–6 Months</span>
          <span className="hidden sm:inline">•</span>
          <span>100% Placement Assistance</span>
        </div>
      </div>
    </section>
  );
}
