"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Loader2, Newspaper, Edit, FileText, Eye, Download } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

interface Newsletter {
  id: number
  title: string
  edition: string
  description: string
  highlight: string
  image_url: string
  pdf_url: string
  active: boolean
  created_at: string
}

export default function AdminNewsletter() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    edition: "",
    description: "",
    highlight: "",
    image_url: "",
    pdf_url: "",
    active: true
  })

  useEffect(() => {
    checkAuth()
    loadNewsletters()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/check", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!response.ok) throw new Error("Unauthorized")
    } catch (error) {
      localStorage.removeItem("admin_token")
      router.push("/admin")
    }
  }

  const loadNewsletters = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("http://localhost:8001/api/newsletters", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setNewsletters(data)
      }
    } catch (error) {
      console.error("Erro ao carregar newsletters:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")
    const isEditing = editingId !== null

    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:8001/api/newsletter/${editingId}`
          : "http://localhost:8001/api/newsletter",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      )

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadNewsletters()
      }
    } catch (error) {
      console.error("Erro ao salvar newsletter:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (newsletter: Newsletter) => {
    setFormData({
      title: newsletter.title,
      edition: newsletter.edition,
      description: newsletter.description,
      highlight: newsletter.highlight,
      image_url: newsletter.image_url,
      pdf_url: newsletter.pdf_url,
      active: newsletter.active
    })
    setEditingId(newsletter.id)
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/newsletter/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadNewsletters()
      }
    } catch (error) {
      console.error("Erro ao deletar newsletter:", error)
    }
  }

  const toggleActive = async (newsletter: Newsletter) => {
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/newsletter/${newsletter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ active: !newsletter.active })
      })

      if (response.ok) {
        loadNewsletters()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      edition: "",
      description: "",
      highlight: "",
      image_url: "",
      pdf_url: "",
      active: true
    })
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-white">Gerenciar Newsletter / Jornal</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Edições do Jornal</h2>
            <p className="text-gray-400">Total: {newsletters.length} edições</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowDialog(true)
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Edição
          </Button>
        </div>

        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <Card key={newsletter.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image Preview */}
                  <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    {newsletter.image_url ? (
                      <Image
                        src={newsletter.image_url}
                        alt={newsletter.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    {!newsletter.active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">INATIVO</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{newsletter.title}</h3>
                        {newsletter.active && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Ativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#FFD700] text-sm font-medium mb-2">{newsletter.edition}</p>
                      <p className="text-gray-400 text-sm line-clamp-2">{newsletter.description}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(newsletter)}
                        className={`border-gray-600 ${
                          newsletter.active
                            ? "text-green-400 hover:text-green-300"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {newsletter.active ? "Desativar" : "Ativar"}
                      </Button>
                      {newsletter.pdf_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(newsletter.pdf_url, "_blank")}
                          className="border-gray-600 text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver PDF
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(newsletter)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(newsletter.id)
                        setShowDeleteDialog(true)
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {newsletters.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma edição cadastrada</p>
                <p className="text-gray-500 text-sm">Clique em "Nova Edição" para adicionar um jornal</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? "Editar Edição" : "Nova Edição do Jornal"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingId
                ? "Atualize as informações da edição do jornal"
                : "Adicione uma nova edição do jornal para exibir no site"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Título *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-900 border-gray-600 text-white"
                  placeholder="Portal News"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Edição *
                </label>
                <Input
                  value={formData.edition}
                  onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                  className="bg-gray-900 border-gray-600 text-white"
                  placeholder="Edição #01 - Janeiro 2026"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Descrição *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white min-h-[80px]"
                placeholder="Descrição do conteúdo desta edição..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Destaque
              </label>
              <Input
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="Texto de destaque da edição"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aparece como badge de destaque no card
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Imagem de Capa *
              </label>
              <FileUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                accept="image/*"
                placeholder="https://exemplo.com/imagem-capa.jpg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                PDF do Jornal *
              </label>
              <FileUpload
                value={formData.pdf_url}
                onChange={(url) => setFormData({ ...formData, pdf_url: url })}
                accept="application/pdf"
                placeholder="https://exemplo.com/jornal.pdf"
                required
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-[#FFD700] focus:ring-[#FFD700]"
              />
              <label htmlFor="active" className="text-sm text-gray-300">
                Ativar esta edição (apenas uma edição pode estar ativa)
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  "Salvar Alterações"
                ) : (
                  "Adicionar Edição"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir esta edição do jornal? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
