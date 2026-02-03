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
from typing import List
import shutil

from database import init_db, get_db, User, News, BannerSlide, Settings, NewsSource, PendingNews, Newsletter, FiscalCalendar, WeeklyHighlight
from schemas import (
    UserLogin, Token, NewsCreate, NewsUpdate, NewsResponse,
    BannerSlideCreate, BannerSlideUpdate, BannerSlideResponse, BannerReorder,
    SettingResponse, SettingsUpdateBulk,
    NewsSourceCreate, NewsSourceUpdate, NewsSourceResponse,
    PendingNewsResponse, PendingNewsUpdate,
    NewsletterCreate, NewsletterUpdate, NewsletterResponse,
    FiscalCalendarCreate, FiscalCalendarUpdate, FiscalCalendarResponse,
    WeeklyHighlightCreate, WeeklyHighlightUpdate, WeeklyHighlightResponse
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
UPLOAD_DIR = Path("/app/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.on_event("startup")
async def startup():
    await init_db()
    # Create default admin user if not exists
    async with AsyncSession(bind=app.state.engine) as db:
        result = await db.execute(select(User).where(User.username == "admin"))
        if not result.scalar_one_or_none():
            admin = User(
                username="admin",
                password_hash=get_password_hash("admin")
            )
            db.add(admin)
            await db.commit()
    
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

# Store engine reference for startup
from database import engine
app.state.engine = engine

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
    for article in articles:
        try:
            success = await news_ai_service.process_and_create_pending(article, db)
            if success:
                processed += 1
        except Exception as e:
            print(f"Erro ao processar notícia: {e}")
            continue
    
    # Update last_fetch for sources
    for source in sources:
        source.last_fetch = datetime.utcnow()
    await db.commit()
    
    return {
        "message": f"{processed} notícias processadas e adicionadas para aprovação",
        "processed": processed,
        "total_fetched": len(articles)
    }

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

@app.get("/")
async def root():
    return {"message": "Reforma Tributária News CMS API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
