"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react"

interface News {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  badge: string
  badge_color: string
  date: string
  image_url: string | null
  tags: string[]
  source: string
  created_at: string
}

export default function AdminNews() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<News[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Reforma Tributária",
    badge: "NOVO",
    badge_color: "default",
    date: new Date().toLocaleDateString("pt-BR"),
    image_url: "",
    tags: "",
    source: "Portal Reforma Tributária News"
  })

  useEffect(() => {
    checkAuth()
    loadNews()
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

  const loadNews = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/news")
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Erro ao carregar notícias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)

    const payload = {
      ...formData,
      tags: tagsArray
    }

    try {
      const url = editingNews 
        ? `http://localhost:8001/api/news/${editingNews.id}`
        : "http://localhost:8001/api/news"
      
      const method = editingNews ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadNews()
      }
    } catch (error) {
      console.error("Erro ao salvar notícia:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: News) => {
    setEditingNews(item)
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      badge: item.badge,
      badge_color: item.badge_color,
      date: item.date,
      image_url: item.image_url || "",
      tags: item.tags.join(", "),
      source: item.source
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/news/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadNews()
      }
    } catch (error) {
      console.error("Erro ao deletar notícia:", error)
    }
  }

  const resetForm = () => {
    setEditingNews(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Reforma Tributária",
      badge: "NOVO",
      badge_color: "default",
      date: new Date().toLocaleDateString("pt-BR"),
      image_url: "",
      tags: "",
      source: "Portal Reforma Tributária News"
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
            <h1 className="text-lg font-bold text-white">Gerenciar Notícias</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Notícias</h2>
            <p className="text-gray-400">Total: {news.length} notícias</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowDialog(true)
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Notícia
          </Button>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300">Título</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Badge</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-white font-medium max-w-md truncate">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-gray-300">{item.category}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-xs font-semibold">
                        {item.badge}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeleteId(item.id)
                            setShowDeleteDialog(true)
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingNews ? "Editar Notícia" : "Nova Notícia"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os campos abaixo para {editingNews ? "atualizar" : "criar"} a notícia
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={6}
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
                    <SelectItem value="Legislação">Legislação</SelectItem>
                    <SelectItem value="Notícias">Notícias</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Data</label>
                <Input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Fonte</label>
                <Input
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="bg-gray-900 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">URL da Imagem (opcional)</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Tags (separadas por vírgula)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="reforma, tributação, ibs"
              />
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingNews ? "Atualizar" : "Criar"}
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
              Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
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
