"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
import { ArrowLeft, Plus, Pencil, Trash2, TrendingUp, Loader2 } from "lucide-react"

interface WeeklyHighlight {
  id: number
  title: string
  category: string
  active: boolean
  order: number
}

export default function WeeklyHighlightsAdmin() {
  const router = useRouter()
  const [highlights, setHighlights] = useState<WeeklyHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState<WeeklyHighlight | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    active: true,
    order: 0,
  })

  useEffect(() => {
    checkAuth()
    loadHighlights()
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

  const loadHighlights = async () => {
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch("http://localhost:8001/api/weekly-highlights/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setHighlights(data)
    } catch (error) {
      console.error("Erro ao carregar destaques:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")

    try {
      const url = editingHighlight
        ? `http://localhost:8001/api/weekly-highlights/${editingHighlight.id}`
        : "http://localhost:8001/api/weekly-highlights"

      const method = editingHighlight ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadHighlights()
      }
    } catch (error) {
      console.error("Erro ao salvar destaque:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (highlight: WeeklyHighlight) => {
    setEditingHighlight(highlight)
    setFormData({
      title: highlight.title,
      category: highlight.category,
      active: highlight.active,
      order: highlight.order,
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/weekly-highlights/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadHighlights()
      }
    } catch (error) {
      console.error("Erro ao deletar destaque:", error)
    }
  }

  const resetForm = () => {
    setEditingHighlight(null)
    setFormData({
      title: "",
      category: "",
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
                <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                Destaques da Semana
              </h1>
              <p className="text-gray-400 text-sm">Gerencie os destaques exibidos na sidebar</p>
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
            Novo Destaque
          </Button>
        </div>

        {/* Highlights List */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-800 text-sm font-semibold text-gray-300 border-b border-gray-700">
            <div className="col-span-2">Titulo</div>
            <div>Categoria</div>
            <div className="text-center">Ordem</div>
            <div className="text-center">Acoes</div>
          </div>

          {highlights.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum destaque cadastrado. Clique em &quot;Novo Destaque&quot; para adicionar.
            </div>
          ) : (
            highlights.map((highlight) => (
              <div
                key={highlight.id}
                className={`grid grid-cols-5 gap-4 p-4 border-b border-gray-700 items-center hover:bg-gray-700/30 transition-colors ${
                  !highlight.active ? "opacity-50" : ""
                }`}
              >
                <div className="col-span-2 text-white font-medium">{highlight.title}</div>
                <div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold border bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
                    {highlight.category}
                  </span>
                </div>
                <div className="text-center text-gray-400">{highlight.order}</div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => handleEdit(highlight)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => {
                      setDeleteId(highlight.id)
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
            <DialogTitle>{editingHighlight ? "Editar Destaque" : "Novo Destaque"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingHighlight ? "Atualize as informacoes do destaque." : "Adicione um novo destaque da semana."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-300">Titulo</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Empresas do Simples estao dispensadas..."
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Categoria</Label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Simples Nacional"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingHighlight ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusao</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir este destaque? Esta acao nao pode ser desfeita.
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
