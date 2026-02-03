"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, Image as ImageIcon, Settings, LogOut, LayoutDashboard, Globe, Sparkles, Calendar, TrendingUp, FileText } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.push("/admin")
        return
      }

      try {
        const response = await fetch("http://localhost:8001/api/auth/check", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Unauthorized")
        }
      } catch (error) {
        localStorage.removeItem("admin_token")
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Portal Administrativo</h1>
                <p className="text-xs text-gray-400">Reforma Tributária News CMS</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">Gerencie o conteúdo do seu site</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/news">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Newspaper className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Notícias</CardTitle>
                <p className="text-gray-400 text-sm">
                  Criar, editar e gerenciar notícias do portal
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/pending">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group relative">
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                IA
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Sparkles className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Notícias Pendentes</CardTitle>
                <p className="text-gray-400 text-sm">
                  Aprovar notícias geradas automaticamente pela IA
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/sources">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Globe className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Fontes (IA)</CardTitle>
                <p className="text-gray-400 text-sm">
                  Configurar sites para busca automática de notícias
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/banner">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ImageIcon className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Banner</CardTitle>
                <p className="text-gray-400 text-sm">
                  Gerenciar slides do banner principal
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Settings className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Configurações</CardTitle>
                <p className="text-gray-400 text-sm">
                  Ajustar WhatsApp, logo e outras configurações
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/calendar">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Calendar className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Calendário Fiscal</CardTitle>
                <p className="text-gray-400 text-sm">
                  Gerenciar datas e eventos do calendário fiscal
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/highlights">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Destaques da Semana</CardTitle>
                <p className="text-gray-400 text-sm">
                  Gerenciar destaques exibidos na sidebar
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/newsletter">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="w-12 h-12 text-[#FFD700] group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-white mb-2">Jornal / Newsletter</CardTitle>
                <p className="text-gray-400 text-sm">
                  Gerenciar edições do jornal em PDF
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Link href="/">Ver Site</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900">
                  <Link href="/admin/news">Nova Notícia</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
