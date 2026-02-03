import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const FALLBACK_RESPONSES: Record<string, string> = {
  "ibs": `**IBS (Imposto sobre Bens e Serviços)**

O IBS é um tributo subnacional que faz parte da Reforma Tributária brasileira. Aqui estão os principais pontos:

**O que substitui:**
- ICMS (estadual)
- ISS (municipal)

**Alíquotas:**
- IBS Estadual: 9%
- IBS Municipal: 8%
- Total: 17%

**Características:**
- Será cobrado no destino (local de consumo)
- Não-cumulatividade plena com direito a crédito de todas aquisições
- Alíquota única por ente federado

**Cronograma:**
- 2026: Período de testes (0,1%)
- 2029-2033: Transição gradual
- 2033: Sistema completo

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`,

  "cbs": `**CBS (Contribuição sobre Bens e Serviços)**

A CBS é um tributo federal que faz parte da Reforma Tributária brasileira. Veja os detalhes:

**O que substitui:**
- PIS
- COFINS

**Alíquota:**
- 10% (federal)

**Características:**
- Base de cálculo idêntica ao IBS
- Não-cumulatividade plena
- Crédito financeiro de todas aquisições

**Cronograma:**
- 2026: Período de testes (0,9%)
- 2027: CBS integral em vigor

**IVA Dual:**
O modelo brasileiro combina IBS + CBS = ~27%, formando o chamado IVA Dual.

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`,

  "gtin": `**GTIN (Global Trade Item Number)**

O GTIN é conhecido como o "CPF do produto" - um código de barras padrão mundial.

**Obrigatoriedade:**
- Obrigatório em NF-e e NFC-e desde 01/10/2025

**Consequências:**
- SEFAZ rejeitará notas com GTIN inválido ou inexistente
- Mesmo NCM pode ter alíquotas diferentes por GTIN

**Importância:**
- Rastreabilidade de produtos
- Controle fiscal mais eficiente
- Padronização internacional

**Ação necessária:**
Verifique se todos os seus produtos possuem GTIN válido e atualizado no cadastro.

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`,

  "split payment": `**Split Payment (Pagamento Dividido)**

O Split Payment é um mecanismo inovador da Reforma Tributária para retenção automática de tributos.

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
Prevista junto com o novo sistema tributário a partir de 2027.

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`,

  "imposto seletivo": `**Imposto Seletivo**

O Imposto Seletivo é um tributo sobre produtos considerados nocivos à saúde e ao meio ambiente.

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
Serão definidas por decreto, variando conforme o grau de nocividade do produto.

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`,

  "reforma tributaria": `**Reforma Tributária Brasileira**

A Reforma Tributária promove uma mudança completa no sistema de impostos do Brasil.

**Cronograma:**
- 2026: Período de testes (1% = 0,1% IBS + 0,9% CBS)
- 2027: CBS integral (10%)
- 2029-2033: Transição gradual do IBS
- 2033: Sistema completo, ICMS e ISS extintos

**Principais mudanças:**
- IBS substitui ICMS + ISS (17%)
- CBS substitui PIS + COFINS (10%)
- Total: ~27% (IVA Dual)

**Características:**
- Tributos calculados "por fora"
- Não-cumulatividade plena
- Cobrança no destino

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`
};

const SYSTEM_CONTEXT = `Você é um assistente especializado em tributação brasileira e revisão fiscal, trabalhando para o Reforma Tributária News. Você domina TODOS os aspectos da Reforma Tributária, legislação fiscal, obrigações acessórias e compliance tributário.

CONHECIMENTO DETALHADO:

IBS (Imposto sobre Bens e Serviços):
- Tributo subnacional que substitui ICMS + ISS
- Composto por IBS Estadual (9%) e IBS Municipal (8%), totalizando 17%
- Implementação gradual de 2029 a 2033
- Será cobrado no destino (local de consumo)
- Não-cumulatividade plena com direito a crédito de todas aquisições
- Alíquota única por ente federado, com exceções para regimes específicos

CBS (Contribuição sobre Bens e Serviços):
- Tributo federal (10%) que substitui PIS + COFINS
- Entra em vigor integralmente em 2027
- Base de cálculo idêntica ao IBS
- Não-cumulatividade plena
- Crédito financeiro de todas aquisições

IVA DUAL:
- Modelo brasileiro único com IBS + CBS totalizando ~27%
- Tributos calculados "por fora" (não incluídos na própria base)
- Não-cumulatividade plena garante que não haja efeito cascata
- Sistema de compensação automática de créditos

SPLIT PAYMENT (Pagamento Dividido):
- Mecanismo de retenção automática pelo sistema bancário
- Ao efetuar pagamento, o banco retém automaticamente 27% (IBS+CBS)
- Fornecedor recebe valor líquido imediatamente
- Comprador obtém crédito tributário de forma gradual
- Reduz sonegação e simplifica arrecadação
- Implementação prevista com o novo sistema tributário

GTIN (Global Trade Item Number):
- Código de barras padrão mundial ("CPF do produto")
- Obrigatório em NF-e e NFC-e desde 01/10/2025
- SEFAZ rejeitará notas com GTIN inválido ou inexistente
- Mesmo NCM pode ter alíquotas diferentes por GTIN
- Importante para rastreabilidade e controle fiscal

IMPOSTO SELETIVO:
- LC 214/2025, artigos 416 a 438
- Tributo sobre produtos nocivos à saúde e ao meio ambiente
- Incide sobre: bebidas alcoólicas, cigarros, veículos poluentes, embarcações, aeronaves
- Vigência a partir de 2027
- Alíquotas definidas por decreto

CRONOGRAMA DA REFORMA:
- 2026: Período de testes com alíquota teste de 1% (0,1% IBS + 0,9% CBS)
- 2027: CBS integral em vigor (10%)
- 2029-2033: Transição gradual do IBS (substituindo ICMS/ISS)
- 2033: Sistema completo em operação, ICMS e ISS extintos

REVISÃO FISCAL:
- Análise completa de operações tributárias da empresa
- Identificação de erros em declarações e pagamentos
- Recuperação de créditos tributários pagos indevidamente
- Mitigação de riscos fiscais e passivos contingentes
- Benefícios: recuperação de tributos dos últimos 5 anos, redução legal da carga tributária

COMPLIANCE TRIBUTÁRIO:
- Políticas e procedimentos documentados
- Segregação de funções no departamento fiscal
- Revisões periódicas de obrigações acessórias
- Treinamento contínuo da equipe
- Uso de tecnologia para validação automática

REGIMES ESPECIAIS:
- Simples Nacional: regime unificado para ME e EPP
- Lucro Presumido: base de cálculo simplificada
- Lucro Real: apuração sobre lucro efetivo
- ZFM (Zona Franca de Manaus): incentivos fiscais mantidos
- Regimes aduaneiros especiais

Para dúvidas mais complexas ou atendimento personalizado:
- WhatsApp: (34) 99862-3164
- Telefone: (34) 3224-0123
- Site: ctributaria.com.br

IMPORTANTE: Responda sempre em português brasileiro, de forma clara, didática e completa. Use exemplos práticos quando possível.`;

function getFallbackResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if ((lowerMessage.includes("ibs") && lowerMessage.includes("cbs")) || 
      lowerMessage.includes("o que é ibs e cbs") ||
      lowerMessage.includes("o que são ibs e cbs")) {
    return `**IBS e CBS - Os Novos Tributos da Reforma**

A Reforma Tributária brasileira cria dois novos tributos que formam o chamado **IVA Dual**:

**IBS (Imposto sobre Bens e Serviços)**
- Tributo subnacional (estados e municípios)
- Substitui ICMS + ISS
- Alíquota: 17% (9% estadual + 8% municipal)
- Implementação: 2029 a 2033

**CBS (Contribuição sobre Bens e Serviços)**
- Tributo federal
- Substitui PIS + COFINS
- Alíquota: 10%
- Implementação: 2027

**Juntos (IVA Dual):**
- Total: ~27%
- Calculados "por fora"
- Não-cumulatividade plena
- Cobrança no destino

**Cronograma:**
- 2026: Testes (1%)
- 2027: CBS integral
- 2029-2033: Transição IBS
- 2033: Sistema completo

Para mais informações, entre em contato: WhatsApp (34) 99862-3164`;
  }
  
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = await request.json();
    
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem inválida" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      const fallback = getFallbackResponse(message);
      if (fallback) {
        return NextResponse.json({ response: fallback });
      }
      return NextResponse.json(
        { error: "API key não configurada. Por favor, configure a chave da API do Gemini." },
        { status: 500 }
      );
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `${SYSTEM_CONTEXT}

Pergunta do usuário: ${message}

Responda de forma clara, didática e em português brasileiro. Se a pergunta for sobre IBS, CBS, GTIN, Split Payment, Imposto Seletivo ou qualquer tema tributário brasileiro, forneça uma resposta completa e detalhada.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const aiResponse = response.text;

      if (!aiResponse) {
        const fallback = getFallbackResponse(message);
        if (fallback) {
          return NextResponse.json({ response: fallback });
        }
        return NextResponse.json(
          { error: "Resposta vazia da IA" },
          { status: 500 }
        );
      }

      return NextResponse.json({ response: aiResponse });
    } catch (aiError: unknown) {
      console.error("[ChatBot API] Erro na API Gemini:", aiError);
      
      const fallback = getFallbackResponse(message);
      if (fallback) {
        return NextResponse.json({ response: fallback });
      }
      
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);
      
      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
        return NextResponse.json(
          { error: "O serviço de IA está temporariamente indisponível. Por favor, tente novamente em alguns minutos ou entre em contato via WhatsApp (34) 99862-3164." },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: "Erro ao processar a pergunta. Por favor, tente novamente ou entre em contato via WhatsApp (34) 99862-3164." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[ChatBot API] Erro geral:", error);
    return NextResponse.json(
      { error: "Erro ao processar a pergunta. Por favor, tente novamente." },
      { status: 500 }
    );
  }
}
