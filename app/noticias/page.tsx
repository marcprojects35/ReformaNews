"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { noticias, categorias, buscarNoticias, getNoticiasPorCategoria } from "@/lib/noticias-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, ArrowRight, Newspaper, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const ITEMS_PER_PAGE = 6

export default function NoticiasPage() {
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")
  const [paginaAtual, setPaginaAtual] = useState(1)

  const noticiasFiltradas = useMemo(() => {
    let resultado = categoriaAtiva === "Todas" ? noticias : getNoticiasPorCategoria(categoriaAtiva)
    if (busca.trim()) {
      resultado = resultado.filter(n => 
        n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        n.resumo.toLowerCase().includes(busca.toLowerCase()) ||
        n.tags.some(tag => tag.toLowerCase().includes(busca.toLowerCase()))
      )
    }
    return resultado
  }, [busca, categoriaAtiva])

  const totalPaginas = Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE)
  const noticiasPaginadas = noticiasFiltradas.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  )

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaAtiva(categoria)
    setPaginaAtual(1)
  }

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value)
    setPaginaAtual(1)
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Urgente": return "bg-gradient-to-r from-red-500 to-red-600"
      case "Atualização": return "bg-gradient-to-r from-[#FFD700] to-[#FFC107]"
      case "Reforma": return "bg-gradient-to-r from-purple-500 to-purple-600"
      case "Legislação": return "bg-gradient-to-r from-emerald-500 to-emerald-600"
      case "Simples": return "bg-gradient-to-r from-[#FFD700] to-[#FFC107]"
      case "Obrigações": return "bg-gradient-to-r from-amber-500 to-amber-600"
      default: return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] p-4 rounded-2xl shadow-lg shadow-yellow-500/20">
              <Newspaper className="h-8 w-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent">
                Notícias Tributárias
              </h1>
              <p className="text-gray-400 mt-2">
                Acompanhe as últimas atualizações sobre a Reforma Tributária e legislação fiscal
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar notícias por título, resumo ou tags..."
              value={busca}
              onChange={handleBuscaChange}
              className="pl-12 py-6 text-lg rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            {categorias.map(cat => (
              <Button
                key={cat}
                variant={categoriaAtiva === cat ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoriaChange(cat)}
                className={categoriaAtiva === cat
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-400">
          Exibindo {noticiasPaginadas.length} de {noticiasFiltradas.length} notícias
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {noticiasPaginadas.map(noticia => (
            <Card key={noticia.id} className="group hover:shadow-2xl transition-all duration-300 bg-gray-800/50 border-gray-700 hover:border-[#FFD700]/50 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getCategoriaColor(noticia.categoria)} text-gray-900 text-xs font-bold shadow-lg`}>
                    {noticia.categoria}
                  </Badge>
                  {noticia.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-lg leading-tight text-white group-hover:text-[#FFD700] transition-colors line-clamp-2">
                  {noticia.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {noticia.resumo}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 text-[#FFD700]" />
                    {new Date(noticia.data).toLocaleDateString('pt-BR')}
                  </div>
                  <Link href={`/noticia/${noticia.id}`}>
                    <Button variant="ghost" size="sm" className="text-[#FFD700] hover:bg-[#FFD700] hover:text-gray-900 font-semibold group/btn rounded-full px-4">
                      Ler mais
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {noticiasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhuma notícia encontrada</p>
            <p className="text-gray-500 text-sm">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
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
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
