from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from datetime import datetime, timedelta
import os

Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    badge = Column(String, nullable=False)
    badge_color = Column(String, default="default")
    date = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    tags = Column(JSON, nullable=False)
    source = Column(String, default="Portal Reforma Tributária News")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NewsSource(Base):
    __tablename__ = "news_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    source_type = Column(String, default="newsapi")  # newsapi, rss, scraping
    active = Column(Boolean, default=True)
    last_fetch = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PendingNews(Base):
    __tablename__ = "pending_news"
    
    id = Column(Integer, primary_key=True, index=True)
    original_title = Column(String, nullable=False)
    original_url = Column(String, nullable=True)
    original_source = Column(String, nullable=False)
    
    # Rewritten by AI
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    badge = Column(String, default="NOVO")
    badge_color = Column(String, default="default")
    date = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    tags = Column(JSON, nullable=False)
    
    # Metadata
    expires_at = Column(DateTime, nullable=False)  # Auto-delete after 2 days
    created_at = Column(DateTime, default=datetime.utcnow)
    fetched_at = Column(DateTime, default=datetime.utcnow)

class BannerSlide(Base):
    __tablename__ = "banner_slides"
    
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    alt = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Newsletter(Base):
    __tablename__ = "newsletters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    edition = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    highlight = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    pdf_url = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FiscalCalendar(Base):
    __tablename__ = "fiscal_calendar"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)  # DD
    month = Column(String, nullable=False)  # MMM (JAN, FEV, etc)
    event = Column(String, nullable=False)
    event_type = Column(String, nullable=False)  # federal, estadual, municipal, trabalhista
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WeeklyHighlight(Base):
    __tablename__ = "weekly_highlights"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./cms.db")
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
