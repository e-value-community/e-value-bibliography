import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePapersData } from '../usePapersData';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePapersData', () => {
  it('loads the static paper catalogue', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
        if (url === '/papers.json') {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                { title: 'First paper', doi: '10.1234/first' },
                { title: 'Kept paper', doi: '10.1234/kept' },
              ])
            )
          );
        }
        return Promise.resolve(new Response(null, { status: 404 }));
      })
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => usePapersData(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data?.map(paper => paper.title)).toEqual([
      'First paper',
      'Kept paper',
    ]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
