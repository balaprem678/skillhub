import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skill Hub — Skill-Based Career Courses in Chennai" },
      { name: "description", content: "Job-oriented digital and professional skill courses in Ambattur, Chennai. Offline & online batches, live project internship, certificate and 100% placement assistance." },
      { property: "og:title", content: "Skill Hub — Skill-Based Career Courses in Chennai" },
      { property: "og:description", content: "Learn Skills. Build Confidence. Launch Your Career. Admissions open now at Skill Hub, Chennai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <a
        href="https://chat.whatsapp.com/JQf9fZejJHP32ShYHfKRtv"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp group"
        title="Join our WhatsApp group"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="h-8 w-8"
        >
          <path d="M16.04 3C8.86 3 3.02 8.82 3.02 15.98c0 2.3.61 4.55 1.77 6.54L3 29l6.65-1.74a13.1 13.1 0 0 0 6.38 1.63h.01c7.17 0 13.01-5.82 13.02-12.98A12.9 12.9 0 0 0 25.24 6.7 12.94 12.94 0 0 0 16.04 3Zm0 23.69h-.01a10.9 10.9 0 0 1-5.55-1.52l-.4-.24-3.95 1.04 1.05-3.84-.26-.4a10.78 10.78 0 0 1-1.66-5.75c0-5.96 4.84-10.8 10.8-10.8 2.89 0 5.6 1.13 7.64 3.17a10.72 10.72 0 0 1 3.16 7.65c0 5.96-4.85 10.8-10.82 10.8Zm5.93-8.09c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.51-.16-.73.16-.22.33-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.58-.95-.84-1.6-1.88-1.79-2.2-.19-.33-.02-.5.14-.66.15-.15.32-.38.49-.57.16-.19.21-.33.32-.55.1-.22.05-.41-.03-.57-.08-.16-.73-1.75-1-2.39-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.41-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.11 1.32 3.33.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.1 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
        </svg>
      </a>
    </QueryClientProvider>
  );
}
