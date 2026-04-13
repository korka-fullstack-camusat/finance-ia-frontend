"use client";
import { useState, KeyboardEvent, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { uploadFile, deleteFile, fetchFiles } from "@/lib/api";
import { formatFileSize } from "@/lib/utils";

interface Props {
  onSend: (msg: string, fileIds: string[]) => void;
  disabled?: boolean;
}

const FILE_ICONS: Record<string, string> = {
  csv: "📊", xlsx: "📊", xls: "📊", pdf: "📄",
};

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICONS[ext] ?? "📎";
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const [attached, setAttached] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  // Fetch stored files
  const { data: files = [] } = useQuery({ queryKey: ["files"], queryFn: fetchFiles });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["files"] });
      setAttached((prev) => { const s = new Set(prev); s.delete(id); return s; });
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      qc.invalidateQueries({ queryKey: ["files"] });
      // Auto-attach the just-uploaded file
      setAttached((prev) => new Set([...prev, uploaded.id]));
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  }, [qc]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleUpload(f);
  };

  const toggleAttach = (id: string) => {
    setAttached((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleSend = () => {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg, [...attached]);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasFiles = files.length > 0;

  return (
    <div
      className="px-4 pb-4 pt-2"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {/* Main input box */}
      <div className={`bg-white border rounded-2xl shadow-sm transition-all ${
        dragOver
          ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-[#EFF6FF]"
          : disabled
          ? "border-[#E2E8F0] opacity-60"
          : "border-[#E2E8F0] hover:border-[#2563EB]/40 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]/20"
      }`}>
        {/* Textarea row */}
        <div className="flex items-end gap-2 px-3 pt-3 pb-2">
          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors shrink-0 mb-0.5 disabled:opacity-40"
            title="Joindre un fichier"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-[#BFDBFE] border-t-[#2563EB] rounded-full animate-spin" />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            )}
          </button>
          <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={onFileInput} />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            disabled={disabled}
            placeholder={dragOver ? "Déposez le fichier ici..." : "Posez une question financière..."}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none leading-relaxed"
            style={{ minHeight: "24px", maxHeight: "160px" }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 hover:bg-[#1D4ED8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* File chips row — only visible when files exist */}
        {hasFiles && (
          <div className="px-3 pb-2.5 flex flex-wrap gap-1.5 border-t border-[#F1F5F9] pt-2">
            {files.map((f) => {
              const isAttached = attached.has(f.id);
              return (
                <div
                  key={f.id}
                  className={`group flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all select-none ${
                    isAttached
                      ? "bg-[#EFF6FF] border border-[#2563EB]/40 text-[#2563EB]"
                      : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/30 hover:text-[#2563EB]"
                  }`}
                  onClick={() => toggleAttach(f.id)}
                  title={isAttached ? "Cliquez pour détacher" : "Cliquez pour attacher au message"}
                >
                  <span>{fileIcon(f.original_name)}</span>
                  <span className="max-w-[120px] truncate">{f.original_name}</span>
                  <span className={`text-[9px] ${isAttached ? "text-[#2563EB]/60" : "text-[#94A3B8]"}`}>
                    {formatFileSize(f.file_size)}
                  </span>
                  {isAttached && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#2563EB] shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMut.mutate(f.id); }}
                    className="ml-0.5 text-[#94A3B8] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Supprimer"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}

            {attached.size > 0 && (
              <span className="text-[10px] text-[#2563EB] self-center ml-1">
                {attached.size} fichier{attached.size > 1 ? "s" : ""} joint{attached.size > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-[#94A3B8] mt-1.5">
        FinanceAI peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  );
}
