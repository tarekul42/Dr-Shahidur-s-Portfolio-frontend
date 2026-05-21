import { About } from "@/components/home/About";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { getAppInfo } from "@/lib/api/app-info";
import { getArticles } from "@/lib/api/articles";
export async function AboutSection() {
  const appInfo = await getAppInfo().catch(() => undefined);
  return <About doctorImageUrl={appInfo?.doctorImage?.url} />;
}

export async function FeaturedArticlesSection() {
  const articles = await getArticles({
    limit: 6,
    articleType: "MEDICAL",
  }).catch(() => undefined);

  if (!articles?.docs?.length) return null;
  return <FeaturedArticles articles={articles.docs} />;
}
