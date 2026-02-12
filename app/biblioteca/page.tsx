"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Download,
  FileText,
  Search,
  FileSpreadsheet,
  FileType,
  Video,
  ExternalLink,
  Loader2
} from "lucide-react"

interface Documento {
  id: number
  title: string
  description: string
  doc_type: string
  category: string
  file_size: string | null
  url: string
  active: boolean
  order: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

export default function BibliotecaPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [categorias, setCategorias] = useState<string[]>(["Todas"])
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocumentos() {
      try {
        const response = await fetch(`${API_URL}/api/documents`)
        if (response.ok) {
          const data = await response.json()
          setDocumentos(data)

          // Extrair categorias únicas
          const uniqueCategories = ["Todas", ...Array.from(new Set(data.map((d: Documento) => d.category)))] as string[]
          setCategorias(uniqueCategories)
        }
      } catch (error) {
        console.error("Erro ao carregar documentos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocumentos()
  }, [])

  const documentosFiltrados = documentos.filter(doc => {
    const matchBusca = doc.title.toLowerCase().includes(busca.toLowerCase()) ||
                       doc.description.toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = categoriaAtiva === "Todas" || doc.category === categoriaAtiva
    return matchBusca && matchCategoria
  })

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "pdf": return <FileText className="h-8 w-8 text-red-500" />
      case "excel": return <FileSpreadsheet className="h-8 w-8 text-green-600" />
      case "video": return <Video className="h-8 w-8 text-blue-500" />
      case "link": return <ExternalLink className="h-8 w-8 text-purple-500" />
      default: return <FileType className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] p-4 rounded-2xl shadow-lg shadow-yellow-500/20">
              <BookOpen className="h-8 w-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFC107] bg-clip-text text-transparent">
                Biblioteca
              </h1>
              <p className="text-gray-400 mt-2">
                Materiais, planilhas e documentos para download
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar documentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FFD700]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categorias.map(cat => (
              <Button
                key={cat}
                variant={categoriaAtiva === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoriaAtiva(cat)}
                className={categoriaAtiva === cat
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentosFiltrados.map(doc => (
              <Card key={doc.id} className="group hover:shadow-2xl transition-all duration-300 bg-gray-800/50 border-gray-700 hover:border-[#FFD700]/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-900/50 rounded-xl">
                      {getIconByType(doc.doc_type)}
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 text-xs border-gray-600 text-gray-400">
                        {doc.category}
                      </Badge>
                      <CardTitle className="text-lg leading-tight text-white group-hover:text-[#FFD700] transition-colors">
                        {doc.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">
                    {doc.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    {doc.file_size && (
                      <span className="text-xs text-gray-500">{doc.file_size}</span>
                    )}
                    <a href={doc.url} download>
                      <Button size="sm" className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 font-semibold hover:from-[#FFC107] hover:to-[#FFD700]">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && documentosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum documento encontrado</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
