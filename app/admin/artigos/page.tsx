"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Loader2, Upload, FolderOpen } from "lucide-react"

interface ArticleCategory {
  id: number
  name: string
  description: string | null
  slug: string | null
  active: boolean
  order: number
}

interface Article {
  id: number
  title: string
  excerpt: string | null
  content: string
  category_id: number
  writer_id: number
  image_url: string | null
  file_url: string | null
  active: boolean
  order: number
  created_at: string
  updated_at: string
}

interface Writer {
  id: number
  name: string
  role: string
  image_url: string | null
  active: boolean
}

export default function ArtigosAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [writers, setWriters] = useState<Writer[]>([])

  // Category dialog
  const [showCatDialog, setShowCatDialog] = useState(false)
  const [showCatDeleteDialog, setShowCatDeleteDialog] = useState(false)
  const [editingCat, setEditingCat] = useState<ArticleCategory | null>(null)
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null)
  const [submittingCat, setSubmittingCat] = useState(false)
  const [catForm, setCatForm] = useState({
    name: "",
    description: "",
    slug: "",
    active: true,
    order: 0,
  })

  // Article dialog
  const [showArticleDialog, setShowArticleDialog] = useState(false)
  const [showArticleDeleteDialog, setShowArticleDeleteDialog] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null)
  const [submittingArticle, setSubmittingArticle] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    writer_id: "",
    image_url: "",
    file_url: "",
    active: true,
    order: 0,
  })
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    checkAuth()
    loadData()
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

  const loadData = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) return
    try {
      const [catRes, artRes, writerRes] = await Promise.all([
        fetch("http://localhost:8001/api/article-categories/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8001/api/articles/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8001/api/writers"),
      ])

      if (catRes.ok) {
        const data = await catRes.json()
        setCategories(Array.isArray(data) ? data : [])
      }
      if (artRes.ok) {
        const data = await artRes.json()
        setArticles(Array.isArray(data) ? data : [])
      }
      if (writerRes.ok) {
        const data = await writerRes.json()
        setWriters(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // ========== CATEGORY HANDLERS ==========

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingCat(true)
    const token = localStorage.getItem("admin_token")

    try {
      const url = editingCat
        ? `http://localhost:8001/api/article-categories/${editingCat.id}`
        : "http://localhost:8001/api/article-categories"
      const method = editingCat ? "PUT" : "POST"

      const payload = {
        ...catForm,
        description: catForm.description || null,
        slug: catForm.slug || null,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowCatDialog(false)
        resetCatForm()
        loadData()
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
    } finally {
      setSubmittingCat(false)
    }
  }

  const handleCatEdit = (cat: ArticleCategory) => {
    setEditingCat(cat)
    setCatForm({
      name: cat.name,
      description: cat.description || "",
      slug: cat.slug || "",
      active: cat.active,
      order: cat.order,
    })
    setShowCatDialog(true)
  }

  const handleCatDelete = async () => {
    if (!deleteCatId) return
    const token = localStorage.getItem("admin_token")
    setDeleteError("")
    try {
      const response = await fetch(`http://localhost:8001/api/article-categories/${deleteCatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setShowCatDeleteDialog(false)
        setDeleteCatId(null)
        loadData()
      } else {
        const data = await response.json()
        setDeleteError(data.detail || "Erro ao excluir categoria")
      }
    } catch (error) {
      console.error("Erro ao deletar categoria:", error)
    }
  }

  const resetCatForm = () => {
    setEditingCat(null)
    setCatForm({ name: "", description: "", slug: "", active: true, order: 0 })
  }

  // ========== ARTICLE HANDLERS ==========

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === "image") setUploading(true)
    else setUploadingFile(true)

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
        if (type === "image") {
          setArticleForm((prev) => ({ ...prev, image_url: data.url }))
        } else {
          setArticleForm((prev) => ({ ...prev, file_url: data.url }))
        }
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    } finally {
      if (type === "image") setUploading(false)
      else setUploadingFile(false)
    }
  }

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingArticle(true)
    const token = localStorage.getItem("admin_token")

    try {
      const url = editingArticle
        ? `http://localhost:8001/api/articles/${editingArticle.id}`
        : "http://localhost:8001/api/articles"
      const method = editingArticle ? "PUT" : "POST"

      const payload = {
        title: articleForm.title,
        excerpt: articleForm.excerpt || null,
        content: articleForm.content,
        category_id: parseInt(articleForm.category_id),
        writer_id: parseInt(articleForm.writer_id),
        image_url: articleForm.image_url || null,
        file_url: articleForm.file_url || null,
        active: articleForm.active,
        order: articleForm.order,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowArticleDialog(false)
        resetArticleForm()
        loadData()
      }
    } catch (error) {
      console.error("Erro ao salvar artigo:", error)
    } finally {
      setSubmittingArticle(false)
    }
  }

  const handleArticleEdit = (article: Article) => {
    setEditingArticle(article)
    setArticleForm({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      category_id: article.category_id.toString(),
      writer_id: article.writer_id.toString(),
      image_url: article.image_url || "",
      file_url: article.file_url || "",
      active: article.active,
      order: article.order,
    })
    setShowArticleDialog(true)
  }

  const handleArticleDelete = async () => {
    if (!deleteArticleId) return
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/articles/${deleteArticleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setShowArticleDeleteDialog(false)
        setDeleteArticleId(null)
        loadData()
      }
    } catch (error) {
      console.error("Erro ao deletar artigo:", error)
    }
  }

  const resetArticleForm = () => {
    setEditingArticle(null)
    setArticleForm({
      title: "", excerpt: "", content: "", category_id: "", writer_id: "",
      image_url: "", file_url: "", active: true, order: 0,
    })
  }

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || "—"
  const getWriterName = (id: number) => writers.find((w) => w.id === id)?.name || "—"

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
                <FileText className="w-6 h-6 text-[#FFD700]" />
                Artigos
              </h1>
              <p className="text-gray-400 text-sm">Gerencie artigos e categorias de conteúdo</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="bg-gray-800 border border-gray-700 mb-6">
            <TabsTrigger value="articles" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              Artigos ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              Categorias ({categories.length})
            </TabsTrigger>
          </TabsList>

          {/* ========== ARTICLES TAB ========== */}
          <TabsContent value="articles">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => { resetArticleForm(); setShowArticleDialog(true) }}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Artigo
              </Button>
            </div>

            {articles.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                Nenhum artigo cadastrado. Clique em &quot;Novo Artigo&quot; para adicionar.
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Imagem</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Título</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Categoria</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Redator</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-right p-4 text-gray-400 text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-4">
                          {article.image_url ? (
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-600">
                              <Image src={article.image_url} alt={article.title} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-gray-700 flex items-center justify-center border border-gray-600">
                              <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium text-sm truncate max-w-[250px]">{article.title}</p>
                          {article.excerpt && (
                            <p className="text-gray-500 text-xs truncate max-w-[250px] mt-0.5">{article.excerpt}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                            {getCategoryName(article.category_id)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-300">{getWriterName(article.writer_id)}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${article.active ? "bg-green-500/20 text-green-400" : "bg-gray-600/30 text-gray-500"}`}>
                            {article.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700" onClick={() => handleArticleEdit(article)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => { setDeleteArticleId(article.id); setShowArticleDeleteDialog(true) }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* ========== CATEGORIES TAB ========== */}
          <TabsContent value="categories">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => { resetCatForm(); setShowCatDialog(true) }}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            {categories.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                Nenhuma categoria cadastrada. Crie categorias para organizar os artigos.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`bg-gray-800/50 rounded-xl border border-gray-700 p-5 transition-all hover:border-[#FFD700]/50 ${!cat.active ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{cat.name}</h3>
                        {cat.description && <p className="text-gray-400 text-sm mt-1">{cat.description}</p>}
                        {cat.slug && <p className="text-gray-500 text-xs mt-1">/{cat.slug}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8" onClick={() => handleCatEdit(cat)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8" onClick={() => { setDeleteCatId(cat.id); setDeleteError(""); setShowCatDeleteDialog(true) }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <span>Ordem: {cat.order}</span>
                      <span>•</span>
                      <span>{cat.active ? "Ativa" : "Inativa"}</span>
                      <span>•</span>
                      <span>{articles.filter((a) => a.category_id === cat.id).length} artigos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ========== CATEGORY DIALOG ========== */}
      <Dialog open={showCatDialog} onOpenChange={setShowCatDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCat ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCat ? "Atualize as informações da categoria." : "Crie uma nova categoria para organizar artigos."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCatSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-300">Nome</Label>
              <Input
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                placeholder="Ex: Legislação"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Descrição</Label>
              <Input
                value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                placeholder="Descrição opcional"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Slug (URL)</Label>
              <Input
                value={catForm.slug}
                onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                placeholder="Ex: legislacao"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Ordem</Label>
              <Input
                type="number"
                value={catForm.order}
                onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })}
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Ativa</Label>
              <Switch checked={catForm.active} onCheckedChange={(checked) => setCatForm({ ...catForm, active: checked })} />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => setShowCatDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submittingCat} className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
                {submittingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCat ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========== ARTICLE DIALOG ========== */}
      <Dialog open={showArticleDialog} onOpenChange={setShowArticleDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Editar Artigo" : "Novo Artigo"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingArticle ? "Atualize as informações do artigo." : "Crie um novo artigo."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleArticleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-300">Título</Label>
              <Input
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                placeholder="Título do artigo"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Resumo</Label>
              <Textarea
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                placeholder="Breve descrição do artigo"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-gray-300">Conteúdo</Label>
              <Textarea
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                placeholder="Conteúdo completo do artigo"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                rows={8}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Categoria</Label>
                <Select
                  value={articleForm.category_id}
                  onValueChange={(value) => setArticleForm({ ...articleForm, category_id: value })}
                >
                  <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.filter((c) => c.active).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="text-gray-200">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Redator</Label>
                <Select
                  value={articleForm.writer_id}
                  onValueChange={(value) => setArticleForm({ ...articleForm, writer_id: value })}
                >
                  <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white mt-1">
                    <SelectValue placeholder="Selecione um redator" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {writers.filter((w) => w.active).map((writer) => (
                      <SelectItem key={writer.id} value={writer.id.toString()} className="text-gray-200">
                        {writer.name} — {writer.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Imagem de Capa</Label>
              <div className="mt-2 space-y-3">
                {articleForm.image_url && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-600">
                    <Image src={articleForm.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={articleForm.image_url}
                    onChange={(e) => setArticleForm({ ...articleForm, image_url: e.target.value })}
                    placeholder="URL da imagem ou faça upload"
                    className="bg-gray-900/50 border-gray-600 text-white flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "image")} />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Arquivo PDF (opcional)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={articleForm.file_url}
                  onChange={(e) => setArticleForm({ ...articleForm, file_url: e.target.value })}
                  placeholder="URL do PDF ou faça upload"
                  className="bg-gray-900/50 border-gray-600 text-white flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleUpload(e, "file")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Ordem</Label>
                <Input
                  type="number"
                  value={articleForm.order}
                  onChange={(e) => setArticleForm({ ...articleForm, order: parseInt(e.target.value) || 0 })}
                  className="bg-gray-900/50 border-gray-600 text-white mt-1"
                />
              </div>
              <div className="flex items-center justify-between pt-6">
                <Label className="text-gray-300">Ativo</Label>
                <Switch checked={articleForm.active} onCheckedChange={(checked) => setArticleForm({ ...articleForm, active: checked })} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => setShowArticleDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submittingArticle} className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
                {submittingArticle ? <Loader2 className="w-4 h-4 animate-spin" /> : editingArticle ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========== DELETE CATEGORY DIALOG ========== */}
      <AlertDialog open={showCatDeleteDialog} onOpenChange={setShowCatDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
            {deleteError && (
              <p className="text-red-400 text-sm mt-2">{deleteError}</p>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCatDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ========== DELETE ARTICLE DIALOG ========== */}
      <AlertDialog open={showArticleDeleteDialog} onOpenChange={setShowArticleDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleArticleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
