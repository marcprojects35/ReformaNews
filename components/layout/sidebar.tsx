"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TrendingUp, Bell } from "lucide-react"

interface FiscalEvent {
  id: number
  date: string
  month: string
  event: string
  event_type: string
  active: boolean
  order: number
}

interface WeeklyHighlight {
  id: number
  title: string
  category: string
  active: boolean
  order: number
}

const defaultFiscalCalendar = [
  { date: "10", month: "DEZ", event: "Vencimento ICMS", event_type: "estadual" },
  { date: "15", month: "DEZ", event: "IBS/CBS - Apuração", event_type: "federal" },
  { date: "20", month: "DEZ", event: "DCTF-Web", event_type: "federal" },
  { date: "25", month: "DEZ", event: "EFD-Reinf", event_type: "trabalhista" },
]

const defaultHighlights = [
  {
    title: "Empresas do Simples estão dispensadas de recolher IBS/CBS em 2026",
    category: "Simples Nacional",
  },
  {
    title: "DERE não é a nova obrigação acessória da reforma tributária",
    category: "Obrigações",
  },
  {
    title: "Transição para o novo modelo: cronograma 2026-2033",
    category: "Reforma",
  },
]

export function Sidebar() {
  const [fiscalCalendar, setFiscalCalendar] = useState<FiscalEvent[]>([])
  const [highlights, setHighlights] = useState<WeeklyHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [highlightsLoading, setHighlightsLoading] = useState(true)

  useEffect(() => {
    const loadFiscalCalendar = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/fiscal-calendar")
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setFiscalCalendar(data)
          } else {
            setFiscalCalendar(defaultFiscalCalendar as unknown as FiscalEvent[])
          }
        } else {
          setFiscalCalendar(defaultFiscalCalendar as unknown as FiscalEvent[])
        }
      } catch {
        setFiscalCalendar(defaultFiscalCalendar as unknown as FiscalEvent[])
      } finally {
        setLoading(false)
      }
    }

    const loadHighlights = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/weekly-highlights")
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setHighlights(data)
          } else {
            setHighlights(defaultHighlights as unknown as WeeklyHighlight[])
          }
        } else {
          setHighlights(defaultHighlights as unknown as WeeklyHighlight[])
        }
      } catch {
        setHighlights(defaultHighlights as unknown as WeeklyHighlight[])
      } finally {
        setHighlightsLoading(false)
      }
    }

    loadFiscalCalendar()
    loadHighlights()
  }, [])

  return (
    <div className="space-y-6 sticky top-32">
      {/* Calendário Fiscal */}
      <div className="border border-gray-700 shadow-xl rounded-xl overflow-hidden bg-gray-800">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2D3748] text-white p-4">
          <h3 className="text-base flex items-center gap-2 font-bold">
            <div className="p-1.5 bg-[#FFD700]/20 rounded-lg">
              <Calendar className="h-4 w-4 text-[#FFD700]" />
            </div>
            Calendário Fiscal
          </h3>
        </div>
        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Carregando...</div>
          ) : (
            fiscalCalendar.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3 hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-lg p-2 min-w-[50px] shadow-lg shadow-yellow-500/20">
                    <div className="text-lg font-bold text-gray-900 leading-none">{item.date}</div>
                    <div className="text-[10px] text-gray-900/90 uppercase font-semibold">{item.month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-100 group-hover:text-[#FFD700] transition-colors truncate">
                      {item.event}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5 mt-1"
                    >
                      {item.event_type}
                    </Badge>
                  </div>
                  <Bell className="h-4 w-4 text-gray-500 group-hover:text-[#FFD700] transition-colors flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Destaques da Semana */}
      <div className="border border-gray-700 shadow-xl rounded-xl overflow-hidden bg-gray-800">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 p-4">
          <h3 className="text-base flex items-center gap-2 font-bold">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
            Destaques da Semana
          </h3>
        </div>
        <div className="divide-y divide-gray-700">
          {highlightsLoading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Carregando...</div>
          ) : (
            highlights.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
              >
                <Badge
                  variant="outline"
                  className="mb-2 text-[10px] border-gray-600 text-gray-300 bg-gray-700 font-semibold group-hover:border-[#FFD700] group-hover:text-[#FFD700] group-hover:bg-[#FFD700]/5 transition-all"
                >
                  {item.category}
                </Badge>
                <p className="text-sm font-semibold text-gray-100 leading-snug group-hover:text-[#FFD700] transition-colors line-clamp-2">
                  {item.title}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Endereço */}
      <div className="relative border border-gray-700 shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 flex-shrink-0">
              <MapPin className="h-5 w-5 text-gray-900" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-white mb-1">Uberlândia MG</h3>
              <div className="space-y-0.5 text-sm text-white/90">
                <p>Av. Vasconcelos Costa, 1281</p>
                <p>Jardim Inconfidência</p>
                <p>CEP 38410-465</p>
                <p className="font-bold text-[#FFD700] mt-2">(34) 3224-0102</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
