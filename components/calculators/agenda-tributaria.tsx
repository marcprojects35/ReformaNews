"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Bell, ChevronLeft, ChevronRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react"

interface Obrigacao {
  nome: string
  dia: number
  tipo: "federal" | "estadual" | "municipal" | "trabalhista"
  descricao: string
}

const obrigacoesMensais: Obrigacao[] = [
  { nome: "FGTS", dia: 7, tipo: "trabalhista", descricao: "Depósito do FGTS referente ao mês anterior" },
  { nome: "GPS (INSS)", dia: 7, tipo: "federal", descricao: "Pagamento da GPS referente ao mês anterior" },
  { nome: "CAGED", dia: 7, tipo: "trabalhista", descricao: "Entrega do CAGED (se houver movimentação)" },
  { nome: "DCTF", dia: 15, tipo: "federal", descricao: "Entrega da DCTF mensal" },
  { nome: "EFD-Contribuições", dia: 15, tipo: "federal", descricao: "Entrega do SPED Contribuições" },
  { nome: "ICMS", dia: 15, tipo: "estadual", descricao: "Pagamento do ICMS (varia por estado)" },
  { nome: "ISS", dia: 15, tipo: "municipal", descricao: "Pagamento do ISS (varia por município)" },
  { nome: "IRRF", dia: 20, tipo: "federal", descricao: "Recolhimento do IRRF sobre folha" },
  { nome: "PIS/COFINS", dia: 20, tipo: "federal", descricao: "Pagamento de PIS e COFINS" },
  { nome: "DARF Simples", dia: 20, tipo: "federal", descricao: "Pagamento do DAS - Simples Nacional" },
  { nome: "CSLL", dia: 25, tipo: "federal", descricao: "Pagamento da CSLL (Lucro Real)" },
  { nome: "IRPJ", dia: 25, tipo: "federal", descricao: "Pagamento do IRPJ (Lucro Real)" },
  { nome: "EFD-ICMS/IPI", dia: 25, tipo: "estadual", descricao: "Entrega do SPED Fiscal" },
  { nome: "DARF IRPJ/CSLL", dia: 30, tipo: "federal", descricao: "Pagamento trimestral IRPJ/CSLL" }
]

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export function AgendaTributaria() {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(hoje.getMonth())
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear())

  const obrigacoesDoMes = useMemo(() => {
    return obrigacoesMensais.map(ob => {
      const dataVencimento = new Date(anoAtual, mesAtual, ob.dia)
      const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      
      let status: "vencido" | "urgente" | "proximo" | "ok" = "ok"
      if (diasRestantes < 0) status = "vencido"
      else if (diasRestantes <= 3) status = "urgente"
      else if (diasRestantes <= 7) status = "proximo"

      return {
        ...ob,
        dataVencimento,
        diasRestantes,
        status
      }
    }).sort((a, b) => a.dia - b.dia)
  }, [mesAtual, anoAtual, hoje])

  const navegarMes = (direcao: number) => {
    const novaData = new Date(anoAtual, mesAtual + direcao, 1)
    setMesAtual(novaData.getMonth())
    setAnoAtual(novaData.getFullYear())
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "federal": return "bg-blue-500"
      case "estadual": return "bg-green-500"
      case "municipal": return "bg-purple-500"
      case "trabalhista": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "urgente": return <Bell className="h-4 w-4 text-yellow-500" />
      case "proximo": return <Clock className="h-4 w-4 text-orange-500" />
      default: return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "vencido": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      case "urgente": return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      case "proximo": return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
      default: return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  const obrigacoesUrgentes = obrigacoesDoMes.filter(o => o.status === "urgente" || o.status === "vencido")

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#FFD700] to-[#FFC107] rounded-lg">
              <Calendar className="h-5 w-5 text-gray-900" />
            </div>
            <CardTitle>Agenda Tributária</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navegarMes(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[150px] text-center">
              {meses[mesAtual]} {anoAtual}
            </span>
            <Button variant="outline" size="icon" onClick={() => navegarMes(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {obrigacoesUrgentes.length > 0 && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-bold text-red-700 dark:text-red-400">Atenção!</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              {obrigacoesUrgentes.length} obrigação(ões) com vencimento próximo ou vencidas
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-500">Federal</Badge>
          <Badge className="bg-green-500">Estadual</Badge>
          <Badge className="bg-purple-500">Municipal</Badge>
          <Badge className="bg-orange-500">Trabalhista</Badge>
        </div>

        <div className="space-y-3">
          {obrigacoesDoMes.map((ob, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${getStatusBg(ob.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(ob.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{ob.nome}</span>
                      <Badge className={`${getTipoColor(ob.tipo)} text-xs`}>
                        {ob.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {ob.descricao}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    Dia {ob.dia}
                  </div>
                  <div className="text-xs text-gray-500">
                    {ob.status === "vencido" 
                      ? `Vencido há ${Math.abs(ob.diasRestantes)} dias`
                      : ob.diasRestantes === 0 
                        ? "Vence hoje!"
                        : `${ob.diasRestantes} dias restantes`
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
