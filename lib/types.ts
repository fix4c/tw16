export type Headline = {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  sourceName: string;
  sourceUrl: string;
  sourceTier: 1 | 2 | 3;
  publishedAt: string;
  fetchedAt: string;
};

export type HeadlineFeed = {
  lastUpdated: string;
  headlines: Headline[];
};