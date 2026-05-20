import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getResearchBySlug, getResearchList } from "@/lib/api/research";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const response = await getResearchList({ limit: 100 });
    return response.docs.map((research) => ({
      slug: research.slug,
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to generate static params for research", error);
    }
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const research = await getResearchBySlug(slug);
    return {
      title: research.title,
      description: research.description || research.title,
      openGraph: {
        title: research.title,
        description: research.description || research.title,
        images: research.thumbnailImage
          ? [{ url: research.thumbnailImage.url }]
          : [],
        type: "article",
      },
      alternates: { canonical: `/research/${slug}` },
    };
  } catch (_error) {
    return { title: "Research Not Found" };
  }
}

export default async function ResearchDetailPage({ params }: Props) {
  const { slug } = await params;
  let research: import("@/types/research").Research;
  try {
    research = await getResearchBySlug(slug);
  } catch (_error) {
    notFound();
  }

  const publishedLabel = research.publishedAt ?? research.createdAt;
  const accessUrl =
    research.uploadType === "PDF" ? research.pdfFile?.url : research.doiUrl;

  return (
    <article className="container mx-auto px-6 py-12 max-w-5xl">
      <Breadcrumbs title={research.title} />

      <div className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-hover uppercase tracking-widest transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Back Icon</title>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Research
          </Link>
          <ShareButtons
            title={research.title}
            slug={research.slug}
            basePath="research"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border-light dark:border-border-dark bg-brand-softbg dark:bg-brand-primary/10">
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary/15 via-transparent to-brand-secondary/15" />
          {research.thumbnailImage ? (
            <div className="relative aspect-16/6">
              <Image
                src={research.thumbnailImage.url}
                alt={research.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="h-56 md:h-72" />
          )}

          <div className="relative p-8 md:p-12 -mt-20 md:-mt-24">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge variant="medical">
                {research.uploadType === "PDF" ? "PDF" : "DOI"}
              </Badge>
              <span className="text-xs font-bold text-text-para-light dark:text-text-para-dark opacity-60">
                {formatDate(publishedLabel)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
              {research.title}
            </h1>

            {research.description ? (
              <p className="mt-6 text-base md:text-lg text-text-para-light dark:text-text-para-dark leading-relaxed max-w-3xl">
                {research.description}
              </p>
            ) : null}
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8">
              <h2 className="text-xl font-bold text-text-heading-light dark:text-text-heading-dark">
                Access
              </h2>
              <p className="mt-2 text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                {research.uploadType === "PDF"
                  ? "You can view or download the PDF document."
                  : "You can open the DOI link for the publication details."}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  href={accessUrl || "#"}
                  target={accessUrl ? "_blank" : undefined}
                  rel={accessUrl ? "noopener noreferrer" : undefined}
                  disabled={!accessUrl}
                  className="justify-center"
                >
                  {research.uploadType === "PDF"
                    ? "View / Download PDF"
                    : "Open DOI Link"}
                </Button>

                {research.doiNumber ? (
                  <div className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark px-4 py-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-60">
                      DOI
                    </div>
                    <div className="font-mono text-sm text-text-heading-light dark:text-text-heading-dark break-all">
                      {research.doiNumber}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {research.uploadType === "PDF" && accessUrl ? (
              <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
                <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                  <h3 className="font-bold text-text-heading-light dark:text-text-heading-dark">
                    Preview
                  </h3>
                </div>
                <iframe
                  title="PDF preview"
                  src={accessUrl}
                  className="w-full h-[70vh]"
                />
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-60">
                Need a consultation?
              </h3>
              <p className="mt-3 text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
                If you’d like to discuss this research or explore treatment
                options, you can book an appointment.
              </p>
              <div className="mt-6">
                <Button href="/appointment" className="w-full justify-center">
                  Book Appointment
                </Button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </article>
  );
}
