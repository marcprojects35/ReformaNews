"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Share2, BookmarkPlus, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NoticiaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-gray-300 hover:bg-gray-800 hover:text-white group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para início
          </Button>
        </Link>

        <article className="animate-fade-in">
          <div className="bg-gray-800/50 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="relative h-[400px] bg-gradient-to-br from-[#1a1a1a] to-[#2D3748]">
              <Image src="/tax-reform-brazil-fiscal-documents.jpg" alt="Imposto Seletivo" fill className="object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <h1 className="text-5xl font-bold text-white text-center leading-tight max-w-4xl">
                  Novo Imposto Seletivo: o que muda com a Lei Complementar nº 214/2025
                </h1>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-700">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2">Urgente</Badge>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                  <span className="text-sm font-medium">03 de novembro de 2025</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-5 w-5 text-[#FFD700]" />
                  <span className="text-sm font-medium">Leitura de 5 min</span>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <BookmarkPlus className="h-4 w-4" />
                    Salvar
                  </Button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none prose-invert">
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  O Reforma Tributária News sempre estudando e trazendo conteúdo em primeira mão. A equipe do Reforma Tributária News acompanha
                  de perto cada etapa da Reforma Tributária e, após análise dos artigos 416 ao 438 da Lei Complementar
                  nº 214/2025, apresenta um resumo dos principais pontos de destaque.
                </p>

                <div className="bg-gray-900/50 border-l-4 border-[#FFD700] p-6 rounded-r-xl mb-8">
                  <p className="text-[#FFD700] font-semibold mb-2">Objetivo</p>
                  <p className="text-gray-300">
                    Compartilhar conhecimento técnico de forma clara e prática, para que nossos clientes e parceiros
                    compreendam como essas mudanças impactarão o dia a dia das empresas.
                  </p>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4 mt-8">O que é o Imposto Seletivo?</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  A Lei Complementar nº 214/2025 institui o Imposto Seletivo (IS), tributo federal com fundamento nos
                  arts. 416 a 438, destinado a incidir sobre bens e serviços prejudiciais à saúde ou ao meio ambiente.
                </p>

                <h3 className="text-2xl font-bold text-white mb-4 mt-8">Art. 416 - Fato Gerador</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Estabelece o fato gerador e a abrangência do imposto, enquanto os arts. 417 a 420 tratam da base de
                  cálculo, determinando que esta não pode ser inferior ao valor de mercado em operações entre partes
                  relacionadas. Também excluem-se da base o valor de outros tributos, descontos incondicionais e
                  devoluções de mercadorias.
                </p>

                <h3 className="text-2xl font-bold text-white mb-4 mt-8">Arts. 421 a 424 - Alíquotas</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Disciplinam as alíquotas, a serem fixadas em lei ordinária, podendo variar conforme a natureza,
                  destinação e impacto ambiental do bem ou serviço. Prevê-se ainda a possibilidade de redução ou isenção
                  conforme políticas públicas específicas.
                </p>

                <Card className="border-2 border-[#FFD700]/30 bg-gray-900/50 my-8">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#FFD700]" />
                      Pontos de Atenção
                    </h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex gap-2">
                        <span className="text-[#FFD700] font-bold">•</span>
                        <span>
                          Contribuintes incluem fabricantes, importadores, extrativistas e prestadores de serviços
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#FFD700] font-bold">•</span>
                        <span>
                          Não incidência nas exportações, desde que comprovada a saída efetiva do território nacional
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#FFD700] font-bold">•</span>
                        <span>Infrações podem resultar em perdimento de mercadorias e sanções fiscais</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[#FFD700] font-bold">•</span>
                        <span>Apuração e pagamento mensais, centralizados em um único estabelecimento</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <h2 className="text-3xl font-bold text-white mb-4 mt-8">Conclusão</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Em síntese, os arts. 416 a 438 da Lei Complementar nº 214/2025 estruturam o funcionamento do Imposto
                  Seletivo, estabelecendo parâmetros de sustentabilidade, transparência e eficiência fiscal,
                  consolidando-o como instrumento regulatório dentro do novo sistema tributário brasileiro.
                </p>

                <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 p-8 rounded-2xl mt-12">
                  <h3 className="text-2xl font-bold mb-4">Precisa de orientação especializada?</h3>
                  <p className="mb-6">
                    Entre em contato com nossos canais de atendimento através do WhatsApp Suporte Reforma Tributária News
                  </p>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 font-semibold">(34) 99862-3164</Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
