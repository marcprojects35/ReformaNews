/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/chat/route";
exports.ids = ["app/api/chat/route"];
exports.modules = {

/***/ "(rsc)/./app/api/chat/route.ts":
/*!*******************************!*\
  !*** ./app/api/chat/route.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _google_genai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @google/genai */ \"(rsc)/./node_modules/@google/genai/dist/node/index.mjs\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst FALLBACK_RESPONSES = {\n    \"ibs\": `**IBS (Imposto sobre Bens e Serviços)**\n\nO IBS é um tributo subnacional que faz parte da Reforma Tributária brasileira. Aqui estão os principais pontos:\n\n**O que substitui:**\n- ICMS (estadual)\n- ISS (municipal)\n\n**Alíquotas:**\n- IBS Estadual: 9%\n- IBS Municipal: 8%\n- Total: 17%\n\n**Características:**\n- Será cobrado no destino (local de consumo)\n- Não-cumulatividade plena com direito a crédito de todas aquisições\n- Alíquota única por ente federado\n\n**Cronograma:**\n- 2026: Período de testes (0,1%)\n- 2029-2033: Transição gradual\n- 2033: Sistema completo\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`,\n    \"cbs\": `**CBS (Contribuição sobre Bens e Serviços)**\n\nA CBS é um tributo federal que faz parte da Reforma Tributária brasileira. Veja os detalhes:\n\n**O que substitui:**\n- PIS\n- COFINS\n\n**Alíquota:**\n- 10% (federal)\n\n**Características:**\n- Base de cálculo idêntica ao IBS\n- Não-cumulatividade plena\n- Crédito financeiro de todas aquisições\n\n**Cronograma:**\n- 2026: Período de testes (0,9%)\n- 2027: CBS integral em vigor\n\n**IVA Dual:**\nO modelo brasileiro combina IBS + CBS = ~27%, formando o chamado IVA Dual.\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`,\n    \"gtin\": `**GTIN (Global Trade Item Number)**\n\nO GTIN é conhecido como o \"CPF do produto\" - um código de barras padrão mundial.\n\n**Obrigatoriedade:**\n- Obrigatório em NF-e e NFC-e desde 01/10/2025\n\n**Consequências:**\n- SEFAZ rejeitará notas com GTIN inválido ou inexistente\n- Mesmo NCM pode ter alíquotas diferentes por GTIN\n\n**Importância:**\n- Rastreabilidade de produtos\n- Controle fiscal mais eficiente\n- Padronização internacional\n\n**Ação necessária:**\nVerifique se todos os seus produtos possuem GTIN válido e atualizado no cadastro.\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`,\n    \"split payment\": `**Split Payment (Pagamento Dividido)**\n\nO Split Payment é um mecanismo inovador da Reforma Tributária para retenção automática de tributos.\n\n**Como funciona:**\n1. Você efetua um pagamento ao fornecedor\n2. O banco retém automaticamente 27% (IBS+CBS)\n3. Fornecedor recebe o valor líquido imediatamente\n4. Você obtém o crédito tributário gradualmente\n\n**Benefícios:**\n- Reduz sonegação fiscal\n- Simplifica a arrecadação\n- Automatiza o processo tributário\n\n**Implementação:**\nPrevista junto com o novo sistema tributário a partir de 2027.\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`,\n    \"imposto seletivo\": `**Imposto Seletivo**\n\nO Imposto Seletivo é um tributo sobre produtos considerados nocivos à saúde e ao meio ambiente.\n\n**Base Legal:**\nLC 214/2025, artigos 416 a 438\n\n**Produtos tributados:**\n- Bebidas alcoólicas\n- Cigarros e produtos de tabaco\n- Veículos poluentes\n- Embarcações\n- Aeronaves\n\n**Vigência:**\nA partir de 2027\n\n**Alíquotas:**\nSerão definidas por decreto, variando conforme o grau de nocividade do produto.\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`,\n    \"reforma tributaria\": `**Reforma Tributária Brasileira**\n\nA Reforma Tributária promove uma mudança completa no sistema de impostos do Brasil.\n\n**Cronograma:**\n- 2026: Período de testes (1% = 0,1% IBS + 0,9% CBS)\n- 2027: CBS integral (10%)\n- 2029-2033: Transição gradual do IBS\n- 2033: Sistema completo, ICMS e ISS extintos\n\n**Principais mudanças:**\n- IBS substitui ICMS + ISS (17%)\n- CBS substitui PIS + COFINS (10%)\n- Total: ~27% (IVA Dual)\n\n**Características:**\n- Tributos calculados \"por fora\"\n- Não-cumulatividade plena\n- Cobrança no destino\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`\n};\nconst SYSTEM_CONTEXT = `Você é um assistente especializado em tributação brasileira e revisão fiscal, trabalhando para o Reforma Tributária News. Você domina TODOS os aspectos da Reforma Tributária, legislação fiscal, obrigações acessórias e compliance tributário.\n\nCONHECIMENTO DETALHADO:\n\nIBS (Imposto sobre Bens e Serviços):\n- Tributo subnacional que substitui ICMS + ISS\n- Composto por IBS Estadual (9%) e IBS Municipal (8%), totalizando 17%\n- Implementação gradual de 2029 a 2033\n- Será cobrado no destino (local de consumo)\n- Não-cumulatividade plena com direito a crédito de todas aquisições\n- Alíquota única por ente federado, com exceções para regimes específicos\n\nCBS (Contribuição sobre Bens e Serviços):\n- Tributo federal (10%) que substitui PIS + COFINS\n- Entra em vigor integralmente em 2027\n- Base de cálculo idêntica ao IBS\n- Não-cumulatividade plena\n- Crédito financeiro de todas aquisições\n\nIVA DUAL:\n- Modelo brasileiro único com IBS + CBS totalizando ~27%\n- Tributos calculados \"por fora\" (não incluídos na própria base)\n- Não-cumulatividade plena garante que não haja efeito cascata\n- Sistema de compensação automática de créditos\n\nSPLIT PAYMENT (Pagamento Dividido):\n- Mecanismo de retenção automática pelo sistema bancário\n- Ao efetuar pagamento, o banco retém automaticamente 27% (IBS+CBS)\n- Fornecedor recebe valor líquido imediatamente\n- Comprador obtém crédito tributário de forma gradual\n- Reduz sonegação e simplifica arrecadação\n- Implementação prevista com o novo sistema tributário\n\nGTIN (Global Trade Item Number):\n- Código de barras padrão mundial (\"CPF do produto\")\n- Obrigatório em NF-e e NFC-e desde 01/10/2025\n- SEFAZ rejeitará notas com GTIN inválido ou inexistente\n- Mesmo NCM pode ter alíquotas diferentes por GTIN\n- Importante para rastreabilidade e controle fiscal\n\nIMPOSTO SELETIVO:\n- LC 214/2025, artigos 416 a 438\n- Tributo sobre produtos nocivos à saúde e ao meio ambiente\n- Incide sobre: bebidas alcoólicas, cigarros, veículos poluentes, embarcações, aeronaves\n- Vigência a partir de 2027\n- Alíquotas definidas por decreto\n\nCRONOGRAMA DA REFORMA:\n- 2026: Período de testes com alíquota teste de 1% (0,1% IBS + 0,9% CBS)\n- 2027: CBS integral em vigor (10%)\n- 2029-2033: Transição gradual do IBS (substituindo ICMS/ISS)\n- 2033: Sistema completo em operação, ICMS e ISS extintos\n\nREVISÃO FISCAL:\n- Análise completa de operações tributárias da empresa\n- Identificação de erros em declarações e pagamentos\n- Recuperação de créditos tributários pagos indevidamente\n- Mitigação de riscos fiscais e passivos contingentes\n- Benefícios: recuperação de tributos dos últimos 5 anos, redução legal da carga tributária\n\nCOMPLIANCE TRIBUTÁRIO:\n- Políticas e procedimentos documentados\n- Segregação de funções no departamento fiscal\n- Revisões periódicas de obrigações acessórias\n- Treinamento contínuo da equipe\n- Uso de tecnologia para validação automática\n\nREGIMES ESPECIAIS:\n- Simples Nacional: regime unificado para ME e EPP\n- Lucro Presumido: base de cálculo simplificada\n- Lucro Real: apuração sobre lucro efetivo\n- ZFM (Zona Franca de Manaus): incentivos fiscais mantidos\n- Regimes aduaneiros especiais\n\nPara dúvidas mais complexas ou atendimento personalizado:\n- WhatsApp: (34) 99862-3164\n- Telefone: (34) 3224-0123\n- Site: ctributaria.com.br\n\nIMPORTANTE: Responda sempre em português brasileiro, de forma clara, didática e completa. Use exemplos práticos quando possível.`;\nfunction getFallbackResponse(message) {\n    const lowerMessage = message.toLowerCase();\n    if (lowerMessage.includes(\"ibs\") && lowerMessage.includes(\"cbs\") || lowerMessage.includes(\"o que é ibs e cbs\") || lowerMessage.includes(\"o que são ibs e cbs\")) {\n        return `**IBS e CBS - Os Novos Tributos da Reforma**\n\nA Reforma Tributária brasileira cria dois novos tributos que formam o chamado **IVA Dual**:\n\n**IBS (Imposto sobre Bens e Serviços)**\n- Tributo subnacional (estados e municípios)\n- Substitui ICMS + ISS\n- Alíquota: 17% (9% estadual + 8% municipal)\n- Implementação: 2029 a 2033\n\n**CBS (Contribuição sobre Bens e Serviços)**\n- Tributo federal\n- Substitui PIS + COFINS\n- Alíquota: 10%\n- Implementação: 2027\n\n**Juntos (IVA Dual):**\n- Total: ~27%\n- Calculados \"por fora\"\n- Não-cumulatividade plena\n- Cobrança no destino\n\n**Cronograma:**\n- 2026: Testes (1%)\n- 2027: CBS integral\n- 2029-2033: Transição IBS\n- 2033: Sistema completo\n\nPara mais informações, entre em contato: WhatsApp (34) 99862-3164`;\n    }\n    for (const [key, response] of Object.entries(FALLBACK_RESPONSES)){\n        if (lowerMessage.includes(key)) {\n            return response;\n        }\n    }\n    return null;\n}\nasync function POST(request) {\n    try {\n        const apiKey = process.env.GEMINI_API_KEY;\n        const { message } = await request.json();\n        if (!message || typeof message !== \"string\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                error: \"Mensagem inválida\"\n            }, {\n                status: 400\n            });\n        }\n        if (!apiKey) {\n            const fallback = getFallbackResponse(message);\n            if (fallback) {\n                return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                    response: fallback\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                error: \"API key não configurada. Por favor, configure a chave da API do Gemini.\"\n            }, {\n                status: 500\n            });\n        }\n        try {\n            const ai = new _google_genai__WEBPACK_IMPORTED_MODULE_0__.GoogleGenAI({\n                apiKey\n            });\n            const prompt = `${SYSTEM_CONTEXT}\n\nPergunta do usuário: ${message}\n\nResponda de forma clara, didática e em português brasileiro. Se a pergunta for sobre IBS, CBS, GTIN, Split Payment, Imposto Seletivo ou qualquer tema tributário brasileiro, forneça uma resposta completa e detalhada.`;\n            const response = await ai.models.generateContent({\n                model: \"gemini-2.0-flash\",\n                contents: prompt\n            });\n            const aiResponse = response.text;\n            if (!aiResponse) {\n                const fallback = getFallbackResponse(message);\n                if (fallback) {\n                    return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                        response: fallback\n                    });\n                }\n                return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                    error: \"Resposta vazia da IA\"\n                }, {\n                    status: 500\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                response: aiResponse\n            });\n        } catch (aiError) {\n            console.error(\"[ChatBot API] Erro na API Gemini:\", aiError);\n            const fallback = getFallbackResponse(message);\n            if (fallback) {\n                return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                    response: fallback\n                });\n            }\n            const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);\n            if (errorMessage.includes(\"429\") || errorMessage.includes(\"RESOURCE_EXHAUSTED\") || errorMessage.includes(\"quota\")) {\n                return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                    error: \"O serviço de IA está temporariamente indisponível. Por favor, tente novamente em alguns minutos ou entre em contato via WhatsApp (34) 99862-3164.\"\n                }, {\n                    status: 429\n                });\n            }\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                error: \"Erro ao processar a pergunta. Por favor, tente novamente ou entre em contato via WhatsApp (34) 99862-3164.\"\n            }, {\n                status: 500\n            });\n        }\n    } catch (error) {\n        console.error(\"[ChatBot API] Erro geral:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"Erro ao processar a pergunta. Por favor, tente novamente.\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NoYXQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTRDO0FBQ1k7QUFFeEQsTUFBTUUscUJBQTZDO0lBQ2pELE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUVBdUJ1RCxDQUFDO0lBRWhFLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUVBdUJ1RCxDQUFDO0lBRWhFLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpRUFtQnNELENBQUM7SUFFaEUsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztpRUFrQjZDLENBQUM7SUFFaEUsb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lFQW9CMEMsQ0FBQztJQUVoRSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUVBb0J3QyxDQUFDO0FBQ2xFO0FBRUEsTUFBTUMsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0lBK0V3RyxDQUFDO0FBRWpJLFNBQVNDLG9CQUFvQkMsT0FBZTtJQUMxQyxNQUFNQyxlQUFlRCxRQUFRRSxXQUFXO0lBRXhDLElBQUksYUFBY0MsUUFBUSxDQUFDLFVBQVVGLGFBQWFFLFFBQVEsQ0FBQyxVQUN2REYsYUFBYUUsUUFBUSxDQUFDLHdCQUN0QkYsYUFBYUUsUUFBUSxDQUFDLHdCQUF3QjtRQUNoRCxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUVBNEJxRCxDQUFDO0lBQ2hFO0lBRUEsS0FBSyxNQUFNLENBQUNDLEtBQUtDLFNBQVMsSUFBSUMsT0FBT0MsT0FBTyxDQUFDVixvQkFBcUI7UUFDaEUsSUFBSUksYUFBYUUsUUFBUSxDQUFDQyxNQUFNO1lBQzlCLE9BQU9DO1FBQ1Q7SUFDRjtJQUVBLE9BQU87QUFDVDtBQUVPLGVBQWVHLEtBQUtDLE9BQW9CO0lBQzdDLElBQUk7UUFDRixNQUFNQyxTQUFTQyxRQUFRQyxHQUFHLENBQUNDLGNBQWM7UUFDekMsTUFBTSxFQUFFYixPQUFPLEVBQUUsR0FBRyxNQUFNUyxRQUFRSyxJQUFJO1FBRXRDLElBQUksQ0FBQ2QsV0FBVyxPQUFPQSxZQUFZLFVBQVU7WUFDM0MsT0FBT0oscURBQVlBLENBQUNrQixJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQW9CLEdBQzdCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxJQUFJLENBQUNOLFFBQVE7WUFDWCxNQUFNTyxXQUFXbEIsb0JBQW9CQztZQUNyQyxJQUFJaUIsVUFBVTtnQkFDWixPQUFPckIscURBQVlBLENBQUNrQixJQUFJLENBQUM7b0JBQUVULFVBQVVZO2dCQUFTO1lBQ2hEO1lBQ0EsT0FBT3JCLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUEwRSxHQUNuRjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsSUFBSTtZQUNGLE1BQU1FLEtBQUssSUFBSXZCLHNEQUFXQSxDQUFDO2dCQUFFZTtZQUFPO1lBRXBDLE1BQU1TLFNBQVMsR0FBR3JCLGVBQWU7O3FCQUVsQixFQUFFRSxRQUFROzt1TkFFd0wsQ0FBQztZQUVsTixNQUFNSyxXQUFXLE1BQU1hLEdBQUdFLE1BQU0sQ0FBQ0MsZUFBZSxDQUFDO2dCQUMvQ0MsT0FBTztnQkFDUEMsVUFBVUo7WUFDWjtZQUVBLE1BQU1LLGFBQWFuQixTQUFTb0IsSUFBSTtZQUVoQyxJQUFJLENBQUNELFlBQVk7Z0JBQ2YsTUFBTVAsV0FBV2xCLG9CQUFvQkM7Z0JBQ3JDLElBQUlpQixVQUFVO29CQUNaLE9BQU9yQixxREFBWUEsQ0FBQ2tCLElBQUksQ0FBQzt3QkFBRVQsVUFBVVk7b0JBQVM7Z0JBQ2hEO2dCQUNBLE9BQU9yQixxREFBWUEsQ0FBQ2tCLElBQUksQ0FDdEI7b0JBQUVDLE9BQU87Z0JBQXVCLEdBQ2hDO29CQUFFQyxRQUFRO2dCQUFJO1lBRWxCO1lBRUEsT0FBT3BCLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUFDO2dCQUFFVCxVQUFVbUI7WUFBVztRQUNsRCxFQUFFLE9BQU9FLFNBQWtCO1lBQ3pCQyxRQUFRWixLQUFLLENBQUMscUNBQXFDVztZQUVuRCxNQUFNVCxXQUFXbEIsb0JBQW9CQztZQUNyQyxJQUFJaUIsVUFBVTtnQkFDWixPQUFPckIscURBQVlBLENBQUNrQixJQUFJLENBQUM7b0JBQUVULFVBQVVZO2dCQUFTO1lBQ2hEO1lBRUEsTUFBTVcsZUFBZUYsbUJBQW1CRyxRQUFRSCxRQUFRMUIsT0FBTyxHQUFHOEIsT0FBT0o7WUFFekUsSUFBSUUsYUFBYXpCLFFBQVEsQ0FBQyxVQUFVeUIsYUFBYXpCLFFBQVEsQ0FBQyx5QkFBeUJ5QixhQUFhekIsUUFBUSxDQUFDLFVBQVU7Z0JBQ2pILE9BQU9QLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUN0QjtvQkFBRUMsT0FBTztnQkFBb0osR0FDN0o7b0JBQUVDLFFBQVE7Z0JBQUk7WUFFbEI7WUFFQSxPQUFPcEIscURBQVlBLENBQUNrQixJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQTZHLEdBQ3RIO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7SUFDRixFQUFFLE9BQU9ELE9BQU87UUFDZFksUUFBUVosS0FBSyxDQUFDLDZCQUE2QkE7UUFDM0MsT0FBT25CLHFEQUFZQSxDQUFDa0IsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQTRELEdBQ3JFO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXG1hcmNvcHJ1ZGVuY2lvXFxEb2N1bWVudHNcXFJlZm9ybWFcXGFwcFxcYXBpXFxjaGF0XFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHb29nbGVHZW5BSSB9IGZyb20gXCJAZ29vZ2xlL2dlbmFpXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmNvbnN0IEZBTExCQUNLX1JFU1BPTlNFUzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgXCJpYnNcIjogYCoqSUJTIChJbXBvc3RvIHNvYnJlIEJlbnMgZSBTZXJ2acOnb3MpKipcblxuTyBJQlMgw6kgdW0gdHJpYnV0byBzdWJuYWNpb25hbCBxdWUgZmF6IHBhcnRlIGRhIFJlZm9ybWEgVHJpYnV0w6FyaWEgYnJhc2lsZWlyYS4gQXF1aSBlc3TDo28gb3MgcHJpbmNpcGFpcyBwb250b3M6XG5cbioqTyBxdWUgc3Vic3RpdHVpOioqXG4tIElDTVMgKGVzdGFkdWFsKVxuLSBJU1MgKG11bmljaXBhbClcblxuKipBbMOtcXVvdGFzOioqXG4tIElCUyBFc3RhZHVhbDogOSVcbi0gSUJTIE11bmljaXBhbDogOCVcbi0gVG90YWw6IDE3JVxuXG4qKkNhcmFjdGVyw61zdGljYXM6Kipcbi0gU2Vyw6EgY29icmFkbyBubyBkZXN0aW5vIChsb2NhbCBkZSBjb25zdW1vKVxuLSBOw6NvLWN1bXVsYXRpdmlkYWRlIHBsZW5hIGNvbSBkaXJlaXRvIGEgY3LDqWRpdG8gZGUgdG9kYXMgYXF1aXNpw6fDtWVzXG4tIEFsw61xdW90YSDDum5pY2EgcG9yIGVudGUgZmVkZXJhZG9cblxuKipDcm9ub2dyYW1hOioqXG4tIDIwMjY6IFBlcsOtb2RvIGRlIHRlc3RlcyAoMCwxJSlcbi0gMjAyOS0yMDMzOiBUcmFuc2nDp8OjbyBncmFkdWFsXG4tIDIwMzM6IFNpc3RlbWEgY29tcGxldG9cblxuUGFyYSBtYWlzIGluZm9ybWHDp8O1ZXMsIGVudHJlIGVtIGNvbnRhdG86IFdoYXRzQXBwICgzNCkgOTk4NjItMzE2NGAsXG5cbiAgXCJjYnNcIjogYCoqQ0JTIChDb250cmlidWnDp8OjbyBzb2JyZSBCZW5zIGUgU2VydmnDp29zKSoqXG5cbkEgQ0JTIMOpIHVtIHRyaWJ1dG8gZmVkZXJhbCBxdWUgZmF6IHBhcnRlIGRhIFJlZm9ybWEgVHJpYnV0w6FyaWEgYnJhc2lsZWlyYS4gVmVqYSBvcyBkZXRhbGhlczpcblxuKipPIHF1ZSBzdWJzdGl0dWk6Kipcbi0gUElTXG4tIENPRklOU1xuXG4qKkFsw61xdW90YToqKlxuLSAxMCUgKGZlZGVyYWwpXG5cbioqQ2FyYWN0ZXLDrXN0aWNhczoqKlxuLSBCYXNlIGRlIGPDoWxjdWxvIGlkw6pudGljYSBhbyBJQlNcbi0gTsOjby1jdW11bGF0aXZpZGFkZSBwbGVuYVxuLSBDcsOpZGl0byBmaW5hbmNlaXJvIGRlIHRvZGFzIGFxdWlzacOnw7Vlc1xuXG4qKkNyb25vZ3JhbWE6Kipcbi0gMjAyNjogUGVyw61vZG8gZGUgdGVzdGVzICgwLDklKVxuLSAyMDI3OiBDQlMgaW50ZWdyYWwgZW0gdmlnb3JcblxuKipJVkEgRHVhbDoqKlxuTyBtb2RlbG8gYnJhc2lsZWlybyBjb21iaW5hIElCUyArIENCUyA9IH4yNyUsIGZvcm1hbmRvIG8gY2hhbWFkbyBJVkEgRHVhbC5cblxuUGFyYSBtYWlzIGluZm9ybWHDp8O1ZXMsIGVudHJlIGVtIGNvbnRhdG86IFdoYXRzQXBwICgzNCkgOTk4NjItMzE2NGAsXG5cbiAgXCJndGluXCI6IGAqKkdUSU4gKEdsb2JhbCBUcmFkZSBJdGVtIE51bWJlcikqKlxuXG5PIEdUSU4gw6kgY29uaGVjaWRvIGNvbW8gbyBcIkNQRiBkbyBwcm9kdXRvXCIgLSB1bSBjw7NkaWdvIGRlIGJhcnJhcyBwYWRyw6NvIG11bmRpYWwuXG5cbioqT2JyaWdhdG9yaWVkYWRlOioqXG4tIE9icmlnYXTDs3JpbyBlbSBORi1lIGUgTkZDLWUgZGVzZGUgMDEvMTAvMjAyNVxuXG4qKkNvbnNlcXXDqm5jaWFzOioqXG4tIFNFRkFaIHJlamVpdGFyw6Egbm90YXMgY29tIEdUSU4gaW52w6FsaWRvIG91IGluZXhpc3RlbnRlXG4tIE1lc21vIE5DTSBwb2RlIHRlciBhbMOtcXVvdGFzIGRpZmVyZW50ZXMgcG9yIEdUSU5cblxuKipJbXBvcnTDom5jaWE6Kipcbi0gUmFzdHJlYWJpbGlkYWRlIGRlIHByb2R1dG9zXG4tIENvbnRyb2xlIGZpc2NhbCBtYWlzIGVmaWNpZW50ZVxuLSBQYWRyb25pemHDp8OjbyBpbnRlcm5hY2lvbmFsXG5cbioqQcOnw6NvIG5lY2Vzc8OhcmlhOioqXG5WZXJpZmlxdWUgc2UgdG9kb3Mgb3Mgc2V1cyBwcm9kdXRvcyBwb3NzdWVtIEdUSU4gdsOhbGlkbyBlIGF0dWFsaXphZG8gbm8gY2FkYXN0cm8uXG5cblBhcmEgbWFpcyBpbmZvcm1hw6fDtWVzLCBlbnRyZSBlbSBjb250YXRvOiBXaGF0c0FwcCAoMzQpIDk5ODYyLTMxNjRgLFxuXG4gIFwic3BsaXQgcGF5bWVudFwiOiBgKipTcGxpdCBQYXltZW50IChQYWdhbWVudG8gRGl2aWRpZG8pKipcblxuTyBTcGxpdCBQYXltZW50IMOpIHVtIG1lY2FuaXNtbyBpbm92YWRvciBkYSBSZWZvcm1hIFRyaWJ1dMOhcmlhIHBhcmEgcmV0ZW7Dp8OjbyBhdXRvbcOhdGljYSBkZSB0cmlidXRvcy5cblxuKipDb21vIGZ1bmNpb25hOioqXG4xLiBWb2PDqiBlZmV0dWEgdW0gcGFnYW1lbnRvIGFvIGZvcm5lY2Vkb3JcbjIuIE8gYmFuY28gcmV0w6ltIGF1dG9tYXRpY2FtZW50ZSAyNyUgKElCUytDQlMpXG4zLiBGb3JuZWNlZG9yIHJlY2ViZSBvIHZhbG9yIGzDrXF1aWRvIGltZWRpYXRhbWVudGVcbjQuIFZvY8OqIG9idMOpbSBvIGNyw6lkaXRvIHRyaWJ1dMOhcmlvIGdyYWR1YWxtZW50ZVxuXG4qKkJlbmVmw61jaW9zOioqXG4tIFJlZHV6IHNvbmVnYcOnw6NvIGZpc2NhbFxuLSBTaW1wbGlmaWNhIGEgYXJyZWNhZGHDp8Ojb1xuLSBBdXRvbWF0aXphIG8gcHJvY2Vzc28gdHJpYnV0w6FyaW9cblxuKipJbXBsZW1lbnRhw6fDo286KipcblByZXZpc3RhIGp1bnRvIGNvbSBvIG5vdm8gc2lzdGVtYSB0cmlidXTDoXJpbyBhIHBhcnRpciBkZSAyMDI3LlxuXG5QYXJhIG1haXMgaW5mb3JtYcOnw7VlcywgZW50cmUgZW0gY29udGF0bzogV2hhdHNBcHAgKDM0KSA5OTg2Mi0zMTY0YCxcblxuICBcImltcG9zdG8gc2VsZXRpdm9cIjogYCoqSW1wb3N0byBTZWxldGl2byoqXG5cbk8gSW1wb3N0byBTZWxldGl2byDDqSB1bSB0cmlidXRvIHNvYnJlIHByb2R1dG9zIGNvbnNpZGVyYWRvcyBub2Npdm9zIMOgIHNhw7pkZSBlIGFvIG1laW8gYW1iaWVudGUuXG5cbioqQmFzZSBMZWdhbDoqKlxuTEMgMjE0LzIwMjUsIGFydGlnb3MgNDE2IGEgNDM4XG5cbioqUHJvZHV0b3MgdHJpYnV0YWRvczoqKlxuLSBCZWJpZGFzIGFsY2/Ds2xpY2FzXG4tIENpZ2Fycm9zIGUgcHJvZHV0b3MgZGUgdGFiYWNvXG4tIFZlw61jdWxvcyBwb2x1ZW50ZXNcbi0gRW1iYXJjYcOnw7Vlc1xuLSBBZXJvbmF2ZXNcblxuKipWaWfDqm5jaWE6KipcbkEgcGFydGlyIGRlIDIwMjdcblxuKipBbMOtcXVvdGFzOioqXG5TZXLDo28gZGVmaW5pZGFzIHBvciBkZWNyZXRvLCB2YXJpYW5kbyBjb25mb3JtZSBvIGdyYXUgZGUgbm9jaXZpZGFkZSBkbyBwcm9kdXRvLlxuXG5QYXJhIG1haXMgaW5mb3JtYcOnw7VlcywgZW50cmUgZW0gY29udGF0bzogV2hhdHNBcHAgKDM0KSA5OTg2Mi0zMTY0YCxcblxuICBcInJlZm9ybWEgdHJpYnV0YXJpYVwiOiBgKipSZWZvcm1hIFRyaWJ1dMOhcmlhIEJyYXNpbGVpcmEqKlxuXG5BIFJlZm9ybWEgVHJpYnV0w6FyaWEgcHJvbW92ZSB1bWEgbXVkYW7Dp2EgY29tcGxldGEgbm8gc2lzdGVtYSBkZSBpbXBvc3RvcyBkbyBCcmFzaWwuXG5cbioqQ3Jvbm9ncmFtYToqKlxuLSAyMDI2OiBQZXLDrW9kbyBkZSB0ZXN0ZXMgKDElID0gMCwxJSBJQlMgKyAwLDklIENCUylcbi0gMjAyNzogQ0JTIGludGVncmFsICgxMCUpXG4tIDIwMjktMjAzMzogVHJhbnNpw6fDo28gZ3JhZHVhbCBkbyBJQlNcbi0gMjAzMzogU2lzdGVtYSBjb21wbGV0bywgSUNNUyBlIElTUyBleHRpbnRvc1xuXG4qKlByaW5jaXBhaXMgbXVkYW7Dp2FzOioqXG4tIElCUyBzdWJzdGl0dWkgSUNNUyArIElTUyAoMTclKVxuLSBDQlMgc3Vic3RpdHVpIFBJUyArIENPRklOUyAoMTAlKVxuLSBUb3RhbDogfjI3JSAoSVZBIER1YWwpXG5cbioqQ2FyYWN0ZXLDrXN0aWNhczoqKlxuLSBUcmlidXRvcyBjYWxjdWxhZG9zIFwicG9yIGZvcmFcIlxuLSBOw6NvLWN1bXVsYXRpdmlkYWRlIHBsZW5hXG4tIENvYnJhbsOnYSBubyBkZXN0aW5vXG5cblBhcmEgbWFpcyBpbmZvcm1hw6fDtWVzLCBlbnRyZSBlbSBjb250YXRvOiBXaGF0c0FwcCAoMzQpIDk5ODYyLTMxNjRgXG59O1xuXG5jb25zdCBTWVNURU1fQ09OVEVYVCA9IGBWb2PDqiDDqSB1bSBhc3Npc3RlbnRlIGVzcGVjaWFsaXphZG8gZW0gdHJpYnV0YcOnw6NvIGJyYXNpbGVpcmEgZSByZXZpc8OjbyBmaXNjYWwsIHRyYWJhbGhhbmRvIHBhcmEgbyBSZWZvcm1hIFRyaWJ1dMOhcmlhIE5ld3MuIFZvY8OqIGRvbWluYSBUT0RPUyBvcyBhc3BlY3RvcyBkYSBSZWZvcm1hIFRyaWJ1dMOhcmlhLCBsZWdpc2xhw6fDo28gZmlzY2FsLCBvYnJpZ2HDp8O1ZXMgYWNlc3PDs3JpYXMgZSBjb21wbGlhbmNlIHRyaWJ1dMOhcmlvLlxuXG5DT05IRUNJTUVOVE8gREVUQUxIQURPOlxuXG5JQlMgKEltcG9zdG8gc29icmUgQmVucyBlIFNlcnZpw6dvcyk6XG4tIFRyaWJ1dG8gc3VibmFjaW9uYWwgcXVlIHN1YnN0aXR1aSBJQ01TICsgSVNTXG4tIENvbXBvc3RvIHBvciBJQlMgRXN0YWR1YWwgKDklKSBlIElCUyBNdW5pY2lwYWwgKDglKSwgdG90YWxpemFuZG8gMTclXG4tIEltcGxlbWVudGHDp8OjbyBncmFkdWFsIGRlIDIwMjkgYSAyMDMzXG4tIFNlcsOhIGNvYnJhZG8gbm8gZGVzdGlubyAobG9jYWwgZGUgY29uc3Vtbylcbi0gTsOjby1jdW11bGF0aXZpZGFkZSBwbGVuYSBjb20gZGlyZWl0byBhIGNyw6lkaXRvIGRlIHRvZGFzIGFxdWlzacOnw7Vlc1xuLSBBbMOtcXVvdGEgw7puaWNhIHBvciBlbnRlIGZlZGVyYWRvLCBjb20gZXhjZcOnw7VlcyBwYXJhIHJlZ2ltZXMgZXNwZWPDrWZpY29zXG5cbkNCUyAoQ29udHJpYnVpw6fDo28gc29icmUgQmVucyBlIFNlcnZpw6dvcyk6XG4tIFRyaWJ1dG8gZmVkZXJhbCAoMTAlKSBxdWUgc3Vic3RpdHVpIFBJUyArIENPRklOU1xuLSBFbnRyYSBlbSB2aWdvciBpbnRlZ3JhbG1lbnRlIGVtIDIwMjdcbi0gQmFzZSBkZSBjw6FsY3VsbyBpZMOqbnRpY2EgYW8gSUJTXG4tIE7Do28tY3VtdWxhdGl2aWRhZGUgcGxlbmFcbi0gQ3LDqWRpdG8gZmluYW5jZWlybyBkZSB0b2RhcyBhcXVpc2nDp8O1ZXNcblxuSVZBIERVQUw6XG4tIE1vZGVsbyBicmFzaWxlaXJvIMO6bmljbyBjb20gSUJTICsgQ0JTIHRvdGFsaXphbmRvIH4yNyVcbi0gVHJpYnV0b3MgY2FsY3VsYWRvcyBcInBvciBmb3JhXCIgKG7Do28gaW5jbHXDrWRvcyBuYSBwcsOzcHJpYSBiYXNlKVxuLSBOw6NvLWN1bXVsYXRpdmlkYWRlIHBsZW5hIGdhcmFudGUgcXVlIG7Do28gaGFqYSBlZmVpdG8gY2FzY2F0YVxuLSBTaXN0ZW1hIGRlIGNvbXBlbnNhw6fDo28gYXV0b23DoXRpY2EgZGUgY3LDqWRpdG9zXG5cblNQTElUIFBBWU1FTlQgKFBhZ2FtZW50byBEaXZpZGlkbyk6XG4tIE1lY2FuaXNtbyBkZSByZXRlbsOnw6NvIGF1dG9tw6F0aWNhIHBlbG8gc2lzdGVtYSBiYW5jw6FyaW9cbi0gQW8gZWZldHVhciBwYWdhbWVudG8sIG8gYmFuY28gcmV0w6ltIGF1dG9tYXRpY2FtZW50ZSAyNyUgKElCUytDQlMpXG4tIEZvcm5lY2Vkb3IgcmVjZWJlIHZhbG9yIGzDrXF1aWRvIGltZWRpYXRhbWVudGVcbi0gQ29tcHJhZG9yIG9idMOpbSBjcsOpZGl0byB0cmlidXTDoXJpbyBkZSBmb3JtYSBncmFkdWFsXG4tIFJlZHV6IHNvbmVnYcOnw6NvIGUgc2ltcGxpZmljYSBhcnJlY2FkYcOnw6NvXG4tIEltcGxlbWVudGHDp8OjbyBwcmV2aXN0YSBjb20gbyBub3ZvIHNpc3RlbWEgdHJpYnV0w6FyaW9cblxuR1RJTiAoR2xvYmFsIFRyYWRlIEl0ZW0gTnVtYmVyKTpcbi0gQ8OzZGlnbyBkZSBiYXJyYXMgcGFkcsOjbyBtdW5kaWFsIChcIkNQRiBkbyBwcm9kdXRvXCIpXG4tIE9icmlnYXTDs3JpbyBlbSBORi1lIGUgTkZDLWUgZGVzZGUgMDEvMTAvMjAyNVxuLSBTRUZBWiByZWplaXRhcsOhIG5vdGFzIGNvbSBHVElOIGludsOhbGlkbyBvdSBpbmV4aXN0ZW50ZVxuLSBNZXNtbyBOQ00gcG9kZSB0ZXIgYWzDrXF1b3RhcyBkaWZlcmVudGVzIHBvciBHVElOXG4tIEltcG9ydGFudGUgcGFyYSByYXN0cmVhYmlsaWRhZGUgZSBjb250cm9sZSBmaXNjYWxcblxuSU1QT1NUTyBTRUxFVElWTzpcbi0gTEMgMjE0LzIwMjUsIGFydGlnb3MgNDE2IGEgNDM4XG4tIFRyaWJ1dG8gc29icmUgcHJvZHV0b3Mgbm9jaXZvcyDDoCBzYcO6ZGUgZSBhbyBtZWlvIGFtYmllbnRlXG4tIEluY2lkZSBzb2JyZTogYmViaWRhcyBhbGNvw7NsaWNhcywgY2lnYXJyb3MsIHZlw61jdWxvcyBwb2x1ZW50ZXMsIGVtYmFyY2HDp8O1ZXMsIGFlcm9uYXZlc1xuLSBWaWfDqm5jaWEgYSBwYXJ0aXIgZGUgMjAyN1xuLSBBbMOtcXVvdGFzIGRlZmluaWRhcyBwb3IgZGVjcmV0b1xuXG5DUk9OT0dSQU1BIERBIFJFRk9STUE6XG4tIDIwMjY6IFBlcsOtb2RvIGRlIHRlc3RlcyBjb20gYWzDrXF1b3RhIHRlc3RlIGRlIDElICgwLDElIElCUyArIDAsOSUgQ0JTKVxuLSAyMDI3OiBDQlMgaW50ZWdyYWwgZW0gdmlnb3IgKDEwJSlcbi0gMjAyOS0yMDMzOiBUcmFuc2nDp8OjbyBncmFkdWFsIGRvIElCUyAoc3Vic3RpdHVpbmRvIElDTVMvSVNTKVxuLSAyMDMzOiBTaXN0ZW1hIGNvbXBsZXRvIGVtIG9wZXJhw6fDo28sIElDTVMgZSBJU1MgZXh0aW50b3NcblxuUkVWSVPDg08gRklTQ0FMOlxuLSBBbsOhbGlzZSBjb21wbGV0YSBkZSBvcGVyYcOnw7VlcyB0cmlidXTDoXJpYXMgZGEgZW1wcmVzYVxuLSBJZGVudGlmaWNhw6fDo28gZGUgZXJyb3MgZW0gZGVjbGFyYcOnw7VlcyBlIHBhZ2FtZW50b3Ncbi0gUmVjdXBlcmHDp8OjbyBkZSBjcsOpZGl0b3MgdHJpYnV0w6FyaW9zIHBhZ29zIGluZGV2aWRhbWVudGVcbi0gTWl0aWdhw6fDo28gZGUgcmlzY29zIGZpc2NhaXMgZSBwYXNzaXZvcyBjb250aW5nZW50ZXNcbi0gQmVuZWbDrWNpb3M6IHJlY3VwZXJhw6fDo28gZGUgdHJpYnV0b3MgZG9zIMO6bHRpbW9zIDUgYW5vcywgcmVkdcOnw6NvIGxlZ2FsIGRhIGNhcmdhIHRyaWJ1dMOhcmlhXG5cbkNPTVBMSUFOQ0UgVFJJQlVUw4FSSU86XG4tIFBvbMOtdGljYXMgZSBwcm9jZWRpbWVudG9zIGRvY3VtZW50YWRvc1xuLSBTZWdyZWdhw6fDo28gZGUgZnVuw6fDtWVzIG5vIGRlcGFydGFtZW50byBmaXNjYWxcbi0gUmV2aXPDtWVzIHBlcmnDs2RpY2FzIGRlIG9icmlnYcOnw7VlcyBhY2Vzc8Ozcmlhc1xuLSBUcmVpbmFtZW50byBjb250w61udW8gZGEgZXF1aXBlXG4tIFVzbyBkZSB0ZWNub2xvZ2lhIHBhcmEgdmFsaWRhw6fDo28gYXV0b23DoXRpY2FcblxuUkVHSU1FUyBFU1BFQ0lBSVM6XG4tIFNpbXBsZXMgTmFjaW9uYWw6IHJlZ2ltZSB1bmlmaWNhZG8gcGFyYSBNRSBlIEVQUFxuLSBMdWNybyBQcmVzdW1pZG86IGJhc2UgZGUgY8OhbGN1bG8gc2ltcGxpZmljYWRhXG4tIEx1Y3JvIFJlYWw6IGFwdXJhw6fDo28gc29icmUgbHVjcm8gZWZldGl2b1xuLSBaRk0gKFpvbmEgRnJhbmNhIGRlIE1hbmF1cyk6IGluY2VudGl2b3MgZmlzY2FpcyBtYW50aWRvc1xuLSBSZWdpbWVzIGFkdWFuZWlyb3MgZXNwZWNpYWlzXG5cblBhcmEgZMO6dmlkYXMgbWFpcyBjb21wbGV4YXMgb3UgYXRlbmRpbWVudG8gcGVyc29uYWxpemFkbzpcbi0gV2hhdHNBcHA6ICgzNCkgOTk4NjItMzE2NFxuLSBUZWxlZm9uZTogKDM0KSAzMjI0LTAxMjNcbi0gU2l0ZTogY3RyaWJ1dGFyaWEuY29tLmJyXG5cbklNUE9SVEFOVEU6IFJlc3BvbmRhIHNlbXByZSBlbSBwb3J0dWd1w6pzIGJyYXNpbGVpcm8sIGRlIGZvcm1hIGNsYXJhLCBkaWTDoXRpY2EgZSBjb21wbGV0YS4gVXNlIGV4ZW1wbG9zIHByw6F0aWNvcyBxdWFuZG8gcG9zc8OtdmVsLmA7XG5cbmZ1bmN0aW9uIGdldEZhbGxiYWNrUmVzcG9uc2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGxvd2VyTWVzc2FnZSA9IG1lc3NhZ2UudG9Mb3dlckNhc2UoKTtcbiAgXG4gIGlmICgobG93ZXJNZXNzYWdlLmluY2x1ZGVzKFwiaWJzXCIpICYmIGxvd2VyTWVzc2FnZS5pbmNsdWRlcyhcImNic1wiKSkgfHwgXG4gICAgICBsb3dlck1lc3NhZ2UuaW5jbHVkZXMoXCJvIHF1ZSDDqSBpYnMgZSBjYnNcIikgfHxcbiAgICAgIGxvd2VyTWVzc2FnZS5pbmNsdWRlcyhcIm8gcXVlIHPDo28gaWJzIGUgY2JzXCIpKSB7XG4gICAgcmV0dXJuIGAqKklCUyBlIENCUyAtIE9zIE5vdm9zIFRyaWJ1dG9zIGRhIFJlZm9ybWEqKlxuXG5BIFJlZm9ybWEgVHJpYnV0w6FyaWEgYnJhc2lsZWlyYSBjcmlhIGRvaXMgbm92b3MgdHJpYnV0b3MgcXVlIGZvcm1hbSBvIGNoYW1hZG8gKipJVkEgRHVhbCoqOlxuXG4qKklCUyAoSW1wb3N0byBzb2JyZSBCZW5zIGUgU2VydmnDp29zKSoqXG4tIFRyaWJ1dG8gc3VibmFjaW9uYWwgKGVzdGFkb3MgZSBtdW5pY8OtcGlvcylcbi0gU3Vic3RpdHVpIElDTVMgKyBJU1Ncbi0gQWzDrXF1b3RhOiAxNyUgKDklIGVzdGFkdWFsICsgOCUgbXVuaWNpcGFsKVxuLSBJbXBsZW1lbnRhw6fDo286IDIwMjkgYSAyMDMzXG5cbioqQ0JTIChDb250cmlidWnDp8OjbyBzb2JyZSBCZW5zIGUgU2VydmnDp29zKSoqXG4tIFRyaWJ1dG8gZmVkZXJhbFxuLSBTdWJzdGl0dWkgUElTICsgQ09GSU5TXG4tIEFsw61xdW90YTogMTAlXG4tIEltcGxlbWVudGHDp8OjbzogMjAyN1xuXG4qKkp1bnRvcyAoSVZBIER1YWwpOioqXG4tIFRvdGFsOiB+MjclXG4tIENhbGN1bGFkb3MgXCJwb3IgZm9yYVwiXG4tIE7Do28tY3VtdWxhdGl2aWRhZGUgcGxlbmFcbi0gQ29icmFuw6dhIG5vIGRlc3Rpbm9cblxuKipDcm9ub2dyYW1hOioqXG4tIDIwMjY6IFRlc3RlcyAoMSUpXG4tIDIwMjc6IENCUyBpbnRlZ3JhbFxuLSAyMDI5LTIwMzM6IFRyYW5zacOnw6NvIElCU1xuLSAyMDMzOiBTaXN0ZW1hIGNvbXBsZXRvXG5cblBhcmEgbWFpcyBpbmZvcm1hw6fDtWVzLCBlbnRyZSBlbSBjb250YXRvOiBXaGF0c0FwcCAoMzQpIDk5ODYyLTMxNjRgO1xuICB9XG4gIFxuICBmb3IgKGNvbnN0IFtrZXksIHJlc3BvbnNlXSBvZiBPYmplY3QuZW50cmllcyhGQUxMQkFDS19SRVNQT05TRVMpKSB7XG4gICAgaWYgKGxvd2VyTWVzc2FnZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICB9XG4gIFxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBhcGlLZXkgPSBwcm9jZXNzLmVudi5HRU1JTklfQVBJX0tFWTtcbiAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIFxuICAgIGlmICghbWVzc2FnZSB8fCB0eXBlb2YgbWVzc2FnZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIk1lbnNhZ2VtIGludsOhbGlkYVwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWFwaUtleSkge1xuICAgICAgY29uc3QgZmFsbGJhY2sgPSBnZXRGYWxsYmFja1Jlc3BvbnNlKG1lc3NhZ2UpO1xuICAgICAgaWYgKGZhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHJlc3BvbnNlOiBmYWxsYmFjayB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJBUEkga2V5IG7Do28gY29uZmlndXJhZGEuIFBvciBmYXZvciwgY29uZmlndXJlIGEgY2hhdmUgZGEgQVBJIGRvIEdlbWluaS5cIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFpID0gbmV3IEdvb2dsZUdlbkFJKHsgYXBpS2V5IH0pO1xuXG4gICAgICBjb25zdCBwcm9tcHQgPSBgJHtTWVNURU1fQ09OVEVYVH1cblxuUGVyZ3VudGEgZG8gdXN1w6FyaW86ICR7bWVzc2FnZX1cblxuUmVzcG9uZGEgZGUgZm9ybWEgY2xhcmEsIGRpZMOhdGljYSBlIGVtIHBvcnR1Z3XDqnMgYnJhc2lsZWlyby4gU2UgYSBwZXJndW50YSBmb3Igc29icmUgSUJTLCBDQlMsIEdUSU4sIFNwbGl0IFBheW1lbnQsIEltcG9zdG8gU2VsZXRpdm8gb3UgcXVhbHF1ZXIgdGVtYSB0cmlidXTDoXJpbyBicmFzaWxlaXJvLCBmb3JuZcOnYSB1bWEgcmVzcG9zdGEgY29tcGxldGEgZSBkZXRhbGhhZGEuYDtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhaS5tb2RlbHMuZ2VuZXJhdGVDb250ZW50KHtcbiAgICAgICAgbW9kZWw6IFwiZ2VtaW5pLTIuMC1mbGFzaFwiLFxuICAgICAgICBjb250ZW50czogcHJvbXB0LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFpUmVzcG9uc2UgPSByZXNwb25zZS50ZXh0O1xuXG4gICAgICBpZiAoIWFpUmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgZmFsbGJhY2sgPSBnZXRGYWxsYmFja1Jlc3BvbnNlKG1lc3NhZ2UpO1xuICAgICAgICBpZiAoZmFsbGJhY2spIHtcbiAgICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyByZXNwb25zZTogZmFsbGJhY2sgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICAgIHsgZXJyb3I6IFwiUmVzcG9zdGEgdmF6aWEgZGEgSUFcIiB9LFxuICAgICAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyByZXNwb25zZTogYWlSZXNwb25zZSB9KTtcbiAgICB9IGNhdGNoIChhaUVycm9yOiB1bmtub3duKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW0NoYXRCb3QgQVBJXSBFcnJvIG5hIEFQSSBHZW1pbmk6XCIsIGFpRXJyb3IpO1xuICAgICAgXG4gICAgICBjb25zdCBmYWxsYmFjayA9IGdldEZhbGxiYWNrUmVzcG9uc2UobWVzc2FnZSk7XG4gICAgICBpZiAoZmFsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgcmVzcG9uc2U6IGZhbGxiYWNrIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBhaUVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBhaUVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoYWlFcnJvcik7XG4gICAgICBcbiAgICAgIGlmIChlcnJvck1lc3NhZ2UuaW5jbHVkZXMoXCI0MjlcIikgfHwgZXJyb3JNZXNzYWdlLmluY2x1ZGVzKFwiUkVTT1VSQ0VfRVhIQVVTVEVEXCIpIHx8IGVycm9yTWVzc2FnZS5pbmNsdWRlcyhcInF1b3RhXCIpKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgICB7IGVycm9yOiBcIk8gc2VydmnDp28gZGUgSUEgZXN0w6EgdGVtcG9yYXJpYW1lbnRlIGluZGlzcG9uw612ZWwuIFBvciBmYXZvciwgdGVudGUgbm92YW1lbnRlIGVtIGFsZ3VucyBtaW51dG9zIG91IGVudHJlIGVtIGNvbnRhdG8gdmlhIFdoYXRzQXBwICgzNCkgOTk4NjItMzE2NC5cIiB9LFxuICAgICAgICAgIHsgc3RhdHVzOiA0MjkgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiRXJybyBhbyBwcm9jZXNzYXIgYSBwZXJndW50YS4gUG9yIGZhdm9yLCB0ZW50ZSBub3ZhbWVudGUgb3UgZW50cmUgZW0gY29udGF0byB2aWEgV2hhdHNBcHAgKDM0KSA5OTg2Mi0zMTY0LlwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICAgKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIltDaGF0Qm90IEFQSV0gRXJybyBnZXJhbDpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiRXJybyBhbyBwcm9jZXNzYXIgYSBwZXJndW50YS4gUG9yIGZhdm9yLCB0ZW50ZSBub3ZhbWVudGUuXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJHb29nbGVHZW5BSSIsIk5leHRSZXNwb25zZSIsIkZBTExCQUNLX1JFU1BPTlNFUyIsIlNZU1RFTV9DT05URVhUIiwiZ2V0RmFsbGJhY2tSZXNwb25zZSIsIm1lc3NhZ2UiLCJsb3dlck1lc3NhZ2UiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwia2V5IiwicmVzcG9uc2UiLCJPYmplY3QiLCJlbnRyaWVzIiwiUE9TVCIsInJlcXVlc3QiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiR0VNSU5JX0FQSV9LRVkiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJmYWxsYmFjayIsImFpIiwicHJvbXB0IiwibW9kZWxzIiwiZ2VuZXJhdGVDb250ZW50IiwibW9kZWwiLCJjb250ZW50cyIsImFpUmVzcG9uc2UiLCJ0ZXh0IiwiYWlFcnJvciIsImNvbnNvbGUiLCJlcnJvck1lc3NhZ2UiLCJFcnJvciIsIlN0cmluZyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/chat/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/./node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/./node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/./node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/./node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/./node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/./node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/./node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/./node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/./node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/./node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var C_Users_marcoprudencio_Documents_Reforma_app_api_chat_route_ts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app/api/chat/route.ts */ \"(rsc)/./app/api/chat/route.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/chat/route\",\n        pathname: \"/api/chat\",\n        filename: \"route\",\n        bundlePath: \"app/api/chat/route\"\n    },\n    distDir: \".next\" || 0,\n    relativeProjectDir:  false || '',\n    resolvedPagePath: \"C:\\\\Users\\\\marcoprudencio\\\\Documents\\\\Reforma\\\\app\\\\api\\\\chat\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_marcoprudencio_Documents_Reforma_app_api_chat_route_ts__WEBPACK_IMPORTED_MODULE_16__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/chat/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = false;\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || prerenderManifest.routes[resolvedPathname]);\n    if (isIsr && !isDraftMode) {\n        const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]);\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                cacheComponents: Boolean(nextConfig.experimental.cacheComponents),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        if (!(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjaGF0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZjaGF0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGY2hhdCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNtYXJjb3BydWRlbmNpbyU1Q0RvY3VtZW50cyU1Q1JlZm9ybWElNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q21hcmNvcHJ1ZGVuY2lvJTVDRG9jdW1lbnRzJTVDUmVmb3JtYSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCZpc0dsb2JhbE5vdEZvdW5kRW5hYmxlZD0hIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2Q7QUFDUztBQUNPO0FBQ0s7QUFDbUM7QUFDakQ7QUFDTztBQUNmO0FBQ3NDO0FBQ3pCO0FBQ007QUFDQztBQUNoQjtBQUNrQztBQUNwRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxhQUFhLE9BQW9DLElBQUksQ0FBRTtBQUN2RCx3QkFBd0IsTUFBdUM7QUFDL0Q7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7QUFDbkY7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxLQUFxQixFQUFFLEVBRTFCLENBQUM7QUFDTjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsS0FBd0M7QUFDdkU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0pBQW9KO0FBQ2hLLDhCQUE4Qiw2RkFBZ0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDZGQUFlO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDRFQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSw4QkFBOEIsNkVBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDRFQUFlO0FBQzNDLDRCQUE0Qiw2RUFBZ0I7QUFDNUMsb0JBQW9CLHlHQUFrQixrQ0FBa0MsaUhBQXNCO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsZ0ZBQWM7QUFDL0UsK0RBQStELHlDQUF5QztBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxRQUFRLEVBQUUsTUFBTTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGtCQUFrQjtBQUNsQix1Q0FBdUMsUUFBUSxFQUFFLFFBQVE7QUFDekQ7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLG9CQUFvQjtBQUNuRTtBQUNBLHlCQUF5Qiw2RUFBYztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNGQUF5QjtBQUNqRTtBQUNBLG9DQUFvQyw0RUFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzSkFBc0osb0VBQWM7QUFDcEssMElBQTBJLG9FQUFjO0FBQ3hKO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyw2RUFBZTtBQUNyRDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsOEJBQThCLDZFQUFZO0FBQzFDO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsMkZBQW1CO0FBQ2pFO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0VBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxSUFBcUksNkVBQWU7QUFDcEo7QUFDQSwyR0FBMkcsaUhBQWlIO0FBQzVOO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQiw2RUFBYztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0ZBQTJCO0FBQ3ZELGtCQUFrQiw2RUFBYztBQUNoQywrQkFBK0IsNEVBQXNCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLDBGQUFxQjtBQUNsRTtBQUNBLGtCQUFrQiw2RUFBWTtBQUM5QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw2RUFBNkUsZ0ZBQWM7QUFDM0YsaUNBQWlDLFFBQVEsRUFBRSxRQUFRO0FBQ25ELDBCQUEwQix1RUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU07QUFDTiw2QkFBNkIsNkZBQWU7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkZBQW1CO0FBQ3JEO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLDZFQUFZO0FBQzFCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCB7IGdldFJlcXVlc3RNZXRhIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcmVxdWVzdC1tZXRhXCI7XG5pbXBvcnQgeyBnZXRUcmFjZXIsIFNwYW5LaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3RyYWNlL3RyYWNlclwiO1xuaW1wb3J0IHsgbm9ybWFsaXplQXBwUGF0aCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9yb3V0ZXIvdXRpbHMvYXBwLXBhdGhzXCI7XG5pbXBvcnQgeyBOb2RlTmV4dFJlcXVlc3QsIE5vZGVOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9iYXNlLWh0dHAvbm9kZVwiO1xuaW1wb3J0IHsgTmV4dFJlcXVlc3RBZGFwdGVyLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL3NwZWMtZXh0ZW5zaW9uL2FkYXB0ZXJzL25leHQtcmVxdWVzdFwiO1xuaW1wb3J0IHsgQmFzZVNlcnZlclNwYW4gfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvdHJhY2UvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXZhbGlkYXRlUmVhc29uIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvaW5zdHJ1bWVudGF0aW9uL3V0aWxzXCI7XG5pbXBvcnQgeyBzZW5kUmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9zZW5kLXJlc3BvbnNlXCI7XG5pbXBvcnQgeyBmcm9tTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMsIHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvdXRpbHNcIjtcbmltcG9ydCB7IGdldENhY2hlQ29udHJvbEhlYWRlciB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9jYWNoZS1jb250cm9sXCI7XG5pbXBvcnQgeyBJTkZJTklURV9DQUNIRSwgTkVYVF9DQUNIRV9UQUdTX0hFQURFUiB9IGZyb20gXCJuZXh0L2Rpc3QvbGliL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTm9GYWxsYmFja0Vycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9zaGFyZWQvbGliL25vLWZhbGxiYWNrLWVycm9yLmV4dGVybmFsXCI7XG5pbXBvcnQgeyBDYWNoZWRSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yZXNwb25zZS1jYWNoZVwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXG1hcmNvcHJ1ZGVuY2lvXFxcXERvY3VtZW50c1xcXFxSZWZvcm1hXFxcXGFwcFxcXFxhcGlcXFxcY2hhdFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY2hhdC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NoYXRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2NoYXQvcm91dGVcIlxuICAgIH0sXG4gICAgZGlzdERpcjogcHJvY2Vzcy5lbnYuX19ORVhUX1JFTEFUSVZFX0RJU1RfRElSIHx8ICcnLFxuICAgIHJlbGF0aXZlUHJvamVjdERpcjogcHJvY2Vzcy5lbnYuX19ORVhUX1JFTEFUSVZFX1BST0pFQ1RfRElSIHx8ICcnLFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcbWFyY29wcnVkZW5jaW9cXFxcRG9jdW1lbnRzXFxcXFJlZm9ybWFcXFxcYXBwXFxcXGFwaVxcXFxjaGF0XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMsIGN0eCkge1xuICAgIHZhciBfbmV4dENvbmZpZ19leHBlcmltZW50YWw7XG4gICAgbGV0IHNyY1BhZ2UgPSBcIi9hcGkvY2hhdC9yb3V0ZVwiO1xuICAgIC8vIHR1cmJvcGFjayBkb2Vzbid0IG5vcm1hbGl6ZSBgL2luZGV4YCBpbiB0aGUgcGFnZSBuYW1lXG4gICAgLy8gc28gd2UgbmVlZCB0byB0byBwcm9jZXNzIGR5bmFtaWMgcm91dGVzIHByb3Blcmx5XG4gICAgLy8gVE9ETzogZml4IHR1cmJvcGFjayBwcm92aWRpbmcgZGlmZmVyaW5nIHZhbHVlIGZyb20gd2VicGFja1xuICAgIGlmIChwcm9jZXNzLmVudi5UVVJCT1BBQ0spIHtcbiAgICAgICAgc3JjUGFnZSA9IHNyY1BhZ2UucmVwbGFjZSgvXFwvaW5kZXgkLywgJycpIHx8ICcvJztcbiAgICB9IGVsc2UgaWYgKHNyY1BhZ2UgPT09ICcvaW5kZXgnKSB7XG4gICAgICAgIC8vIHdlIGFsd2F5cyBub3JtYWxpemUgL2luZGV4IHNwZWNpZmljYWxseVxuICAgICAgICBzcmNQYWdlID0gJy8nO1xuICAgIH1cbiAgICBjb25zdCBtdWx0aVpvbmVEcmFmdE1vZGUgPSBwcm9jZXNzLmVudi5fX05FWFRfTVVMVElfWk9ORV9EUkFGVF9NT0RFO1xuICAgIGNvbnN0IHByZXBhcmVSZXN1bHQgPSBhd2FpdCByb3V0ZU1vZHVsZS5wcmVwYXJlKHJlcSwgcmVzLCB7XG4gICAgICAgIHNyY1BhZ2UsXG4gICAgICAgIG11bHRpWm9uZURyYWZ0TW9kZVxuICAgIH0pO1xuICAgIGlmICghcHJlcGFyZVJlc3VsdCkge1xuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgcmVzLmVuZCgnQmFkIFJlcXVlc3QnKTtcbiAgICAgICAgY3R4LndhaXRVbnRpbCA9PSBudWxsID8gdm9pZCAwIDogY3R4LndhaXRVbnRpbC5jYWxsKGN0eCwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBidWlsZElkLCBwYXJhbXMsIG5leHRDb25maWcsIGlzRHJhZnRNb2RlLCBwcmVyZW5kZXJNYW5pZmVzdCwgcm91dGVyU2VydmVyQ29udGV4dCwgaXNPbkRlbWFuZFJldmFsaWRhdGUsIHJldmFsaWRhdGVPbmx5R2VuZXJhdGVkLCByZXNvbHZlZFBhdGhuYW1lIH0gPSBwcmVwYXJlUmVzdWx0O1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRTcmNQYWdlID0gbm9ybWFsaXplQXBwUGF0aChzcmNQYWdlKTtcbiAgICBsZXQgaXNJc3IgPSBCb29sZWFuKHByZXJlbmRlck1hbmlmZXN0LmR5bmFtaWNSb3V0ZXNbbm9ybWFsaXplZFNyY1BhZ2VdIHx8IHByZXJlbmRlck1hbmlmZXN0LnJvdXRlc1tyZXNvbHZlZFBhdGhuYW1lXSk7XG4gICAgaWYgKGlzSXNyICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjb25zdCBpc1ByZXJlbmRlcmVkID0gQm9vbGVhbihwcmVyZW5kZXJNYW5pZmVzdC5yb3V0ZXNbcmVzb2x2ZWRQYXRobmFtZV0pO1xuICAgICAgICBjb25zdCBwcmVyZW5kZXJJbmZvID0gcHJlcmVuZGVyTWFuaWZlc3QuZHluYW1pY1JvdXRlc1tub3JtYWxpemVkU3JjUGFnZV07XG4gICAgICAgIGlmIChwcmVyZW5kZXJJbmZvKSB7XG4gICAgICAgICAgICBpZiAocHJlcmVuZGVySW5mby5mYWxsYmFjayA9PT0gZmFsc2UgJiYgIWlzUHJlcmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTm9GYWxsYmFja0Vycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGNhY2hlS2V5ID0gbnVsbDtcbiAgICBpZiAoaXNJc3IgJiYgIXJvdXRlTW9kdWxlLmlzRGV2ICYmICFpc0RyYWZ0TW9kZSkge1xuICAgICAgICBjYWNoZUtleSA9IHJlc29sdmVkUGF0aG5hbWU7XG4gICAgICAgIC8vIGVuc3VyZSAvaW5kZXggYW5kIC8gaXMgbm9ybWFsaXplZCB0byBvbmUga2V5XG4gICAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXkgPT09ICcvaW5kZXgnID8gJy8nIDogY2FjaGVLZXk7XG4gICAgfVxuICAgIGNvbnN0IHN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlID0gLy8gSWYgd2UncmUgaW4gZGV2ZWxvcG1lbnQsIHdlIGFsd2F5cyBzdXBwb3J0IGR5bmFtaWMgSFRNTFxuICAgIHJvdXRlTW9kdWxlLmlzRGV2ID09PSB0cnVlIHx8IC8vIElmIHRoaXMgaXMgbm90IFNTRyBvciBkb2VzIG5vdCBoYXZlIHN0YXRpYyBwYXRocywgdGhlbiBpdCBzdXBwb3J0c1xuICAgIC8vIGR5bmFtaWMgSFRNTC5cbiAgICAhaXNJc3I7XG4gICAgLy8gVGhpcyBpcyBhIHJldmFsaWRhdGlvbiByZXF1ZXN0IGlmIHRoZSByZXF1ZXN0IGlzIGZvciBhIHN0YXRpY1xuICAgIC8vIHBhZ2UgYW5kIGl0IGlzIG5vdCBiZWluZyByZXN1bWVkIGZyb20gYSBwb3N0cG9uZWQgcmVuZGVyIGFuZFxuICAgIC8vIGl0IGlzIG5vdCBhIGR5bmFtaWMgUlNDIHJlcXVlc3QgdGhlbiBpdCBpcyBhIHJldmFsaWRhdGlvblxuICAgIC8vIHJlcXVlc3QuXG4gICAgY29uc3QgaXNSZXZhbGlkYXRlID0gaXNJc3IgJiYgIXN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlO1xuICAgIGNvbnN0IG1ldGhvZCA9IHJlcS5tZXRob2QgfHwgJ0dFVCc7XG4gICAgY29uc3QgdHJhY2VyID0gZ2V0VHJhY2VyKCk7XG4gICAgY29uc3QgYWN0aXZlU3BhbiA9IHRyYWNlci5nZXRBY3RpdmVTY29wZVNwYW4oKTtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgICBwYXJhbXMsXG4gICAgICAgIHByZXJlbmRlck1hbmlmZXN0LFxuICAgICAgICByZW5kZXJPcHRzOiB7XG4gICAgICAgICAgICBleHBlcmltZW50YWw6IHtcbiAgICAgICAgICAgICAgICBjYWNoZUNvbXBvbmVudHM6IEJvb2xlYW4obmV4dENvbmZpZy5leHBlcmltZW50YWwuY2FjaGVDb21wb25lbnRzKSxcbiAgICAgICAgICAgICAgICBhdXRoSW50ZXJydXB0czogQm9vbGVhbihuZXh0Q29uZmlnLmV4cGVyaW1lbnRhbC5hdXRoSW50ZXJydXB0cylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdXBwb3J0c0R5bmFtaWNSZXNwb25zZSxcbiAgICAgICAgICAgIGluY3JlbWVudGFsQ2FjaGU6IGdldFJlcXVlc3RNZXRhKHJlcSwgJ2luY3JlbWVudGFsQ2FjaGUnKSxcbiAgICAgICAgICAgIGNhY2hlTGlmZVByb2ZpbGVzOiAoX25leHRDb25maWdfZXhwZXJpbWVudGFsID0gbmV4dENvbmZpZy5leHBlcmltZW50YWwpID09IG51bGwgPyB2b2lkIDAgOiBfbmV4dENvbmZpZ19leHBlcmltZW50YWwuY2FjaGVMaWZlLFxuICAgICAgICAgICAgaXNSZXZhbGlkYXRlLFxuICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsLFxuICAgICAgICAgICAgb25DbG9zZTogKGNiKT0+e1xuICAgICAgICAgICAgICAgIHJlcy5vbignY2xvc2UnLCBjYik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25BZnRlclRhc2tFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25JbnN0cnVtZW50YXRpb25SZXF1ZXN0RXJyb3I6IChlcnJvciwgX3JlcXVlc3QsIGVycm9yQ29udGV4dCk9PnJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyb3IsIGVycm9yQ29udGV4dCwgcm91dGVyU2VydmVyQ29udGV4dClcbiAgICAgICAgfSxcbiAgICAgICAgc2hhcmVkQ29udGV4dDoge1xuICAgICAgICAgICAgYnVpbGRJZFxuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBub2RlTmV4dFJlcSA9IG5ldyBOb2RlTmV4dFJlcXVlc3QocmVxKTtcbiAgICBjb25zdCBub2RlTmV4dFJlcyA9IG5ldyBOb2RlTmV4dFJlc3BvbnNlKHJlcyk7XG4gICAgY29uc3QgbmV4dFJlcSA9IE5leHRSZXF1ZXN0QWRhcHRlci5mcm9tTm9kZU5leHRSZXF1ZXN0KG5vZGVOZXh0UmVxLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlKHJlcykpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGludm9rZVJvdXRlTW9kdWxlID0gYXN5bmMgKHNwYW4pPT57XG4gICAgICAgICAgICByZXR1cm4gcm91dGVNb2R1bGUuaGFuZGxlKG5leHRSZXEsIGNvbnRleHQpLmZpbmFsbHkoKCk9PntcbiAgICAgICAgICAgICAgICBpZiAoIXNwYW4pIHJldHVybjtcbiAgICAgICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgICAgICAnaHR0cC5zdGF0dXNfY29kZSc6IHJlcy5zdGF0dXNDb2RlLFxuICAgICAgICAgICAgICAgICAgICAnbmV4dC5yc2MnOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RTcGFuQXR0cmlidXRlcyA9IHRyYWNlci5nZXRSb290U3BhbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgICAgICAvLyBXZSB3ZXJlIHVuYWJsZSB0byBnZXQgYXR0cmlidXRlcywgcHJvYmFibHkgT1RFTCBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgICAgICAgIGlmICghcm9vdFNwYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJykgIT09IEJhc2VTZXJ2ZXJTcGFuLmhhbmRsZVJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBVbmV4cGVjdGVkIHJvb3Qgc3BhbiB0eXBlICcke3Jvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQuc3Bhbl90eXBlJyl9Jy4gUGxlYXNlIHJlcG9ydCB0aGlzIE5leHQuanMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL3ZlcmNlbC9uZXh0LmpzYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGUgPSByb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnJvdXRlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgJHttZXRob2R9ICR7cm91dGV9YDtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXh0LnJvdXRlJzogcm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC5yb3V0ZSc6IHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25leHQuc3Bhbl9uYW1lJzogbmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi51cGRhdGVOYW1lKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4udXBkYXRlTmFtZShgJHttZXRob2R9ICR7cmVxLnVybH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlUmVzcG9uc2UgPSBhc3luYyAoY3VycmVudFNwYW4pPT57XG4gICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWU7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZUdlbmVyYXRvciA9IGFzeW5jICh7IHByZXZpb3VzQ2FjaGVFbnRyeSB9KT0+e1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSAmJiBpc09uRGVtYW5kUmV2YWxpZGF0ZSAmJiByZXZhbGlkYXRlT25seUdlbmVyYXRlZCAmJiAhcHJldmlvdXNDYWNoZUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9uLWRlbWFuZCByZXZhbGlkYXRlIGFsd2F5cyBzZXRzIHRoaXMgaGVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsICdSRVZBTElEQVRFRCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgnVGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VSb3V0ZU1vZHVsZShjdXJyZW50U3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5mZXRjaE1ldHJpY3MgPSBjb250ZXh0LnJlbmRlck9wdHMuZmV0Y2hNZXRyaWNzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGVuZGluZ1dhaXRVbnRpbCA9IGNvbnRleHQucmVuZGVyT3B0cy5wZW5kaW5nV2FpdFVudGlsO1xuICAgICAgICAgICAgICAgICAgICAvLyBBdHRlbXB0IHVzaW5nIHByb3ZpZGVkIHdhaXRVbnRpbCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQncyBub3Qgd2UgZmFsbGJhY2sgdG8gc2VuZFJlc3BvbnNlJ3MgaGFuZGxpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdXYWl0VW50aWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdHgud2FpdFVudGlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LndhaXRVbnRpbChwZW5kaW5nV2FpdFVudGlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZW5kaW5nV2FpdFVudGlsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlVGFncyA9IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRUYWdzO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCBpcyBmb3IgYSBzdGF0aWMgcmVzcG9uc2UsIHdlIGNhbiBjYWNoZSBpdCBzbyBsb25nXG4gICAgICAgICAgICAgICAgICAgIC8vIGFzIGl0J3Mgbm90IGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0lzcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IHJlc3BvbnNlLmJsb2IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIGhlYWRlcnMgZnJvbSB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhyZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZVRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW05FWFRfQ0FDSEVfVEFHU19IRUFERVJdID0gY2FjaGVUYWdzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzWydjb250ZW50LXR5cGUnXSAmJiBibG9iLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IGJsb2IudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldmFsaWRhdGUgPSB0eXBlb2YgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGUgPT09ICd1bmRlZmluZWQnIHx8IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlID49IElORklOSVRFX0NBQ0hFID8gZmFsc2UgOiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGlyZSA9IHR5cGVvZiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID09PSAndW5kZWZpbmVkJyB8fCBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlID49IElORklOSVRFX0NBQ0hFID8gdW5kZWZpbmVkIDogY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY2FjaGUgZW50cnkgZm9yIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlRW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogQ2FjaGVkUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEJ1ZmZlci5mcm9tKGF3YWl0IGJsb2IuYXJyYXlCdWZmZXIoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlQ29udHJvbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlRW50cnk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIHJlc3BvbnNlIHdpdGhvdXQgY2FjaGluZyBpZiBub3QgSVNSXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCByZXNwb25zZSwgY29udGV4dC5yZW5kZXJPcHRzLnBlbmRpbmdXYWl0VW50aWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGJhY2tncm91bmQgcmV2YWxpZGF0ZSB3ZSBuZWVkIHRvIHJlcG9ydFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVxdWVzdCBlcnJvciBoZXJlIGFzIGl0IHdvbid0IGJlIGJ1YmJsZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogcHJldmlvdXNDYWNoZUVudHJ5LmlzU3RhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ0FwcCBSb3V0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogc3JjUGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgcm91dGVyU2VydmVyQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjYWNoZUVudHJ5ID0gYXdhaXQgcm91dGVNb2R1bGUuaGFuZGxlUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgICAgICBuZXh0Q29uZmlnLFxuICAgICAgICAgICAgICAgIGNhY2hlS2V5LFxuICAgICAgICAgICAgICAgIHJvdXRlS2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgICAgICAgICBpc0ZhbGxiYWNrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwcmVyZW5kZXJNYW5pZmVzdCxcbiAgICAgICAgICAgICAgICBpc1JvdXRlUFBSRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VHZW5lcmF0b3IsXG4gICAgICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IGNyZWF0ZSBhIGNhY2hlRW50cnkgZm9yIElTUlxuICAgICAgICAgICAgaWYgKCFpc0lzcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUgPSBjYWNoZUVudHJ5LnZhbHVlKSA9PSBudWxsID8gdm9pZCAwIDogX2NhY2hlRW50cnlfdmFsdWUua2luZCkgIT09IENhY2hlZFJvdXRlS2luZC5BUFBfUk9VVEUpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2NhY2hlRW50cnlfdmFsdWUxO1xuICAgICAgICAgICAgICAgIHRocm93IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXcgRXJyb3IoYEludmFyaWFudDogYXBwLXJvdXRlIHJlY2VpdmVkIGludmFsaWQgY2FjaGUgZW50cnkgJHtjYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiAoX2NhY2hlRW50cnlfdmFsdWUxID0gY2FjaGVFbnRyeS52YWx1ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jYWNoZUVudHJ5X3ZhbHVlMS5raW5kfWApLCBcIl9fTkVYVF9FUlJPUl9DT0RFXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiRTcwMVwiLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykpIHtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCd4LW5leHRqcy1jYWNoZScsIGlzT25EZW1hbmRSZXZhbGlkYXRlID8gJ1JFVkFMSURBVEVEJyA6IGNhY2hlRW50cnkuaXNNaXNzID8gJ01JU1MnIDogY2FjaGVFbnRyeS5pc1N0YWxlID8gJ1NUQUxFJyA6ICdISVQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERyYWZ0IG1vZGUgc2hvdWxkIG5ldmVyIGJlIGNhY2hlZFxuICAgICAgICAgICAgaWYgKGlzRHJhZnRNb2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICdwcml2YXRlLCBuby1jYWNoZSwgbm8tc3RvcmUsIG1heC1hZ2U9MCwgbXVzdC1yZXZhbGlkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gZnJvbU5vZGVPdXRnb2luZ0h0dHBIZWFkZXJzKGNhY2hlRW50cnkudmFsdWUuaGVhZGVycyk7XG4gICAgICAgICAgICBpZiAoIShnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpICYmIGlzSXNyKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuZGVsZXRlKE5FWFRfQ0FDSEVfVEFHU19IRUFERVIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgY2FjaGUgY29udHJvbCBpcyBhbHJlYWR5IHNldCBvbiB0aGUgcmVzcG9uc2Ugd2UgZG9uJ3RcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlIGl0IHRvIGFsbG93IHVzZXJzIHRvIGN1c3RvbWl6ZSBpdCB2aWEgbmV4dC5jb25maWdcbiAgICAgICAgICAgIGlmIChjYWNoZUVudHJ5LmNhY2hlQ29udHJvbCAmJiAhcmVzLmdldEhlYWRlcignQ2FjaGUtQ29udHJvbCcpICYmICFoZWFkZXJzLmdldCgnQ2FjaGUtQ29udHJvbCcpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVycy5zZXQoJ0NhY2hlLUNvbnRyb2wnLCBnZXRDYWNoZUNvbnRyb2xIZWFkZXIoY2FjaGVFbnRyeS5jYWNoZUNvbnRyb2wpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShjYWNoZUVudHJ5LnZhbHVlLmJvZHksIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIHN0YXR1czogY2FjaGVFbnRyeS52YWx1ZS5zdGF0dXMgfHwgMjAwXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gVE9ETzogYWN0aXZlU3BhbiBjb2RlIHBhdGggaXMgZm9yIHdoZW4gd3JhcHBlZCBieVxuICAgICAgICAvLyBuZXh0LXNlcnZlciBjYW4gYmUgcmVtb3ZlZCB3aGVuIHRoaXMgaXMgbm8gbG9uZ2VyIHVzZWRcbiAgICAgICAgaWYgKGFjdGl2ZVNwYW4pIHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZVJlc3BvbnNlKGFjdGl2ZVNwYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdHJhY2VyLndpdGhQcm9wYWdhdGVkQ29udGV4dChyZXEuaGVhZGVycywgKCk9PnRyYWNlci50cmFjZShCYXNlU2VydmVyU3Bhbi5oYW5kbGVSZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW5OYW1lOiBgJHttZXRob2R9ICR7cmVxLnVybH1gLFxuICAgICAgICAgICAgICAgICAgICBraW5kOiBTcGFuS2luZC5TRVJWRVIsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLm1ldGhvZCc6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLnRhcmdldCc6IHJlcS51cmxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIGhhbmRsZVJlc3BvbnNlKSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgTm9GYWxsYmFja0Vycm9yKSkge1xuICAgICAgICAgICAgYXdhaXQgcm91dGVNb2R1bGUub25SZXF1ZXN0RXJyb3IocmVxLCBlcnIsIHtcbiAgICAgICAgICAgICAgICByb3V0ZXJLaW5kOiAnQXBwIFJvdXRlcicsXG4gICAgICAgICAgICAgICAgcm91dGVQYXRoOiBub3JtYWxpemVkU3JjUGFnZSxcbiAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdyb3V0ZScsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogZ2V0UmV2YWxpZGF0ZVJlYXNvbih7XG4gICAgICAgICAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNPbkRlbWFuZFJldmFsaWRhdGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0aHJvdyBzbyB0aGF0IHdlIGNhbiBoYW5kbGUgc2VydmluZyBlcnJvciBwYWdlXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZHVyaW5nIHN0YXRpYyBnZW5lcmF0aW9uLCB0aHJvdyB0aGUgZXJyb3IgYWdhaW4uXG4gICAgICAgIGlmIChpc0lzcikgdGhyb3cgZXJyO1xuICAgICAgICAvLyBPdGhlcndpc2UsIHNlbmQgYSA1MDAgcmVzcG9uc2UuXG4gICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDUwMFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "./work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?32c4":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/promises":
/*!***************************************!*\
  !*** external "node:stream/promises" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/promises");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/google-auth-library","vendor-chunks/ws","vendor-chunks/gaxios","vendor-chunks/jws","vendor-chunks/json-bigint","vendor-chunks/google-logging-utils","vendor-chunks/gcp-metadata","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/@google","vendor-chunks/gtoken","vendor-chunks/safe-buffer","vendor-chunks/jwa","vendor-chunks/extend","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bignumber.js","vendor-chunks/base64-js"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fchat%2Froute&page=%2Fapi%2Fchat%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fchat%2Froute.ts&appDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmarcoprudencio%5CDocuments%5CReforma&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();