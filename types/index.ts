// ============================================================
// Core types for FinanceAI Frontend
// ============================================================

export type TaskType =
  | "reporting"
  | "reconciliation"
  | "kpi"
  | "forecast"
  | "anomaly"
  | "audit";

export type TaskFrequency = "daily" | "weekly" | "monthly";

export type TaskStatus = "idle" | "running" | "success" | "error";

export interface Task {
  id: string;
  name: string;
  description: string;
  task_type: TaskType;
  is_auto: boolean;
  frequency: TaskFrequency;
  status: TaskStatus;
  last_run: string | null;
  next_run: string | null;
  created_at: string;
}

export interface TaskResult {
  id: string;
  task_id: string;
  content: string;
  summary: string;
  duration: number;
  triggered_by: "auto" | "manual";
  created_at: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Notification {
  id: string;
  task_id: string | null;
  task_name: string;
  message: string;
  type?: "success" | "error" | "info";
  channel: "email" | "slack" | "system";
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  lastMessageAt: string | null;
  messages: ChatMessage[];
}

export interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: "log" | "error" | "info";
}

export interface TaskRunEvent {
  type: "log" | "progress" | "result" | "error" | "done";
  message?: string;
  value?: number;
  result_id?: string;
  summary?: string;
}
