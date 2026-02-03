export interface Noticia {
  id: string
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  tags: string[]
  data: string
  autor: string
  imagem?: string
}

export const noticias: Noticia[] = [
  {
    id: "1",
    titulo: "GTIN passa a ser obrigatório nas notas fiscais a partir de outubro de 2025",
    resumo: "A SEFAZ fará a checagem automática do código de barras GTIN nas NF-e e NFC-e. Notas com códigos inválidos serão rejeitadas.",
    conteudo: `A partir de 01 de outubro de 2025, o GTIN (Global Trade Item Number) passa a ser obrigatório em todas as Notas Fiscais Eletrônicas (NF-e) e Notas Fiscais de Consumidor Eletrônicas (NFC-e).

O GTIN é conhecido como o "CPF do produto" - um código de barras padrão mundial que permite a identificação única de cada item comercializado.

**Principais pontos:**
- SEFAZ rejeitará notas com GTIN inválido ou inexistente
- Mesmo NCM pode ter alíquotas diferentes por GTIN
- Rastreabilidade de produtos será aprimorada
- Controle fiscal mais eficiente

**Ação necessária:**
Verifique se todos os seus produtos possuem GTIN válido e atualizado no cadastro.`,
    categoria: "Urgente",
    tags: ["GTIN", "NF-e", "Obrigações"],
    data: "2025-10-01",
    autor: "Reforma Tributária News"
  },
  {
    id: "2",
    titulo: "Novo leiaute das NF-e traz as tags IBS e CBS obrigatórias em 2026",
    resumo: "Em outubro de 2025, o formato entra em homologação. Em janeiro de 2026, torna-se obrigatório também em produção.",
    conteudo: `O novo leiaute da Nota Fiscal Eletrônica (NF-e) trará campos específicos para os novos tributos da Reforma Tributária: IBS e CBS.

**Cronograma:**
- Outubro/2025: Ambiente de homologação
- Janeiro/2026: Produção obrigatória

**Novos campos:**
- Tag IBS (Imposto sobre Bens e Serviços)
- Tag CBS (Contribuição sobre Bens e Serviços)
- Campos para Split Payment

As empresas devem se preparar para atualizar seus sistemas ERP e emissores de notas fiscais.`,
    categoria: "Atualização",
    tags: ["NF-e", "IBS", "CBS", "Reforma"],
    data: "2025-09-15",
    autor: "Reforma Tributária News"
  },
  {
    id: "3",
    titulo: "Reforma Tributária: CBS entra em vigor integralmente em 2027",
    resumo: "A Contribuição sobre Bens e Serviços substituirá PIS e COFINS com alíquota de 10%.",
    conteudo: `A CBS (Contribuição sobre Bens e Serviços) entrará em vigor integralmente a partir de 2027, substituindo PIS e COFINS.

**Características da CBS:**
- Alíquota: 10% (federal)
- Substitui: PIS + COFINS
- Base de cálculo idêntica ao IBS
- Não-cumulatividade plena
- Crédito financeiro de todas aquisições

**Cronograma:**
- 2026: Período de testes (0,9%)
- 2027: CBS integral em vigor`,
    categoria: "Reforma",
    tags: ["CBS", "Reforma Tributária", "2027"],
    data: "2025-08-20",
    autor: "Reforma Tributária News"
  },
  {
    id: "4",
    titulo: "Split Payment: Como funciona o novo sistema de retenção automática",
    resumo: "O mecanismo de pagamento dividido retém automaticamente 27% dos tributos no momento do pagamento.",
    conteudo: `O Split Payment é um mecanismo inovador da Reforma Tributária para retenção automática de tributos.

**Como funciona:**
1. Você efetua um pagamento ao fornecedor
2. O banco retém automaticamente 27% (IBS+CBS)
3. Fornecedor recebe o valor líquido imediatamente
4. Você obtém o crédito tributário gradualmente

**Benefícios:**
- Reduz sonegação fiscal
- Simplifica a arrecadação
- Automatiza o processo tributário

**Implementação:**
Prevista junto com o novo sistema tributário a partir de 2027.`,
    categoria: "Reforma",
    tags: ["Split Payment", "IBS", "CBS"],
    data: "2025-07-10",
    autor: "Reforma Tributária News"
  },
  {
    id: "5",
    titulo: "Imposto Seletivo: Produtos que serão tributados a partir de 2027",
    resumo: "Bebidas alcoólicas, cigarros e veículos poluentes terão tributação adicional.",
    conteudo: `O Imposto Seletivo é um tributo sobre produtos considerados nocivos à saúde e ao meio ambiente.

**Base Legal:**
LC 214/2025, artigos 416 a 438

**Produtos tributados:**
- Bebidas alcoólicas
- Cigarros e produtos de tabaco
- Veículos poluentes
- Embarcações
- Aeronaves

**Vigência:**
A partir de 2027

**Alíquotas:**
Serão definidas por decreto, variando conforme o grau de nocividade do produto.`,
    categoria: "Legislação",
    tags: ["Imposto Seletivo", "2027"],
    data: "2025-06-25",
    autor: "Reforma Tributária News"
  },
  {
    id: "6",
    titulo: "Simples Nacional: Alterações previstas com a Reforma Tributária",
    resumo: "O regime simplificado sofrerá adaptações para compatibilidade com IBS e CBS.",
    conteudo: `O Simples Nacional passará por adaptações importantes com a entrada em vigor da Reforma Tributária.

**Principais mudanças:**
- Manutenção do regime unificado
- Adaptação das alíquotas para IBS/CBS
- Novo sistema de créditos
- Ajustes nas faixas de faturamento

**Cronograma:**
As mudanças serão implementadas gradualmente junto com a transição tributária.`,
    categoria: "Simples",
    tags: ["Simples Nacional", "Reforma"],
    data: "2025-05-18",
    autor: "Reforma Tributária News"
  },
  {
    id: "7",
    titulo: "DCTF: Prazo de entrega alterado para dia 15 de cada mês",
    resumo: "A Receita Federal alterou o prazo de entrega da DCTF mensal.",
    conteudo: `A Declaração de Débitos e Créditos Tributários Federais (DCTF) teve seu prazo de entrega alterado.

**Novo prazo:** Dia 15 do mês seguinte ao período de apuração

**Obrigados:**
- Pessoas jurídicas de direito privado
- Empresas individuais equiparadas
- Consórcios que realizem negócios jurídicos

**Penalidades:**
Multa por atraso na entrega pode chegar a 20% do valor dos tributos declarados.`,
    categoria: "Obrigações",
    tags: ["DCTF", "Obrigações Acessórias"],
    data: "2025-04-12",
    autor: "Reforma Tributária News"
  },
  {
    id: "8",
    titulo: "Zona Franca de Manaus mantém incentivos na Reforma Tributária",
    resumo: "Benefícios fiscais da ZFM foram preservados na nova legislação tributária.",
    conteudo: `A Zona Franca de Manaus terá seus incentivos fiscais mantidos mesmo com a Reforma Tributária.

**Incentivos preservados:**
- Isenção de IPI
- Créditos presumidos
- Benefícios regionais

**Período de vigência:**
Os incentivos foram prorrogados até 2073.

Esta decisão visa manter a competitividade da região e os empregos gerados pelo polo industrial.`,
    categoria: "Legislação",
    tags: ["ZFM", "Incentivos Fiscais"],
    data: "2025-03-05",
    autor: "Reforma Tributária News"
  }
]

export const categorias = [
  "Todas",
  "Urgente",
  "Atualização",
  "Reforma",
  "Legislação",
  "Simples",
  "Obrigações"
]

export function getNoticiaById(id: string): Noticia | undefined {
  return noticias.find(n => n.id === id)
}

export function getNoticiasPorCategoria(categoria: string): Noticia[] {
  if (categoria === "Todas") return noticias
  return noticias.filter(n => n.categoria === categoria)
}

export function buscarNoticias(termo: string): Noticia[] {
  const termoLower = termo.toLowerCase()
  return noticias.filter(n => 
    n.titulo.toLowerCase().includes(termoLower) ||
    n.resumo.toLowerCase().includes(termoLower) ||
    n.tags.some(tag => tag.toLowerCase().includes(termoLower))
  )
}
