"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, ExternalLink, Newspaper, Loader2 } from "lucide-react"
import Image from "next/image"

interface Newsletter {
  id: number
  title: string
  edition: string
  description: string
  highlight: string
  image_url: string
  pdf_url: string
  active: boolean
}

export function NewsletterDownload() {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNewsletter = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/newsletter")
        if (response.ok) {
          const data = await response.json()
          setNewsletter(data)
        }
      } catch (error) {
        console.error("Erro ao carregar newsletter:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNewsletter()
  }, [])

  const handleDownload = () => {
    if (!newsletter?.pdf_url) return
    const link = document.createElement("a")
    link.href = newsletter.pdf_url
    link.download = `${newsletter.title.replace(/\s+/g, "-")}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewOnline = () => {
    if (!newsletter?.pdf_url) return
    window.open(newsletter.pdf_url, "_blank")
  }

  if (loading) {
    return (
      <Card className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl relative z-10">
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 text-[#FFD700] animate-spin" />
        </div>
      </Card>
    )
  }

  // Fallback quando não há newsletter cadastrada
  if (!newsletter) {
    return (
      <Card className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl relative z-10">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-xl shadow-lg shadow-yellow-500/20">
              <Newspaper className="h-6 w-6 text-gray-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Portal News - Jornal
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4 text-[#FFD700]" />
                <span>Edição em breve</span>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-xl bg-gray-900/30">
            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Nenhuma edição disponível no momento
            </p>
            <p className="text-gray-500 text-sm">
              Fique atento! Em breve teremos novidades.
            </p>
          </div>

          {/* Disabled Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              disabled
              className="flex-1 bg-gray-600 text-gray-400 font-bold py-6 rounded-xl cursor-not-allowed"
            >
              <Download className="h-5 w-5 mr-2" />
              Baixar PDF Completo
            </Button>
            <Button
              disabled
              variant="outline"
              className="flex-1 border-2 border-gray-600 text-gray-500 font-bold py-6 rounded-xl bg-transparent cursor-not-allowed"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Visualizar Online
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl hover:border-[#FFD700]/50 transition-all duration-300 group relative z-10">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-xl shadow-lg shadow-yellow-500/20">
            <Newspaper className="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white group-hover:text-[#FFD700] transition-colors">
              {newsletter.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4 text-[#FFD700]" />
              <span>{newsletter.edition}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          {newsletter.description}
        </p>

        {/* Image Preview */}
        <div className="relative mb-6 overflow-hidden rounded-xl border border-gray-700 shadow-lg group/image">
          <Image
            src={newsletter.image_url}
            alt={newsletter.title}
            width={800}
            height={400}
            className="w-full h-auto transition-transform duration-500 group-hover/image:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-full flex items-center justify-center mx-auto mb-3 transform scale-90 group-hover/image:scale-100 transition-transform duration-300 shadow-lg shadow-yellow-500/30">
                <Download className="h-10 w-10 text-gray-900" />
              </div>
              <p className="text-white font-bold text-lg">Clique para baixar</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFD700]/90 hover:to-[#FFC107]/90 text-gray-900 font-bold py-6 rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105 group/button"
          >
            <Download className="h-5 w-5 mr-2 group-hover/button:animate-bounce" />
            Baixar PDF Completo
          </Button>
          <Button
            onClick={handleViewOnline}
            variant="outline"
            className="flex-1 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-gray-900 font-bold py-6 rounded-xl transition-all duration-300 bg-transparent"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Visualizar Online
          </Button>
        </div>

        {/* Highlight Section */}
        {newsletter.highlight && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <div className="flex items-start gap-3">
              <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-bold px-3 py-1 text-xs whitespace-nowrap">
                DESTAQUE
              </Badge>
              <p className="text-sm text-gray-300 leading-relaxed">
                {newsletter.highlight}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
