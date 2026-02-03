import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"

const glossaryTerms = [
  {
    letter: "C",
    terms: [
      {
        term: "CBS - Contribuição sobre Bens e Serviços",
        definition:
          "Tributo federal que substituirá o PIS e a Cofins no novo sistema tributário. Será administrado pela Receita Federal e terá características de IVA não-cumulativo.",
      },
      {
        term: "cClassTrib",
        definition:
          "Novo código nacional de classificação tributária que substituirá o CST (Código de Situação Tributária) nos documentos fiscais eletrônicos a partir de 2026.",
      },
      {
        term: "Crédito Tributário",
        definition:
          "Direito do contribuinte de abater o imposto pago nas compras do imposto devido nas vendas, característica fundamental do sistema não-cumulativo.",
      },
    ],
  },
  {
    letter: "D",
    terms: [
      {
        term: "DERE",
        definition:
          "Declaração de Registro Eletrônico, obrigação acessória excepcional aplicável apenas a serviços financeiros, planos de saúde e concursos de prognósticos no novo sistema.",
      },
    ],
  },
  {
    letter: "G",
    terms: [
      {
        term: "GTIN - Global Trade Item Number",
        definition:
          "Código de identificação única de produtos reconhecido internacionalmente. Será obrigatório nas NF-e e NFC-e a partir de outubro de 2025 para controle fiscal.",
      },
    ],
  },
  {
    letter: "I",
    terms: [
      {
        term: "IBS - Imposto sobre Bens e Serviços",
        definition:
          "Tributo estadual e municipal que substituirá o ICMS e o ISS. Será administrado pelo Comitê Gestor do IBS e seguirá o princípio do destino.",
      },
      {
        term: "Imposto Seletivo (IS)",
        definition:
          "Novo tributo federal que incidirá sobre bens e serviços prejudiciais à saúde ou ao meio ambiente, como bebidas alcoólicas, cigarros e veículos poluentes.",
      },
      {
        term: "IVA - Imposto sobre Valor Agregado",
        definition:
          "Modelo de tributação que incide sobre o valor adicionado em cada etapa da cadeia produtiva. O Brasil adotará um IVA Dual com IBS e CBS.",
      },
      {
        term: "IVA Dual",
        definition:
          "Sistema com dois impostos sobre valor agregado: um federal (CBS) e outro subnacional (IBS), modelo adotado pelo Brasil na Reforma Tributária.",
      },
    ],
  },
  {
    letter: "N",
    terms: [
      {
        term: "NCM - Nomenclatura Comum do Mercosul",
        definition:
          "Código de oito dígitos que classifica mercadorias. Continuará existindo, mas o GTIN ganhará mais relevância para identificação específica de produtos.",
      },
      {
        term: "Não-cumulatividade",
        definition:
          "Princípio que permite deduzir o imposto pago nas etapas anteriores, evitando tributação em cascata e garantindo que o imposto incida apenas sobre o valor agregado.",
      },
    ],
  },
  {
    letter: "P",
    terms: [
      {
        term: "PMPF - Preço Médio Ponderado ao Consumidor Final",
        definition:
          "Base de cálculo utilizada em alguns regimes de substituição tributária, especialmente para combustíveis e bebidas.",
      },
      {
        term: "Princípio do Destino",
        definition:
          "Regra pela qual o imposto é arrecadado no estado/município de destino da mercadoria, não na origem. Base do novo sistema IBS.",
      },
    ],
  },
  {
    letter: "S",
    terms: [
      {
        term: "Split Payment",
        definition:
          "Sistema de pagamento onde o banco separa automaticamente o valor do tributo e repassa diretamente ao Fisco, sem passar pelo caixa do vendedor.",
      },
      {
        term: "Substituição Tributária (ST)",
        definition:
          "Regime onde a responsabilidade pelo recolhimento do imposto de toda a cadeia é atribuída a um contribuinte específico. Será extinto com a reforma.",
      },
    ],
  },
  {
    letter: "T",
    terms: [
      {
        term: "Transição Tributária",
        definition:
          "Período de 2026 a 2033 durante o qual os impostos antigos serão gradualmente substituídos pelos novos tributos IBS e CBS.",
      },
    ],
  },
]

export default function GlossarioPage() {
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
              className="border-0 bg-transparent text-sm focus-visible:ring-0 p-0 h-auto dark:text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-8">
          {glossaryTerms.map((section, index) => (
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
                  {section.terms.map((item, termIndex) => (
                    <div key={termIndex} className="group">
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
