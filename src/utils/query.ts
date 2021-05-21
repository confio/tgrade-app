// Crazy stuff for typing react-query's useQueries: https://blog.johnnyreilly.com/2021/01/03/strongly-typing-react-query-s-usequeries/

import { useQueries, UseQueryOptions, UseQueryResult } from "react-query";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export function useQueriesTyped<TQueries extends readonly UseQueryOptions[]>(
  queries: [...TQueries],
): {
  [ArrayElement in keyof TQueries]: UseQueryResult<
    TQueries[ArrayElement] extends { select: infer TSelect }
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TSelect extends (data: any) => any
        ? ReturnType<TSelect>
        : never
      : Awaited<ReturnType<NonNullable<Extract<TQueries[ArrayElement], UseQueryOptions>["queryFn"]>>>
  >;
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQueries(queries as UseQueryOptions<unknown, unknown, unknown>[]) as any;
}
