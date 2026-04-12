import axios from "axios";
import type {
  Task,
  TaskResult,
  UploadedFile,
  Notification,
  TaskFrequency,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// --- Tasks ---

export const fetchTasks = (): Promise<Task[]> =>
  api.get("/api/tasks").then((r) => r.data);

export const toggleTask = (id: string): Promise<Task> =>
  api.patch(`/api/tasks/${id}/toggle`).then((r) => r.data);

export const updateFrequency = (
  id: string,
  frequency: TaskFrequency
): Promise<Task> =>
  api.patch(`/api/tasks/${id}/frequency`, { frequency }).then((r) => r.data);

// --- Results ---

export const fetchResults = (taskId?: string): Promise<TaskResult[]> =>
  api
    .get("/api/results", { params: taskId ? { task_id: taskId } : {} })
    .then((r) => r.data);

export const fetchLatestResult = (taskId: string): Promise<TaskResult> =>
  api.get(`/api/results/${taskId}/latest`).then((r) => r.data);

// --- Files ---

export const fetchFiles = (): Promise<UploadedFile[]> =>
  api.get("/api/files").then((r) => r.data);

export const uploadFile = (file: File): Promise<UploadedFile> => {
  const form = new FormData();
  form.append("file", file);
  return api
    .post("/api/files/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const deleteFile = (id: string): Promise<void> =>
  api.delete(`/api/files/${id}`).then((r) => r.data);

// --- Notifications ---

export const fetchNotifications = (): Promise<Notification[]> =>
  api.get("/api/notifications").then((r) => r.data);

export const markNotificationRead = (id: string): Promise<void> =>
  api.delete(`/api/notifications/${id}`).then((r) => r.data);

// --- Health ---

export const checkHealth = (): Promise<{ status: string }> =>
  api.get("/api/health").then((r) => r.data);

// --- SSE helpers ---

export const API_BASE = BASE_URL;
