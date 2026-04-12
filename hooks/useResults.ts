import { useQuery } from "@tanstack/react-query";
import { fetchResults, fetchLatestResult } from "@/lib/api";

export function useResults(taskId?: string) {
  return useQuery({
    queryKey: ["results", taskId],
    queryFn: () => fetchResults(taskId),
    refetchInterval: 15000,
  });
}

export function useLatestResult(taskId: string | null) {
  return useQuery({
    queryKey: ["result-latest", taskId],
    queryFn: () => fetchLatestResult(taskId!),
    enabled: !!taskId,
  });
}
