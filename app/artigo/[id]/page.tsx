"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Download, FileText, User, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Article {
  id: number
  title: string
  excerpt: string | null
  content: string
  category_id: number
  writer_id: number
  image_url: string | null
  file_url: string | null
  active: boolean
  order: number
  writer_name: string | null
  writer_role: string | null
  writer_image_url: string | null
  category_name: string | null
  created_at: string
  updated_at: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export default function ArtigoPage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`${API_URL}/api/articles/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setArticle(data)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Erro ao carregar artigo:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchArticle()
  }, [params.id])

  const estimateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
        <Header />
        <div className="text-center py-32">
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Artigo não encontrado</p>
          <Link href="/artigos">
            <Button variant="ghost" className="mt-4 text-[#FFD700] hover:bg-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para artigos
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <Link href="/artigos">
          <Button variant="ghost" className="mb-8 text-gray-300 hover:bg-gray-800 hover:text-white group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para artigos
          </Button>
        </Link>

        <article className="animate-fade-in">
          <div className="bg-gray-800/50 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
            {/* Hero Image */}
            {article.image_url && (
              <div className="relative h-[350px] bg-gradient-to-br from-[#1a1a1a] to-[#2D3748]">
                <Image src={article.image_url} alt={article.title} fill className="object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                    {article.title}
                  </h1>
                </div>
              </div>
            )}

            <div className="p-8 lg:p-12">
              {/* Title (if no image) */}
              {!article.image_url && (
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
                  {article.title}
                </h1>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-700">
                {article.category_name && (
                  <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 px-4 py-2 font-semibold">
                    {article.category_name}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                  <span className="text-sm font-medium">
                    {new Date(article.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-5 w-5 text-[#FFD700]" />
                  <span className="text-sm font-medium">Leitura de {estimateReadTime(article.content)}</span>
                </div>

                {article.file_url && (
                  <a href={article.file_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                    <Button variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Download className="h-4 w-4" />
                      Baixar PDF
                    </Button>
                  </a>
                )}
              </div>

              {/* Writer Card */}
              {article.writer_name && (
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  {article.writer_image_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#FFD700]/70 flex-shrink-0">
                      <Image src={article.writer_image_url} alt={article.writer_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center border-2 border-[#FFD700]/70 flex-shrink-0">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold">{article.writer_name}</p>
                    {article.writer_role && (
                      <p className="text-[#FFD700] text-sm">{article.writer_role}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-gray-300 leading-relaxed mb-8 italic border-l-4 border-[#FFD700] pl-6">
                  {article.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-gray-300 prose-a:text-[#FFD700] prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* CTA */}
              <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 p-8 rounded-2xl mt-12">
                <h3 className="text-2xl font-bold mb-4">Precisa de orientação especializada?</h3>
                <p className="mb-6">
                  Entre em contato com nossos canais de atendimento através do WhatsApp Suporte Reforma Tributária News
                </p>
                <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">(34) 99862-3164</Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
