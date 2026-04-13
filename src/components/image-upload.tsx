"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  file?: File | null;
  onFileChange?: (file: File | null) => void;
  onChange?: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, file, onFileChange, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [file, value]);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Tipo de archivo no permitido. Solo JPG, PNG, WEBP, GIF");
      return;
    }

    const maxSize = 4 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("El archivo es muy grande. Máximo 4MB");
      return;
    }

    setError(null);
    onFileChange?.(selectedFile);
    onChange?.("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    onFileChange?.(null);
    onChange?.("");
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const displayUrl = preview || value;

  return (
    <div className="space-y-2">
      {displayUrl ? (
        <div className="relative inline-block w-full max-w-md">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={displayUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
            disabled={disabled || uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          {file && (
            <p className="text-sm text-muted-foreground mt-1">
              Nuevo archivo: {file.name}
            </p>
          )}
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-muted-foreground/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            disabled={disabled || uploading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <span className="text-sm">Haz click o arrastra una imagen</span>
            <span className="text-xs text-muted-foreground/70">JPG, PNG, WEBP, GIF (max 4MB)</span>
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}