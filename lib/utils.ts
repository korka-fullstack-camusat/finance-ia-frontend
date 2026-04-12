import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const TASK_LABELS: Record<string, string> = {
  reporting: "Rapport Financier",
  reconciliation: "Rapprochement Bancaire",
  kpi: "Calcul KPIs",
  forecast: "Prévisions Trésorerie",
  anomaly: "Détection Anomalies",
  audit: "Rapport d'Audit",
};

export const TASK_ICONS: Record<string, string> = {
  reporting: "📊",
  reconciliation: "🔄",
  kpi: "📈",
  forecast: "🔮",
  anomaly: "🔍",
  audit: "✅",
};

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
};
