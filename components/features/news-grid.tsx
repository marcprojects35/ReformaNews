"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, TrendingUp, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsArticle {
  id: number
  category: string
  title: string
  excerpt: string
  content: string
  date: string
  badge: string
  badge_color: string
  tags: string[]
  source: string
  image_url?: string
}

interface NewsGridProps {
  searchQuery?: string
  activeFilters?: string[]
}

export function NewsGrid({ searchQuery = "", activeFilters = [] }: NewsGridProps) {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  // Load news from backend
  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/news")
        if (response.ok) {
          const data = await response.json()
          setNewsArticles(data)
        }
      } catch (error) {
        console.error("Erro ao carregar notícias:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article)
  }

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters = activeFilters.length === 0 || activeFilters.includes(article.category)

    return matchesSearch && matchesFilters
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    )
  }

  if (newsArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Nenhuma notícia disponível no momento.</p>
        <p className="text-gray-500 text-sm mt-2">Adicione notícias através do portal administrativo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-[#FFD700]" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1a1a1a] to-[#2D3748] dark:from-[#FFD700] dark:to-[#FFC107] bg-clip-text text-transparent">
            {filteredArticles.length === newsArticles.length
              ? "Últimas Notícias"
              : `${filteredArticles.length} Notícia${filteredArticles.length !== 1 ? "s" : ""} Encontrada${filteredArticles.length !== 1 ? "s" : ""}`}
          </h2>
        </div>
        <Button
          variant="outline"
          className="border-2 border-[#FFD700] text-[#1a1a1a] hover:bg-[#FFD700] hover:text-gray-900 bg-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Ver todas
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhuma notícia encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Card
              key={article.id}
              className="group hover:shadow-2xl transition-all duration-500 border border-gray-700 hover:border-[#FFD700]/50 animate-fade-in-up overflow-hidden bg-gray-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-7">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={article.badge_color as any}
                    className={`
                      ${
                        article.badge_color === "destructive"
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                          : article.badge_color === "secondary"
                            ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30"
                            : "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 shadow-lg shadow-yellow-500/30"
                      }
                      px-3 py-1 text-xs font-bold tracking-wide
                    `}
                  >
                    {article.badge}
                  </Badge>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#FFD700] transition-colors duration-300 cursor-pointer line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-300 mb-5 leading-relaxed line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-4 w-4 text-[#FFD700]" />
                    <span className="font-medium">{article.date}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FFD700] hover:text-gray-900 hover:bg-[#FFD700] font-semibold transition-all duration-300 rounded-full px-4"
                    onClick={() => handleReadMore(article)}
                  >
                    Ler mais
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900">
          {selectedArticle && (
            <>
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2D3748] p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    className={`
                      ${
                        selectedArticle.badge_color === "destructive"
                          ? "bg-red-500 text-white"
                          : selectedArticle.badge_color === "secondary"
                            ? "bg-gray-500 text-white"
                            : "bg-[#FFD700] text-gray-900"
                      }
                      px-3 py-1 text-xs font-bold tracking-wide
                    `}
                  >
                    {selectedArticle.badge}
                  </Badge>
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    {selectedArticle.category}
                  </span>
                </div>

                <DialogTitle className="text-3xl font-bold text-white leading-tight">
                  {selectedArticle.title}
                </DialogTitle>

                <DialogDescription className="text-white/80 mt-4 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedArticle.date}
                  </span>
                  <span>•</span>
                  <span>Fonte: {selectedArticle.source}</span>
                </DialogDescription>
              </div>

              <ScrollArea className="h-[60vh] px-6">
                <div className="py-6">
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    {formatContent(selectedArticle.content)}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-[#FFD700] text-[#FFD700] bg-[#FFD700]/5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-[#1a1a1a] dark:text-[#FFD700] mt-6 mb-3">
          {line.replace(/\*\*/g, '')}
        </h3>
      )
      i++
    } else if (line.startsWith('• ')) {
      const listItems: React.ReactNode[] = []
      while (i < lines.length && lines[i].startsWith('• ')) {
        listItems.push(
          <li key={i} className="flex items-start gap-2 mb-2">
            <span className="text-[#FFD700] font-bold mt-1">•</span>
            <span>{lines[i].substring(2)}</span>
          </li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="ml-4 mb-4">
          {listItems}
        </ul>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const listItems: React.ReactNode[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(
          <li key={i} className="flex items-start gap-2 mb-2">
            <span className="text-[#FFD700] font-bold">{lines[i].match(/^\d+/)?.[0]}.</span>
            <span>{lines[i].replace(/^\d+\.\s/, '')}</span>
          </li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="ml-4 mb-4">
          {listItems}
        </ol>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
      i++
    } else {
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          {line}
        </p>
      )
      i++
    }
  }

  return elements
}
