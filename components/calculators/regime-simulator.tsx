"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"

const atividadesComercio = ["Comércio", "Indústria", "Serviços"]

const tabelaSimplesComercio = [
  { ate: 180000, aliquota: 4.0, deducao: 0 },
  { ate: 360000, aliquota: 7.3, deducao: 5940 },
  { ate: 720000, aliquota: 9.5, deducao: 13860 },
  { ate: 1800000, aliquota: 10.7, deducao: 22500 },
  { ate: 3600000, aliquota: 14.3, deducao: 87300 },
  { ate: 4800000, aliquota: 19.0, deducao: 378000 }
]

const tabelaSimplesServicos = [
  { ate: 180000, aliquota: 6.0, deducao: 0 },
  { ate: 360000, aliquota: 11.2, deducao: 9360 },
  { ate: 720000, aliquota: 13.5, deducao: 17640 },
  { ate: 1800000, aliquota: 16.0, deducao: 35640 },
  { ate: 3600000, aliquota: 21.0, deducao: 125640 },
  { ate: 4800000, aliquota: 33.0, deducao: 648000 }
]

export function RegimeSimulator() {
  const [faturamento, setFaturamento] = useState("")
  const [atividade, setAtividade] = useState("Comércio")
  const [folhaSalarial, setFolhaSalarial] = useState("")
  const [resultado, setResultado] = useState<{
    simples: number
    presumido: number
    real: number
    recomendacao: string
    economias: { regime: string; valor: number }[]
  } | null>(null)

  const calcular = () => {
    const fat = parseFloat(faturamento.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const folha = parseFloat(folhaSalarial.replace(/[^\d,]/g, "").replace(",", ".")) || 0

    if (fat <= 0) return

    let simples = 0
    const tabela = atividade === "Serviços" ? tabelaSimplesServicos : tabelaSimplesComercio

    if (fat <= 4800000) {
      const faixa = tabela.find(f => fat <= f.ate) || tabela[tabela.length - 1]
      simples = (fat * faixa.aliquota / 100) - faixa.deducao
    } else {
      simples = Infinity
    }

    let presumido = 0
    if (atividade === "Comércio") {
      const basePresumida = fat * 0.08
      presumido = basePresumida * 0.15 + (basePresumida > 240000 / 12 * 12 ? (basePresumida - 240000) * 0.10 : 0)
      presumido += fat * 0.0365
      presumido += fat * 0.03
    } else if (atividade === "Serviços") {
      const basePresumida = fat * 0.32
      presumido = basePresumida * 0.15 + (basePresumida > 240000 ? (basePresumida - 240000) * 0.10 : 0)
      presumido += fat * 0.0365
      presumido += fat * 0.05
    } else {
      const basePresumida = fat * 0.08
      presumido = basePresumida * 0.15
      presumido += fat * 0.0365
      presumido += fat * 0.03
    }

    const margemLucro = 0.12
    const lucroEstimado = fat * margemLucro
    let real = 0
    real = lucroEstimado * 0.15 + (lucroEstimado > 240000 ? (lucroEstimado - 240000) * 0.10 : 0)
    real += lucroEstimado * 0.09
    real += fat * 0.0925
    real += folha * 0.20

    const regimes = [
      { nome: "Simples Nacional", valor: simples },
      { nome: "Lucro Presumido", valor: presumido },
      { nome: "Lucro Real", valor: real }
    ].filter(r => r.valor !== Infinity).sort((a, b) => a.valor - b.valor)

    const melhor = regimes[0]
    const economias = regimes.slice(1).map(r => ({
      regime: r.nome,
      valor: r.valor - melhor.valor
    }))

    setResultado({
      simples: simples === Infinity ? 0 : simples,
      presumido,
      real,
      recomendacao: melhor.nome,
      economias
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Simulador de Regime Tributário</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Faturamento Anual (R$)</Label>
            <Input
              type="text"
              placeholder="0,00"
              value={faturamento}
              onChange={(e) => setFaturamento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Atividade</Label>
            <Select value={atividade} onValueChange={setAtividade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {atividadesComercio.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Folha Salarial Anual (R$)</Label>
            <Input
              type="text"
              placeholder="0,00"
              value={folhaSalarial}
              onChange={(e) => setFolhaSalarial(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calcular} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
          <Calculator className="h-4 w-4 mr-2" />
          Simular Regimes
        </Button>

        {resultado && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-700 dark:text-green-400">Recomendação: {resultado.recomendacao}</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Este é o regime mais vantajoso para o seu perfil
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${resultado.recomendacao === "Simples Nacional" ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" : "bg-gray-50 dark:bg-gray-800"}`}>
                <h4 className="font-semibold mb-2">Simples Nacional</h4>
                {resultado.simples > 0 ? (
                  <p className="text-xl font-bold">{formatCurrency(resultado.simples)}</p>
                ) : (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Não elegível
                  </p>
                )}
              </div>

              <div className={`p-4 rounded-lg ${resultado.recomendacao === "Lucro Presumido" ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" : "bg-gray-50 dark:bg-gray-800"}`}>
                <h4 className="font-semibold mb-2">Lucro Presumido</h4>
                <p className="text-xl font-bold">{formatCurrency(resultado.presumido)}</p>
              </div>

              <div className={`p-4 rounded-lg ${resultado.recomendacao === "Lucro Real" ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" : "bg-gray-50 dark:bg-gray-800"}`}>
                <h4 className="font-semibold mb-2">Lucro Real</h4>
                <p className="text-xl font-bold">{formatCurrency(resultado.real)}</p>
              </div>
            </div>

            {resultado.economias.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-1">Economia em relação aos outros regimes:</p>
                {resultado.economias.map((e, i) => (
                  <p key={i}>vs {e.regime}: {formatCurrency(e.valor)}/ano</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
