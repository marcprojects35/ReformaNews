"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calculator, Building2 } from "lucide-react"

const municipios = [
  { nome: "São Paulo - SP", aliquota: 5.0 },
  { nome: "Rio de Janeiro - RJ", aliquota: 5.0 },
  { nome: "Belo Horizonte - MG", aliquota: 5.0 },
  { nome: "Uberlândia - MG", aliquota: 4.0 },
  { nome: "Curitiba - PR", aliquota: 5.0 },
  { nome: "Porto Alegre - RS", aliquota: 5.0 },
  { nome: "Salvador - BA", aliquota: 5.0 },
  { nome: "Brasília - DF", aliquota: 5.0 },
  { nome: "Campinas - SP", aliquota: 3.0 },
  { nome: "Florianópolis - SC", aliquota: 5.0 }
]

export function IssCalculator() {
  const [municipio, setMunicipio] = useState("")
  const [valorServico, setValorServico] = useState("")
  const [regime, setRegime] = useState("simples")
  const [resultado, setResultado] = useState<{
    iss: number
    aliquota: number
    valorLiquido: number
  } | null>(null)

  const calcular = () => {
    const valor = parseFloat(valorServico.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const municipioData = municipios.find(m => m.nome === municipio)
    
    if (!municipioData || valor <= 0) return

    let aliquotaEfetiva = municipioData.aliquota

    if (regime === "simples") {
      aliquotaEfetiva = Math.min(aliquotaEfetiva, 4.0)
    }

    const iss = valor * (aliquotaEfetiva / 100)
    const valorLiquido = valor - iss

    setResultado({
      iss,
      aliquota: aliquotaEfetiva,
      valorLiquido
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Calculadora de ISS</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Município</Label>
            <Select value={municipio} onValueChange={setMunicipio}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o município" />
              </SelectTrigger>
              <SelectContent>
                {municipios.map(m => (
                  <SelectItem key={m.nome} value={m.nome}>
                    {m.nome} ({m.aliquota}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Regime Tributário</Label>
            <Select value={regime} onValueChange={setRegime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples">Simples Nacional</SelectItem>
                <SelectItem value="presumido">Lucro Presumido</SelectItem>
                <SelectItem value="real">Lucro Real</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Valor do Serviço (R$)</Label>
          <Input
            type="text"
            placeholder="0,00"
            value={valorServico}
            onChange={(e) => setValorServico(e.target.value)}
          />
        </div>

        <Button onClick={calcular} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
          <Calculator className="h-4 w-4 mr-2" />
          Calcular ISS
        </Button>

        {resultado && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Alíquota:</span>
              <span className="font-semibold">{resultado.aliquota}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">ISS a pagar:</span>
              <span className="font-semibold text-red-600">{formatCurrency(resultado.iss)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600 dark:text-gray-400">Valor Líquido:</span>
              <span className="font-bold text-green-600 text-lg">{formatCurrency(resultado.valorLiquido)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
