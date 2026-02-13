"use client"

import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Link, X, Loader2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  required?: boolean
  placeholder?: string
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  label,
  required = false,
  placeholder = "https://exemplo.com/imagem.jpg",
  className,
}: FileUploadProps) {
  const [mode, setMode] = useState<"url" | "upload">(value && !value.startsWith("/uploads/") ? "url" : "upload")
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isImage = accept?.includes("image")
  const isPdf = accept?.includes("pdf")

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true)
    setUploadError(null)

    try {
      const token = localStorage.getItem("admin_token")
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8001/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao fazer upload")
      }

      const data = await response.json()
      onChange(data.url)
    } catch {
      setUploadError("Erro ao fazer upload do ficheiro")
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClear = useCallback(() => {
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [onChange])

  const showPreview = value && (isImage || (!isPdf && !value.endsWith(".pdf")))
  const showPdfPreview = value && (isPdf || value.endsWith(".pdf"))

  return (
    <div className={cn("space-y-2", className)}>
      {/* Mode toggle */}
      <div className="flex gap-1 bg-gray-900 rounded-md p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors",
            mode === "upload"
              ? "bg-[#FFD700] text-gray-900"
              : "text-gray-400 hover:text-white"
          )}
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors",
            mode === "url"
              ? "bg-[#FFD700] text-gray-900"
              : "text-gray-400 hover:text-white"
          )}
        >
          <Link className="w-3 h-3" />
          URL
        </button>
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-gray-900 border-gray-600 text-white"
            placeholder={placeholder}
            required={required}
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole a URL completa do ficheiro
          </p>
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
              dragOver
                ? "border-[#FFD700] bg-[#FFD700]/10"
                : "border-gray-600 hover:border-gray-500 bg-gray-900/50",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
                <span className="text-xs text-gray-400">A enviar...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">
                  Clique ou arraste um ficheiro aqui
                </span>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-xs text-red-400 mt-1">{uploadError}</p>
          )}
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="relative mt-2 p-2 bg-gray-900 rounded-lg">
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 p-1 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <p className="text-xs text-gray-400 mb-1">Preview:</p>
          <img
            src={value.startsWith("/uploads/") ? `http://localhost:8001${value}` : value}
            alt="Preview"
            className="max-h-32 object-contain rounded"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}

      {showPdfPreview && (
        <div className="relative mt-2 p-3 bg-gray-900 rounded-lg flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 p-1 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <FileText className="w-8 h-8 text-red-400" />
          <div>
            <p className="text-xs text-gray-400">PDF carregado</p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">{value}</p>
          </div>
        </div>
      )}
    </div>
  )
}
