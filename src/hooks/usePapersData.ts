import { useQuery } from '@tanstack/react-query';
import type { Paper } from '@/types';

/**
 * Fetches papers data from /papers.json
 * Includes validation and error handling
 */
const fetchPapersData = async (): Promise<Paper[]> => {
  const response = await fetch(`${import.meta.env.BASE_URL}papers.json`);

  if (!response.ok) {
    // Differentiate between error types for better UX
    if (response.status === 404) {
      throw new Error(
        'Papers data not found. Please ensure papers.json exists.'
      );
    }
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(`Failed to load papers: ${response.status}`);
  }

  const data: unknown = await response.json();

  // Validate data structure
  if (!Array.isArray(data)) {
    throw new Error('Invalid papers data format: expected an array');
  }

  return data as Paper[];
};

/**
 * Custom hook to fetch and cache papers data using React Query
 *
 * Maintains backward-compatible API with the original hook:
 * Returns { data, loading, error } instead of React Query's standard shape
 *
 * Features:
 * - Caches the large static catalogue for 10 minutes
 * - Automatic retry with exponential backoff
 */
export const usePapersData = () => {
  const papersQuery = useQuery({
    queryKey: ['papers'],
    queryFn: fetchPapersData,
    staleTime: 10 * 60 * 1000, // 10 minutes - papers data is very static
    gcTime: 30 * 60 * 1000, // 30 minutes in memory
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Return backward-compatible shape for existing components
  return {
    data: papersQuery.data ?? null,
    loading: papersQuery.isLoading,
    error: papersQuery.error ?? null,
  };
};
