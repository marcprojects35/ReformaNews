"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, X, Home, Wrench, Newspaper, BookOpen, MessageCircle, Settings } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState({
    whatsapp_number: "5534998623164",
    logo_url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-LCnFAhRppf1WpoIrMPm80uY0pn1a0U.png",
    site_title: "Reforma News"
  })

  useEffect(() => {
    // Load settings from backend
    const loadSettings = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/settings")
        if (response.ok) {
          const data = await response.json()
          const settingsMap: Record<string, string> = {}
          data.forEach((setting: { key: string; value: string }) => {
            settingsMap[setting.key] = setting.value
          })
          setSettings({
            whatsapp_number: settingsMap.whatsapp_number || "5534998623164",
            logo_url: settingsMap.logo_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-LCnFAhRppf1WpoIrMPm80uY0pn1a0U.png",
            site_title: settingsMap.site_title || "Reforma News"
          })
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }

    loadSettings()
  }, [])

  return (
    <>
      <header className="border-b border-gray-700 bg-gray-900/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-gray-900/50 transition-colors">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link href="/">
                <Image
                  src={settings.logo_url}
                  alt={settings.site_title}
                  width={280}
                  height={60}
                  className="h-12 w-auto transition-transform hover:scale-105 duration-300 cursor-pointer"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-semibold text-gray-200 hover:text-[#FFD700] transition-all duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/noticias"
                className="text-sm font-semibold text-gray-200 hover:text-[#FFD700] transition-all duration-300 relative group"
              >
                Notícias
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/ferramentas"
                className="text-sm font-semibold text-gray-200 hover:text-[#FFD700] transition-all duration-300 relative group"
              >
                Ferramentas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/biblioteca"
                className="text-sm font-semibold text-gray-200 hover:text-[#FFD700] transition-all duration-300 relative group"
              >
                Biblioteca
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=Olá!%20Preciso%20de%20ajuda%20com%20questões%20tributárias.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105"
              >
                Fale Conosco
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 transition-all hover:bg-gray-700">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar..."
                  className="border-0 bg-transparent text-sm w-[160px] focus-visible:ring-0 p-0 h-auto text-gray-200"
                />
              </div>

              <Select defaultValue="MG">
                <SelectTrigger className="w-[80px] border-gray-600 bg-gray-800 hover:bg-gray-700 transition-colors text-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MG">MG</SelectItem>
                  <SelectItem value="SP">SP</SelectItem>
                  <SelectItem value="RJ">RJ</SelectItem>
                  <SelectItem value="RS">RS</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                  <SelectItem value="PR">PR</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-200 hover:bg-gray-800 transition-colors rounded-full"
                  title="Portal Administrativo"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-200 hover:bg-gray-800 rounded-full"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-[300px] bg-gray-900 shadow-2xl z-50 lg:hidden animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-200 hover:bg-gray-800 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Home className="h-5 w-5 text-[#FFD700]" />
                  <span className="font-semibold">Home</span>
                </Link>

                <Link
                  href="/noticias"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Newspaper className="h-5 w-5 text-[#FFD700]" />
                  <span className="font-semibold">Notícias</span>
                </Link>

                <Link
                  href="/ferramentas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Wrench className="h-5 w-5 text-[#FFD700]" />
                  <span className="font-semibold">Ferramentas</span>
                </Link>

                <Link
                  href="/biblioteca"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-[#FFD700]" />
                  <span className="font-semibold">Biblioteca</span>
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp_number}?text=Olá!%20Preciso%20de%20ajuda%20com%20questões%20tributárias.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#FFD700]" />
                  <span className="font-semibold">Fale Conosco</span>
                </a>
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-r from-[#FFD700] to-[#FFC107] rounded-xl text-gray-900">
                <p className="text-sm font-semibold mb-2">Precisa de ajuda?</p>
                <p className="text-xs mb-3">Fale com nossos especialistas</p>
                <a
                  href={`https://wa.me/${settings.whatsapp_number}?text=Olá!%20Preciso%20de%20ajuda%20com%20questões%20tributárias.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-white text-[#1a1a1a] font-semibold py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors shadow-md"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
