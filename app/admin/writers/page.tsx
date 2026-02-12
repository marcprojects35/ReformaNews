"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Pencil, Trash2, Users, Loader2, Upload } from "lucide-react"

interface Writer {
  id: number
  name: string
  role: string
  image_url: string | null
  active: boolean
  order: number
}

export default function WritersAdmin() {
  const router = useRouter()
  const [writers, setWriters] = useState<Writer[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingWriter, setEditingWriter] = useState<Writer | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "Colunista",
    image_url: "",
    active: true,
    order: 0,
  })

  useEffect(() => {
    checkAuth()
    loadWriters()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Unauthorized")
    } catch {
      localStorage.removeItem("admin_token")
      router.push("/admin")
    }
  }

  const loadWriters = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) return
    try {
      const response = await fetch("http://localhost:8001/api/writers/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setWriters(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Erro ao carregar redatores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const token = localStorage.getItem("admin_token")

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("http://localhost:8001/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")

    try {
      const url = editingWriter
        ? `http://localhost:8001/api/writers/${editingWriter.id}`
        : "http://localhost:8001/api/writers"

      const method = editingWriter ? "PUT" : "POST"

      const payload = {
        ...formData,
        image_url: formData.image_url || null,
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadWriters()
      }
    } catch (error) {
      console.error("Erro ao salvar redator:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (writer: Writer) => {
    setEditingWriter(writer)
    setFormData({
      name: writer.name,
      role: writer.role,
      image_url: writer.image_url || "",
      active: writer.active,
      order: writer.order,
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/writers/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadWriters()
      }
    } catch (error) {
      console.error("Erro ao deletar redator:", error)
    }
  }

  const resetForm = () => {
    setEditingWriter(null)
    setFormData({
      name: "",
      role: "Colunista",
      image_url: "",
      active: true,
      order: 0,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-[#FFD700]" />
                Redatores
              </h1>
              <p className="text-gray-400 text-sm">Gerencie os redatores exibidos na homepage</p>
            </div>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowDialog(true)
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Redator
          </Button>
        </div>

        {/* Writers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writers.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700">
              Nenhum redator cadastrado. Clique em &quot;Novo Redator&quot; para adicionar.
            </div>
          ) : (
            writers.map((writer) => (
              <div
                key={writer.id}
                className={`bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex flex-col items-center gap-4 transition-all hover:border-[#FFD700]/50 ${
                  !writer.active ? "opacity-50" : ""
                }`}
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#FFD700]/70">
                  {writer.image_url ? (
                    <Image
                      src={writer.image_url}
                      alt={writer.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold">{writer.name}</h3>
                  <span className="text-xs text-[#FFD700]">{writer.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Ordem: {writer.order}</span>
                  <span>•</span>
                  <span>{writer.active ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => handleEdit(writer)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => {
                      setDeleteId(writer.id)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingWriter ? "Editar Redator" : "Novo Redator"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingWriter ? "Atualize as informações do redator." : "Adicione um novo redator."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-300">Nome</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Charles Gularte"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Cargo / Função</Label>
              <Input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Colunista"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Foto</Label>
              <div className="mt-2 space-y-3">
                {formData.image_url && (
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#FFD700]/50">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="URL da imagem ou faça upload"
                    className="bg-gray-900/50 border-gray-600 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadImage}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Ordem</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Ativo</Label>
              <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingWriter ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir este redator? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
