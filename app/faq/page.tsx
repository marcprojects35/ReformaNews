"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FAQItem {
  id: number
  category: string
  question: string
  answer: string
  active: boolean
  order: number
}

interface FAQCategory {
  category: string
  questions: FAQItem[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [whatsappNumber, setWhatsappNumber] = useState("")

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const response = await fetch(`${API_URL}/api/faqs`)
        if (response.ok) {
          const data = await response.json()
          setFaqs(data)
        }
      } catch (error) {
        console.error("Erro ao carregar FAQs:", error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchSettings() {
      try {
        const response = await fetch(`${API_URL}/api/settings`)
        if (response.ok) {
          const data = await response.json()
          const settingsMap: Record<string, string> = {}
          data.forEach((setting: { key: string; value: string }) => {
            settingsMap[setting.key] = setting.value
          })
          setWhatsappNumber(settingsMap.whatsapp_number || "")
        }
      } catch {
        console.error("Erro ao carregar configurações do FAQ")
      }
    }

    fetchFaqs()
    fetchSettings()
  }, [])

  // Agrupar FAQs por categoria
  const faqCategories = useMemo(() => {
    const filtered = busca
      ? faqs.filter(f =>
          f.question.toLowerCase().includes(busca.toLowerCase()) ||
          f.answer.toLowerCase().includes(busca.toLowerCase())
        )
      : faqs

    const grouped: Record<string, FAQItem[]> = {}
    filtered.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = []
      }
      grouped[faq.category].push(faq)
    })

    return Object.entries(grouped).map(([category, questions]) => ({
      category,
      questions
    }))
  }, [faqs, busca])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] p-4 rounded-2xl shadow-lg">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                Perguntas Frequentes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Encontre respostas para as dúvidas mais comuns sobre a Reforma Tributária
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border-2 border-gray-200 dark:border-gray-700 focus-within:border-[#FF7A00] transition-all shadow-md">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Busque sua dúvida..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border-0 bg-transparent text-sm focus-visible:ring-0 p-0 h-auto dark:text-gray-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
          </div>
        ) : (
          <div className="space-y-8">
            {faqCategories.map((category, index) => (
              <Card
                key={category.category}
                className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 text-white px-4 py-2 text-sm">
                      {category.category}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.questions.length} perguntas
                    </span>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem
                        key={item.id}
                        value={`item-${index}-${qIndex}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 hover:border-[#FF7A00]/50 transition-colors"
                      >
                        <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-gray-100 hover:text-[#FF7A00] hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && faqCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Nenhuma pergunta encontrada</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Não encontrou sua dúvida?</h3>
          <p className="mb-6">Entre em contato conosco pelo WhatsApp e nossa equipe especializada irá ajudá-lo.</p>
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <button className="bg-white text-[#0046B3] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all">
                Falar com especialista
              </button>
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
