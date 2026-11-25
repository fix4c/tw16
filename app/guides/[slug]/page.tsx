import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { GuidePage } from '@/components/guides/GuidePage';
import { getGuide, guides } from '@/lib/guides/manifest';
import { getGuideContent } from '@/content/guides/registry';

export function generateStaticParams() {
  return guides.filter((g) => !g.existing).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGuide(slug);
  if (!entry) return {};

  return {
    title: entry.seoTitle,
    description: entry.metaDescription,
    alternates: { canonical: `https://tw16.net/guides/${entry.slug}` },
    openGraph: {
      title: entry.seoTitle,
      description: entry.metaDescription,
      url: `https://tw16.net/guides/${entry.slug}`,
      type: 'article',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGuide(slug);
  const content = getGuideContent(slug);

  if (!entry || !content) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.metaDescription,
    mainEntityOfPage: `https://tw16.net/guides/${entry.slug}`,
    author: { '@type': 'Organization', name: 'tw16.net 台灣醫療網' },
    publisher: { '@type': 'Organization', name: 'tw16.net 台灣醫療網' },
  };

  const faqJsonLd =
    entry.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: entry.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <GuidePage entry={entry} content={content} />
    </>
  );
}