"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Phone, Image as ImageIcon, Globe } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

interface Setting {
  id: number
  key: string
  value: string
  updated_at: string
}

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Setting[]>([])

  const [formData, setFormData] = useState({
    whatsapp_number: "",
    logo_url: "",
    site_title: ""
  })

  useEffect(() => {
    checkAuth()
    loadSettings()
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
      if (!response.ok) throw new Error("Unauthorized")
    } catch (error) {
      localStorage.removeItem("admin_token")
      router.push("/admin")
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch("http://localhost:8001/api/settings")
      const data: Setting[] = await response.json()
      setSettings(data)

      // Populate form
      const settingsMap: any = {}
      data.forEach(setting => {
        settingsMap[setting.key] = setting.value
      })

      setFormData({
        whatsapp_number: settingsMap.whatsapp_number || "",
        logo_url: settingsMap.logo_url || "",
        site_title: settingsMap.site_title || ""
      })
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert("Configurações salvas com sucesso!")
        loadSettings()
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
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
            <h1 className="text-lg font-bold text-white">Configurações</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Configurações Gerais</h2>
          <p className="text-gray-400">Configure as informações do site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* WhatsApp */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#FFD700]" />
                WhatsApp
              </CardTitle>
              <CardDescription className="text-gray-400">
                Número usado no botão "Fale Conosco"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="5534998623164"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Formato: Código do país + DDD + número (sem espaços ou caracteres especiais)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Exemplo: 5534998623164
              </p>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#FFD700]" />
                Logo do Site
              </CardTitle>
              <CardDescription className="text-gray-400">
                URL da logo exibida no cabeçalho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                value={formData.logo_url}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                accept="image/*"
                placeholder="https://exemplo.com/logo.png"
                required
              />
            </CardContent>
          </Card>

          {/* Site Title */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#FFD700]" />
                Título do Site
              </CardTitle>
              <CardDescription className="text-gray-400">
                Nome do site exibido no rodapé e em outros lugares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="CTributária News"
                required
              />
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
              disabled={saving}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <Card className="bg-blue-500/10 border-blue-500/30 mt-8">
          <CardContent className="p-6">
            <h3 className="text-blue-400 font-semibold mb-2">💡 Dica</h3>
            <p className="text-gray-300 text-sm">
              Após salvar as configurações, algumas mudanças podem exigir recarregar a página do site para serem visualizadas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
