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
  download: z.preprocess(
    (v) => (v ?? 'false') === 'true',
    z.boolean().default(false),
  ),
  include: z.string().optional(),
  or: z.preprocess(
    (v) => (v ?? 'false') === 'true',
    z.boolean().default(false),
  ),
});

const SearchResponseSchema = z.object({
  count: z.number().min(0),
  results: z.array(z.any()),
});

type SeachQueryPropsWithoutSearch = z.infer<typeof SearchSchema>;

interface SeachQueryPropsHooks {
  beforeWhere?: (where: Record<string, any>) => Record<string, any>;
  afterWhere?: (where: Record<string, any>) => Record<string, any>;
}

interface SearchQueryPropsOptions<T> {
  hooks?: SeachQueryPropsHooks;
  select?: T;
}

interface SeachQueryProps {
  query: SeachQueryPropsWithoutSearch;
  handleSearch<T = any>(
    model: any,
    options?: SearchQueryPropsOptions<T>,
  ): Promise<z.infer<typeof SearchResponseSchema>>;
}

export {
  SeachQueryProps,
  SeachQueryPropsHooks,
  SeachQueryPropsWithoutSearch,
  SearchQueryPropsOptions,
  SearchResponseSchema,
  SearchSchema,
};
