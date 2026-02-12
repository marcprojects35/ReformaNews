"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2, Save, Calculator, Percent, Building2, Building, Landmark, AlertTriangle } from "lucide-react"

interface CalculatorConfig {
  calculator_id: string
  name: string
  active: boolean
  order: number
}

export default function AdminCalculadoras() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingParams, setSavingParams] = useState(false)
  const [calculators, setCalculators] = useState<CalculatorConfig[]>([])
  const [backendAvailable, setBackendAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formParams, setFormParams] = useState({
    ibs_estadual: "",
    ibs_municipal: "",
    cbs: ""
  })

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/check", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!response.ok) {
        localStorage.removeItem("admin_token")
        router.push("/admin")
      }
    } catch {
      setError("Não foi possível verificar autenticação. Backend indisponível.")
    }
  }

  const loadData = async () => {
    try {
      const [configRes, paramsRes] = await Promise.all([
        fetch("http://localhost:8001/api/calculator-config"),
        fetch("http://localhost:8001/api/calculator-parameters")
      ])

      if (configRes.ok && paramsRes.ok) {
        setBackendAvailable(true)
        const configData = await configRes.json()
        const paramsData = await paramsRes.json()

        if (Array.isArray(configData) && configData.length > 0) {
          setCalculators(configData)
        }

        setFormParams({
          ibs_estadual: paramsData?.ibs_estadual?.value || "",
          ibs_municipal: paramsData?.ibs_municipal?.value || "",
          cbs: paramsData?.cbs?.value || ""
        })
      } else {
        setError("Erro ao carregar dados do backend.")
      }
    } catch {
      setBackendAvailable(false)
      setError("Backend não disponível. Inicie o servidor em http://localhost:8001")
    } finally {
      setLoading(false)
    }
  }

  const toggleCalculator = async (calculatorId: string, active: boolean) => {
    const token = localStorage.getItem("admin_token")
    setSaving(true)

    try {
      const response = await fetch(`http://localhost:8001/api/calculator-config/${calculatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ active })
      })

      if (response.ok) {
        setCalculators(prev => prev.map(calc =>
          calc.calculator_id === calculatorId ? { ...calc, active } : calc
        ))
      }
    } catch (error) {
      console.error("Erro ao atualizar calculadora:", error)
      alert("Erro ao atualizar calculadora")
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitParams = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingParams(true)

    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/calculator-parameters", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formParams)
      })

      if (response.ok) {
        alert("Parâmetros salvos com sucesso!")
        loadData()
      }
    } catch (error) {
      console.error("Erro ao salvar parâmetros:", error)
      alert("Erro ao salvar parâmetros")
    } finally {
      setSavingParams(false)
    }
  }

  const totalAliquota = () => {
    const ibsEstadual = parseFloat(formParams.ibs_estadual) || 0
    const ibsMunicipal = parseFloat(formParams.ibs_municipal) || 0
    const cbs = parseFloat(formParams.cbs) || 0
    return (ibsEstadual + ibsMunicipal + cbs).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#FFD700]" />
              Gerenciar Calculadoras
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aviso de Backend */}
        {!backendAvailable && (
          <Card className="bg-red-500/10 border-red-500/30 mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">
                {error || "Backend não disponível. Inicie o servidor em http://localhost:8001"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção 1: Ativar/Desativar Calculadoras */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Ativar/Desativar Calculadoras</h2>
          <p className="text-gray-400 mb-6">Escolha quais calculadoras ficam visíveis na página de ferramentas</p>

          {calculators.length === 0 && backendAvailable && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center text-gray-400">
                Nenhuma calculadora configurada no banco de dados.
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {calculators.map(calc => (
                <Card key={calc.calculator_id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{calc.name}</h3>
                        <p className="text-sm text-gray-400">ID: {calc.calculator_id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${calc.active ? "text-green-400" : "text-gray-500"}`}>
                          {calc.active ? "Ativa" : "Inativa"}
                        </span>
                        <Switch
                          checked={calc.active}
                          onCheckedChange={(checked) => toggleCalculator(calc.calculator_id, checked)}
                          disabled={saving || !backendAvailable}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Seção 2: Parâmetros de Alíquotas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Parâmetros de Alíquotas</h2>
          <p className="text-gray-400 mb-6">Configure as alíquotas usadas nas calculadoras IBS/CBS</p>

          <form onSubmit={handleSubmitParams} className="space-y-6">
            {/* IBS Estadual */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  IBS Estadual
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Alíquota do IBS recolhido pelo Estado (substitui ICMS)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formParams.ibs_estadual}
                    onChange={(e) => setFormParams({ ...formParams, ibs_estadual: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white w-32"
                    required
                  />
                  <Percent className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* IBS Municipal */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-400" />
                  IBS Municipal
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Alíquota do IBS recolhido pelo Município (substitui ISS)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formParams.ibs_municipal}
                    onChange={(e) => setFormParams({ ...formParams, ibs_municipal: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white w-32"
                    required
                  />
                  <Percent className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* CBS */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-green-400" />
                  CBS (Federal)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Alíquota da CBS recolhida pela União (substitui PIS/COFINS)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formParams.cbs}
                    onChange={(e) => setFormParams({ ...formParams, cbs: e.target.value })}
                    className="bg-gray-900 border-gray-600 text-white w-32"
                    required
                  />
                  <Percent className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Total */}
            <Card className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFC107]/20 border-[#FFD700]/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[#FFD700] font-bold text-lg">Alíquota Total (IVA Dual)</h3>
                    <p className="text-gray-400 text-sm">IBS Estadual + IBS Municipal + CBS</p>
                  </div>
                  <div className="text-3xl font-bold text-[#FFD700]">
                    {totalAliquota()}%
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={savingParams || !backendAvailable}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold disabled:opacity-50"
              >
                {savingParams ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Parâmetros
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <h3 className="text-blue-400 font-semibold mb-2">Informação</h3>
            <p className="text-gray-300 text-sm">
              As alterações nas alíquotas serão refletidas automaticamente na Calculadora IBS/CBS Detalhada
              e na Calculadora Tributária Automática. As calculadoras desativadas não aparecerão na página
              de ferramentas do site.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
