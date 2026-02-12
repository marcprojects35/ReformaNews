"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calculator, FileText, Package, Download, Loader2 } from "lucide-react"
import jsPDF from "jspdf"

interface TaxParameters {
  ibs_estadual: { value: string }
  ibs_municipal: { value: string }
  cbs: { value: string }
}

interface CalculadoraTributariaAutomaticaProps {
  taxParameters?: TaxParameters | null
}

interface Produto {
  id: number
  nome: string
  gtin: string
  ncm: string
  cest: string
  origem: string
  icms: number
  ipi: number
  pis: number
  cofins: number
  ibsEstadual: number
  ibsMunicipal: number
  cbs: number
  categoria: string
}

const categorias = [
  "Animais Vivos", "Carnes", "Peixes", "Laticínios", "Hortaliças", "Frutas",
  "Café/Chá", "Cereais", "Farinhas", "Óleos/Gorduras", "Preparados de Carne",
  "Açúcares", "Preparados de Cereais", "Preparados de Vegetais", "Preparados Alimentícios",
  "Bebidas", "Combustíveis", "Medicamentos", "Cosméticos", "Sabões/Detergentes",
  "Plásticos", "Madeira", "Papel", "Vestuário Malha", "Vestuário Não-Malha",
  "Calçados", "Cerâmica", "Ferro/Aço", "Máquinas", "Equipamentos Elétricos",
  "Veículos", "Móveis", "Brinquedos/Jogos", "Outros"
]

export function CalculadoraTributariaAutomatica({ taxParameters }: CalculadoraTributariaAutomaticaProps) {
  // Usar parâmetros do admin ou valores padrão
  const ibsEstadualPercent = parseFloat(taxParameters?.ibs_estadual?.value || "9")
  const ibsMunicipalPercent = parseFloat(taxParameters?.ibs_municipal?.value || "8")
  const cbsPercent = parseFloat(taxParameters?.cbs?.value || "10")

  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [quantidade, setQuantidade] = useState("1")
  const [valorUnitario, setValorUnitario] = useState("")
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [resultado, setResultado] = useState<{
    valorTotal: number
    icms: number
    ipi: number
    pis: number
    cofins: number
    ibsEstadual: number
    ibsMunicipal: number
    cbs: number
    totalTributos: number
    valorLiquido: number
    cargaTributaria: number
  } | null>(null)

  const buscarProdutos = useCallback(async (termo: string, categoria: string) => {
    if (!termo && categoria === "todas") {
      setProdutosFiltrados([])
      setErro(null)
      setShowDropdown(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setShowDropdown(true)
    setErro(null)
    
    try {
      const params = new URLSearchParams()
      if (termo) params.set('q', termo)
      if (categoria && categoria !== 'todas') params.set('categoria', categoria)
      params.set('limit', '15')

      const response = await fetch(`/api/produtos/search?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error('Erro ao conectar com o servidor')
      }
      
      const data = await response.json()
      
      if (data.error) {
        setErro(data.error)
        setProdutosFiltrados([])
      } else {
        setProdutosFiltrados(data.produtos || [])
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }
      console.error('Erro ao buscar produtos:', error)
      setErro('Erro ao buscar produtos. Tente novamente.')
      setProdutosFiltrados([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (busca.length >= 2 || categoriaFiltro !== "todas") {
        buscarProdutos(busca, categoriaFiltro)
      } else {
        setProdutosFiltrados([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [busca, categoriaFiltro, buscarProdutos])

  const selecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setBusca("")
    setProdutosFiltrados([])
    setShowDropdown(false)
  }

  const calcular = () => {
    if (!produtoSelecionado) return

    const qtd = parseInt(quantidade) || 1
    const valor = parseFloat(valorUnitario.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const valorTotal = qtd * valor

    const icms = valorTotal * (produtoSelecionado.icms / 100)
    const ipi = valorTotal * (produtoSelecionado.ipi / 100)
    const pis = valorTotal * (produtoSelecionado.pis / 100)
    const cofins = valorTotal * (produtoSelecionado.cofins / 100)
    // Usar parâmetros configurados pelo admin para a reforma tributária
    const ibsEstadual = valorTotal * (ibsEstadualPercent / 100)
    const ibsMunicipal = valorTotal * (ibsMunicipalPercent / 100)
    const cbs = valorTotal * (cbsPercent / 100)

    const totalTributos = icms + ipi + pis + cofins
    const valorLiquido = valorTotal - totalTributos
    const cargaTributaria = valorTotal > 0 ? (totalTributos / valorTotal) * 100 : 0

    setResultado({
      valorTotal,
      icms,
      ipi,
      pis,
      cofins,
      ibsEstadual,
      ibsMunicipal,
      cbs,
      totalTributos,
      valorLiquido,
      cargaTributaria
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const gerarPDF = () => {
    if (!produtoSelecionado || !resultado) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    doc.setFontSize(18)
    doc.setTextColor(255, 122, 0)
    doc.text("RELATORIO TRIBUTARIO", pageWidth / 2, y, { align: "center" })
    y += 8
    doc.setFontSize(12)
    doc.setTextColor(0, 70, 179)
    doc.text("Calculadora Automatica por Produto", pageWidth / 2, y, { align: "center" })
    y += 10
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, y, { align: "center" })
    y += 15

    doc.setFontSize(14)
    doc.setTextColor(0, 70, 179)
    doc.text("DADOS DO PRODUTO", 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.text(`Nome: ${produtoSelecionado.nome}`, 20, y); y += 6
    doc.text(`GTIN: ${produtoSelecionado.gtin}`, 20, y); y += 6
    doc.text(`NCM: ${produtoSelecionado.ncm}`, 20, y); y += 6
    doc.text(`CEST: ${produtoSelecionado.cest}`, 20, y); y += 6
    doc.text(`Origem: ${produtoSelecionado.origem}`, 20, y); y += 6
    doc.text(`Categoria: ${produtoSelecionado.categoria}`, 20, y); y += 12

    doc.setFontSize(14)
    doc.setTextColor(0, 70, 179)
    doc.text("VALORES DA OPERACAO", 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.text(`Quantidade: ${quantidade}`, 20, y); y += 6
    doc.text(`Valor Unitario: ${formatCurrency(parseFloat(valorUnitario.replace(/[^\d,]/g, "").replace(",", ".")) || 0)}`, 20, y); y += 6
    doc.text(`Valor Total: ${formatCurrency(resultado.valorTotal)}`, 20, y); y += 12

    doc.setFontSize(14)
    doc.setTextColor(0, 70, 179)
    doc.text("TRIBUTOS CALCULADOS (Sistema Atual)", 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.text(`ICMS (${produtoSelecionado.icms}%): ${formatCurrency(resultado.icms)}`, 20, y); y += 6
    doc.text(`IPI (${produtoSelecionado.ipi}%): ${formatCurrency(resultado.ipi)}`, 20, y); y += 6
    doc.text(`PIS (${produtoSelecionado.pis}%): ${formatCurrency(resultado.pis)}`, 20, y); y += 6
    doc.text(`COFINS (${produtoSelecionado.cofins}%): ${formatCurrency(resultado.cofins)}`, 20, y); y += 8
    doc.setFontSize(11)
    doc.setTextColor(200, 0, 0)
    doc.text(`Total de Tributos: ${formatCurrency(resultado.totalTributos)}`, 20, y); y += 6
    doc.text(`Carga Tributaria: ${resultado.cargaTributaria.toFixed(2)}%`, 20, y); y += 12

    doc.setFontSize(14)
    doc.setTextColor(0, 70, 179)
    doc.text("SIMULACAO REFORMA TRIBUTARIA (IBS/CBS) - 2026", 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(0)
    doc.text(`IBS Estadual (${ibsEstadualPercent}%): ${formatCurrency(resultado.ibsEstadual)}`, 20, y); y += 6
    doc.text(`IBS Municipal (${ibsMunicipalPercent}%): ${formatCurrency(resultado.ibsMunicipal)}`, 20, y); y += 6
    doc.text(`CBS (${cbsPercent}%): ${formatCurrency(resultado.cbs)}`, 20, y); y += 8
    doc.setFontSize(11)
    doc.setTextColor(0, 70, 179)
    doc.text(`Total IBS/CBS: ${formatCurrency(resultado.ibsEstadual + resultado.ibsMunicipal + resultado.cbs)}`, 20, y); y += 20

    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text("Gerado por Reforma Tributária News", pageWidth / 2, y, { align: "center" })

    doc.save(`relatorio_tributario_${produtoSelecionado.gtin}_${Date.now()}.pdf`)
  }

  const limpar = () => {
    setProdutoSelecionado(null)
    setQuantidade("1")
    setValorUnitario("")
    setResultado(null)
    setBusca("")
    setCategoriaFiltro("todas")
    setProdutosFiltrados([])
    setShowDropdown(false)
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 lg:col-span-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 p-0 gap-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg">
            <Calculator className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <CardTitle className="text-2xl">Calculadora Tributaria Automatica</CardTitle>
            <p className="text-sm text-gray-700 mt-1">
              Pesquise por nome, GTIN ou NCM e calcule automaticamente os impostos (102.070 produtos)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Buscar Produto</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nome, GTIN ou NCM..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>
            {showDropdown && !produtoSelecionado && (busca.length >= 2 || categoriaFiltro !== "todas") && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3 px-4 py-6">
                    <Loader2 className="h-5 w-5 text-[#FFD700] animate-spin" />
                    <span className="text-gray-600 dark:text-gray-400">Pesquisando produtos...</span>
                  </div>
                ) : produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map(p => (
                    <button
                      key={p.id}
                      onClick={() => selecionarProduto(p)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{p.nome}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        GTIN: {p.gtin} | NCM: {p.ncm} | {p.categoria}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum produto encontrado</p>
                    <p className="text-xs mt-1">Tente outro termo de busca</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Filtrar por Categoria</Label>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {erro && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            {erro}
          </div>
        )}

        {produtoSelecionado && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-100">{produtoSelecionado.nome}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                  <div><span className="text-gray-500">GTIN:</span> {produtoSelecionado.gtin}</div>
                  <div><span className="text-gray-500">NCM:</span> {produtoSelecionado.ncm}</div>
                  <div><span className="text-gray-500">CEST:</span> {produtoSelecionado.cest}</div>
                  <div><span className="text-gray-500">Origem:</span> {produtoSelecionado.origem}</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded text-xs">
                    ICMS: {produtoSelecionado.icms}%
                  </span>
                  <span className="px-2 py-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded text-xs">
                    IPI: {produtoSelecionado.ipi}%
                  </span>
                  <span className="px-2 py-1 bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100 rounded text-xs">
                    PIS: {produtoSelecionado.pis}%
                  </span>
                  <span className="px-2 py-1 bg-orange-200 dark:bg-orange-700 text-orange-800 dark:text-orange-100 rounded text-xs">
                    COFINS: {produtoSelecionado.cofins}%
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={limpar}>Limpar</Button>
            </div>
          </div>
        )}

        {produtoSelecionado && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Unitario (R$)</Label>
              <Input
                placeholder="0,00"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={calcular}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Tributos
              </Button>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FFD700]" />
                Resultado do Calculo
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Valor Total</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(resultado.valorTotal)}</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tributos</div>
                  <div className="text-xl font-bold text-red-600">{formatCurrency(resultado.totalTributos)}</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Valor Liquido</div>
                  <div className="text-xl font-bold text-green-600">{formatCurrency(resultado.valorLiquido)}</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Carga Tributaria</div>
                  <div className="text-xl font-bold text-[#FF7A00]">{resultado.cargaTributaria.toFixed(2)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Sistema Tributario Atual</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">ICMS ({produtoSelecionado?.icms}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.icms)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IPI ({produtoSelecionado?.ipi}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.ipi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">PIS ({produtoSelecionado?.pis}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.pis)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">COFINS ({produtoSelecionado?.cofins}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.cofins)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Reforma Tributaria (IBS/CBS) - 2026</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IBS Estadual ({ibsEstadualPercent}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.ibsEstadual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IBS Municipal ({ibsMunicipalPercent}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.ibsMunicipal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CBS ({cbsPercent}%)</span>
                      <span className="font-medium">{formatCurrency(resultado.cbs)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Total IBS/CBS</span>
                      <span className="font-bold text-[#0046B3]">
                        {formatCurrency(resultado.ibsEstadual + resultado.ibsMunicipal + resultado.cbs)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={gerarPDF}
              variant="outline"
              className="w-full border-[#FFD700] text-gray-900 hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFC107]"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatorio
            </Button>
          </div>
        )}

        {!produtoSelecionado && !busca && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Digite o nome, GTIN ou NCM do produto para comecar</p>
            <p className="text-xs mt-2">Base de dados com 102.070 produtos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
