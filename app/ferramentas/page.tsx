"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IbsCbsCalculator } from "@/components/calculators/ibs-cbs-calculator"
import { SplitPaymentSimulator } from "@/components/calculators/split-payment-simulator"
import { ReformTimeline } from "@/components/calculators/reform-timeline"
import { IssCalculator } from "@/components/calculators/iss-calculator"
import { RegimeSimulator } from "@/components/calculators/regime-simulator"
import { DarfGenerator } from "@/components/calculators/darf-generator"
import { DifalCalculator } from "@/components/calculators/difal-calculator"
import { AgendaTributaria } from "@/components/calculators/agenda-tributaria"
import { CalculadoraTributariaAutomatica } from "@/components/calculators/calculadora-tributaria-automatica"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Calculator,
  FileText,
  Calendar,
  TrendingUp,
  Loader2
} from "lucide-react"

interface CalculatorConfig {
  calculator_id: string
  name: string
  active: boolean
  order: number
}

interface TaxParameters {
  ibs_estadual: { value: string }
  ibs_municipal: { value: string }
  cbs: { value: string }
}

const categorias = [
  { id: "todas", nome: "Todas", icon: Wrench },
  { id: "reforma", nome: "Reforma Tributária", icon: TrendingUp },
  { id: "calculos", nome: "Cálculos Fiscais", icon: Calculator },
  { id: "documentos", nome: "Documentos", icon: FileText },
  { id: "agenda", nome: "Agenda", icon: Calendar }
]

const ferramentas = [
  { id: "calculadora-automatica", categoria: "calculos", component: CalculadoraTributariaAutomatica },
  { id: "ibs-cbs", categoria: "reforma", component: IbsCbsCalculator },
  { id: "split", categoria: "reforma", component: SplitPaymentSimulator },
  { id: "timeline", categoria: "reforma", component: ReformTimeline },
  { id: "iss", categoria: "calculos", component: IssCalculator },
  { id: "regime", categoria: "calculos", component: RegimeSimulator },
  { id: "darf", categoria: "documentos", component: DarfGenerator },
  { id: "difal", categoria: "calculos", component: DifalCalculator },
  { id: "agenda", categoria: "agenda", component: AgendaTributaria }
]

export default function FerramentasPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas")
  const [calculatorConfig, setCalculatorConfig] = useState<CalculatorConfig[]>([])
  const [taxParameters, setTaxParameters] = useState<TaxParameters | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/calculator-config")
        const data = await response.json()
        setCalculatorConfig(data.calculators || [])
        setTaxParameters(data.parameters || null)
      } catch (error) {
        console.error("Erro ao carregar configuração:", error)
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  // Filtrar calculadoras baseado no status ativo (só mostra se existir no backend e estiver ativa)
  const ferramentasAtivas = ferramentas.filter(f => {
    const config = calculatorConfig.find(c => c.calculator_id === f.id)
    return config ? config.active : false
  })

  const ferramentasFiltradas = categoriaAtiva === "todas"
    ? ferramentasAtivas
    : ferramentasAtivas.filter(f => f.categoria === categoriaAtiva)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
        <Header />
        <main className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-[#FFD700] animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] p-4 rounded-2xl shadow-lg shadow-yellow-500/20">
              <Wrench className="h-8 w-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent">
                Ferramentas e Calculadoras
              </h1>
              <p className="text-gray-400 mt-2">
                Utilize nossas calculadoras para entender melhor os tributos e a Reforma Tributária
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categorias.map(cat => {
              const Icon = cat.icon
              return (
                <Button
                  key={cat.id}
                  variant={categoriaAtiva === cat.id ? "default" : "outline"}
                  onClick={() => setCategoriaAtiva(cat.id)}
                  className={categoriaAtiva === cat.id
                    ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {cat.nome}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ferramentasFiltradas.map(ferramenta => {
            const Component = ferramenta.component
            // Passar parâmetros de alíquotas para calculadoras que precisam
            if (ferramenta.id === "ibs-cbs" || ferramenta.id === "calculadora-automatica") {
              return <Component key={ferramenta.id} taxParameters={taxParameters} />
            }
            return <Component key={ferramenta.id} />
          })}
        </div>

        {ferramentasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma ferramenta encontrada</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
