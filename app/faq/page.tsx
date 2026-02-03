import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const faqCategories = [
  {
    category: "Reforma Tributária",
    questions: [
      {
        question: "O que é a Reforma Tributária?",
        answer:
          "A Reforma Tributária é uma mudança no sistema de impostos brasileiro que unifica diversos tributos em dois principais: IBS (Imposto sobre Bens e Serviços) e CBS (Contribuição sobre Bens e Serviços). O objetivo é simplificar a tributação e torná-la mais transparente.",
      },
      {
        question: "Quando entra em vigor a Reforma Tributária?",
        answer:
          "A implementação é gradual: 2026 é o ano de testes, 2027 inicia a cobrança efetiva da CBS, de 2029 a 2032 há transição progressiva do ICMS e ISS para o IBS, e em 2033 o modelo estará completamente implementado.",
      },
      {
        question: "Quais impostos serão extintos?",
        answer:
          "Serão extintos gradualmente o PIS, Cofins, IPI, ICMS e ISS. Eles serão substituídos pelo IBS (estadual e municipal) e CBS (federal).",
      },
    ],
  },
  {
    category: "IBS e CBS",
    questions: [
      {
        question: "Qual a diferença entre IBS e CBS?",
        answer:
          "O IBS (Imposto sobre Bens e Serviços) é de competência estadual e municipal, substituindo ICMS e ISS. Já o CBS (Contribuição sobre Bens e Serviços) é federal, substituindo PIS e Cofins. Juntos formam o modelo de IVA Dual brasileiro.",
      },
      {
        question: "Qual será a alíquota do IBS e CBS?",
        answer:
          "As alíquotas ainda estão sendo definidas, mas estimativas apontam para uma alíquota combinada em torno de 27%, sendo aproximadamente 17% para IBS e 10% para CBS. Haverá alíquotas reduzidas para produtos da cesta básica e outros itens essenciais.",
      },
      {
        question: "O IBS e CBS são cobrados 'por fora' do preço?",
        answer:
          "Sim, no modelo brasileiro de IVA Dual, os tributos são destacados 'por fora' do preço líquido do produto, permitindo ao consumidor ver claramente quanto está pagando de imposto.",
      },
    ],
  },
  {
    category: "GTIN",
    questions: [
      {
        question: "O que é GTIN e por que é obrigatório?",
        answer:
          "GTIN (Global Trade Item Number) é o código de barras único que identifica produtos. A partir de outubro de 2025, será obrigatório nas NF-e e NFC-e. O Fisco utilizará o GTIN para verificar se a tributação está correta para cada produto específico.",
      },
      {
        question: "O que acontece se eu não informar o GTIN?",
        answer:
          "Notas fiscais sem GTIN válido ou com GTIN incorreto serão rejeitadas pela SEFAZ. É essencial atualizar o cadastro de produtos no ERP com os códigos GTIN corretos antes do prazo.",
      },
      {
        question: "GTIN é o mesmo que código de barras?",
        answer:
          "Sim, o GTIN é o número que aparece no código de barras do produto. Existem diferentes formatos (GTIN-8, GTIN-12, GTIN-13, GTIN-14), mas todos servem para identificar produtos de forma única globalmente.",
      },
    ],
  },
  {
    category: "Split Payment",
    questions: [
      {
        question: "Como funciona o Split Payment?",
        answer:
          "No Split Payment, quando o cliente paga uma compra, o banco automaticamente separa o valor do imposto e repassa diretamente ao governo. O fornecedor recebe apenas o valor líquido, sem que o tributo passe pelo seu caixa.",
      },
      {
        question: "O que muda no pagamento parcelado?",
        answer:
          "Em cada parcela paga, o imposto é retido e repassado ao Fisco proporcionalmente. O comprador só gera crédito tributário na medida em que paga cada parcela, diferente do modelo atual onde o crédito é apropriado integralmente na emissão da nota.",
      },
      {
        question: "Qual o impacto no fluxo de caixa?",
        answer:
          "O fornecedor recebe menos em cada parcela, já líquido de tributos. Isso pode impactar o capital de giro e exige planejamento financeiro mais cuidadoso, especialmente para vendas parceladas.",
      },
    ],
  },
  {
    category: "NF-e",
    questions: [
      {
        question: "Quando o novo layout da NF-e entra em vigor?",
        answer:
          "O novo layout com tags IBS e CBS entra em homologação em outubro de 2025 e se torna obrigatório em produção a partir de janeiro de 2026.",
      },
      {
        question: "O preenchimento dos campos IBS/CBS é obrigatório em 2026?",
        answer:
          "Tecnicamente é facultativo em 2026 (ano de testes), mas para garantir a dispensa do pagamento dos tributos, é necessário emitir as notas no novo modelo e cumprir as obrigações acessórias.",
      },
      {
        question: "Os tributos IBS e CBS entram no total da NF-e?",
        answer:
          "Não, no modelo IVA Dual os tributos IBS e CBS não compõem o total da NF-e. Eles são destacados separadamente, 'por fora' do valor do produto.",
      },
    ],
  },
]

export default function FaqPage() {
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
              className="border-0 bg-transparent text-sm focus-visible:ring-0 p-0 h-auto dark:text-gray-200"
            />
          </div>
        </div>

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
                      key={qIndex}
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

        <div className="mt-12 bg-gradient-to-r from-[#0046B3] to-[#0046B3]/90 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Não encontrou sua dúvida?</h3>
          <p className="mb-6">Entre em contato conosco pelo WhatsApp e nossa equipe especializada irá ajudá-lo.</p>
          <a href="https://wa.me/5534998623164" target="_blank" rel="noopener noreferrer">
            <button className="bg-white text-[#0046B3] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all">
              Falar com especialista
            </button>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
