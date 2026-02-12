"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Globe, RefreshCw } from "lucide-react"

interface NewsSource {
  id: number
  name: string
  url: string
  source_type: string
  active: boolean
  last_fetch: string | null
  created_at: string
}

export default function AdminSources() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sources, setSources] = useState<NewsSource[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    url: "",
  })

  useEffect(() => {
    checkAuth()
    loadSources()
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

  const loadSources = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/sources")
      const data = await response.json()
      setSources(data)
    } catch (error) {
      console.error("Erro ao carregar fontes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")

    try {
      const url = editingSource 
        ? `http://localhost:8001/api/sources/${editingSource.id}`
        : "http://localhost:8001/api/sources"
      
      const method = editingSource ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadSources()
      } else {
        const error = await response.json()
        alert(error.detail || "Erro ao salvar fonte")
      }
    } catch (error) {
      console.error("Erro ao salvar fonte:", error)
      alert("Erro ao salvar fonte")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: NewsSource) => {
    setEditingSource(item)
    setFormData({
      name: item.name,
      url: item.url,
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/sources/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadSources()
      }
    } catch (error) {
      console.error("Erro ao deletar fonte:", error)
    }
  }

  const handleFetchNews = async () => {
    setFetching(true)
    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/fetch-news", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Erro ao buscar notícias no servidor")
        return
      }

      alert(data.message)
      loadSources()
    } catch (error) {
      console.error("Erro ao buscar notícias:", error)
      alert("Erro de conexão ao buscar notícias. Verifique se o servidor backend está rodando.")
    } finally {
      setFetching(false)
    }
  }

  const resetForm = () => {
    setEditingSource(null)
    setFormData({
      name: "",
      url: "",
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
            <h1 className="text-lg font-bold text-white">Fontes de Notícias (IA)</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Card className="bg-blue-500/10 border-blue-500/30 mb-6">
          <CardContent className="p-6">
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Como funciona?
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Configure até 10 fontes de notícias (G1, Folha, UOL, etc). A IA irá buscar automaticamente notícias relacionadas à reforma tributária, reescrevê-las profissionalmente e enviá-las para aprovação.
            </p>
            <p className="text-gray-400 text-xs">
              Notícias pendentes ficam disponíveis por 2 dias para aprovação antes de serem excluídas automaticamente.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Fontes Configuradas</h2>
            <p className="text-gray-400">Total: {sources.length} / 10 fontes</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleFetchNews}
              disabled={fetching || sources.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {fetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Buscar Notícias Agora
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                resetForm()
                setShowDialog(true)
              }}
              disabled={sources.length >= 10}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Fonte
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">URL</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Última Busca</TableHead>
                  <TableHead className="text-gray-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((item) => (
                  <TableRow key={item.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-white font-medium">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-gray-300 truncate max-w-md">{item.url}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {item.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {item.last_fetch ? new Date(item.last_fetch).toLocaleString("pt-BR") : "Nunca"}
                    </TableCell>
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
            
            {sources.length === 0 && (
              <div className="p-12 text-center">
                <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma fonte cadastrada</p>
                <p className="text-gray-500 text-sm">Adicione fontes para começar a buscar notícias automaticamente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSource ? "Editar Fonte" : "Nova Fonte"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Adicione sites de notícias para a IA buscar conteúdo automaticamente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Nome da Fonte</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="G1, Folha, UOL, etc"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">URL do Site</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="https://g1.globo.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole a URL principal do site de notícias
              </p>
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSource ? "Atualizar" : "Adicionar"}
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
              Tem certeza que deseja excluir esta fonte? Esta ação não pode ser desfeita.
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
