import os
import asyncio
from pathlib import Path
import aiohttp
from datetime import datetime, timedelta
from typing import List, Dict
import google.generativeai as genai
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Debug: verificar se as chaves foram carregadas
print(f"NEWSAPI_KEY carregada: {'Sim' if os.getenv('NEWSAPI_KEY') else 'Não'}")
print(f"GEMINI_API_KEY carregada: {'Sim' if os.getenv('GEMINI_API_KEY') else 'Não'}")

# Keywords relacionadas à reforma tributária (50+ termos)
KEYWORDS = [
    # Reforma Tributária - Termos Principais
    "reforma tributária",
    "reforma fiscal",
    "sistema tributário",
    "tributação",
    "carga tributária",

    # Novos Impostos (IBS/CBS)
    "IBS",
    "CBS",
    "imposto sobre bens e serviços",
    "contribuição sobre bens e serviços",
    "IVA",
    "imposto sobre valor agregado",
    "IVA dual",

    # Impostos Atuais que serão substituídos
    "ICMS",
    "ISS",
    "PIS",
    "COFINS",
    "IPI",
    "IOF",
    "CSLL",
    "IRPJ",
    "IRPF",
    "contribuição social",

    # Documentos Fiscais
    "nota fiscal",
    "NF-e",
    "NFC-e",
    "CT-e",
    "MDF-e",
    "DANFE",
    "documento fiscal",
    "escrituração fiscal",
    "SPED",
    "EFD",
    "ECD",
    "ECF",

    # Códigos e Identificadores
    "GTIN",
    "NCM",
    "CEST",
    "CFOP",
    "CST",
    "código tributário",

    # Mecanismos e Processos
    "split payment",
    "cashback",
    "crédito tributário",
    "débito tributário",
    "compensação tributária",
    "substituição tributária",
    "antecipação tributária",
    "diferencial de alíquota",
    "DIFAL",

    # Órgãos e Entidades
    "SEFAZ",
    "receita federal",
    "secretaria da fazenda",
    "fisco",
    "ministério da fazenda",
    "CONFAZ",
    "conselho fazendário",
    "comitê gestor",

    # Termos Técnicos
    "alíquota",
    "base de cálculo",
    "fato gerador",
    "incidência",
    "isenção fiscal",
    "imunidade tributária",
    "benefício fiscal",
    "incentivo fiscal",
    "regime especial",
    "simples nacional",
    "lucro real",
    "lucro presumido",
    "MEI",
    "microempresa",

    # Transição e Cronograma
    "período de transição",
    "transição tributária",
    "cronograma da reforma",
    "2026",
    "2027",
    "2033",

    # Setores Específicos
    "zona franca",
    "zona franca de manaus",
    "exportação",
    "importação",
    "comércio exterior",
    "serviços",
    "indústria",
    "agronegócio",

    # Legislação
    "PEC 45",
    "PEC 110",
    "emenda constitucional",
    "lei complementar",
    "regulamentação",
    "decreto",

    # Compliance e Obrigações
    "obrigação acessória",
    "DCTF",
    "DIRF",
    "DEFIS",
    "compliance fiscal",
    "auditoria fiscal",
    "fiscalização",
    "auto de infração",
    "penalidade tributária",

    # Contabilidade
    "contabilidade tributária",
    "planejamento tributário",
    "elisão fiscal",
    "sonegação",
    "bitributação",
    "guerra fiscal"
]

# Keywords de alta prioridade para busca (usadas na query da API)
PRIORITY_KEYWORDS = [
    "reforma tributária",
    "IBS",
    "CBS",
    "imposto",
    "tributação",
    "ICMS",
    "nota fiscal",
    "NF-e",
    "GTIN",
    "receita federal",
    "alíquota",
    "SEFAZ",
    "simples nacional"
]

class NewsAIService:
    def __init__(self):
        self.newsapi_key = os.getenv("NEWSAPI_KEY", "")
        
        # Configure Gemini
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            self.model = None
    
    async def fetch_news_from_newsapi(self, query: str = "reforma tributária Brasil", page_size: int = 20) -> List[Dict]:
        """Busca notícias usando NewsAPI"""
        if not self.newsapi_key:
            return []

        url = "https://newsapi.org/v2/everything"
        params = {
            "q": query,
            "language": "pt",
            "sortBy": "publishedAt",
            "pageSize": page_size,
            "apiKey": self.newsapi_key
        }

        try:
            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("articles", [])
                    else:
                        error_text = await response.text()
                        print(f"NewsAPI erro ({response.status}): {error_text}")
        except Exception as e:
            print(f"Erro ao buscar notícias: {e}")

        return []
    
    def _match_source(self, article: Dict, sources: List[Dict]) -> str:
        """Verifica se um artigo pertence a uma das fontes configuradas"""
        article_url = (article.get("url") or "").lower()
        article_source = (article.get("source", {}).get("name") or "").lower()

        for source in sources:
            if not source.get("active"):
                continue
            source_url = source.get("url", "").lower()
            source_name = source.get("name", "").lower()

            # Extrair domínio base da fonte (ex: "globo.com" de "https://g1.globo.com")
            domain = source_url.replace("https://", "").replace("http://", "").split("/")[0]
            # Pegar domínio raiz (ex: "globo.com" de "g1.globo.com")
            domain_parts = domain.split(".")
            root_domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else domain

            if root_domain in article_url or root_domain in article_source:
                return source.get("name", "")
            if source_name in article_source:
                return source.get("name", "")

        return ""

    async def fetch_news_from_sources(self, sources: List[Dict]) -> List[Dict]:
        """Busca notícias e filtra pelas fontes configuradas"""
        all_articles = []
        existing_urls = set()

        active_sources = [s for s in sources if s.get("active")]
        print(f"Iniciando busca com {len(active_sources)} fontes ativas...")

        # Busca geral com vários termos (o filtro domains da NewsAPI não funciona bem com domínios BR)
        search_queries = [
            "reforma tributária",
            "IBS CBS imposto",
            "ICMS tributação",
            "nota fiscal NF-e",
            "receita federal fisco",
            "simples nacional MEI",
            "alíquota tributo"
        ]

        for query in search_queries:
            articles = await self.fetch_news_from_newsapi(query, page_size=50)
            for article in articles:
                url = article.get("url")
                if url and url not in existing_urls:
                    # Tentar associar a uma fonte configurada
                    matched_source = self._match_source(article, active_sources)
                    if matched_source:
                        article["configured_source"] = matched_source
                    else:
                        article["configured_source"] = article.get("source", {}).get("name", "Outras Fontes")
                    all_articles.append(article)
                    existing_urls.add(url)

        print(f"Total de artigos encontrados: {len(all_articles)}")

        # Log de artigos por fonte
        source_counts = {}
        for a in all_articles:
            src = a.get("configured_source", "?")
            source_counts[src] = source_counts.get(src, 0) + 1
        for src, count in sorted(source_counts.items(), key=lambda x: -x[1]):
            print(f"  {src}: {count} artigos")

        return all_articles

    async def fetch_generic_news(self) -> List[Dict]:
        """Busca genérica de notícias sobre reforma tributária (fallback)"""
        if not self.newsapi_key:
            return []

        all_articles = []

        search_terms = [
            "reforma tributária Brasil",
            "IBS CBS Brasil",
            "ICMS imposto Brasil",
            "nota fiscal eletrônica Brasil",
            "receita federal tributação",
            "simples nacional imposto"
        ]

        for term in search_terms:
            articles = await self.fetch_news_from_newsapi(term, page_size=30)
            existing_urls = {a.get("url") for a in all_articles}
            for article in articles:
                if article.get("url") not in existing_urls:
                    all_articles.append(article)

        print(f"Busca genérica total: {len(all_articles)} artigos únicos")
        return all_articles
    
    def check_relevance(self, article: Dict) -> bool:
        """Verifica se a notícia é relevante baseado nas keywords"""
        title = article.get("title", "") or ""
        description = article.get("description", "") or ""
        content = article.get("content", "") or ""

        text = f"{title} {description} {content}".lower()

        # Verifica se contém pelo menos 1 keyword (mais flexível)
        matches = sum(1 for keyword in KEYWORDS if keyword.lower() in text)

        # Log para debug
        if matches > 0:
            print(f"Artigo relevante ({matches} matches): {title[:50]}...")

        return matches >= 1
    
    async def rewrite_with_ai(self, article: Dict) -> Dict:
        """Reescreve a notícia usando IA"""
        if not self.model:
            # Fallback sem IA
            return {
                "title": article.get("title", ""),
                "excerpt": article.get("description", "")[:200],
                "content": article.get("content", ""),
                "category": "Reforma Tributária",
                "badge": "NOVO",
                "tags": ["Tributação", "Brasil"]
            }
        
        original_title = article.get("title", "")
        original_content = article.get("description", "") + " " + article.get("content", "")
        
        prompt = f"""Você é um especialista em tributação brasileira. Reescreva a seguinte notícia de forma profissional e objetiva, focando em reforma tributária.

NOTÍCIA ORIGINAL:
Título: {original_title}
Conteúdo: {original_content}

INSTRUÇÕES:
1. Reescreva o título de forma clara e profissional
2. Crie um resumo (excerpt) de 150-200 caracteres
3. Reescreva o conteúdo completo com 4-5 parágrafos bem estruturados
4. Identifique a categoria principal (GTIN, NF-e, IBS/CBS, Reforma Tributária, etc)
5. Sugira 3-5 tags relevantes
6. Determine o badge (NOVO, URGENTE, DESTAQUE, ATUALIZAÇÃO)

FORMATO DE RESPOSTA (JSON):
{{
  "title": "Título reescrito",
  "excerpt": "Resumo de 150-200 caracteres",
  "content": "Conteúdo completo reescrito em 4-5 parágrafos. Use \\n\\n para separar parágrafos. Use **Título** para subtítulos. Use • para listas.",
  "category": "Categoria",
  "badge": "BADGE",
  "tags": ["tag1", "tag2", "tag3"]
}}

Responda APENAS com o JSON, sem texto adicional."""

        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            text = response.text.strip()
            
            # Remover possíveis markdown
            if text.startswith("```json"):
                text = text.replace("```json", "").replace("```", "").strip()
            elif text.startswith("```"):
                text = text.replace("```", "").strip()
            
            import json
            result = json.loads(text)
            
            return result
        except Exception as e:
            print(f"Erro ao reescrever com IA: {e}")
            # Fallback
            return {
                "title": original_title,
                "excerpt": original_content[:200],
                "content": original_content,
                "category": "Reforma Tributária",
                "badge": "NOVO",
                "tags": ["Tributação"]
            }
    
    async def process_and_create_pending(self, article: Dict, db_session) -> bool:
        """Processa uma notícia e cria como pendente"""
        from database import PendingNews
        
        # Verificar relevância
        if not self.check_relevance(article):
            return False
        
        # Reescrever com IA
        rewritten = await self.rewrite_with_ai(article)
        
        # Criar notícia pendente
        pending = PendingNews(
            original_title=article.get("title", ""),
            original_url=article.get("url", ""),
            original_source=article.get("configured_source", article.get("source", {}).get("name", "Desconhecido")),
            title=rewritten.get("title", ""),
            excerpt=rewritten.get("excerpt", ""),
            content=rewritten.get("content", ""),
            category=rewritten.get("category", "Reforma Tributária"),
            badge=rewritten.get("badge", "NOVO"),
            badge_color="default",
            date=datetime.now().strftime("%d de %B de %Y"),
            image_url=article.get("urlToImage"),
            tags=rewritten.get("tags", []),
            expires_at=datetime.utcnow() + timedelta(days=2),
            fetched_at=datetime.utcnow()
        )
        
        db_session.add(pending)
        await db_session.commit()
        
        return True

# Singleton instance
news_ai_service = NewsAIService()
