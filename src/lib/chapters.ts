/* Canonical chapter inventory. The slug doubles as the content-collection id
   and the URL segment — keep all three in lockstep. */

export type ChapterMeta = {
  chapter: number;
  slug: string;
  title: string;
  group: string;
};

export const GROUPS = [
  'Foundations of Data Systems',
  'Distributed Data',
  'Derived Data',
  'Data and Society',
] as const;

export const CHAPTERS: ChapterMeta[] = [
  { chapter: 1, slug: '01-trade-offs-in-data-systems-architecture', title: 'Trade-Offs in Data Systems Architecture', group: GROUPS[0] },
  { chapter: 2, slug: '02-defining-nonfunctional-requirements', title: 'Defining Nonfunctional Requirements', group: GROUPS[0] },
  { chapter: 3, slug: '03-data-models-and-query-languages', title: 'Data Models and Query Languages', group: GROUPS[0] },
  { chapter: 4, slug: '04-storage-and-retrieval', title: 'Storage and Retrieval', group: GROUPS[0] },
  { chapter: 5, slug: '05-encoding-and-evolution', title: 'Encoding and Evolution', group: GROUPS[0] },
  { chapter: 6, slug: '06-replication', title: 'Replication', group: GROUPS[1] },
  { chapter: 7, slug: '07-sharding', title: 'Sharding', group: GROUPS[1] },
  { chapter: 8, slug: '08-transactions', title: 'Transactions', group: GROUPS[1] },
  { chapter: 9, slug: '09-the-trouble-with-distributed-systems', title: 'The Trouble with Distributed Systems', group: GROUPS[1] },
  { chapter: 10, slug: '10-consistency-and-consensus', title: 'Consistency and Consensus', group: GROUPS[1] },
  { chapter: 11, slug: '11-batch-processing', title: 'Batch Processing', group: GROUPS[2] },
  { chapter: 12, slug: '12-stream-processing', title: 'Stream Processing', group: GROUPS[2] },
  { chapter: 13, slug: '13-a-philosophy-of-streaming-systems', title: 'A Philosophy of Streaming Systems', group: GROUPS[2] },
  { chapter: 14, slug: '14-doing-the-right-thing', title: 'Doing the Right Thing', group: GROUPS[3] },
];

export function chapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chapterByNumber(n: number): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.chapter === n);
}
