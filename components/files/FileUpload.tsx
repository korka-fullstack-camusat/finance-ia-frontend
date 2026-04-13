"use client";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadFile, deleteFile, fetchFiles } from "@/lib/api";
import { formatFileSize } from "@/lib/utils";
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
      <h3 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest">
        Fichiers
      </h3>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center h-14 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? "border-[#2563EB] bg-[#EFF6FF]"
            : "border-[#E2E8F0] hover:border-[#2563EB]/50 hover:bg-[#F8FAFC]"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls,.pdf"
          onChange={onInput}
        />
        {uploading ? (
          <p className="text-[11px] text-[#2563EB] font-medium animate-pulse">Envoi...</p>
        ) : (
          <>
            <span className="text-base">📂</span>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">CSV · XLSX · PDF</p>
          </>
        )}
      </label>

      {files.length > 0 && (
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-2 py-1.5 border border-[#E2E8F0]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#0F172A] truncate font-medium">{f.original_name}</p>
                <p className="text-[9px] text-[#94A3B8]">{formatFileSize(f.file_size)}</p>
              </div>
              <button
                onClick={() => deleteMut.mutate(f.id)}
                className="text-[#94A3B8] hover:text-red-400 text-xs ml-2 shrink-0 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
