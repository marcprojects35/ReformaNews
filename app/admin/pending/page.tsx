"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Edit, Check, Trash2, Loader2, Clock, Eye, Sparkles } from "lucide-react"

interface PendingNews {
  id: number
  original_title: string
  original_url: string
  original_source: string
  title: string
  excerpt: string
  content: string
  category: string
  badge: string
  badge_color: string
  date: string
  image_url: string | null
  tags: string[]
  expires_at: string
  created_at: string
  fetched_at: string
}

export default function AdminPending() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<PendingNews[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingNews, setEditingNews] = useState<PendingNews | null>(null)
  const [previewNews, setPreviewNews] = useState<PendingNews | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [publishing, setPublishing] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    badge: "",
    tags: ""
  })

  useEffect(() => {
    checkAuth()
    loadPending()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadPending, 30000)
    return () => clearInterval(interval)
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

  const loadPending = async () => {
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch("http://localhost:8001/api/pending", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await response.json()
      setPending(data)
    } catch (error) {
      console.error("Erro ao carregar pendentes:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff < 0) return "Expirado"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    
    return `${hours}h ${minutes}m`
  }

  const handleEdit = (item: PendingNews) => {
    setEditingNews(item)
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      badge: item.badge,
      tags: item.tags.join(", ")
    })
    setShowEditDialog(true)
  }

  const handlePreview = (item: PendingNews) => {
    setPreviewNews(item)
    setShowPreviewDialog(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNews) return
    
    setSubmitting(true)
    const token = localStorage.getItem("admin_token")
    
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)

    try {
      const response = await fetch(`http://localhost:8001/api/pending/${editingNews.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      })

      if (response.ok) {
        setShowEditDialog(false)
        setEditingNews(null)
        loadPending()
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePublish = async (id: number) => {
    setPublishing(id)
    const token = localStorage.getItem("admin_token")
    
    try {
      const response = await fetch(`http://localhost:8001/api/pending/${id}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        alert("Notícia publicada com sucesso!")
        loadPending()
      }
    } catch (error) {
      console.error("Erro ao publicar:", error)
      alert("Erro ao publicar notícia")
    } finally {
      setPublishing(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/pending/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadPending()
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
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
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              Notícias Pendentes (IA)
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Aguardando Aprovação</h2>
            <p className="text-gray-400">{pending.length} notícias pendentes • Auto-refresh a cada 30s</p>
          </div>
        </div>

        {pending.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma notícia pendente no momento</p>
              <p className="text-gray-500 text-sm mt-2">
                A IA buscará notícias automaticamente a cada hora ou você pode buscar manualmente em Fontes
              </p>
              <Link href="/admin/sources">
                <Button className="mt-4 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900">
                  Ir para Fontes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pending.map((item) => {
              const timeRemaining = getTimeRemaining(item.expires_at)
              const isExpiringSoon = timeRemaining.includes("h") && parseInt(timeRemaining) < 6
              
              return (
                <Card key={item.id} className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700]/50 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900">
                            {item.badge}
                          </Badge>
                          <span className="text-sm text-gray-400">{item.category}</span>
                          <Badge variant="outline" className={`text-xs ${
                            isExpiringSoon ? "border-red-500 text-red-400" : "border-gray-600 text-gray-400"
                          }`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {timeRemaining}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white mb-2 line-clamp-2">
                          {item.title}
                        </CardTitle>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Fonte: {item.original_source}</span>
                          <span>•</span>
                          <span>Gerado em: {new Date(item.fetched_at).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(item)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="border-blue-600 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePublish(item.id)}
                        disabled={publishing === item.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {publishing === item.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        Publicar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteId(item.id)
                          setShowDeleteDialog(true)
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Notícia</DialogTitle>
            <DialogDescription className="text-gray-400">
              Faça ajustes antes de publicar
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Resumo</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Conteúdo</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                rows={8}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Categoria</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reforma Tributária">Reforma Tributária</SelectItem>
                    <SelectItem value="IBS/CBS">IBS/CBS</SelectItem>
                    <SelectItem value="GTIN">GTIN</SelectItem>
                    <SelectItem value="NF-e">NF-e</SelectItem>
                    <SelectItem value="Legislação">Legislação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Badge</label>
                <Select value={formData.badge} onValueChange={(value) => setFormData({ ...formData, badge: value })}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOVO">NOVO</SelectItem>
                    <SelectItem value="URGENTE">URGENTE</SelectItem>
                    <SelectItem value="ATUALIZADO">ATUALIZADO</SelectItem>
                    <SelectItem value="DESTAQUE">DESTAQUE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Tags (separadas por vírgula)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewNews && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900">
                    {previewNews.badge}
                  </Badge>
                  <span className="text-sm text-gray-400">{previewNews.category}</span>
                </div>
                <DialogTitle className="text-2xl text-white">{previewNews.title}</DialogTitle>
                <p className="text-gray-400">{previewNews.excerpt}</p>
              </DialogHeader>
              <div className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  {previewNews.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-300">{para}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                  {previewNews.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="border-[#FFD700] text-[#FFD700]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500 pt-2">
                  Fonte original: {previewNews.original_source}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir esta notícia pendente?
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
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
