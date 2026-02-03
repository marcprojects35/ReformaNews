"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Info, AlertCircle } from 'lucide-react'

export function IbsCbsCalculator() {
  const [productValue, setProductValue] = useState("")
  const [result, setResult] = useState<{
    ibsEstadual: number
    ibsMunicipal: number
    ibsTotal: number
    cbs: number
    total: number
    finalPrice: number
  } | null>(null)

  const calculate = () => {
    const value = Number.parseFloat(productValue)
    if (isNaN(value) || value <= 0) return

    // Alíquota IBS = 17% (exemplo ilustrativo)
    // Sendo: 9% estadual + 8% municipal
    const ibsEstadualRate = 0.09 // 9% IBS Estadual (substitui ICMS)
    const ibsMunicipalRate = 0.08 // 8% IBS Municipal (substitui ISS)
    const cbsRate = 0.1 // 10% CBS (substitui PIS/COFINS)

    const ibsEstadual = value * ibsEstadualRate
    const ibsMunicipal = value * ibsMunicipalRate
    const ibsTotal = ibsEstadual + ibsMunicipal
    const cbs = value * cbsRate
    const total = ibsTotal + cbs
    const finalPrice = value + total

    setResult({ ibsEstadual, ibsMunicipal, ibsTotal, cbs, total, finalPrice })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card className="border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Calculadora IBS/CBS Detalhada</CardTitle>
            <CardDescription className="text-white/90">
              Calcule os impostos com detalhamento estadual e municipal
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3 mb-3">
              <Info className="h-5 w-5 text-[#0046B3] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#0046B3] mb-2">O que é IBS?</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>IBS (Imposto sobre Bens e Serviços)</strong> é o novo tributo SUBNACIONAL que substituirá o
                  ICMS e ISS a partir de 2033. É composto por duas partes:
                </p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>
                    <strong>IBS Estadual (9%):</strong> Substitui o ICMS, arrecadado pelos estados
                  </li>
                  <li>
                    <strong>IBS Municipal (8%):</strong> Substitui o ISS, arrecadado pelos municípios
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-700 mb-2">O que é CBS?</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>CBS (Contribuição sobre Bens e Serviços)</strong> é o novo tributo FEDERAL que substituirá
                  PIS e COFINS a partir de 2027. Tem alíquota de 10% e é arrecadado pela Receita Federal.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#FF7A00] mb-2">Modelo IVA Dual Brasileiro</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  O Brasil adotou o <strong>IVA Dual</strong>, onde IBS (subnacional) + CBS (federal) = 27% total. Os
                  impostos são destacados "por fora" do preço e seguem o princípio da não-cumulatividade (créditos
                  tributários na cadeia produtiva).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productValue" className="text-sm font-semibold text-gray-700">
              Valor Líquido do Produto (R$)
            </Label>
            <Input
              id="productValue"
              type="number"
              placeholder="0,00"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
              className="mt-2 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Digite o valor do produto SEM os impostos</p>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF9500] hover:from-[#FF8800] hover:to-[#FFA000] text-white font-semibold py-6 text-lg shadow-lg"
          >
            Calcular Impostos Detalhados
          </Button>
        </div>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-t-2 border-gray-200 pt-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Resultado da Simulação</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Valor do Produto</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(Number.parseFloat(productValue))}
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-[#0046B3]">IBS Estadual (9%)</p>
                      <p className="text-xs text-gray-600">Substitui o ICMS - Arrecadado pelo Estado</p>
                    </div>
                    <span className="text-lg font-bold text-[#0046B3]">{formatCurrency(result.ibsEstadual)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-[#0046B3]">IBS Municipal (8%)</p>
                      <p className="text-xs text-gray-600">Substitui o ISS - Arrecadado pelo Município</p>
                    </div>
                    <span className="text-lg font-bold text-[#0046B3]">{formatCurrency(result.ibsMunicipal)}</span>
                  </div>
                </div>

                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-[#0046B3]">IBS Total (17%)</p>
                      <p className="text-xs text-gray-600">Estadual + Municipal</p>
                    </div>
                    <span className="text-xl font-bold text-[#0046B3]">{formatCurrency(result.ibsTotal)}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-green-700">CBS (10%)</p>
                      <p className="text-xs text-gray-600">Substitui PIS/COFINS - Arrecadado pela União</p>
                    </div>
                    <span className="text-lg font-bold text-green-700">{formatCurrency(result.cbs)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-sm font-medium text-gray-600">Total de Impostos (27%)</span>
                  <span className="text-lg font-bold text-[#FF7A00]">{formatCurrency(result.total)}</span>
                </div>

                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#FF7A00] to-[#FF9500] rounded-lg mt-4">
                  <span className="text-sm font-bold text-white">Valor Final (produto + impostos)</span>
                  <span className="text-2xl font-bold text-white">{formatCurrency(result.finalPrice)}</span>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Importante:</strong> Valores ilustrativos baseados no modelo IVA Dual brasileiro. As alíquotas
                  reais podem variar conforme legislação estadual e municipal. A implementação será gradual de 2029 a
                  2033. Para informações específicas do seu negócio, consulte nossa equipe.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
