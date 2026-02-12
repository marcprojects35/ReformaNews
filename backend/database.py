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

class ChatKnowledge(Base):
    """Base de conhecimento do chatbot"""
    __tablename__ = "chat_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    keywords = Column(JSON, nullable=True)
    category = Column(String, default="geral")
    source = Column(String, default="manual")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UnansweredQuestion(Base):
    """Perguntas que a IA não soube responder"""
    __tablename__ = "unanswered_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    user_session = Column(String, nullable=True)
    redirected_whatsapp = Column(Boolean, default=False)
    resolved = Column(Boolean, default=False)
    resolved_knowledge_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatSettings(Base):
    """Configurações do chatbot"""
    __tablename__ = "chat_settings"

    id = Column(Integer, primary_key=True, index=True)
    welcome_message = Column(Text, nullable=False)
    fallback_message = Column(Text, nullable=False)
    whatsapp_number = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CalculatorConfig(Base):
    """Configuração de ativação das calculadoras"""
    __tablename__ = "calculator_config"

    id = Column(Integer, primary_key=True, index=True)
    calculator_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CalculatorParameters(Base):
    """Parâmetros das alíquotas das calculadoras"""
    __tablename__ = "calculator_parameters"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String, nullable=False)
    description = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Document(Base):
    """Documentos da biblioteca para download"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    doc_type = Column(String, nullable=False)  # pdf, excel, video, link
    category = Column(String, nullable=False)
    file_size = Column(String, nullable=True)
    url = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FAQ(Base):
    """Perguntas frequentes"""
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Writer(Base):
    """Redatores e colunistas"""
    __tablename__ = "writers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, default="Colunista")
    image_url = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GlossaryTerm(Base):
    """Termos do glossário tributário"""
    __tablename__ = "glossary_terms"

    id = Column(Integer, primary_key=True, index=True)
    letter = Column(String(1), nullable=False, index=True)
    term = Column(String, nullable=False)
    definition = Column(Text, nullable=False)
    active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database setup - PostgreSQL remoto para dados principais
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://app_user:32235665@192.168.14.213:5432/app_db")

# Configurações de conexão PostgreSQL (SSL desativado para rede interna)
connect_args = {}
if DATABASE_URL.startswith("postgresql"):
    connect_args = {"ssl": False}

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args if DATABASE_URL.startswith("postgresql") else {}
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Database separado para Chat (PostgreSQL - banco ia_db)
CHAT_DATABASE_URL = os.getenv("CHAT_DATABASE_URL", "postgresql+asyncpg://app_user:32235665@192.168.14.213:5432/ia_db")

# Configurações de conexão PostgreSQL para chat (SSL desativado para rede interna)
chat_connect_args = {}
if CHAT_DATABASE_URL.startswith("postgresql"):
    chat_connect_args = {"ssl": False}

chat_engine = create_async_engine(
    CHAT_DATABASE_URL,
    echo=False,
    connect_args=chat_connect_args if CHAT_DATABASE_URL.startswith("postgresql") else {}
)
ChatAsyncSessionLocal = sessionmaker(chat_engine, class_=AsyncSession, expire_on_commit=False)

# Modelos do Chat (para criar no banco separado)
ChatModels = [ChatKnowledge, UnansweredQuestion, ChatSettings]

# Modelos principais (para criar no PostgreSQL)
MainModels = [User, News, NewsSource, PendingNews, BannerSlide, Settings, Newsletter,
              FiscalCalendar, WeeklyHighlight, CalculatorConfig, CalculatorParameters,
              Document, FAQ, GlossaryTerm, Writer]

async def init_db():
    """Inicializa ambos os bancos de dados"""
    # Criar tabelas principais no PostgreSQL
    async with engine.begin() as conn:
        for model in MainModels:
            await conn.run_sync(model.__table__.create, checkfirst=True)

    # Criar tabelas de chat no PostgreSQL (ia_db)
    async with chat_engine.begin() as conn:
        for model in ChatModels:
            await conn.run_sync(model.__table__.create, checkfirst=True)

async def get_db():
    """Sessão para banco principal (PostgreSQL)"""
    async with AsyncSessionLocal() as session:
        yield session

async def get_chat_db():
    """Sessão para banco de chat (PostgreSQL ia_db)"""
    async with ChatAsyncSessionLocal() as session:
        yield session
