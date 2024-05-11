import z from 'zod';

const SearchSchema = z.object({
  perPage: z.preprocess(
    (v) => +((v ?? '20') as string),
    z.number().min(1).max(100),
  ),
  page: z.preprocess((v) => +((v ?? '1') as string), z.number().min(1)),
  search: z.string().default(''),
  order: z.enum(['desc', 'asc']).default('desc'),
  orderBy: z.string().default('createdAt'),
});

export { SearchSchema };
