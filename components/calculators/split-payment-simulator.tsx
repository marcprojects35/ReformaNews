"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, Building2, BadgeCheck } from "lucide-react"

export function SplitPaymentSimulator() {
  const [totalValue, setTotalValue] = useState("")
  const [installments, setInstallments] = useState("3")
  const [result, setResult] = useState<{
    installmentValue: number
    taxPerInstallment: number
    supplierPerInstallment: number
    creditPerInstallment: number
  } | null>(null)

  const simulate = () => {
    const total = Number.parseFloat(totalValue)
    const numInstallments = Number.parseInt(installments)

    if (isNaN(total) || total <= 0 || isNaN(numInstallments) || numInstallments <= 0) return

    const taxRate = 0.27 // 27% IBS + CBS
    const installmentValue = total / numInstallments
    const taxPerInstallment = installmentValue * taxRate
    const supplierPerInstallment = installmentValue - taxPerInstallment
    const creditPerInstallment = taxPerInstallment

    setResult({
      installmentValue,
      taxPerInstallment,
      supplierPerInstallment,
      creditPerInstallment,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card className="border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Simulador Split Payment</CardTitle>
            <CardDescription className="text-white/90">
              Veja como funciona o pagamento parcelado com IBS/CBS
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalValue" className="text-sm font-semibold text-gray-700">
              Valor Total da Venda (R$)
            </Label>
            <Input
              id="totalValue"
              type="number"
              placeholder="30.000,00"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="installments" className="text-sm font-semibold text-gray-700">
              Número de Parcelas
            </Label>
            <Input
              id="installments"
              type="number"
              placeholder="3"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <Button
          onClick={simulate}
          className="w-full bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 hover:from-[#0046B3]/90 hover:to-[#0046B3] text-white font-semibold py-6 text-lg shadow-lg"
        >
          Simular Split Payment
        </Button>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-t-2 border-gray-200 pt-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Como funciona cada parcela:</h4>

              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#0046B3] p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800">Valor da Parcela</span>
                  </div>
                  <p className="text-3xl font-bold text-[#0046B3]">{formatCurrency(result.installmentValue)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-[#FF7A00]" />
                      <span className="text-xs font-semibold text-gray-600">Governo recebe</span>
                    </div>
                    <p className="text-xl font-bold text-[#FF7A00]">{formatCurrency(result.taxPerInstallment)}</p>
                    <p className="text-xs text-gray-500 mt-1">27% direto ao Fisco</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-600">Fornecedor recebe</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(result.supplierPerInstallment)}</p>
                    <p className="text-xs text-gray-500 mt-1">Valor líquido</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-semibold text-gray-600">Crédito gerado</span>
                    </div>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(result.creditPerInstallment)}</p>
                    <p className="text-xs text-gray-500 mt-1">Por parcela paga</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-gray-800 mb-3">Resumo total em {installments}x:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total para o Governo:</span>
                      <span className="font-bold text-[#FF7A00]">
                        {formatCurrency(result.taxPerInstallment * Number.parseInt(installments))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total para o Fornecedor:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(result.supplierPerInstallment * Number.parseInt(installments))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total de Créditos:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(result.creditPerInstallment * Number.parseInt(installments))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
