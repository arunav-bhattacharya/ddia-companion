import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const referenceSchema = z.object({
  title: z.string().min(5),
  url: z.string().url(),
  type: z.enum(['article', 'video', 'course', 'paper', 'docs']),
  author: z.string().optional(),
  note: z.string().min(20).max(300),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string().min(3),
    chapter: z.number().int().min(1).max(14),
    description: z.string().min(80).max(220),
    readingMinutes: z.number().int().min(5).max(60),
    keyTakeaways: z.array(z.string().min(40)).min(6).max(12),
    references: z.array(referenceSchema).min(4).max(10),
    draft: z.boolean().default(false),
  }),
});

const flashcards = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/flashcards' }),
  schema: z.object({
    cards: z
      .array(
        z.object({
          id: z.string().regex(/^ch\d{2}-f\d{2}$/),
          front: z.string().min(10),
          back: z.string().min(10),
        })
      )
      .min(12)
      .max(20),
  }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/quizzes' }),
  schema: z.object({
    questions: z
      .array(
        z.object({
          id: z.string().regex(/^ch\d{2}-q\d{2}$/),
          prompt: z.string().min(15),
          options: z.array(z.string().min(1)).length(4),
          answerIndex: z.number().int().min(0).max(3),
          explanation: z.string().min(30),
        })
      )
      .min(8)
      .max(12),
  }),
});

const assignments = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/assignments' }),
  schema: z.object({
    assignments: z
      .array(
        z.object({
          id: z.string().regex(/^ch\d{2}-a\d{2}$/),
          title: z.string().min(5),
          scenario: z.string().min(100),
          tasks: z.array(z.string().min(10)).min(2).max(4),
          hints: z.array(z.string().min(10)).optional(),
          modelAnswer: z.string().min(200),
        })
      )
      .min(2)
      .max(3),
  }),
});

const glossary = defineCollection({
  loader: file('./src/content/glossary/terms.yaml'),
  schema: z.object({
    id: z.string(),
    term: z.string().min(2),
    definition: z.string().min(30),
    chapters: z.array(z.number().int().min(1).max(14)).optional(),
  }),
});

export const collections = { chapters, flashcards, quizzes, assignments, glossary };
