"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, Truck } from "lucide-react"

const estados = [
  { uf: "AC", nome: "Acre", icms: 19 },
  { uf: "AL", nome: "Alagoas", icms: 19 },
  { uf: "AM", nome: "Amazonas", icms: 20 },
  { uf: "AP", nome: "Amapá", icms: 18 },
  { uf: "BA", nome: "Bahia", icms: 20.5 },
  { uf: "CE", nome: "Ceará", icms: 20 },
  { uf: "DF", nome: "Distrito Federal", icms: 20 },
  { uf: "ES", nome: "Espírito Santo", icms: 17 },
  { uf: "GO", nome: "Goiás", icms: 19 },
  { uf: "MA", nome: "Maranhão", icms: 22 },
  { uf: "MG", nome: "Minas Gerais", icms: 18 },
  { uf: "MS", nome: "Mato Grosso do Sul", icms: 17 },
  { uf: "MT", nome: "Mato Grosso", icms: 17 },
  { uf: "PA", nome: "Pará", icms: 19 },
  { uf: "PB", nome: "Paraíba", icms: 20 },
  { uf: "PE", nome: "Pernambuco", icms: 20.5 },
  { uf: "PI", nome: "Piauí", icms: 21 },
  { uf: "PR", nome: "Paraná", icms: 19.5 },
  { uf: "RJ", nome: "Rio de Janeiro", icms: 22 },
  { uf: "RN", nome: "Rio Grande do Norte", icms: 20 },
  { uf: "RO", nome: "Rondônia", icms: 19.5 },
  { uf: "RR", nome: "Roraima", icms: 20 },
  { uf: "RS", nome: "Rio Grande do Sul", icms: 17 },
  { uf: "SC", nome: "Santa Catarina", icms: 17 },
  { uf: "SE", nome: "Sergipe", icms: 19 },
  { uf: "SP", nome: "São Paulo", icms: 18 },
  { uf: "TO", nome: "Tocantins", icms: 20 }
]

export function DifalCalculator() {
  const [ufOrigem, setUfOrigem] = useState("")
  const [ufDestino, setUfDestino] = useState("")
  const [valorOperacao, setValorOperacao] = useState("")
  const [resultado, setResultado] = useState<{
    icmsOrigem: number
    icmsDestino: number
    aliquotaInterestadual: number
    diferencial: number
    difalValor: number
    baseCalculo: number
  } | null>(null)

  const getAliquotaInterestadual = (origem: string, destino: string) => {
    const estadosNorteSul = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "RN", "RO", "RR", "SE", "TO"]
    const estadosSudesteSul = ["MG", "PR", "RJ", "RS", "SC", "SP"]
    
    const origemSudesteSul = estadosSudesteSul.includes(origem)
    const destinoNorteSul = estadosNorteSul.includes(destino)

    if (origemSudesteSul && destinoNorteSul) {
      return 7
    }
    return 12
  }

  const calcular = () => {
    const valor = parseFloat(valorOperacao.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    if (valor <= 0 || !ufOrigem || !ufDestino || ufOrigem === ufDestino) return

    const estadoOrigem = estados.find(e => e.uf === ufOrigem)
    const estadoDestino = estados.find(e => e.uf === ufDestino)

    if (!estadoOrigem || !estadoDestino) return

    const aliquotaInterestadual = getAliquotaInterestadual(ufOrigem, ufDestino)
    const diferencial = estadoDestino.icms - aliquotaInterestadual

    if (diferencial <= 0) {
      setResultado({
        icmsOrigem: estadoOrigem.icms,
        icmsDestino: estadoDestino.icms,
        aliquotaInterestadual,
        diferencial: 0,
        difalValor: 0,
        baseCalculo: valor
      })
      return
    }

    const baseCalculo = valor / (1 - estadoDestino.icms / 100)
    const difalValor = baseCalculo * (diferencial / 100)

    setResultado({
      icmsOrigem: estadoOrigem.icms,
      icmsDestino: estadoDestino.icms,
      aliquotaInterestadual,
      diferencial,
      difalValor,
      baseCalculo
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Calculadora DIFAL</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>UF de Origem</Label>
            <Select value={ufOrigem} onValueChange={setUfOrigem}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a UF" />
              </SelectTrigger>
              <SelectContent>
                {estados.map(e => (
                  <SelectItem key={e.uf} value={e.uf}>
                    {e.uf} - {e.nome} ({e.icms}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>UF de Destino</Label>
            <Select value={ufDestino} onValueChange={setUfDestino}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a UF" />
              </SelectTrigger>
              <SelectContent>
                {estados.map(e => (
                  <SelectItem key={e.uf} value={e.uf}>
                    {e.uf} - {e.nome} ({e.icms}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Valor da Operação (R$)</Label>
          <Input
            type="text"
            placeholder="0,00"
            value={valorOperacao}
            onChange={(e) => setValorOperacao(e.target.value)}
          />
        </div>

        <Button onClick={calcular} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
          <Calculator className="h-4 w-4 mr-2" />
          Calcular DIFAL
        </Button>

        {resultado && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ICMS Origem:</span>
                <span className="ml-2 font-semibold">{resultado.icmsOrigem}%</span>
              </div>
              <div>
                <span className="text-gray-500">ICMS Destino:</span>
                <span className="ml-2 font-semibold">{resultado.icmsDestino}%</span>
              </div>
              <div>
                <span className="text-gray-500">Alíq. Interestadual:</span>
                <span className="ml-2 font-semibold">{resultado.aliquotaInterestadual}%</span>
              </div>
              <div>
                <span className="text-gray-500">Diferencial:</span>
                <span className="ml-2 font-semibold">{resultado.diferencial}%</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Base de Cálculo:</span>
                <span className="font-semibold">{formatCurrency(resultado.baseCalculo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">DIFAL a Recolher:</span>
                <span className="font-bold text-lg text-[#FFD700]">{formatCurrency(resultado.difalValor)}</span>
              </div>
            </div>

            {resultado.diferencial === 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Não há DIFAL a recolher nesta operação
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          *Valores de ICMS atualizados para 2025. Consulte a legislação vigente.
        </p>
      </CardContent>
    </Card>
  )
}
