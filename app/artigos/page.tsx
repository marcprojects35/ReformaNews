"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Filter, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react"
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

interface ArticleCategory {
  id: number
  name: string
  description: string | null
  active: boolean
  order: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
const ITEMS_PER_PAGE = 9

export default function ArtigosPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [artRes, catRes] = await Promise.all([
          fetch(`${API_URL}/api/articles`),
          fetch(`${API_URL}/api/article-categories`),
        ])
        if (artRes.ok) {
          const data = await artRes.json()
          setArticles(Array.isArray(data) ? data : [])
        }
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error("Erro ao carregar artigos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const artigosFiltrados = useMemo(() => {
    let resultado = articles
    if (categoriaAtiva !== "Todas") {
      resultado = resultado.filter((a) => a.category_name === categoriaAtiva)
    }
    if (busca.trim()) {
      const search = busca.toLowerCase()
      resultado = resultado.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(search)) ||
          (a.writer_name && a.writer_name.toLowerCase().includes(search))
      )
    }
    return resultado
  }, [articles, busca, categoriaAtiva])

  // Group by category for section display
  const artigosPorCategoria = useMemo(() => {
    if (categoriaAtiva !== "Todas") return null
    const grouped: Record<string, Article[]> = {}
    for (const article of artigosFiltrados) {
      const catName = article.category_name || "Sem Categoria"
      if (!grouped[catName]) grouped[catName] = []
      grouped[catName].push(article)
    }
    // Sort by category order
    const sorted = Object.entries(grouped).sort(([a], [b]) => {
      const catA = categories.find((c) => c.name === a)
      const catB = categories.find((c) => c.name === b)
      return (catA?.order ?? 99) - (catB?.order ?? 99)
    })
    return sorted
  }, [artigosFiltrados, categoriaAtiva, categories])

  const totalPaginas = Math.ceil(artigosFiltrados.length / ITEMS_PER_PAGE)
  const artigosPaginados = artigosFiltrados.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  )

  const handleCategoriaChange = (cat: string) => {
    setCategoriaAtiva(cat)
    setPaginaAtual(1)
  }

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value)
    setPaginaAtual(1)
  }

  const renderArticleCard = (article: Article) => (
    <Link key={article.id} href={`/artigo/${article.id}`} className="group">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-[#FFD700]/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5 h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 bg-gray-700">
          {article.image_url ? (
            <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-4">{article.excerpt}</p>
          )}

          {/* Writer */}
          <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-700/50">
            {article.writer_image_url ? (
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#FFD700]/50 flex-shrink-0">
                <Image src={article.writer_image_url} alt={article.writer_name || ""} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 flex-shrink-0">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-gray-300 text-xs font-medium truncate">{article.writer_name || "Redator"}</p>
              {article.writer_role && (
                <p className="text-[#FFD700] text-[10px] truncate">{article.writer_role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] p-4 rounded-2xl shadow-lg shadow-yellow-500/20">
              <FileText className="h-8 w-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent">
                Artigos e Publicações
              </h1>
              <p className="text-gray-400 mt-2">
                Artigos, estudos e publicações sobre a Reforma Tributária
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar artigos por título, resumo ou redator..."
              value={busca}
              onChange={handleBuscaChange}
              className="pl-12 py-6 text-lg rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <Button
              variant={categoriaAtiva === "Todas" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoriaChange("Todas")}
              className={categoriaAtiva === "Todas"
                ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]"
                : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"}
            >
              Todas
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={categoriaAtiva === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoriaChange(cat.name)}
                className={categoriaAtiva === cat.name
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
          </div>
        ) : artigosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum artigo encontrado</p>
            <p className="text-gray-500 text-sm">Tente ajustar os filtros ou termo de busca</p>
          </div>
        ) : categoriaAtiva === "Todas" && !busca.trim() && artigosPorCategoria ? (
          /* Grouped by category view */
          <div className="space-y-12">
            {artigosPorCategoria.map(([catName, catArticles]) => (
              <section key={catName}>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-r from-[#FFD700] to-[#FFC107] px-6 py-2.5 rounded-lg shadow-lg shadow-yellow-500/10">
                    <h2 className="text-gray-900 font-bold text-lg">{catName}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                  {catArticles.map(renderArticleCard)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Filtered/paginated view */
          <>
            <div className="mb-4 text-sm text-gray-400">
              Exibindo {artigosPaginados.length} de {artigosFiltrados.length} artigos
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {artigosPaginados.map(renderArticleCard)}
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                  <Button
                    key={pagina}
                    variant={paginaAtual === pagina ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPaginaAtual(pagina)}
                    className={paginaAtual === pagina
                      ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"}
                  >
                    {pagina}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
