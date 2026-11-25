import type { ReactNode } from 'react';

export type GuideCategory =
  | 'process'
  | 'nhi-rights'
  | 'medication-safety'
  | 'report-reading'
  | 'special-groups'
  | 'chronic-disease';

export type GuideFaq = { q: string; a: string };

export type GuideEntry = {
  slug: string;
  category: GuideCategory;
  title: string;
  seoTitle: string;
  metaDescription: string;
  priority: 1 | 2 | 3;
  departmentSlugs?: string[];
  relatedGuides?: string[];
  existing?: boolean;
  faqs: GuideFaq[];
};

export type GuideContent = {
  intro: ReactNode;
  highlights: string[];
  body: ReactNode;
};