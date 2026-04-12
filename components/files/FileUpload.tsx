"use client";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile, deleteFile, fetchFiles } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { formatFileSize, formatDate } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";

export function FileUpload() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: fetchFiles,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["files"] }),
  });

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        await uploadFile(file);
        qc.invalidateQueries({ queryKey: ["files"] });
      } catch (e: any) {
        alert(e?.response?.data?.detail || "Erreur d'upload");
      } finally {
        setUploading(false);
      }
    },
    [qc]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <h3 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">
        Fichiers
      </h3>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center h-16 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? "border-[#7c6ff7] bg-[#7c6ff7]/10"
            : "border-white/10 hover:border-[#7c6ff7]/40 hover:bg-[#7c6ff7]/5"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls,.pdf"
          onChange={onInput}
        />
        {uploading ? (
          <p className="text-[11px] font-mono text-[#7c6ff7] animate-pulse">Upload...</p>
        ) : (
          <>
            <span className="text-lg">📂</span>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">CSV / XLSX / PDF</p>
          </>
        )}
      </label>

      <div className="space-y-1 max-h-28 overflow-y-auto">
        {files.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between bg-[#1c1c22] rounded px-2 py-1 border border-white/5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-300 truncate font-mono">{f.original_name}</p>
              <p className="text-[9px] text-gray-600 font-mono">{formatFileSize(f.file_size)}</p>
            </div>
            <button
              onClick={() => deleteMut.mutate(f.id)}
              className="text-gray-600 hover:text-red-400 text-xs ml-2 shrink-0 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
