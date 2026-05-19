import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { ReadingProgress } from "@/components/articles/ReadingProgress";
import { TableOfContents } from "@/components/articles/TableOfContents";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getArticleBySlug, getArticles } from "@/lib/api/articles";
import { formatDate, readingTime } from "@/lib/utils";
import type { Article } from "@/types/article";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    return {
      title: article.title,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        images: article.featuredImage
          ? [{ url: article.featuredImage.url }]
          : [],
      },
    };
  } catch (_error) {
    return { title: "Article Not Found" };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  let article: Article;
  try {
    article = await getArticleBySlug(slug);
  } catch (_error) {
    notFound();
  }

  const relatedResponse = await getArticles({
    limit: 4,
    tag: article.tags?.[0],
  }).catch(() => ({ docs: [] }));
  const relatedArticles = relatedResponse.docs.filter(
    (item) => item._id !== article._id,
  );

  return (
    <article className="container mx-auto px-6 py-12 max-w-6xl">
      <ReadingProgress />
      <Breadcrumbs title={article.title} />

      <div className="space-y-8 mb-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <Badge key={tag} variant="medical">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-text-para-light dark:text-text-para-dark opacity-60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <span>Dr. Sahidur Rahman Khan</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>{formatDate(article.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>{readingTime(article.content)} min read</span>
            </div>
          </div>
          <ShareButtons
            title={article.title}
            slug={article.slug}
            basePath="articles"
          />
        </div>

        {article.featuredImage && (
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border-light dark:border-border-dark">
            <Image
              src={article.featuredImage.url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-16">
          <ArticleContent html={article.content} />

          {relatedArticles.length > 0 ? (
            <section className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-text-heading-light dark:text-text-heading-dark">
                    Related Articles
                  </h2>
                  <p className="text-text-para-light dark:text-text-para-dark">
                    Explore other articles on similar topics.
                  </p>
                </div>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {relatedArticles.map((item, index) => (
                  <ArticleCard key={item._id} article={item} idx={index} />
                ))}
              </div>
            </section>
          ) : null}

          <div className="pt-12 border-t border-border-light dark:border-border-dark">
            <div className="bg-brand-softbg dark:bg-brand-primary/10 rounded-2xl p-8 md:p-12 text-center space-y-6">
              <h3 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark">
                Have questions about this topic?
              </h3>
              <p className="text-text-para-light dark:text-text-para-dark max-w-xl mx-auto leading-relaxed">
                If you’re experiencing symptoms discussed in this article or
                would like to discuss a treatment plan, feel free to schedule a
                consultation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/appointment">
                  Book Appointment
                </Button>
                <Button variant="outline" size="lg" href="/contact">
                  Ask a Question
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <TableOfContents html={article.content} />
        </aside>
      </div>
    </article>
  );
}
