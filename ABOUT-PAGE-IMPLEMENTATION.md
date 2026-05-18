# About Page — Complete Implementation Specification

> **Project:** Dr. Sahidur Rahman Khan Portfolio (`dr-shahid-main`)
> **Route:** `/about`
> **Status:** Ready for implementation
> **Constraint:** This page does NOT go in the navbar. It is reached via homepage CTA, footer, and breadcrumbs only.

---

## 0. Architecture Overview

```
src/
  app/
    about/
      page.tsx           ← Server component (fetches appInfo, passes down)
      loading.tsx        ← Skeleton loader (matches contact/loading.tsx pattern)
      error.tsx          ← Error boundary (matches contact/error.tsx pattern)
  components/
    about/               ← New folder — same pattern as home/, articles/, research/
      AboutHero.tsx      ← "use client" — photo + name + tagline
      AboutBio.tsx       ← "use client" — full narrative with AnimatedSection
      AboutQualifications.tsx  ← "use client" — credential cards + stats row
      AboutCTA.tsx       ← "use client" — conversion section at bottom

  (MODIFY) src/constants/navigation.ts       ← Add "About" to FOOTER_LINKS
  (MODIFY) src/components/home/About.tsx     ← Fix CTA href from "/contact" → "/about"
  (MODIFY) src/components/shared/Breadcrumbs.tsx  ← Add "about" to LABELS map
  (MODIFY) src/app/sitemap.ts               ← Add /about entry
```

**No new npm packages.** Every section uses existing shared components: `AnimatedSection`, `SectionHeading`, `Button`, `Skeleton`.

---

## 1. Task: Create `src/components/about/AboutHero.tsx`

**Type:** `"use client"` component (uses framer-motion)

**What it does:** Top identity banner — doctor photo on the left, name + title + tagline on the right. On mobile, stacks vertically with photo on top.

**Data props:**
```ts
interface AboutHeroProps {
  doctorName: string;
  doctorTitle: string;
  doctorSpecialty: string;
  doctorImageUrl?: string;  // from appInfo.doctorImage?.url — may be undefined
}
```

**Layout specification:**

```
┌─────────────────────────────────────────────────────────┐
│  container mx-auto px-6                                 │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │                  │  │ badge: "About the Doctor"    │  │
│  │   Doctor Photo   │  │ h1: {doctorName}            │  │
│  │   (aspect-4/5)   │  │ p: {doctorTitle}            │  │
│  │                  │  │ p: {doctorSpecialty}         │  │
│  │                  │  │ tagline (hardcoded)          │  │
│  │                  │  │ "Book Appointment" button    │  │
│  └──────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Exact Tailwind classes:**

- Outer wrapper: `container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-32 pb-20`
- Photo column: `relative group` (matches `home/About.tsx` photo column pattern)
  - Photo container: `relative aspect-4/5 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl`
  - Inside photo, if no image URL: `<div className="absolute inset-0 flex items-center justify-center text-text-para-light dark:text-text-para-dark font-bold text-xl opacity-30">{doctorName.toUpperCase()}</div>` — **exact same fallback as `home/About.tsx` line 16-18**
  - If image URL exists: `<Image src={doctorImageUrl} alt={doctorName} fill className="object-cover" />` — use Next.js `Image` component
  - Rotating background accent: `<div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 -z-10 opacity-10" />` — **exact same as `home/About.tsx` line 14**
  - Experience badge (bottom-right): same floating badge pattern as `home/About.tsx` lines 22-34, but with `motion.div` and `whileInView`
- Text column: `space-y-8`
  - Badge: `<span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold tracking-widest uppercase">About the Doctor</span>` — matches badge pattern used across the site
  - Name: `<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">{doctorName}</h1>`
  - Title + Specialty: `<p className="text-lg text-brand-primary font-semibold">{doctorTitle} — {doctorSpecialty}</p>`
  - Tagline (hardcoded): `<p className="text-lg text-text-para-light dark:text-text-para-dark max-w-lg leading-relaxed">Restoring mobility through precision, compassion, and innovation — dedicated to helping every patient reclaim their active life.</p>`
  - CTA button: `<Button size="lg" href="/appointment">Book a Consultation</Button>`

**Framer Motion:** Wrap each text block in `motion.div` with `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` — matches the animation pattern used everywhere in `home/About.tsx`, `home/Hero.tsx`, etc.

**Photo handling logic:**
```tsx
{doctorImageUrl ? (
  <Image
    src={doctorImageUrl}
    alt={doctorName}
    fill
    className="object-cover"
    priority  // above the fold
  />
) : (
  <div className="absolute inset-0 flex items-center justify-center text-text-para-light dark:text-text-para-dark font-bold text-xl opacity-30">
    {doctorName.toUpperCase()}
  </div>
)}
```

---

## 2. Task: Create `src/components/about/AboutBio.tsx`

**Type:** `"use client"` component

**What it does:** Full narrative section — who the doctor is, his journey, his philosophy. This is where the homepage's 2-paragraph teaser expands into a real story.

**Data props:**
```ts
interface AboutBioProps {
  doctorBio?: string;  // from appInfo.doctorBio — may be undefined
  doctorName: string;
}
```

**Layout specification:**

```
┌─────────────────────────────────────────────────────────┐
│  AnimatedSection (py-24 bg-white dark:bg-bg-dark)       │
│  container mx-auto px-6                                 │
│                                                         │
│  SectionHeading:                                        │
│    badge: "My Journey"                                  │
│    title: "A Life Dedicated to Orthopedic Excellence"   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  max-w-3xl mx-auto space-y-6                    │    │
│  │                                                  │    │
│  │  Paragraph 1: Who he is, what drives him        │    │
│  │  Paragraph 2: Medical school, specialization     │    │
│  │  Paragraph 3: His approach to patient care       │    │
│  │  Paragraph 4: Research & teaching commitment     │    │
│  │  Paragraph 5: Philosophy of care closing         │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐             │
│  │  Value    │ │  Value    │ │  Value    │  (3 cards)   │
│  │  Card 1   │ │  Card 2   │ │  Card 3   │             │
│  │  Patient  │ │  Evidence │ │  Innovate │             │
│  │  First    │ │  Based    │ │  & Teach  │             │
│  └───────────┘ └───────────┘ └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

**Hardcoded bio content (v1):** If `doctorBio` is provided from CMS, render it as HTML. Otherwise, render the following hardcoded paragraphs:

```tsx
const BIO_PARAGRAPHS = [
  "Dr. Sahidur Rahman Khan is a distinguished Orthopedic Surgeon whose career has been defined by an unwavering commitment to surgical precision and patient-centered care. With over 15 years of experience across tertiary medical centers in Bangladesh, he has become a trusted name in restoring mobility and transforming lives through advanced orthopedic interventions.",
  "His journey in medicine began with a Gold Medal in MBBS, followed by a Master of Surgery in Orthopedics — achievements that laid the foundation for a career built on academic rigor and clinical excellence. A subsequent Fellowship in Joint Replacement further sharpened his expertise in one of the most demanding subspecialties in orthopedic surgery.",
  "Dr. Sahidur believes that every patient deserves not just treatment, but understanding. His approach combines thorough diagnostic evaluation with personalized treatment plans, ensuring that each individual receives care tailored to their unique condition, lifestyle, and recovery goals. He takes the time to explain procedures, set realistic expectations, and walk alongside his patients through every stage of recovery.",
  "Beyond the operating room, Dr. Sahidur is a passionate researcher and educator. He has contributed to the development of orthopedic protocols, published clinical research, and actively mentors the next generation of surgeons. His commitment to evidence-based practice ensures that his patients benefit from the latest advancements in orthopedic science.",
  "Whether performing a complex joint replacement, managing a challenging trauma case, or guiding a patient through rehabilitation, Dr. Sahidur's philosophy remains the same: treat every patient as you would want your own family to be treated — with skill, empathy, and respect."
];
```

**Paragraph styling:** `<p className="text-lg text-text-para-light dark:text-text-para-dark leading-relaxed">` — matches `home/About.tsx` paragraph classes.

**Value cards row:** Below the bio paragraphs, add a 3-column grid of value cards.

```tsx
const VALUES = [
  {
    icon: /* heart-pulse SVG */,
    title: "Patient First",
    description: "Every decision is guided by what is best for the patient — from diagnosis to recovery."
  },
  {
    icon: /* microscope/clipboard SVG */,
    title: "Evidence Based",
    description: "Treatment plans are rooted in the latest clinical research and proven surgical techniques."
  },
  {
    icon: /* lightbulb/graduation-cap SVG */,
    title: "Innovate & Teach",
    description: "Advancing orthopedic care through research while mentoring the next generation of surgeons."
  }
];
```

**Value card styling** — reuse the exact same card pattern as `home/Specialties.tsx`:
```
group p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5
```

**Grid:** `grid grid-cols-1 md:grid-cols-3 gap-8 mt-16` — 3 cards in a row on desktop, stacked on mobile.

**Icons:** Use inline SVGs (same pattern as `Specialties.tsx`). Each icon should be 32x32, `stroke="currentColor"`, `strokeWidth="1.5"`. Suggested icons:
- Patient First: heart-pulse or stethoscope
- Evidence Based: clipboard-check or flask
- Innovate & Teach: graduation-cap or lightbulb

---

## 3. Task: Create `src/components/about/AboutQualifications.tsx`

**Type:** `"use client"` component

**What it does:** Academic credentials in card format + career stats row. This is the trust-building section.

**Props:** None — all content is hardcoded for v1.

**Layout specification:**

```
┌─────────────────────────────────────────────────────────┐
│  AnimatedSection (py-24 bg-brand-softbg dark:bg-brand-primary/5) │
│  container mx-auto px-6                                 │
│                                                         │
│  SectionHeading:                                        │
│    badge: "Credentials"                                 │
│    title: "Education & Specializations"                 │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  MBBS    │ │  MS      │ │  Fellow  │ │  Trauma  │  │
│  │  Card    │ │  Card    │ │  ship    │ │  Expert  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │ 15+    │  │ 5000+  │  │ 10+    │  │ 20+    │       │
│  │ Years  │  │ Surger. │  │ Public.│  │ Conf.  │       │
│  └────────┘  └────────┘  └────────┘  └────────┘       │
└─────────────────────────────────────────────────────────┘
```

**Qualification cards data:**

```tsx
const QUALIFICATIONS = [
  {
    icon: /* graduation-cap SVG */,
    degree: "MBBS",
    detail: "Gold Medalist — Graduated with the highest academic distinction in the batch.",
    tag: "Gold Medal"
  },
  {
    icon: /* bone/joint SVG */,
    degree: "MS (Orthopedics)",
    detail: "Master of Surgery specializing in orthopedic pathology, trauma management, and reconstructive procedures.",
    tag: "Postgraduate"
  },
  {
    icon: /* award/ribbon SVG */,
    degree: "Fellowship in Joint Replacement",
    detail: "Advanced training in total knee and hip arthroplasty, including minimally invasive and computer-assisted techniques.",
    tag: "Fellowship"
  },
  {
    icon: /* shield-check SVG */,
    degree: "Expert Trauma Consultant",
    detail: "Specialized certification in managing complex musculoskeletal injuries and polytrauma cases.",
    tag: "Certified"
  }
];
```

**Card styling:** Use the exact same card pattern as `home/Specialties.tsx` — it's already a perfect match:
```
group p-8 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:border-brand-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5
```

**Inside each card:**
- Icon container: `w-14 h-14 bg-brand-softbg dark:bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-500` — **exact same as Specialties.tsx line 116**
- Tag badge: `<span className="inline-block px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-[9px] font-bold tracking-widest uppercase mb-3">{tag}</span>`
- Degree: `<h3 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark mb-3">{degree}</h3>`
- Detail: `<p className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">{detail}</p>`

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8` — 4 columns on desktop, 2 on tablet, 1 on mobile.

**Stats row:** Below the cards grid, add a stats section.

```tsx
const STATS = [
  { value: "15+", label: "Years of Experience" },
  { value: "5000+", label: "Successful Surgeries" },
  { value: "10+", label: "Research Publications" },
  { value: "20+", label: "Conferences Attended" },
];
```

**Stats styling:**
- Outer wrapper: `mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8`
- Each stat: `<div className="text-center p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark">`
- Value: `<span className="block text-4xl font-bold text-brand-primary">{value}</span>`
- Label: `<span className="text-xs uppercase tracking-wider font-semibold opacity-50 mt-1 block">{label}</span>`

---

## 4. Task: Create `src/components/about/AboutCTA.tsx`

**Type:** `"use client"` component

**What it does:** Bottom conversion section — gets the user to book or contact. This is the same purpose as the homepage's `CTASection`.

**Props:**
```ts
interface AboutCTAProps {
  clinicHours?: string;
}
```

**Implementation:** This component should **import and reuse** the existing `CTASection` component from `@/components/home/CTASection.tsx` directly. Pass `clinicHours` through.

```tsx
"use client";

import { CTASection } from "@/components/home/CTASection";

export function AboutCTA({ clinicHours }: { clinicHours?: string }) {
  return <CTASection clinicHours={clinicHours} />;
}
```

That's it. Don't reinvent the wheel. The existing `CTASection` already has the right copy ("Ready to Take the First Step?"), buttons (Book Appointment + Ask a Question), and styling. It fits perfectly.

---

## 5. Task: Create `src/app/about/page.tsx`

**Type:** Server component (default export)

**What it does:** The actual route page. Fetches `appInfo`, passes data to child components. Follows the exact same pattern as `contact/page.tsx`.

**Complete file:**

```tsx
import type { Metadata } from "next";
import { AboutBio } from "@/components/about/AboutBio";
import { AboutCTA } from "@/components/about/AboutCTA";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutQualifications } from "@/components/about/AboutQualifications";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getAppInfo } from "@/lib/api/app-info";

export const metadata: Metadata = {
  title: "About Dr. Sahidur",
  description:
    "Learn about Dr. Sahidur Rahman Khan — his journey, qualifications, and commitment to advanced orthopedic care in Bangladesh.",
};

export default async function AboutPage() {
  const appInfo = await getAppInfo().catch(() => undefined);

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-6 pt-32 pb-0">
        <Breadcrumbs title="About" />
      </div>

      <AboutHero
        doctorName={appInfo?.doctorName ?? "Dr. Sahidur Rahman Khan"}
        doctorTitle={appInfo?.doctorTitle ?? "Orthopedic Surgeon"}
        doctorSpecialty={appInfo?.doctorSpecialty ?? "Orthopedic Surgery"}
        doctorImageUrl={appInfo?.doctorImage?.url}
      />

      <AboutBio
        doctorBio={appInfo?.doctorBio}
        doctorName={appInfo?.doctorName ?? "Dr. Sahidur Rahman Khan"}
      />

      <AboutQualifications />

      <AboutCTA clinicHours={appInfo?.clinicHours} />
    </div>
  );
}
```

**Key decisions:**
- `pt-32 pb-0` on the breadcrumbs container — matches the `pt-32` used in `contact/page.tsx`
- The `AboutHero` component handles its own vertical padding (`pt-32 pb-20`) since it's the first visual section and needs the spacing after the fixed header
- The `AboutBio`, `AboutQualifications`, and `AboutCTA` each handle their own `py-24` padding via `AnimatedSection`
- `appInfo` is fetched once at the server level and passed down — no redundant fetches

---

## 6. Task: Create `src/app/about/loading.tsx`

**Type:** Client component (default export)

**Follows the exact pattern of `contact/loading.tsx`:**

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-20 space-y-8">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Skeleton variant="image" className="aspect-4/5 w-full rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton variant="paragraph" className="w-full" />
          <Skeleton className="h-14 w-48" />
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Task: Create `src/app/about/error.tsx`

**Type:** Client component (default export)

**Exact copy of `contact/error.tsx`:**

```tsx
"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-6 py-24 text-center space-y-6">
      <h2 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark">
        Something went wrong
      </h2>
      <p className="text-text-para-light dark:text-text-para-dark max-w-md mx-auto">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

---

## 8. Task: Modify `src/constants/navigation.ts`

**What changes:** Add "About" to `FOOTER_LINKS` only. Do NOT touch `NAV_LINKS`.

**Current file:**
```ts
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Research", href: "/research" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Research Papers", href: "/research" },
      { label: "Patient Testimonials", href: "/testimonials" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Book Appointment", href: "/appointment" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
```

**After change:**
```ts
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Research", href: "/research" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "About Dr. Shahid", href: "/about" },
      { label: "Articles", href: "/articles" },
      { label: "Research Papers", href: "/research" },
      { label: "Patient Testimonials", href: "/testimonials" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Book Appointment", href: "/appointment" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
```

**What was added:** `{ label: "About Dr. Shahid", href: "/about" }` as the **first** item in the "Platform" section. It's first because "About" is the most natural entry point — someone reading the footer wants to know who this doctor is before anything else.

---

## 9. Task: Modify `src/components/home/About.tsx`

**What changes:** Fix the CTA button href from `/contact` to `/about`. One line change.

**Current (line 79):**
```tsx
<Button size="lg" href="/contact">
  Learn More About My Journey
</Button>
```

**After change:**
```tsx
<Button size="lg" href="/about">
  Learn More About My Journey
</Button>
```

Nothing else changes in this file. The homepage About section stays as a teaser. The button text "Learn More About My Journey" now correctly points to a page that delivers on that promise.

---

## 10. Task: Modify `src/components/shared/Breadcrumbs.tsx`

**What changes:** Add `"about"` to the `LABELS` map so breadcrumbs render "About" instead of "about".

**Current (line 6-12):**
```ts
const LABELS: Record<string, string> = {
  articles: "Articles",
  research: "Research",
  appointment: "Appointment",
  contact: "Contact",
  testimonials: "Testimonials",
};
```

**After change:**
```ts
const LABELS: Record<string, string> = {
  articles: "Articles",
  research: "Research",
  appointment: "Appointment",
  contact: "Contact",
  testimonials: "Testimonials",
  about: "About",
};
```

---

## 11. Task: Modify `src/app/sitemap.ts`

**What changes:** Add `/about` entry for SEO.

**Add this object to the sitemap array, after the base URL entry and before `/articles`:**

```ts
{
  url: `${baseUrl}/about`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.8,
},
```

---

## 12. Implementation Order (Task Sequence)

Do these in this exact order. Each task is independent enough to be assigned to a different person, but the sequence ensures no merge conflicts.

| Step | Task | Files | Est. Time |
|------|------|-------|-----------|
| 1 | Create `AboutHero.tsx` | `src/components/about/AboutHero.tsx` (NEW) | 30 min |
| 2 | Create `AboutBio.tsx` | `src/components/about/AboutBio.tsx` (NEW) | 25 min |
| 3 | Create `AboutQualifications.tsx` | `src/components/about/AboutQualifications.tsx` (NEW) | 25 min |
| 4 | Create `AboutCTA.tsx` | `src/components/about/AboutCTA.tsx` (NEW) | 5 min |
| 5 | Create route files | `src/app/about/page.tsx`, `loading.tsx`, `error.tsx` (ALL NEW) | 15 min |
| 6 | Wire into existing site | Modify: `navigation.ts`, `About.tsx`, `Breadcrumbs.tsx`, `sitemap.ts` | 10 min |
| 7 | Visual QA | Test on 1024px-1200px viewport, mobile, dark mode | 15 min |

**Total estimated time: ~2 hours**

---

## 13. Visual Consistency Checklist

Before marking the task done, verify ALL of the following:

- [ ] **Dark mode works** on every section — all text uses `dark:text-*` variants, all backgrounds use `dark:bg-*` variants
- [ ] **Mobile layout** — every grid collapses to single column, photo stacks above text
- [ ] **Tablet layout** (768-1023px) — 2-column grids work, no horizontal overflow
- [ ] **Small laptop** (1024-1200px) — navbar is NOT affected (no new nav link added), page content renders properly
- [ ] **Breadcrumbs** show `Home > About` and "About" is bold (last item)
- [ ] **Footer** shows "About Dr. Shahid" link in Platform section, clicking it navigates to `/about`
- [ ] **Homepage** About section "Learn More About My Journey" button navigates to `/about` (not `/contact`)
- [ ] **Animations** — all sections animate on scroll (fade up, 30px offset) via `AnimatedSection`
- [ ] **Loading state** — skeleton shapes match the page layout structure
- [ ] **Error state** — error boundary renders with "Try Again" button
- [ ] **Photo fallback** — when no `doctorImage` in CMS, the placeholder with the doctor's name renders (no broken image)
- [ ] **SEO** — page title is "About Dr. Sahidur | {siteName}", meta description exists, `/about` is in sitemap

---

## 14. What NOT to Do

- **Do NOT add "About" to `NAV_LINKS`** — the navbar constraint at 1024-1200px makes this impossible without breaking layout
- **Do NOT install any new npm packages** — everything needed already exists in the project
- **Do NOT modify the Header component** — no changes to the navbar
- **Do NOT create an i18n system yet** — English only for now; the EN/BN toggle will be added later as a separate feature
- **Do NOT add a timeline component** — the bio section covers the journey narratively; a visual timeline is a v2 nice-to-have
- **Do NOT change the homepage About section layout** — only the button href changes; the section stays as the teaser it is
- **Do NOT add a new CSS module** — use Tailwind classes consistently like the rest of the project
- **Do NOT use `next/image` unoptimized** — if a doctor image URL exists, use `<Image>` with `fill` and `object-cover`

---

## 15. Future Considerations (Out of Scope for This Task)

These are explicitly NOT part of this implementation, but documented here so the team is aware:

1. **EN/BN Translation** — When the language toggle is implemented, all hardcoded strings in the About page components will need to be extracted into translation keys. The component structure (separate sections as individual components) makes this straightforward.

2. **CMS Integration** — The `doctorBio` field already exists in the `AppInfo` type and the Payload CMS backend. When content is entered in the CMS, the `AboutBio` component should render it. For v1, hardcoded content is fine.

3. **Doctor Photo** — The `doctorImage` field already exists in the CMS. When a photo is uploaded, the `AboutHero` component will automatically display it via `appInfo.doctorImage?.url`. No code changes needed.

4. **Timeline Component** — A visual career timeline could be added below `AboutBio` in a future iteration. The section structure supports this — just add a new `AboutTimeline.tsx` component and insert it into `page.tsx`.

---

## 16. Component Dependency Map

```
about/page.tsx (server)
  ├── Breadcrumbs (shared, existing)
  ├── AboutHero (new, "use client")
  │     └── Button (ui, existing)
  │     └── Image from next/image (existing)
  │     └── motion from framer-motion (existing)
  ├── AboutBio (new, "use client")
  │     └── AnimatedSection (shared, existing)
  │     └── SectionHeading (shared, existing)
  │     └── motion from framer-motion (existing)
  ├── AboutQualifications (new, "use client")
  │     └── AnimatedSection (shared, existing)
  │     └── SectionHeading (shared, existing)
  │     └── motion from framer-motion (existing)
  └── AboutCTA (new, "use client")
        └── CTASection (home, existing — REUSED directly)
              └── AnimatedSection (shared, existing)
              └── Button (ui, existing)
```

**Zero new dependencies.** Every box in this diagram either already exists or is a thin composition of existing components.
