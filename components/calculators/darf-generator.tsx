"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calculator } from "lucide-react"

const codigosReceita = [
  { codigo: "0211", descricao: "IRPJ - Lucro Real - Estimativa Mensal" },
  { codigo: "0220", descricao: "IRPJ - Lucro Real - Trimestral" },
  { codigo: "1708", descricao: "IRRF - Rendimentos do Trabalho Assalariado" },
  { codigo: "2089", descricao: "IRPJ - Lucro Presumido" },
  { codigo: "2372", descricao: "CSLL - Lucro Real - Mensal" },
  { codigo: "2484", descricao: "COFINS - Não Cumulativo" },
  { codigo: "5856", descricao: "PIS/PASEP - Não Cumulativo" },
  { codigo: "6912", descricao: "CSLL - Lucro Presumido" },
  { codigo: "8109", descricao: "IRPF - Carnê Leão" },
  { codigo: "0588", descricao: "IRRF - Rendimentos de Capital" }
]

export function DarfGenerator() {
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [codigoReceita, setCodigoReceita] = useState("")
  const [periodoApuracao, setPeriodoApuracao] = useState("")
  const [valorPrincipal, setValorPrincipal] = useState("")
  const [dataVencimento, setDataVencimento] = useState("")
  const [resultado, setResultado] = useState<{
    valorTotal: number
    juros: number
    multa: number
    diasAtraso: number
  } | null>(null)

  const calcular = () => {
    const valor = parseFloat(valorPrincipal.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    if (valor <= 0 || !dataVencimento) return

    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = hoje.getTime() - vencimento.getTime()
    const diasAtraso = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    let multa = 0
    let juros = 0

    if (diasAtraso > 0) {
      const percentualMulta = Math.min(diasAtraso * 0.33, 20)
      multa = valor * (percentualMulta / 100)
      
      const mesesAtraso = Math.ceil(diasAtraso / 30)
      const taxaSelic = 0.01
      juros = valor * taxaSelic * mesesAtraso
    }

    const valorTotal = valor + multa + juros

    setResultado({
      valorTotal,
      juros,
      multa,
      diasAtraso
    })
  }

  const gerarDARF = () => {
    if (!resultado) return

    const codigoInfo = codigosReceita.find(c => c.codigo === codigoReceita)
    
    const texto = `
═══════════════════════════════════════════════════════════
                    DOCUMENTO DE ARRECADAÇÃO
                  DE RECEITAS FEDERAIS - DARF
═══════════════════════════════════════════════════════════

01 - NOME/TELEFONE
CPF/CNPJ: ${cpfCnpj || "Não informado"}

02 - PERÍODO DE APURAÇÃO          03 - CÓDIGO DA RECEITA
${periodoApuracao || "Não informado"}                              ${codigoReceita}

04 - DESCRIÇÃO
${codigoInfo?.descricao || "Código não identificado"}

05 - DATA DE VENCIMENTO           06 - VALOR PRINCIPAL
${dataVencimento ? new Date(dataVencimento).toLocaleDateString("pt-BR") : "N/A"}                        R$ ${parseFloat(valorPrincipal.replace(/[^\d,]/g, "").replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

07 - MULTA                        08 - JUROS/ENCARGOS
R$ ${resultado.multa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}                      R$ ${resultado.juros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

═══════════════════════════════════════════════════════════
09 - VALOR TOTAL
R$ ${resultado.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
═══════════════════════════════════════════════════════════

Dias em atraso: ${resultado.diasAtraso}

ATENÇÃO: Este é um documento ilustrativo para fins de simulação.
Para pagamento efetivo, utilize o sistema oficial da Receita Federal.

Gerado em: ${new Date().toLocaleString("pt-BR")}
Reforma Tributária News - Consultoria Tributária
    `.trim()

    const blob = new Blob([texto], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `DARF-${codigoReceita}-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <CardTitle>Gerador de DARF</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CPF/CNPJ</Label>
            <Input
              type="text"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Código da Receita</Label>
            <Select value={codigoReceita} onValueChange={setCodigoReceita}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o código" />
              </SelectTrigger>
              <SelectContent>
                {codigosReceita.map(c => (
                  <SelectItem key={c.codigo} value={c.codigo}>
                    {c.codigo} - {c.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Período de Apuração</Label>
            <Input
              type="text"
              placeholder="MM/AAAA"
              value={periodoApuracao}
              onChange={(e) => setPeriodoApuracao(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Input
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Valor Principal (R$)</Label>
            <Input
              type="text"
              placeholder="0,00"
              value={valorPrincipal}
              onChange={(e) => setValorPrincipal(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calcular} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold">
          <Calculator className="h-4 w-4 mr-2" />
          Calcular Juros e Multa
        </Button>

        {resultado && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            {resultado.diasAtraso > 0 && (
              <div className="text-sm text-red-600 mb-2">
                ⚠️ {resultado.diasAtraso} dias em atraso
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valor Principal:</span>
              <span className="font-semibold">{formatCurrency(parseFloat(valorPrincipal.replace(/[^\d,]/g, "").replace(",", ".")))}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>(+) Multa:</span>
              <span>{formatCurrency(resultado.multa)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>(+) Juros:</span>
              <span>{formatCurrency(resultado.juros)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600 dark:text-gray-400">Valor Total:</span>
              <span className="font-bold text-lg">{formatCurrency(resultado.valorTotal)}</span>
            </div>

            <Button onClick={gerarDARF} variant="outline" className="w-full mt-4">
              <Download className="h-4 w-4 mr-2" />
              Gerar DARF (Simulação)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
