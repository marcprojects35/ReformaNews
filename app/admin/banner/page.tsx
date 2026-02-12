"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Trash2, Loader2, ChevronUp, ChevronDown, Upload } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

interface BannerSlide {
  id: number
  image_url: string
  alt: string
  order: number
  active: boolean
  created_at: string
}

export default function AdminBanner() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [slides, setSlides] = useState<BannerSlide[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    image_url: "",
    alt: "",
  })

  useEffect(() => {
    checkAuth()
    loadSlides()
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

  const loadSlides = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/banner")
      const data = await response.json()
      setSlides(data.sort((a: BannerSlide, b: BannerSlide) => a.order - b.order))
    } catch (error) {
      console.error("Erro ao carregar slides:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")
    
    const payload = {
      ...formData,
      order: slides.length,
      active: true
    }

    try {
      const response = await fetch("http://localhost:8001/api/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setShowDialog(false)
        resetForm()
        loadSlides()
      }
    } catch (error) {
      console.error("Erro ao salvar slide:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/banner/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadSlides()
      }
    } catch (error) {
      console.error("Erro ao deletar slide:", error)
    }
  }

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSlides.length) return

    // Swap
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]

    // Update orders
    const reorderData = newSlides.map((slide, idx) => ({
      id: slide.id,
      order: idx
    }))

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch("http://localhost:8001/api/banner/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ slide_orders: reorderData })
      })

      if (response.ok) {
        loadSlides()
      }
    } catch (error) {
      console.error("Erro ao reordenar slides:", error)
    }
  }

  const toggleActive = async (slide: BannerSlide) => {
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/banner/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ active: !slide.active })
      })

      if (response.ok) {
        loadSlides()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      image_url: "",
      alt: "",
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
            <h1 className="text-lg font-bold text-white">Gerenciar Banner</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Slides do Banner</h2>
            <p className="text-gray-400">Total: {slides.length} slides</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowDialog(true)
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Slide
          </Button>
        </div>

        <div className="space-y-4">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image Preview */}
                  <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    <Image
                      src={slide.image_url}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                    />
                    {!slide.active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold">INATIVO</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">{slide.alt}</h3>
                      <p className="text-gray-400 text-sm mb-2">Ordem: {index + 1}</p>
                      <p className="text-gray-500 text-xs truncate">{slide.image_url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(slide)}
                        className={`border-gray-600 ${
                          slide.active 
                            ? "text-green-400 hover:text-green-300" 
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {slide.active ? "Ativo" : "Inativo"}
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(index, "up")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(index, "down")}
                      disabled={index === slides.length - 1}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <div className="border-t border-gray-700 my-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteId(slide.id)
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

          {slides.length === 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum slide cadastrado</p>
                <p className="text-gray-500 text-sm">Clique em "Novo Slide" para adicionar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Slide</DialogTitle>
            <DialogDescription className="text-gray-400">
              Adicione uma nova imagem ao carrossel do banner
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Imagem
              </label>
              <FileUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                accept="image/*"
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Texto Alternativo
              </label>
              <Input
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="Descrição da imagem"
                required
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
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
              Tem certeza que deseja excluir este slide? Esta ação não pode ser desfeita.
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
