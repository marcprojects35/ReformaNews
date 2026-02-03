"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { ArrowLeft, Plus, Pencil, Trash2, Calendar, Loader2 } from "lucide-react"

interface FiscalEvent {
  id: number
  date: string
  month: string
  event: string
  event_type: string
  active: boolean
  order: number
}

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
const EVENT_TYPES = [
  { value: "federal", label: "Federal" },
  { value: "estadual", label: "Estadual" },
  { value: "municipal", label: "Municipal" },
  { value: "trabalhista", label: "Trabalhista" },
]

export default function FiscalCalendarAdmin() {
  const router = useRouter()
  const [events, setEvents] = useState<FiscalEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<FiscalEvent | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    month: "JAN",
    event: "",
    event_type: "federal",
    active: true,
    order: 0,
  })

  useEffect(() => {
    checkAuth()
    loadEvents()
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

  const loadEvents = async () => {
    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch("http://localhost:8001/api/fiscal-calendar/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Erro ao carregar calendário:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("admin_token")

    try {
      const url = editingEvent
        ? `http://localhost:8001/api/fiscal-calendar/${editingEvent.id}`
        : "http://localhost:8001/api/fiscal-calendar"

      const method = editingEvent ? "PUT" : "POST"

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
        loadEvents()
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event: FiscalEvent) => {
    setEditingEvent(event)
    setFormData({
      date: event.date,
      month: event.month,
      event: event.event,
      event_type: event.event_type,
      active: event.active,
      order: event.order,
    })
    setShowDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const token = localStorage.getItem("admin_token")
    try {
      const response = await fetch(`http://localhost:8001/api/fiscal-calendar/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        setDeleteId(null)
        loadEvents()
      }
    } catch (error) {
      console.error("Erro ao deletar evento:", error)
    }
  }

  const resetForm = () => {
    setEditingEvent(null)
    setFormData({
      date: "",
      month: "JAN",
      event: "",
      event_type: "federal",
      active: true,
      order: 0,
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "federal":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "estadual":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "municipal":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "trabalhista":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
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
                <Calendar className="w-6 h-6 text-[#FFD700]" />
                Calendário Fiscal
              </h1>
              <p className="text-gray-400 text-sm">Gerencie as datas e eventos do calendário fiscal</p>
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
            Novo Evento
          </Button>
        </div>

        {/* Events List */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-800 text-sm font-semibold text-gray-300 border-b border-gray-700">
            <div>Data</div>
            <div>Mês</div>
            <div className="col-span-2">Evento</div>
            <div>Tipo</div>
            <div className="text-center">Ações</div>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum evento cadastrado. Clique em &quot;Novo Evento&quot; para adicionar.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`grid grid-cols-6 gap-4 p-4 border-b border-gray-700 items-center hover:bg-gray-700/30 transition-colors ${
                  !event.active ? "opacity-50" : ""
                }`}
              >
                <div className="text-white font-bold text-lg">{event.date}</div>
                <div className="text-gray-300">{event.month}</div>
                <div className="col-span-2 text-white">{event.event}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getEventTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => handleEdit(event)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => {
                      setDeleteId(event.id)
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
            <DialogTitle>{editingEvent ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingEvent ? "Atualize as informações do evento fiscal." : "Adicione um novo evento ao calendário fiscal."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Dia</Label>
                <Input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="10"
                  className="bg-gray-900/50 border-gray-600 text-white mt-1"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Mês</Label>
                <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month} className="text-white hover:bg-gray-700">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Nome do Evento</Label>
              <Input
                type="text"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                placeholder="Vencimento ICMS"
                className="bg-gray-900/50 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Tipo</Label>
              <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingEvent ? "Atualizar" : "Criar"}
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
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
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
