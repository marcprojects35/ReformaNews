"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, ArrowRight, Clock, Calendar, Bookmark } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShareDialog } from "./share-dialog"

const heroArticle = {
  title: "Novo Imposto Seletivo: o que muda com a Lei Complementar nº 214/2025",
  excerpt: "Lei Complementar nº 214/2025 cria nova estrutura fiscal e estabelece base de cálculo e alíquotas sustentáveis para produtos prejudiciais à saúde e ao meio ambiente.",
  date: "03 de novembro de 2025",
  category: "Reforma Tributária",
  badge: "DESTAQUE",
  tags: ["Imposto Seletivo", "LC 214/2025", "Reforma Tributária"],
  fullContent: `O Imposto Seletivo (IS) foi instituído pelos artigos 416 a 438 da Lei Complementar nº 214/2025. Ele incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente. As alíquotas serão atualizadas anualmente pelo IPCA, com apuração mensal e comunicação via DTE (domicílio tributário eletrônico).

**O que é o Imposto Seletivo?**

O Imposto Seletivo é um tributo federal que incide sobre produtos e serviços considerados prejudiciais à saúde humana ou ao meio ambiente. Ele foi criado no contexto da Reforma Tributária brasileira e substituirá parcialmente o IPI para determinados produtos.

**Principais características:**

• Incidência sobre produtos prejudiciais à saúde (bebidas alcoólicas, cigarros, bebidas açucaradas)
• Incidência sobre produtos prejudiciais ao meio ambiente (combustíveis fósseis, agrotóxicos)
• Alíquotas progressivas conforme o grau de nocividade
• Atualização anual pelo IPCA
• Apuração e recolhimento mensais

**Estrutura legal:**

1. **Arts. 416-420:** Estabelecem o fato gerador e base de cálculo
2. **Arts. 421-424:** Disciplinam as alíquotas e suas variações
3. **Arts. 425-427:** Definem os contribuintes e responsabilidades
4. **Art. 428:** Dispõe sobre não incidência nas exportações
5. **Arts. 429-433:** Tratam de infrações e penalidades
6. **Arts. 434-438:** Disposições transitórias e finais

**Produtos abrangidos:**

O Imposto Seletivo incidirá principalmente sobre:

• Bebidas alcoólicas (cervejas, vinhos, destilados)
• Produtos fumígenos (cigarros, charutos, tabaco)
• Bebidas açucaradas (refrigerantes, sucos industrializados com açúcar)
• Combustíveis fósseis (gasolina, diesel, gás natural)
• Veículos automotores (conforme emissão de poluentes)
• Embarcações e aeronaves particulares
• Minerais extraídos (petróleo, gás, minérios)

**Alíquotas previstas:**

As alíquotas do Imposto Seletivo serão definidas por lei ordinária e poderão variar conforme:

• O grau de nocividade do produto
• O impacto ambiental da produção
• Políticas de saúde pública
• Metas de redução de emissões

**Cronograma de implementação:**

• 2026: Início da cobrança em fase de testes
• 2027: Implementação gradual com alíquotas reduzidas
• 2028-2032: Transição completa com alíquotas integrais

**Impactos para as empresas:**

As empresas que comercializam produtos sujeitos ao Imposto Seletivo deverão:

• Adequar seus sistemas de faturamento
• Revisar a precificação dos produtos
• Atualizar as notas fiscais eletrônicas
• Implementar controles de apuração mensal
• Comunicar-se via DTE com a Receita Federal

**Não incidência:**

O Imposto Seletivo não incide sobre:

• Exportações de produtos
• Operações interestaduais para comercialização
• Produtos destinados à Zona Franca de Manaus (condições específicas)
• Medicamentos e insumos farmacêuticos

**Fiscalização e penalidades:**

A fiscalização será realizada pela Receita Federal, com multas que podem chegar a:

• 75% do valor do imposto devido (fraude)
• 50% do valor (sonegação)
• 20% do valor (erros não intencionais)

**Conclusão:**

O Imposto Seletivo representa uma mudança significativa na tributação de produtos nocivos à saúde e ao meio ambiente. As empresas devem se preparar com antecedência para cumprir as novas obrigações e evitar penalidades.`,
}

export function HeroNews() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const formatContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <h3 key={i} className="text-lg font-bold text-[#0046B3] mt-6 mb-3">
            {line.replace(/\*\*/g, '')}
          </h3>
        )
        i++
      } else if (line.startsWith('• ')) {
        const listItems: React.ReactNode[] = []
        while (i < lines.length && lines[i].startsWith('• ')) {
          listItems.push(
            <li key={i} className="flex items-start gap-2 mb-2">
              <span className="text-[#FF7A00] font-bold mt-1">•</span>
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
              <span className="text-[#FF7A00] font-bold">{lines[i].match(/^\d+/)?.[0]}.</span>
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
          <p key={i} className="text-gray-700 leading-relaxed mb-3">
            {line}
          </p>
        )
        i++
      }
    }

    return elements
  }

  return (
    <>
      <Card className="overflow-hidden border-none shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0046B3]/5 via-transparent to-[#FF7A00]/5 pointer-events-none" />

          <div className="relative p-10 bg-white">
            <div className="flex items-center gap-3 mb-5">
              <Badge className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 text-white hover:from-[#0046B3]/90 hover:to-[#0046B3]/70 shadow-lg shadow-[#0046B3]/20 px-4 py-1.5 text-xs font-semibold tracking-wide">
                {heroArticle.badge}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{heroArticle.date}</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 bg-clip-text text-transparent mb-5 leading-tight group-hover:scale-[1.01] transition-transform duration-300">
              {heroArticle.title}
            </h1>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
              {heroArticle.excerpt}
            </p>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed mb-6">
                O <strong className="text-[#0046B3]">Imposto Seletivo (IS)</strong> foi instituído pelos artigos 416 a 438
                da Lei Complementar nº 214/2025. Ele incide sobre bens e serviços prejudiciais à saúde ou ao meio
                ambiente. As alíquotas serão atualizadas anualmente pelo IPCA, com apuração mensal e comunicação via DTE
                (domicílio tributário eletrônico).
              </p>

              <div className="relative bg-gradient-to-r from-[#FFF7ED] to-orange-50 rounded-xl p-6 border-l-4 border-[#FF7A00] shadow-md">
                <h3 className="text-[#FF7A00] font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF7A00] rounded-full animate-pulse"></span>
                  Principais Pontos
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7A00] font-bold mt-0.5">•</span>
                    <span>
                      <strong>Arts. 416-420:</strong> Estabelecem o fato gerador e base de cálculo
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7A00] font-bold mt-0.5">•</span>
                    <span>
                      <strong>Arts. 421-424:</strong> Disciplinam as alíquotas e suas variações
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7A00] font-bold mt-0.5">•</span>
                    <span>
                      <strong>Arts. 425-427:</strong> Definem os contribuintes e responsabilidades
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7A00] font-bold mt-0.5">•</span>
                    <span>
                      <strong>Art. 428:</strong> Dispõe sobre não incidência nas exportações
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7A00] font-bold mt-0.5">•</span>
                    <span>
                      <strong>Arts. 429-433:</strong> Tratam de infrações e penalidades
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/90 hover:from-[#FF7A00]/90 hover:to-[#FF7A00]/80 text-white shadow-lg shadow-[#FF7A00]/30 hover:shadow-xl hover:shadow-[#FF7A00]/40 transition-all duration-300 hover:scale-105 px-6 py-6 text-base font-semibold"
              >
                Ler matéria completa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsShareDialogOpen(true)}
                className="border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-[#FF7A00] transition-all duration-300 w-12 h-12 rounded-full"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Fonte:</span> Portal Reforma Tributária News – Lei Complementar nº 214/2025
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white text-[#0046B3] px-3 py-1 text-xs font-bold tracking-wide">
                {heroArticle.badge}
              </Badge>
              <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">
                {heroArticle.category}
              </span>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white leading-tight">
                {heroArticle.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Leia a notícia completa sobre {heroArticle.category}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Calendar className="h-4 w-4" />
                <span>{heroArticle.date}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {heroArticle.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white/90">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <ScrollArea className="h-[50vh] px-6 py-4">
            <div className="prose prose-sm max-w-none">
              {formatContent(heroArticle.fullContent)}
            </div>
          </ScrollArea>
          <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Fonte:</span> Portal Reforma Tributária News
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  setIsDialogOpen(false)
                  setIsShareDialogOpen(true)
                }}
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        title={heroArticle.title}
      />
    </>
  )
}
