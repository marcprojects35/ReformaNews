"use client"

import { useState } from "react"
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
  ExternalLink
} from "lucide-react"

interface Documento {
  id: string
  titulo: string
  descricao: string
  tipo: "pdf" | "excel" | "video" | "link"
  categoria: string
  tamanho?: string
  url: string
}

const documentos: Documento[] = [
  {
    id: "1",
    titulo: "LC 214 - Sumário da Reforma Tributária",
    descricao: "Documento completo com o sumário da Lei Complementar 214/2025 sobre a Reforma Tributária.",
    tipo: "excel",
    categoria: "Legislação",
    tamanho: "98 KB",
    url: "/documentos/00. LC 214 - SUMÁRIO.xlsx"
  },
  {
    id: "2",
    titulo: "Tributos - Exercícios para Alunos",
    descricao: "Material de exercícios práticos sobre tributos para estudo e capacitação.",
    tipo: "excel",
    categoria: "Educacional",
    tamanho: "13 KB",
    url: "/documentos/01.02. Tributos_Exercícios_Alunos em branco.xlsx"
  },
  {
    id: "3",
    titulo: "Simples Nacional - Manual Completo",
    descricao: "Guia completo sobre o regime do Simples Nacional com tabelas e simulações.",
    tipo: "excel",
    categoria: "Simples Nacional",
    tamanho: "201 KB",
    url: "/documentos/02.01. Simples Nacional_MC.xlsx"
  },
  {
    id: "4",
    titulo: "Lucro Presumido - Simulações",
    descricao: "Planilha com simulações práticas para cálculo do Lucro Presumido.",
    tipo: "excel",
    categoria: "Lucro Presumido",
    tamanho: "29 KB",
    url: "/documentos/03.01. Lucro Presumido - Simulações.xlsx"
  },
  {
    id: "5",
    titulo: "Lucro Real - Simulações",
    descricao: "Planilha com simulações práticas para cálculo do Lucro Real.",
    tipo: "excel",
    categoria: "Lucro Real",
    tamanho: "30 KB",
    url: "/documentos/04.01. Lucro Real - Simulações.xlsx"
  },
  {
    id: "6",
    titulo: "Formação de Preço de Venda",
    descricao: "Planilha para formação de preço considerando tributos e margem de lucro.",
    tipo: "excel",
    categoria: "Precificação",
    tamanho: "31 KB",
    url: "/documentos/05.01. Formação de Preço.xlsx"
  },
  {
    id: "7",
    titulo: "Produtos IBS e CBS - Exemplos",
    descricao: "Exemplos práticos de produtos com aplicação de IBS e CBS.",
    tipo: "excel",
    categoria: "Reforma Tributária",
    tamanho: "10 KB",
    url: "/documentos/ex produtos ibs cbs.xlsx"
  }
]

const categorias = ["Todas", "Legislação", "Educacional", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Precificação", "Reforma Tributária"]

export default function BibliotecaPage() {
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")

  const documentosFiltrados = documentos.filter(doc => {
    const matchBusca = doc.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       doc.descricao.toLowerCase().includes(busca.toLowerCase())
    const matchCategoria = categoriaAtiva === "Todas" || doc.categoria === categoriaAtiva
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.map(doc => (
            <Card key={doc.id} className="group hover:shadow-2xl transition-all duration-300 bg-gray-800/50 border-gray-700 hover:border-[#FFD700]/50">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-900/50 rounded-xl">
                    {getIconByType(doc.tipo)}
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-xs border-gray-600 text-gray-400">
                      {doc.categoria}
                    </Badge>
                    <CardTitle className="text-lg leading-tight text-white group-hover:text-[#FFD700] transition-colors">
                      {doc.titulo}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  {doc.descricao}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  {doc.tamanho && (
                    <span className="text-xs text-gray-500">{doc.tamanho}</span>
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

        {documentosFiltrados.length === 0 && (
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
