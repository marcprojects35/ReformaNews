import asyncio
from database import init_db, AsyncSessionLocal, News, BannerSlide, Settings

# Notícias iniciais
initial_news = [
    {
        "title": "GTIN passa a ser obrigatório nas notas fiscais a partir de outubro de 2025",
        "excerpt": "A SEFAZ fará a checagem automática do código de barras GTIN nas NF-e e NFC-e. Notas com códigos inválidos serão rejeitadas.",
        "content": """A partir de outubro de 2025, a Secretaria da Fazenda (SEFAZ) implementará a validação automática do código GTIN (Global Trade Item Number) em todas as Notas Fiscais Eletrônicas (NF-e) e Notas Fiscais de Consumidor Eletrônicas (NFC-e).

**O que é o GTIN?**

O GTIN é o código de barras internacional que identifica produtos de forma única no mercado. Ele é utilizado em mais de 100 países e permite a rastreabilidade completa dos produtos desde a fabricação até o consumidor final.

**Principais mudanças:**

• Validação automática do GTIN contra a base de dados da GS1 Brasil
• Rejeição imediata de notas fiscais com códigos GTIN inválidos ou inexistentes
• Campos cEAN e cEANTrib passam a ser obrigatórios para produtos que possuem código de barras
• Empresas terão até setembro de 2025 para regularizar seus cadastros

**Impactos para as empresas:**

As empresas devem revisar imediatamente seus cadastros de produtos e garantir que todos os códigos GTIN estejam corretos e devidamente registrados na GS1 Brasil. Notas fiscais com códigos inválidos serão automaticamente rejeitadas, podendo causar atrasos nas entregas e problemas com clientes.

**Recomendações:**

1. Realize um inventário completo dos produtos comercializados
2. Verifique se todos os códigos GTIN estão ativos na GS1 Brasil
3. Atualize os campos cEAN e cEANTrib no seu sistema ERP
4. Teste a emissão de notas fiscais em ambiente de homologação""",
        "category": "GTIN",
        "badge": "URGENTE",
        "badge_color": "destructive",
        "date": "01 de outubro de 2025",
        "tags": ["GTIN", "NF-e", "Reforma Tributária"],
        "source": "Portal CTributária"
    },
    {
        "title": "Novo leiaute das NF-e traz as tags IBS e CBS obrigatórias em 2026",
        "excerpt": "Em outubro de 2025, o formato entra em homologação. Em janeiro de 2026, torna-se obrigatório também em produção.",
        "content": """O novo leiaute da Nota Fiscal Eletrônica (NF-e) foi publicado e traz importantes mudanças relacionadas à Reforma Tributária. As novas tags para IBS (Imposto sobre Bens e Serviços) e CBS (Contribuição sobre Bens e Serviços) serão obrigatórias a partir de 2026.

**Cronograma de implementação:**

• Outubro de 2025: Liberação do novo leiaute em ambiente de homologação
• Janeiro de 2026: Obrigatoriedade em ambiente de produção
• Período de transição: 3 meses para adequação dos sistemas

**Novas tags incluídas:**

• <IBS> - Grupo de informações do Imposto sobre Bens e Serviços
• <CBS> - Grupo de informações da Contribuição sobre Bens e Serviços
• <vIBS> - Valor do IBS
• <vCBS> - Valor da CBS
• <pIBS> - Alíquota do IBS
• <pCBS> - Alíquota da CBS

**Ações necessárias:**

1. Atualize seu software emissor de NF-e
2. Teste a emissão em ambiente de homologação
3. Treine a equipe fiscal sobre as novas informações""",
        "category": "NF-e",
        "badge": "NOVO",
        "badge_color": "default",
        "date": "15 de setembro de 2025",
        "tags": ["IBS/CBS", "NF-e", "Reforma Tributária"],
        "source": "Portal CTributária"
    },
    {
        "title": "Split Payment: entenda como funciona o novo modelo de pagamento da Reforma Tributária",
        "excerpt": "O sistema divide automaticamente o tributo no momento da transação, garantindo maior arrecadação e menos sonegação.",
        "content": """O Split Payment é um dos pilares da Reforma Tributária brasileira e representa uma mudança significativa na forma como os impostos serão recolhidos. O sistema divide automaticamente o valor do tributo no momento da transação financeira.

**Como funciona:**

• No momento da compra, o valor total é automaticamente dividido
• Uma parte vai para o fornecedor e outra diretamente para o governo
• O processo é transparente e automático
• Reduz fraudes e sonegação fiscal

**Vantagens:**

1. Maior eficiência na arrecadação
2. Redução da sonegação fiscal
3. Simplificação para o contribuinte
4. Transparência nas operações

**Implementação:**

O Split Payment começará a ser implementado gradualmente a partir de 2026, inicialmente em setores específicos e depois expandindo para toda a economia.""",
        "category": "Reforma Tributária",
        "badge": "DESTAQUE",
        "badge_color": "default",
        "date": "10 de agosto de 2025",
        "tags": ["Split Payment", "Reforma Tributária", "IBS/CBS"],
        "source": "Portal CTributária"
    }
]

# Slides do banner
initial_slides = [
    {
        "image_url": "https://customer-assets.emergentagent.com/job_0ff25268-ccab-4938-90f3-8865a3898b46/artifacts/siwe24tv_CAPA%2010%20ENCONTRO%20%281%29%201.jpg",
        "alt": "10º Encontro - Precificação na Prática",
        "order": 0,
        "active": True
    },
    {
        "image_url": "https://customer-assets.emergentagent.com/job_0ff25268-ccab-4938-90f3-8865a3898b46/artifacts/yssusxn3_ESPECIALISTAS-CARROSEL_01%202%201.png",
        "alt": "Nosso Time de Especialistas",
        "order": 1,
        "active": True
    },
    {
        "image_url": "https://customer-assets.emergentagent.com/job_0ff25268-ccab-4938-90f3-8865a3898b46/artifacts/eagrka5g_INFORMA%C3%87%C3%95ES%20Importantes.jpg",
        "alt": "Informações Importantes",
        "order": 2,
        "active": True
    },
    {
        "image_url": "https://customer-assets.emergentagent.com/job_0ff25268-ccab-4938-90f3-8865a3898b46/artifacts/hdnfla27_Parab%C3%A9ns%20-%20Ganhadores%20Mentoria%202.png",
        "alt": "Parabéns - Ganhadores Mentoria",
        "order": 3,
        "active": True
    }
]

async def seed_database():
    # Initialize database
    await init_db()
    
    async with AsyncSessionLocal() as db:
        # Check if data already exists
        from sqlalchemy import select
        
        # Seed news
        result = await db.execute(select(News))
        if not result.scalars().first():
            print("Populando notícias...")
            for news_data in initial_news:
                news = News(**news_data)
                db.add(news)
            await db.commit()
            print(f"✅ {len(initial_news)} notícias adicionadas!")
        else:
            print("❌ Notícias já existem no banco.")
        
        # Seed banner slides
        result = await db.execute(select(BannerSlide))
        if not result.scalars().first():
            print("Populando slides do banner...")
            for slide_data in initial_slides:
                slide = BannerSlide(**slide_data)
                db.add(slide)
            await db.commit()
            print(f"✅ {len(initial_slides)} slides adicionados!")
        else:
            print("❌ Slides já existem no banco.")
    
    print("\n🎉 Banco de dados populado com sucesso!")

if __name__ == "__main__":
    asyncio.run(seed_database())
