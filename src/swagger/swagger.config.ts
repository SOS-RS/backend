import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiHeader,
  ApiHeaderOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

type SwaggerOptions = {
  operation: ApiOperationOptions;
  responses: ApiResponseOptions[];
  body?: ApiBodyOptions;
  headers?: ApiHeaderOptions[];
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
};

export const MakeSwagger = (opts: SwaggerOptions) => {
  const queries = opts.queries || [];
  const params = opts.params || [];
  const headers = opts.headers || [];

  return applyDecorators(
    ...([
      ApiOperation(opts.operation),
      ...queries.map(ApiQuery),
      ...headers.map(ApiHeader),
      ...params.map(ApiParam),
      ...Object.entries(opts.responses).map(([, r]) => ApiResponse({ ...r })),
      opts.body && ApiBody(opts.body),
    ].filter(Boolean) as MethodDecorator[]),
  );
};
