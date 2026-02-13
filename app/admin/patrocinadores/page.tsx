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
import { ArrowLeft, Plus, Pencil, Trash2, Award, Loader2, Upload, ExternalLink } from "lucide-react"

interface Sponsor {
  id: number
  name: string
  logo_url: string | null
  website_url: string | null
  active: boolean
  order: number
}

export default function PatrocinadoresAdmin() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    active: true,
    order: 0,
  })

  useEffect(() => {
    checkAuth()
    loadSponsors()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.push("/admin"); return }
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

  const loadSponsors = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) return
    try {
      const response = await fetch("http://localhost:8001/api/sponsors/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setSponsors(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Erro ao carregar patrocinadores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData((prev) => ({ ...prev, logo_url: data.url }))
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
      const url = editingSponsor
        ? `http://localhost:8001/api/sponsors/${editingSponsor.id}`
        : "http://localhost:8001/api/sponsors"
      const method = editingSponsor ? "PUT" : "POST"
      const payload = {
        ...formData,
        logo_url: formData.logo_url || null,
        website_url: formData.website_url || null,
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadSponsors()
      }
    } catch (error) {
      console.error("Erro ao salvar patrocinador:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      logo_url: sponsor.logo_url || "",
      website_url: sponsor.website_url || "",
      active: sponsor.active,
      order: sponsor.order,
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/sponsors/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadSponsors()
      }
    } catch (error) {
      console.error("Erro ao deletar patrocinador:", error)
    }
  }

  const resetForm = () => {
    setEditingSponsor(null)
    setFormData({ name: "", logo_url: "", website_url: "", active: true, order: 0 })
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
                <Award className="w-6 h-6 text-[#FFD700]" />
                Patrocinadores
              </h1>
              <p className="text-gray-400 text-sm">Gerencie os patrocinadores exibidos no rodapé do site</p>
            </div>
          </div>
          <Button
            onClick={() => { resetForm(); setShowDialog(true) }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Patrocinador
          </Button>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              Nenhum patrocinador cadastrado. Clique em &quot;Novo Patrocinador&quot; para adicionar.
            </div>
          ) : (
            sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className={`bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex flex-col items-center gap-4 transition-all hover:border-[#FFD700]/50 ${
                  !sponsor.active ? "opacity-50" : ""
                }`}
              >
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
                  {sponsor.logo_url ? (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <Award className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold">{sponsor.name}</h3>
                  {sponsor.website_url && (
                    <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FFD700] hover:underline flex items-center justify-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" />
                      Visitar site
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Ordem: {sponsor.order}</span>
                  <span>•</span>
                  <span>{sponsor.active ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" onClick={() => handleEdit(sponsor)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => { setDeleteId(sponsor.id); setShowDeleteDialog(true) }}>
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
            <DialogTitle>{editingSponsor ? "Editar Patrocinador" : "Novo Patrocinador"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingSponsor ? "Atualize as informações do patrocinador." : "Adicione um novo patrocinador."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-300">Nome da Empresa</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Empresa ABC"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Logo</Label>
              <div className="mt-2 space-y-3">
                {formData.logo_url && (
                  <div className="flex justify-center">
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-white p-2">
                      <Image src={formData.logo_url} alt="Preview" fill className="object-contain p-2" />
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="URL da logo ou faça upload"
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
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Site (URL)</Label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://www.empresa.com.br"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
              />
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
              <Button type="button" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSponsor ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir este patrocinador? Esta ação não pode ser desfeita.
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
