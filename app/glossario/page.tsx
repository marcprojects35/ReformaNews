"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Loader2 } from "lucide-react"

interface GlossaryItem {
  id: number
  letter: string
  term: string
  definition: string
  active: boolean
  order: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export default function GlossarioPage() {
  const [glossary, setGlossary] = useState<GlossaryItem[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGlossary() {
      try {
        const response = await fetch(`${API_URL}/api/glossary`)
        if (response.ok) {
          const data = await response.json()
          setGlossary(data)
        }
      } catch (error) {
        console.error("Erro ao carregar glossário:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGlossary()
  }, [])

  // Agrupar termos por letra
  const glossarySections = useMemo(() => {
    const filtered = busca
      ? glossary.filter(g =>
          g.term.toLowerCase().includes(busca.toLowerCase()) ||
          g.definition.toLowerCase().includes(busca.toLowerCase())
        )
      : glossary

    const grouped: Record<string, GlossaryItem[]> = {}
    filtered.forEach(item => {
      if (!grouped[item.letter]) {
        grouped[item.letter] = []
      }
      grouped[item.letter].push(item)
    })

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, terms]) => ({
        letter,
        terms
      }))
  }, [glossary, busca])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 p-4 rounded-2xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                Glossário Tributário
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Entenda os termos técnicos da Reforma Tributária</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border-2 border-gray-200 dark:border-gray-700 focus-within:border-[#FF7A00] transition-all shadow-md">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Busque um termo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border-0 bg-transparent text-sm focus-visible:ring-0 p-0 h-auto dark:text-gray-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0046B3]" />
          </div>
        ) : (
          <div className="space-y-8">
            {glossarySections.map((section, index) => (
              <Card
                key={section.letter}
                className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7A00] to-[#FF9500] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">{section.letter}</span>
                    </div>
                    <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2">
                      {section.terms.length} {section.terms.length === 1 ? "termo" : "termos"}
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    {section.terms.map((item) => (
                      <div key={item.id} className="group">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[#FF7A00] transition-colors">
                          {item.term}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-4 border-[#0046B3]/20 group-hover:border-[#FF7A00] transition-colors">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && glossarySections.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Nenhum termo encontrado</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-[#FF7A00] to-[#FF9500] text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Quer mais informações?</h3>
          <p className="mb-6">
            Explore nossas calculadoras e ferramentas interativas para entender melhor como a Reforma Tributária impacta
            seu negócio.
          </p>
          <a href="/ferramentas">
            <button className="bg-white text-[#FF7A00] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all">
              Acessar ferramentas
            </button>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
