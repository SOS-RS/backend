import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { getSearchWhere, parseStringToObject } from '@/utils';
import {
  SeachQueryProps,
  SeachQueryPropsWithoutSearch,
  SearchQueryPropsOptions,
  SearchSchema,
} from './types';

function handleSearch<T = any>(props: SeachQueryPropsWithoutSearch) {
  return async function (model: any, options?: SearchQueryPropsOptions<T>) {
    const { hooks, select } = options ?? {};
    const {
      download,
      order,
      orderBy,
      page,
      perPage,
      search,
      include = '',
      or,
    } = props;
    const { afterWhere, beforeWhere } = hooks ?? {};
    const where = {};

    if (beforeWhere) Object.assign(where, beforeWhere(where));
    Object.assign(where, getSearchWhere(search, or));
    if (afterWhere) Object.assign(where, afterWhere(where));

    const count = await model.count({ where });

    const take = download ? undefined : perPage;
    const skip = download ? undefined : perPage * (page - 1);

    const query = {
      take,
      skip,
      orderBy: parseStringToObject(orderBy, order),
      where,
    };

    const includeData = include
      .split(',')
      .reduce((prev, curr) => (curr ? { ...prev, [curr]: true } : prev), {});

    if (Object.keys(includeData).length > 0) query['include'] = includeData;
    else if (select) query['select'] = select;

    const results = await model.findMany(query);

    return { page, perPage, count, results };
  };
}

export const SearchQuery = createParamDecorator(
  (_, ctx: ExecutionContext): SeachQueryProps => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const searchQueryProps = SearchSchema.parse({
      perPage: query.perPage,
      page: query.page,
      search: query.search,
      orderBy: query.orderBy,
      order: query.order,
      download: query.download,
      include: query.include,
      or: query.or,
    });

    return {
      query: searchQueryProps,
      handleSearch: handleSearch(searchQueryProps),
    };
  },
);
