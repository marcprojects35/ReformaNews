# Carregar variáveis de ambiente ANTES de qualquer outro import
import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar .env do diretório do backend
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)
print(f"[Server] NEWSAPI_KEY carregada: {'Sim' if os.getenv('NEWSAPI_KEY') else 'Não'}")
print(f"[Server] GEMINI_API_KEY carregada: {'Sim' if os.getenv('GEMINI_API_KEY') else 'Não'}")

from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, delete
from datetime import timedelta, datetime
from typing import List, Optional
import shutil

from database import (
    init_db, get_db, get_chat_db, engine, chat_engine,
    User, News, BannerSlide, Settings, NewsSource, PendingNews, Newsletter,
    FiscalCalendar, WeeklyHighlight, ChatKnowledge, UnansweredQuestion, ChatSettings,
    CalculatorConfig, CalculatorParameters, Document, FAQ, GlossaryTerm, Writer,
    ArticleCategory, Article
)
from schemas import (
    UserLogin, Token, NewsCreate, NewsUpdate, NewsResponse,
    BannerSlideCreate, BannerSlideUpdate, BannerSlideResponse, BannerReorder,
    SettingResponse, SettingsUpdateBulk,
    NewsSourceCreate, NewsSourceUpdate, NewsSourceResponse,
    PendingNewsResponse, PendingNewsUpdate,
    NewsletterCreate, NewsletterUpdate, NewsletterResponse,
    FiscalCalendarCreate, FiscalCalendarUpdate, FiscalCalendarResponse,
    WeeklyHighlightCreate, WeeklyHighlightUpdate, WeeklyHighlightResponse,
    ChatKnowledgeCreate, ChatKnowledgeUpdate, ChatKnowledgeResponse,
    UnansweredQuestionResponse,
    ChatSettingsUpdate, ChatSettingsResponse,
    ChatRequest, ChatResponse, ChatTrainRequest, ChatTrainResponse,
    ChatSearchGoogleRequest, ChatSearchGoogleResponse,
    CalculatorConfigResponse, CalculatorConfigUpdate,
    CalculatorParameterResponse, CalculatorParametersBulkUpdate,
    DocumentCreate, DocumentUpdate, DocumentResponse,
    FAQCreate, FAQUpdate, FAQResponse,
    GlossaryTermCreate, GlossaryTermUpdate, GlossaryTermResponse,
    WriterCreate, WriterUpdate, WriterResponse,
    ArticleCategoryCreate, ArticleCategoryUpdate, ArticleCategoryResponse,
    ArticleCreate, ArticleUpdate, ArticleResponse, ArticleWithDetailsResponse
)
from auth import (
    authenticate_user, create_access_token, get_current_user,
    get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(title="Reforma Tributária News CMS API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
UPLOAD_DIR = Path(__file__).parent.parent / "public" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.on_event("startup")
async def startup():
    await init_db()
    # Create default admin user if not exists, or reset password if needed
    async with AsyncSession(bind=app.state.engine) as db:
        result = await db.execute(select(User).where(User.username == "admin"))
        existing_user = result.scalar_one_or_none()
        if not existing_user:
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin")
            )
            db.add(admin)
            await db.commit()
            print("[Server] Usuário admin criado com senha padrão")
        else:
            # Ensure password hash is valid - reset if corrupted
            from auth import verify_password
            if not verify_password("admin", existing_user.password_hash):
                existing_user.password_hash = get_password_hash("admin")
                await db.commit()
                print("[Server] Senha do admin resetada para o padrão")
    
    # Initialize settings
    async with AsyncSession(bind=app.state.engine) as db:
        result = await db.execute(select(Settings).where(Settings.key == "whatsapp_number"))
        if not result.scalar_one_or_none():
            settings = [
                Settings(key="whatsapp_number", value="5534998623164"),
                Settings(key="logo_url", value="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-LCnFAhRppf1WpoIrMPm80uY0pn1a0U.png"),
                Settings(key="site_title", value="Reforma Tributária News"),
            ]
            for setting in settings:
                db.add(setting)
            await db.commit()

    # Initialize chat settings (usando banco de chat PostgreSQL ia_db)
    async with AsyncSession(bind=app.state.chat_engine) as db:
        result = await db.execute(select(ChatSettings))
        if not result.scalar_one_or_none():
            chat_settings = ChatSettings(
                welcome_message="Olá! Sou a IA Tributária do Reforma Tributária News. Estou aqui para ajudar com suas dúvidas sobre IBS/CBS, GTIN, Split Payment, Imposto Seletivo e muito mais. Como posso ajudar você?",
                fallback_message="Desculpe, não consegui encontrar uma resposta para sua pergunta. Nossa equipe está pronta para ajudar pessoalmente!",
                whatsapp_number="5534998623164",
                active=True
            )
            db.add(chat_settings)
            await db.commit()

    # Initialize default knowledge base (usando banco de chat PostgreSQL ia_db)
    async with AsyncSession(bind=app.state.chat_engine) as db:
        result = await db.execute(select(ChatKnowledge))
        if not result.scalars().first():
            default_knowledge = [
                ChatKnowledge(
                    question="O que é IBS?",
                    answer="""**IBS (Imposto sobre Bens e Serviços)**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["ibs", "imposto sobre bens", "icms", "iss", "tributo subnacional"],
                    category="ibs",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é CBS?",
                    answer="""**CBS (Contribuição sobre Bens e Serviços)**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["cbs", "contribuição sobre bens", "pis", "cofins", "tributo federal"],
                    category="cbs",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é IBS e CBS?",
                    answer="""**IBS e CBS - Os Novos Tributos da Reforma**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["ibs", "cbs", "ibs e cbs", "iva dual", "novos tributos"],
                    category="reforma",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é GTIN?",
                    answer="""**GTIN (Global Trade Item Number)**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["gtin", "codigo de barras", "cpf do produto", "nfe", "nfce"],
                    category="gtin",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é Split Payment?",
                    answer="""**Split Payment (Pagamento Dividido)**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["split payment", "pagamento dividido", "retenção automática", "banco"],
                    category="split_payment",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é Imposto Seletivo?",
                    answer="""**Imposto Seletivo**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["imposto seletivo", "produtos nocivos", "bebidas", "cigarros", "tabaco"],
                    category="imposto_seletivo",
                    source="manual"
                ),
                ChatKnowledge(
                    question="O que é a Reforma Tributária?",
                    answer="""**Reforma Tributária Brasileira**

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

Para mais informações, entre em contato: WhatsApp (34) 99862-3164""",
                    keywords=["reforma tributária", "reforma", "mudança", "sistema tributário", "impostos"],
                    category="reforma",
                    source="manual"
                )
            ]
            for knowledge in default_knowledge:
                db.add(knowledge)
            await db.commit()
            print("[Server] Base de conhecimento inicial do chatbot criada")

    # Initialize calculator config
    async with AsyncSession(bind=app.state.engine) as db:
        result = await db.execute(select(CalculatorConfig))
        if not result.scalars().first():
            default_calculators = [
                CalculatorConfig(calculator_id="calculadora-automatica", name="Calculadora Tributária Automática", active=True, order=1),
                CalculatorConfig(calculator_id="ibs-cbs", name="Calculadora IBS/CBS Detalhada", active=True, order=2),
                CalculatorConfig(calculator_id="split", name="Simulador Split Payment", active=True, order=3),
                CalculatorConfig(calculator_id="timeline", name="Linha do Tempo da Reforma", active=True, order=4),
                CalculatorConfig(calculator_id="iss", name="Calculadora de ISS", active=True, order=5),
                CalculatorConfig(calculator_id="regime", name="Simulador de Regime Tributário", active=True, order=6),
                CalculatorConfig(calculator_id="darf", name="Gerador de DARF", active=True, order=7),
                CalculatorConfig(calculator_id="difal", name="Calculadora de DIFAL", active=True, order=8),
                CalculatorConfig(calculator_id="agenda", name="Agenda Tributária", active=True, order=9),
            ]
            for calc in default_calculators:
                db.add(calc)
            await db.commit()
            print("[Server] Configuração de calculadoras inicializada")

    # Initialize calculator parameters
    async with AsyncSession(bind=app.state.engine) as db:
        result = await db.execute(select(CalculatorParameters))
        if not result.scalars().first():
            default_parameters = [
                CalculatorParameters(key="ibs_estadual", value="9", description="Alíquota IBS Estadual (%)"),
                CalculatorParameters(key="ibs_municipal", value="8", description="Alíquota IBS Municipal (%)"),
                CalculatorParameters(key="cbs", value="10", description="Alíquota CBS Federal (%)"),
            ]
            for param in default_parameters:
                db.add(param)
            await db.commit()
            print("[Server] Parâmetros de calculadoras inicializados")

# Store engine references for startup
app.state.engine = engine
app.state.chat_engine = chat_engine

# ========== AUTH ENDPOINTS ==========

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/check")
async def check_auth(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username, "authenticated": True}

# ========== NEWS ENDPOINTS ==========

@app.get("/api/news", response_model=List[NewsResponse])
async def get_all_news(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(News).order_by(News.created_at.desc()))
    news = result.scalars().all()
    return news

@app.get("/api/news/{news_id}", response_model=NewsResponse)
async def get_news(news_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar_one_or_none()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@app.post("/api/news", response_model=NewsResponse)
async def create_news(
    news_data: NewsCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    news = News(**news_data.model_dump())
    db.add(news)
    await db.commit()
    await db.refresh(news)
    return news

@app.put("/api/news/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_data: NewsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar_one_or_none()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    for key, value in news_data.model_dump().items():
        setattr(news, key, value)
    
    await db.commit()
    await db.refresh(news)
    return news

@app.delete("/api/news/{news_id}")
async def delete_news(
    news_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar_one_or_none()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    await db.delete(news)
    await db.commit()
    return {"message": "News deleted successfully"}

# ========== BANNER ENDPOINTS ==========

@app.get("/api/banner", response_model=List[BannerSlideResponse])
async def get_banner_slides(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BannerSlide).where(BannerSlide.active == True).order_by(BannerSlide.order))
    slides = result.scalars().all()
    return slides

@app.post("/api/banner", response_model=BannerSlideResponse)
async def create_banner_slide(
    slide_data: BannerSlideCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    slide = BannerSlide(**slide_data.model_dump())
    db.add(slide)
    await db.commit()
    await db.refresh(slide)
    return slide

@app.put("/api/banner/{slide_id}", response_model=BannerSlideResponse)
async def update_banner_slide(
    slide_id: int,
    slide_data: BannerSlideUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(BannerSlide).where(BannerSlide.id == slide_id))
    slide = result.scalar_one_or_none()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    for key, value in slide_data.model_dump(exclude_unset=True).items():
        setattr(slide, key, value)
    
    await db.commit()
    await db.refresh(slide)
    return slide

@app.delete("/api/banner/{slide_id}")
async def delete_banner_slide(
    slide_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(BannerSlide).where(BannerSlide.id == slide_id))
    slide = result.scalar_one_or_none()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    
    await db.delete(slide)
    await db.commit()
    return {"message": "Slide deleted successfully"}

@app.put("/api/banner/reorder")
async def reorder_banner_slides(
    reorder_data: BannerReorder,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    for item in reorder_data.slide_orders:
        result = await db.execute(select(BannerSlide).where(BannerSlide.id == item["id"]))
        slide = result.scalar_one_or_none()
        if slide:
            slide.order = item["order"]
    
    await db.commit()
    return {"message": "Slides reordered successfully"}

# ========== SETTINGS ENDPOINTS ==========

@app.get("/api/settings", response_model=List[SettingResponse])
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Settings))
    settings = result.scalars().all()
    return settings

@app.put("/api/settings")
async def update_settings(
    settings_data: SettingsUpdateBulk,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    updates = settings_data.model_dump(exclude_unset=True)
    
    for key, value in updates.items():
        result = await db.execute(select(Settings).where(Settings.key == key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = value
        else:
            new_setting = Settings(key=key, value=value)
            db.add(new_setting)
    
    await db.commit()
    return {"message": "Settings updated successfully"}

# ========== UPLOAD ENDPOINT ==========

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    filename = f"{int(datetime.now().timestamp() * 1000)}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    file_url = f"/uploads/{filename}"
    return {"url": file_url, "filename": filename}

# ========== NEWS SOURCES ENDPOINTS ==========

@app.get("/api/sources", response_model=List[NewsSourceResponse])
async def get_news_sources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(NewsSource).order_by(NewsSource.created_at.desc()))
    sources = result.scalars().all()
    return sources

@app.post("/api/sources", response_model=NewsSourceResponse)
async def create_news_source(
    source_data: NewsSourceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check limit of 10 sources
    result = await db.execute(select(NewsSource))
    count = len(result.scalars().all())
    if count >= 10:
        raise HTTPException(status_code=400, detail="Limite máximo de 10 fontes atingido")
    
    source = NewsSource(**source_data.model_dump())
    db.add(source)
    await db.commit()
    await db.refresh(source)
    return source

@app.put("/api/sources/{source_id}", response_model=NewsSourceResponse)
async def update_news_source(
    source_id: int,
    source_data: NewsSourceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(NewsSource).where(NewsSource.id == source_id))
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    for key, value in source_data.model_dump(exclude_unset=True).items():
        setattr(source, key, value)
    
    await db.commit()
    await db.refresh(source)
    return source

@app.delete("/api/sources/{source_id}")
async def delete_news_source(
    source_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(NewsSource).where(NewsSource.id == source_id))
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Fonte não encontrada")
    
    await db.delete(source)
    await db.commit()
    return {"message": "Fonte deletada com sucesso"}

# ========== PENDING NEWS ENDPOINTS ==========

@app.get("/api/pending", response_model=List[PendingNewsResponse])
async def get_pending_news(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Auto-delete expired
    await db.execute(
        delete(PendingNews).where(PendingNews.expires_at < datetime.utcnow())
    )
    await db.commit()
    
    result = await db.execute(
        select(PendingNews).order_by(PendingNews.fetched_at.desc())
    )
    pending = result.scalars().all()
    return pending

@app.get("/api/pending/{pending_id}", response_model=PendingNewsResponse)
async def get_pending_news_by_id(
    pending_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PendingNews).where(PendingNews.id == pending_id))
    pending = result.scalar_one_or_none()
    if not pending:
        raise HTTPException(status_code=404, detail="Notícia pendente não encontrada")
    return pending

@app.put("/api/pending/{pending_id}", response_model=PendingNewsResponse)
async def update_pending_news(
    pending_id: int,
    pending_data: PendingNewsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PendingNews).where(PendingNews.id == pending_id))
    pending = result.scalar_one_or_none()
    if not pending:
        raise HTTPException(status_code=404, detail="Notícia pendente não encontrada")
    
    for key, value in pending_data.model_dump(exclude_unset=True).items():
        setattr(pending, key, value)
    
    await db.commit()
    await db.refresh(pending)
    return pending

@app.post("/api/pending/{pending_id}/publish")
async def publish_pending_news(
    pending_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get pending news
    result = await db.execute(select(PendingNews).where(PendingNews.id == pending_id))
    pending = result.scalar_one_or_none()
    if not pending:
        raise HTTPException(status_code=404, detail="Notícia pendente não encontrada")
    
    # Create published news
    news = News(
        title=pending.title,
        excerpt=pending.excerpt,
        content=pending.content,
        category=pending.category,
        badge=pending.badge,
        badge_color=pending.badge_color,
        date=pending.date,
        image_url=pending.image_url,
        tags=pending.tags,
        source=pending.original_source
    )
    db.add(news)
    
    # Delete pending
    await db.delete(pending)
    
    await db.commit()
    await db.refresh(news)
    
    return {"message": "Notícia publicada com sucesso", "news_id": news.id}

@app.delete("/api/pending/{pending_id}")
async def delete_pending_news(
    pending_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PendingNews).where(PendingNews.id == pending_id))
    pending = result.scalar_one_or_none()
    if not pending:
        raise HTTPException(status_code=404, detail="Notícia pendente não encontrada")
    
    await db.delete(pending)
    await db.commit()
    return {"message": "Notícia pendente deletada com sucesso"}

# ========== AI NEWS FETCHING ==========

@app.post("/api/fetch-news")
async def fetch_news_from_sources(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from news_ai_service import news_ai_service

    try:
        # Get active sources
        result = await db.execute(select(NewsSource).where(NewsSource.active == True))
        sources = result.scalars().all()

        if not sources:
            return {"message": "Nenhuma fonte ativa configurada", "processed": 0}

        # Convert to dict
        sources_list = [
            {"id": s.id, "name": s.name, "url": s.url, "active": s.active}
            for s in sources
        ]

        # Fetch news
        articles = await news_ai_service.fetch_news_from_sources(sources_list)

        # Process and create pending
        processed = 0
        errors = 0
        for article in articles:
            try:
                success = await news_ai_service.process_and_create_pending(article, db)
                if success:
                    processed += 1
            except Exception as e:
                print(f"Erro ao processar notícia: {e}")
                errors += 1
                continue

        # Update last_fetch for sources
        for source in sources:
            source.last_fetch = datetime.utcnow()
        await db.commit()

        if len(articles) == 0:
            return {
                "message": "Nenhuma notícia encontrada nas fontes configuradas. Verifique se as URLs estão corretas.",
                "processed": 0,
                "total_fetched": 0
            }

        return {
            "message": f"{processed} notícias processadas e adicionadas para aprovação (de {len(articles)} encontradas)",
            "processed": processed,
            "total_fetched": len(articles)
        }
    except Exception as e:
        print(f"Erro geral ao buscar notícias: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar notícias: {str(e)}"
        )

# ========== NEWSLETTER ENDPOINTS ==========

@app.get("/api/newsletter")
async def get_active_newsletter(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Newsletter).where(Newsletter.active == True).order_by(Newsletter.created_at.desc())
    )
    newsletter = result.scalar_one_or_none()
    if not newsletter:
        return None
    return newsletter

@app.get("/api/newsletters", response_model=List[NewsletterResponse])
async def get_all_newsletters(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Newsletter).order_by(Newsletter.created_at.desc()))
    newsletters = result.scalars().all()
    return newsletters

@app.post("/api/newsletter", response_model=NewsletterResponse)
async def create_newsletter(
    newsletter_data: NewsletterCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # If active, deactivate all others
    if newsletter_data.active:
        await db.execute(
            Newsletter.__table__.update().values(active=False)
        )

    newsletter = Newsletter(**newsletter_data.model_dump())
    db.add(newsletter)
    await db.commit()
    await db.refresh(newsletter)
    return newsletter

@app.put("/api/newsletter/{newsletter_id}", response_model=NewsletterResponse)
async def update_newsletter(
    newsletter_id: int,
    newsletter_data: NewsletterUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Newsletter).where(Newsletter.id == newsletter_id))
    newsletter = result.scalar_one_or_none()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter não encontrada")

    # If setting to active, deactivate all others
    if newsletter_data.active:
        await db.execute(
            Newsletter.__table__.update().where(Newsletter.id != newsletter_id).values(active=False)
        )

    for key, value in newsletter_data.model_dump(exclude_unset=True).items():
        setattr(newsletter, key, value)

    await db.commit()
    await db.refresh(newsletter)
    return newsletter

@app.delete("/api/newsletter/{newsletter_id}")
async def delete_newsletter(
    newsletter_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Newsletter).where(Newsletter.id == newsletter_id))
    newsletter = result.scalar_one_or_none()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter não encontrada")

    await db.delete(newsletter)
    await db.commit()
    return {"message": "Newsletter deletada com sucesso"}



# ========== FISCAL CALENDAR ENDPOINTS ==========

@app.get("/api/fiscal-calendar", response_model=List[FiscalCalendarResponse])
async def get_fiscal_calendar(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(FiscalCalendar).where(FiscalCalendar.active == True).order_by(FiscalCalendar.order)
    )
    events = result.scalars().all()
    return events

@app.get("/api/fiscal-calendar/all", response_model=List[FiscalCalendarResponse])
async def get_all_fiscal_calendar(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(FiscalCalendar).order_by(FiscalCalendar.order))
    events = result.scalars().all()
    return events

@app.post("/api/fiscal-calendar", response_model=FiscalCalendarResponse)
async def create_fiscal_calendar_event(
    event_data: FiscalCalendarCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    event = FiscalCalendar(**event_data.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event

@app.put("/api/fiscal-calendar/{event_id}", response_model=FiscalCalendarResponse)
async def update_fiscal_calendar_event(
    event_id: int,
    event_data: FiscalCalendarUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(FiscalCalendar).where(FiscalCalendar.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    for key, value in event_data.model_dump(exclude_unset=True).items():
        setattr(event, key, value)

    await db.commit()
    await db.refresh(event)
    return event

@app.delete("/api/fiscal-calendar/{event_id}")
async def delete_fiscal_calendar_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(FiscalCalendar).where(FiscalCalendar.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    await db.delete(event)
    await db.commit()
    return {"message": "Evento deletado com sucesso"}

# ========== WEEKLY HIGHLIGHTS ENDPOINTS ==========

@app.get("/api/weekly-highlights", response_model=List[WeeklyHighlightResponse])
async def get_weekly_highlights(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(WeeklyHighlight).where(WeeklyHighlight.active == True).order_by(WeeklyHighlight.order)
    )
    highlights = result.scalars().all()
    return highlights

@app.get("/api/weekly-highlights/all", response_model=List[WeeklyHighlightResponse])
async def get_all_weekly_highlights(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(WeeklyHighlight).order_by(WeeklyHighlight.order))
    highlights = result.scalars().all()
    return highlights

@app.post("/api/weekly-highlights", response_model=WeeklyHighlightResponse)
async def create_weekly_highlight(
    highlight_data: WeeklyHighlightCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    highlight = WeeklyHighlight(**highlight_data.model_dump())
    db.add(highlight)
    await db.commit()
    await db.refresh(highlight)
    return highlight

@app.put("/api/weekly-highlights/{highlight_id}", response_model=WeeklyHighlightResponse)
async def update_weekly_highlight(
    highlight_id: int,
    highlight_data: WeeklyHighlightUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(WeeklyHighlight).where(WeeklyHighlight.id == highlight_id))
    highlight = result.scalar_one_or_none()
    if not highlight:
        raise HTTPException(status_code=404, detail="Destaque não encontrado")

    for key, value in highlight_data.model_dump(exclude_unset=True).items():
        setattr(highlight, key, value)

    await db.commit()
    await db.refresh(highlight)
    return highlight

@app.delete("/api/weekly-highlights/{highlight_id}")
async def delete_weekly_highlight(
    highlight_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(WeeklyHighlight).where(WeeklyHighlight.id == highlight_id))
    highlight = result.scalar_one_or_none()
    if not highlight:
        raise HTTPException(status_code=404, detail="Destaque não encontrado")

    await db.delete(highlight)
    await db.commit()
    return {"message": "Destaque deletado com sucesso"}

# ========== CHATBOT ENDPOINTS ==========

async def search_knowledge(db: AsyncSession, query: str):
    """Busca no banco de conhecimento por palavras-chave"""
    query_lower = query.lower()
    query_words = set(query_lower.split())

    # Remove palavras comuns
    stopwords = {"o", "a", "os", "as", "um", "uma", "de", "da", "do", "que", "e", "é", "para", "com", "em", "como", "qual", "quais", "oque", "oq"}
    query_words = query_words - stopwords

    result = await db.execute(
        select(ChatKnowledge).where(ChatKnowledge.active == True)
    )
    knowledge_items = result.scalars().all()

    best_match = None
    best_score = 0

    for item in knowledge_items:
        # Verificar palavras-chave
        keywords = set(k.lower() for k in (item.keywords or []))
        question_words = set(item.question.lower().split()) - stopwords
        all_keywords = keywords | question_words

        # Calcular score
        matches = query_words & all_keywords
        if len(query_words) > 0:
            score = len(matches) / len(query_words)
        else:
            score = 0

        # Bonus para match exato em keyword
        for keyword in keywords:
            if keyword in query_lower:
                score += 0.3

        if score > best_score and score >= 0.4:
            best_score = score
            best_match = item

    return best_match

@app.post("/api/chatbot/ask", response_model=ChatResponse)
async def chatbot_ask(request: ChatRequest, db: AsyncSession = Depends(get_chat_db)):
    """Endpoint público do chatbot - busca apenas no banco de dados"""
    # Buscar configurações
    result = await db.execute(select(ChatSettings).where(ChatSettings.active == True))
    settings = result.scalar_one_or_none()

    if not settings:
        settings = ChatSettings(
            welcome_message="Olá!",
            fallback_message="Não encontrei uma resposta.",
            whatsapp_number="5534998623164",
            active=True
        )

    # Buscar no banco de conhecimento
    knowledge = await search_knowledge(db, request.message)

    if knowledge:
        return ChatResponse(
            response=knowledge.answer,
            found=True,
            redirect_whatsapp=False,
            whatsapp_number=None
        )

    # Não encontrou - registrar pergunta
    unanswered = UnansweredQuestion(
        question=request.message,
        redirected_whatsapp=True
    )
    db.add(unanswered)
    await db.commit()

    return ChatResponse(
        response=settings.fallback_message,
        found=False,
        redirect_whatsapp=True,
        whatsapp_number=settings.whatsapp_number
    )

@app.get("/api/chatbot/knowledge", response_model=List[ChatKnowledgeResponse])
async def get_chat_knowledge(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Lista toda a base de conhecimento"""
    result = await db.execute(select(ChatKnowledge).order_by(ChatKnowledge.created_at.desc()))
    knowledge = result.scalars().all()
    return knowledge

@app.post("/api/chatbot/knowledge", response_model=ChatKnowledgeResponse)
async def create_chat_knowledge(
    knowledge_data: ChatKnowledgeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Criar novo conhecimento"""
    knowledge = ChatKnowledge(**knowledge_data.model_dump())
    db.add(knowledge)
    await db.commit()
    await db.refresh(knowledge)
    return knowledge

@app.put("/api/chatbot/knowledge/{knowledge_id}", response_model=ChatKnowledgeResponse)
async def update_chat_knowledge(
    knowledge_id: int,
    knowledge_data: ChatKnowledgeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Atualizar conhecimento existente"""
    result = await db.execute(select(ChatKnowledge).where(ChatKnowledge.id == knowledge_id))
    knowledge = result.scalar_one_or_none()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

    for key, value in knowledge_data.model_dump(exclude_unset=True).items():
        setattr(knowledge, key, value)

    await db.commit()
    await db.refresh(knowledge)
    return knowledge

@app.delete("/api/chatbot/knowledge/{knowledge_id}")
async def delete_chat_knowledge(
    knowledge_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Deletar conhecimento"""
    result = await db.execute(select(ChatKnowledge).where(ChatKnowledge.id == knowledge_id))
    knowledge = result.scalar_one_or_none()
    if not knowledge:
        raise HTTPException(status_code=404, detail="Conhecimento não encontrado")

    await db.delete(knowledge)
    await db.commit()
    return {"message": "Conhecimento deletado com sucesso"}

@app.get("/api/chatbot/unanswered", response_model=List[UnansweredQuestionResponse])
async def get_unanswered_questions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Lista perguntas não respondidas"""
    result = await db.execute(
        select(UnansweredQuestion)
        .where(UnansweredQuestion.resolved == False)
        .order_by(UnansweredQuestion.created_at.desc())
    )
    questions = result.scalars().all()
    return questions

@app.delete("/api/chatbot/unanswered/{question_id}")
async def delete_unanswered_question(
    question_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Deletar pergunta não respondida"""
    result = await db.execute(select(UnansweredQuestion).where(UnansweredQuestion.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Pergunta não encontrada")

    await db.delete(question)
    await db.commit()
    return {"message": "Pergunta deletada com sucesso"}

@app.post("/api/chatbot/unanswered/{question_id}/resolve")
async def resolve_unanswered_question(
    question_id: int,
    knowledge_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Marcar pergunta como resolvida"""
    result = await db.execute(select(UnansweredQuestion).where(UnansweredQuestion.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Pergunta não encontrada")

    question.resolved = True
    question.resolved_knowledge_id = knowledge_id
    await db.commit()
    return {"message": "Pergunta marcada como resolvida"}

@app.get("/api/chatbot/settings", response_model=ChatSettingsResponse)
async def get_chat_settings(db: AsyncSession = Depends(get_chat_db)):
    """Obter configurações do chatbot"""
    result = await db.execute(select(ChatSettings).where(ChatSettings.active == True))
    settings = result.scalar_one_or_none()
    if not settings:
        raise HTTPException(status_code=404, detail="Configurações não encontradas")
    return settings

@app.put("/api/chatbot/settings", response_model=ChatSettingsResponse)
async def update_chat_settings(
    settings_data: ChatSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Atualizar configurações do chatbot"""
    result = await db.execute(select(ChatSettings).where(ChatSettings.active == True))
    settings = result.scalar_one_or_none()

    if not settings:
        # Criar se não existir
        settings = ChatSettings(
            welcome_message=settings_data.welcome_message or "Olá!",
            fallback_message=settings_data.fallback_message or "Não encontrei uma resposta.",
            whatsapp_number=settings_data.whatsapp_number or "5534998623164",
            active=True
        )
        db.add(settings)
    else:
        for key, value in settings_data.model_dump(exclude_unset=True).items():
            setattr(settings, key, value)

    await db.commit()
    await db.refresh(settings)
    return settings

@app.post("/api/chatbot/train", response_model=ChatTrainResponse)
async def chatbot_train(
    request: ChatTrainRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Chat de treinamento - usa Gemini para responder (admin only)"""
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY não configurada")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""Você é um assistente especializado em tributação brasileira e Reforma Tributária.
Responda de forma clara, didática e em português brasileiro.
Se a pergunta for sobre IBS, CBS, GTIN, Split Payment, Imposto Seletivo ou qualquer tema tributário brasileiro, forneça uma resposta completa e detalhada.

Pergunta: {request.message}"""

    try:
        response = model.generate_content(prompt)
        return ChatTrainResponse(response=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao consultar IA: {str(e)}")

@app.post("/api/chatbot/search-google", response_model=ChatSearchGoogleResponse)
async def chatbot_search_google(
    request: ChatSearchGoogleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_chat_db)
):
    """Pesquisar no Google via Gemini (admin only)"""
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY não configurada")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-pro")

    prompt = f"""Pesquise e forneça informações atualizadas sobre a seguinte pergunta relacionada à tributação brasileira:

"{request.query}"

Forneça uma resposta completa, precisa e bem estruturada em português brasileiro.
Inclua detalhes técnicos, legislação aplicável, prazos e qualquer informação relevante.
Use formatação markdown para melhor legibilidade."""

    try:
        response = model.generate_content(prompt)
        return ChatSearchGoogleResponse(response=response.text, source="google")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao pesquisar: {str(e)}")

# ========== CALCULATOR CONFIG ENDPOINTS ==========

@app.get("/api/calculator-config", response_model=List[CalculatorConfigResponse])
async def get_calculator_config(db: AsyncSession = Depends(get_db)):
    """Lista todas as calculadoras e seu status"""
    result = await db.execute(select(CalculatorConfig).order_by(CalculatorConfig.order))
    calculators = result.scalars().all()
    return calculators

@app.put("/api/calculator-config/{calculator_id}", response_model=CalculatorConfigResponse)
async def update_calculator_config(
    calculator_id: str,
    config_data: CalculatorConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualiza status de uma calculadora"""
    result = await db.execute(select(CalculatorConfig).where(CalculatorConfig.calculator_id == calculator_id))
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Calculadora não encontrada")

    for key, value in config_data.model_dump(exclude_unset=True).items():
        setattr(config, key, value)

    await db.commit()
    await db.refresh(config)
    return config

# ========== CALCULATOR PARAMETERS ENDPOINTS ==========

@app.get("/api/calculator-parameters")
async def get_calculator_parameters(db: AsyncSession = Depends(get_db)):
    """Lista todos os parâmetros das calculadoras"""
    result = await db.execute(select(CalculatorParameters))
    parameters = result.scalars().all()

    # Converter para dict para facilitar uso no frontend
    params_dict = {}
    for param in parameters:
        params_dict[param.key] = {
            "id": param.id,
            "value": param.value,
            "description": param.description,
            "updated_at": param.updated_at.isoformat() if param.updated_at else None
        }

    return params_dict

@app.put("/api/calculator-parameters")
async def update_calculator_parameters(
    params_data: CalculatorParametersBulkUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualiza parâmetros das calculadoras em bulk"""
    updates = params_data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        if value is not None:
            result = await db.execute(select(CalculatorParameters).where(CalculatorParameters.key == key))
            param = result.scalar_one_or_none()
            if param:
                param.value = value
            else:
                new_param = CalculatorParameters(key=key, value=value, description=f"Alíquota {key.replace('_', ' ').title()}")
                db.add(new_param)

    await db.commit()
    return {"message": "Parâmetros atualizados com sucesso"}

# ========== DOCUMENT (BIBLIOTECA) ENDPOINTS ==========

@app.get("/api/documents", response_model=List[DocumentResponse])
async def get_documents(db: AsyncSession = Depends(get_db)):
    """Lista todos os documentos ativos da biblioteca"""
    result = await db.execute(
        select(Document).where(Document.active == True).order_by(Document.order)
    )
    documents = result.scalars().all()
    return documents

@app.get("/api/documents/all", response_model=List[DocumentResponse])
async def get_all_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista todos os documentos (admin)"""
    result = await db.execute(select(Document).order_by(Document.order))
    documents = result.scalars().all()
    return documents

@app.post("/api/documents", response_model=DocumentResponse)
async def create_document(
    doc_data: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Criar novo documento"""
    document = Document(**doc_data.model_dump())
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return document

@app.put("/api/documents/{doc_id}", response_model=DocumentResponse)
async def update_document(
    doc_id: int,
    doc_data: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualizar documento"""
    result = await db.execute(select(Document).where(Document.id == doc_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    for key, value in doc_data.model_dump(exclude_unset=True).items():
        setattr(document, key, value)

    await db.commit()
    await db.refresh(document)
    return document

@app.delete("/api/documents/{doc_id}")
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletar documento"""
    result = await db.execute(select(Document).where(Document.id == doc_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    await db.delete(document)
    await db.commit()
    return {"message": "Documento deletado com sucesso"}

# ========== FAQ ENDPOINTS ==========

@app.get("/api/faqs", response_model=List[FAQResponse])
async def get_faqs(db: AsyncSession = Depends(get_db)):
    """Lista todas as FAQs ativas"""
    result = await db.execute(
        select(FAQ).where(FAQ.active == True).order_by(FAQ.category, FAQ.order)
    )
    faqs = result.scalars().all()
    return faqs

@app.get("/api/faqs/all", response_model=List[FAQResponse])
async def get_all_faqs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista todas as FAQs (admin)"""
    result = await db.execute(select(FAQ).order_by(FAQ.category, FAQ.order))
    faqs = result.scalars().all()
    return faqs

@app.post("/api/faqs", response_model=FAQResponse)
async def create_faq(
    faq_data: FAQCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Criar nova FAQ"""
    faq = FAQ(**faq_data.model_dump())
    db.add(faq)
    await db.commit()
    await db.refresh(faq)
    return faq

@app.put("/api/faqs/{faq_id}", response_model=FAQResponse)
async def update_faq(
    faq_id: int,
    faq_data: FAQUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualizar FAQ"""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ não encontrada")

    for key, value in faq_data.model_dump(exclude_unset=True).items():
        setattr(faq, key, value)

    await db.commit()
    await db.refresh(faq)
    return faq

@app.delete("/api/faqs/{faq_id}")
async def delete_faq(
    faq_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletar FAQ"""
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ não encontrada")

    await db.delete(faq)
    await db.commit()
    return {"message": "FAQ deletada com sucesso"}

# ========== WRITER ENDPOINTS ==========

@app.get("/api/writers", response_model=List[WriterResponse])
async def get_writers(db: AsyncSession = Depends(get_db)):
    """Lista todos os redatores ativos"""
    result = await db.execute(
        select(Writer).where(Writer.active == True).order_by(Writer.order)
    )
    writers = result.scalars().all()
    return writers

@app.get("/api/writers/all", response_model=List[WriterResponse])
async def get_all_writers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista todos os redatores (admin)"""
    result = await db.execute(select(Writer).order_by(Writer.order))
    writers = result.scalars().all()
    return writers

@app.post("/api/writers", response_model=WriterResponse)
async def create_writer(
    writer_data: WriterCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Criar novo redator"""
    writer = Writer(**writer_data.model_dump())
    db.add(writer)
    await db.commit()
    await db.refresh(writer)
    return writer

@app.put("/api/writers/{writer_id}", response_model=WriterResponse)
async def update_writer(
    writer_id: int,
    writer_data: WriterUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualizar redator"""
    result = await db.execute(select(Writer).where(Writer.id == writer_id))
    writer = result.scalar_one_or_none()
    if not writer:
        raise HTTPException(status_code=404, detail="Redator não encontrado")

    for key, value in writer_data.model_dump(exclude_unset=True).items():
        setattr(writer, key, value)

    await db.commit()
    await db.refresh(writer)
    return writer

@app.delete("/api/writers/{writer_id}")
async def delete_writer(
    writer_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletar redator"""
    result = await db.execute(select(Writer).where(Writer.id == writer_id))
    writer = result.scalar_one_or_none()
    if not writer:
        raise HTTPException(status_code=404, detail="Redator não encontrado")

    await db.delete(writer)
    await db.commit()
    return {"message": "Redator deletado com sucesso"}

# ========== ARTICLE CATEGORY ENDPOINTS ==========

@app.get("/api/article-categories", response_model=List[ArticleCategoryResponse])
async def get_article_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ArticleCategory).where(ArticleCategory.active == True).order_by(ArticleCategory.order)
    )
    return result.scalars().all()

@app.get("/api/article-categories/all", response_model=List[ArticleCategoryResponse])
async def get_all_article_categories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ArticleCategory).order_by(ArticleCategory.order))
    return result.scalars().all()

@app.post("/api/article-categories", response_model=ArticleCategoryResponse)
async def create_article_category(
    category_data: ArticleCategoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    category = ArticleCategory(**category_data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

@app.put("/api/article-categories/{category_id}", response_model=ArticleCategoryResponse)
async def update_article_category(
    category_id: int,
    category_data: ArticleCategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    for key, value in category_data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)
    await db.commit()
    await db.refresh(category)
    return category

@app.delete("/api/article-categories/{category_id}")
async def delete_article_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    articles_result = await db.execute(select(Article).where(Article.category_id == category_id))
    if articles_result.scalars().first():
        raise HTTPException(status_code=400, detail="Não é possível excluir categoria com artigos vinculados")
    await db.delete(category)
    await db.commit()
    return {"message": "Categoria deletada com sucesso"}

# ========== ARTICLE ENDPOINTS ==========

@app.get("/api/articles", response_model=List[ArticleWithDetailsResponse])
async def get_articles(
    category_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Article).where(Article.active == True).order_by(Article.order, Article.created_at.desc())
    if category_id:
        query = query.where(Article.category_id == category_id)
    result = await db.execute(query)
    articles = result.scalars().all()

    enriched = []
    for article in articles:
        article_dict = {
            "id": article.id, "title": article.title, "excerpt": article.excerpt,
            "content": article.content, "category_id": article.category_id,
            "writer_id": article.writer_id, "image_url": article.image_url,
            "file_url": article.file_url, "active": article.active, "order": article.order,
            "created_at": article.created_at, "updated_at": article.updated_at,
            "writer_name": None, "writer_role": None, "writer_image_url": None, "category_name": None,
        }
        writer_result = await db.execute(select(Writer).where(Writer.id == article.writer_id))
        writer = writer_result.scalar_one_or_none()
        if writer:
            article_dict["writer_name"] = writer.name
            article_dict["writer_role"] = writer.role
            article_dict["writer_image_url"] = writer.image_url
        cat_result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == article.category_id))
        cat = cat_result.scalar_one_or_none()
        if cat:
            article_dict["category_name"] = cat.name
        enriched.append(article_dict)
    return enriched

@app.get("/api/articles/all", response_model=List[ArticleResponse])
async def get_all_articles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Article).order_by(Article.created_at.desc()))
    return result.scalars().all()

@app.get("/api/articles/{article_id}", response_model=ArticleWithDetailsResponse)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    article_dict = {
        "id": article.id, "title": article.title, "excerpt": article.excerpt,
        "content": article.content, "category_id": article.category_id,
        "writer_id": article.writer_id, "image_url": article.image_url,
        "file_url": article.file_url, "active": article.active, "order": article.order,
        "created_at": article.created_at, "updated_at": article.updated_at,
        "writer_name": None, "writer_role": None, "writer_image_url": None, "category_name": None,
    }
    writer_result = await db.execute(select(Writer).where(Writer.id == article.writer_id))
    writer = writer_result.scalar_one_or_none()
    if writer:
        article_dict["writer_name"] = writer.name
        article_dict["writer_role"] = writer.role
        article_dict["writer_image_url"] = writer.image_url
    cat_result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == article.category_id))
    cat = cat_result.scalar_one_or_none()
    if cat:
        article_dict["category_name"] = cat.name
    return article_dict

@app.post("/api/articles", response_model=ArticleResponse)
async def create_article(
    article_data: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    cat_result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == article_data.category_id))
    if not cat_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Categoria não encontrada")
    writer_result = await db.execute(select(Writer).where(Writer.id == article_data.writer_id))
    if not writer_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Redator não encontrado")
    article = Article(**article_data.model_dump())
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article

@app.put("/api/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: int,
    article_data: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    update_data = article_data.model_dump(exclude_unset=True)
    if "category_id" in update_data and update_data["category_id"] is not None:
        cat_result = await db.execute(select(ArticleCategory).where(ArticleCategory.id == update_data["category_id"]))
        if not cat_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Categoria não encontrada")
    if "writer_id" in update_data and update_data["writer_id"] is not None:
        writer_result = await db.execute(select(Writer).where(Writer.id == update_data["writer_id"]))
        if not writer_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Redator não encontrado")
    for key, value in update_data.items():
        setattr(article, key, value)
    await db.commit()
    await db.refresh(article)
    return article

@app.delete("/api/articles/{article_id}")
async def delete_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Artigo não encontrado")
    await db.delete(article)
    await db.commit()
    return {"message": "Artigo deletado com sucesso"}

# ========== GLOSSARY ENDPOINTS ==========

@app.get("/api/glossary", response_model=List[GlossaryTermResponse])
async def get_glossary(db: AsyncSession = Depends(get_db)):
    """Lista todos os termos ativos do glossário"""
    result = await db.execute(
        select(GlossaryTerm).where(GlossaryTerm.active == True).order_by(GlossaryTerm.letter, GlossaryTerm.order)
    )
    terms = result.scalars().all()
    return terms

@app.get("/api/glossary/all", response_model=List[GlossaryTermResponse])
async def get_all_glossary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista todos os termos do glossário (admin)"""
    result = await db.execute(select(GlossaryTerm).order_by(GlossaryTerm.letter, GlossaryTerm.order))
    terms = result.scalars().all()
    return terms

@app.post("/api/glossary", response_model=GlossaryTermResponse)
async def create_glossary_term(
    term_data: GlossaryTermCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Criar novo termo no glossário"""
    term = GlossaryTerm(**term_data.model_dump())
    db.add(term)
    await db.commit()
    await db.refresh(term)
    return term

@app.put("/api/glossary/{term_id}", response_model=GlossaryTermResponse)
async def update_glossary_term(
    term_id: int,
    term_data: GlossaryTermUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualizar termo do glossário"""
    result = await db.execute(select(GlossaryTerm).where(GlossaryTerm.id == term_id))
    term = result.scalar_one_or_none()
    if not term:
        raise HTTPException(status_code=404, detail="Termo não encontrado")

    for key, value in term_data.model_dump(exclude_unset=True).items():
        setattr(term, key, value)

    await db.commit()
    await db.refresh(term)
    return term

@app.delete("/api/glossary/{term_id}")
async def delete_glossary_term(
    term_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletar termo do glossário"""
    result = await db.execute(select(GlossaryTerm).where(GlossaryTerm.id == term_id))
    term = result.scalar_one_or_none()
    if not term:
        raise HTTPException(status_code=404, detail="Termo não encontrado")

    await db.delete(term)
    await db.commit()
    return {"message": "Termo deletado com sucesso"}

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

@app.get("/")
async def root():
    return {"message": "Reforma Tributária News CMS API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
