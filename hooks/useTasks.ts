import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, toggleTask, updateFrequency } from "@/lib/api";
import type { TaskFrequency } from "@/types";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    refetchInterval: 10000,
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateFrequency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, frequency }: { id: string; frequency: TaskFrequency }) =>
      updateFrequency(id, frequency),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
