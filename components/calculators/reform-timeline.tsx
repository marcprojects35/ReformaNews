"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const timelineEvents = [
  {
    year: "2026",
    status: "current",
    title: "Ano de Testes",
    description: "CBS e IBS com alíquotas de 0,9% e 0,1%, compensáveis com PIS/Cofins",
    items: [
      "Recolhimento pode ser dispensado se obrigações acessórias forem cumpridas",
      "Início da adaptação dos sistemas",
    ],
  },
  {
    year: "2027",
    status: "upcoming",
    title: "Início da Cobrança",
    description: "Extinção do PIS, Cofins e IOF-Seguros",
    items: [
      "Cobrança efetiva da CBS",
      "Redução a zero das alíquotas do IPI (exceto Zona Franca de Manaus)",
      "Instituição do Imposto Seletivo",
    ],
  },
  {
    year: "2029-2032",
    status: "future",
    title: "Transição Gradual",
    description: "Redução progressiva do ICMS e ISS, aumento do IBS",
    items: ["2029: 10% de transição", "2030: 20% de transição", "2031: 30% de transição", "2032: 40% de transição"],
  },
  {
    year: "2033",
    status: "future",
    title: "Modelo Definitivo",
    description: "Extinção completa do ICMS e ISS",
    items: [
      "Vigência integral do novo modelo tributário",
      "IBS e CBS em pleno funcionamento",
      "Sistema totalmente unificado",
    ],
  },
]

export function ReformTimeline() {
  return (
    <Card className="border-2 border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Timeline da Reforma Tributária</CardTitle>
            <CardDescription className="text-white/90">
              Acompanhe as etapas de implementação de 2026 a 2033
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div
              key={event.year}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-[#FFD700] to-[#1a1a1a]" />
              )}

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.status === "current"
                        ? "bg-gradient-to-br from-[#FFD700] to-[#FFC107] shadow-lg shadow-yellow-200"
                        : event.status === "upcoming"
                          ? "bg-gradient-to-br from-[#0046B3] to-[#0046B3]/90 shadow-lg shadow-blue-200"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}
                  >
                    {event.status === "current" ? (
                      <Clock className="h-6 w-6 text-white" />
                    ) : event.status === "upcoming" ? (
                      <AlertCircle className="h-6 w-6 text-white" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{event.year}</h3>
                    <Badge
                      className={
                        event.status === "current"
                          ? "bg-[#FFD700] hover:bg-[#FFD700]"
                          : event.status === "upcoming"
                            ? "bg-[#0046B3] hover:bg-[#0046B3]"
                            : "bg-gray-500 hover:bg-gray-500"
                      }
                    >
                      {event.status === "current" ? "Em andamento" : event.status === "upcoming" ? "Próximo" : "Futuro"}
                    </Badge>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                  <ul className="space-y-2">
                    {event.items.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
