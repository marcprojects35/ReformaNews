from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Auth schemas
class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# News schemas
class NewsBase(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    badge: str
    badge_color: str = "default"
    date: str
    image_url: Optional[str] = None
    tags: List[str]
    source: str = "Portal Reforma Tributária News"

class NewsCreate(NewsBase):
    pass

class NewsUpdate(NewsBase):
    pass

class NewsResponse(NewsBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# News Source schemas
class NewsSourceBase(BaseModel):
    name: str
    url: str
    source_type: str = "newsapi"
    active: bool = True

class NewsSourceCreate(NewsSourceBase):
    pass

class NewsSourceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    source_type: Optional[str] = None
    active: Optional[bool] = None

class NewsSourceResponse(NewsSourceBase):
    id: int
    last_fetch: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Pending News schemas
class PendingNewsResponse(BaseModel):
    id: int
    original_title: str
    original_url: Optional[str]
    original_source: str
    title: str
    excerpt: str
    content: str
    category: str
    badge: str
    badge_color: str
    date: str
    image_url: Optional[str]
    tags: List[str]
    expires_at: datetime
    created_at: datetime
    fetched_at: datetime
    
    class Config:
        from_attributes = True

class PendingNewsUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    badge: Optional[str] = None
    badge_color: Optional[str] = None
    tags: Optional[List[str]] = None

# Banner schemas
class BannerSlideBase(BaseModel):
    image_url: str
    alt: str
    order: int
    active: bool = True

class BannerSlideCreate(BannerSlideBase):
    pass

class BannerSlideUpdate(BaseModel):
    image_url: Optional[str] = None
    alt: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None

class BannerSlideResponse(BannerSlideBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BannerReorder(BaseModel):
    slide_orders: List[dict]

# Settings schemas
class SettingBase(BaseModel):
    key: str
    value: str

class SettingUpdate(BaseModel):
    value: str

class SettingResponse(SettingBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SettingsUpdateBulk(BaseModel):
    whatsapp_number: Optional[str] = None
    logo_url: Optional[str] = None
    site_title: Optional[str] = None
    newsapi_key: Optional[str] = None

# Newsletter schemas
class NewsletterBase(BaseModel):
    title: str
    edition: str
    description: str
    highlight: str
    image_url: str
    pdf_url: str
    active: bool = True

class NewsletterCreate(NewsletterBase):
    pass

class NewsletterUpdate(BaseModel):
    title: Optional[str] = None
    edition: Optional[str] = None
    description: Optional[str] = None
    highlight: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    active: Optional[bool] = None

class NewsletterResponse(NewsletterBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Fiscal Calendar schemas
class FiscalCalendarBase(BaseModel):
    date: str  # DD
    month: str  # MMM (JAN, FEV, etc)
    event: str
    event_type: str  # federal, estadual, municipal, trabalhista
    active: bool = True
    order: int = 0

class FiscalCalendarCreate(FiscalCalendarBase):
    pass

class FiscalCalendarUpdate(BaseModel):
    date: Optional[str] = None
    month: Optional[str] = None
    event: Optional[str] = None
    event_type: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class FiscalCalendarResponse(FiscalCalendarBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Weekly Highlight schemas
class WeeklyHighlightBase(BaseModel):
    title: str
    category: str
    active: bool = True
    order: int = 0

class WeeklyHighlightCreate(WeeklyHighlightBase):
    pass

class WeeklyHighlightUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class WeeklyHighlightResponse(WeeklyHighlightBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Chatbot Knowledge schemas
class ChatKnowledgeBase(BaseModel):
    question: str
    answer: str
    keywords: Optional[List[str]] = None
    category: str = "geral"
    source: str = "manual"
    active: bool = True

class ChatKnowledgeCreate(ChatKnowledgeBase):
    pass

class ChatKnowledgeUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    keywords: Optional[List[str]] = None
    category: Optional[str] = None
    source: Optional[str] = None
    active: Optional[bool] = None

class ChatKnowledgeResponse(ChatKnowledgeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Unanswered Question schemas
class UnansweredQuestionResponse(BaseModel):
    id: int
    question: str
    user_session: Optional[str] = None
    redirected_whatsapp: bool
    resolved: bool
    resolved_knowledge_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Settings schemas
class ChatSettingsBase(BaseModel):
    welcome_message: str
    fallback_message: str
    whatsapp_number: str
    active: bool = True

class ChatSettingsUpdate(BaseModel):
    welcome_message: Optional[str] = None
    fallback_message: Optional[str] = None
    whatsapp_number: Optional[str] = None
    active: Optional[bool] = None

class ChatSettingsResponse(ChatSettingsBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Chat Request/Response schemas
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    found: bool
    redirect_whatsapp: bool
    whatsapp_number: Optional[str] = None

class ChatTrainRequest(BaseModel):
    message: str

class ChatTrainResponse(BaseModel):
    response: str

class ChatSearchGoogleRequest(BaseModel):
    query: str

class ChatSearchGoogleResponse(BaseModel):
    response: str
    source: str = "google"

# Calculator Config schemas
class CalculatorConfigBase(BaseModel):
    calculator_id: str
    name: str
    active: bool = True
    order: int = 0

class CalculatorConfigCreate(CalculatorConfigBase):
    pass

class CalculatorConfigUpdate(BaseModel):
    active: Optional[bool] = None
    order: Optional[int] = None

class CalculatorConfigResponse(CalculatorConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Calculator Parameters schemas
class CalculatorParameterBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class CalculatorParameterCreate(CalculatorParameterBase):
    pass

class CalculatorParameterUpdate(BaseModel):
    value: str

class CalculatorParameterResponse(CalculatorParameterBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class CalculatorParametersBulkUpdate(BaseModel):
    ibs_estadual: Optional[str] = None
    ibs_municipal: Optional[str] = None
    cbs: Optional[str] = None

# Document (Biblioteca) schemas
class DocumentBase(BaseModel):
    title: str
    description: str
    doc_type: str  # pdf, excel, video, link
    category: str
    file_size: Optional[str] = None
    url: str
    active: bool = True
    order: int = 0

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    doc_type: Optional[str] = None
    category: Optional[str] = None
    file_size: Optional[str] = None
    url: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class DocumentResponse(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# FAQ schemas
class FAQBase(BaseModel):
    category: str
    question: str
    answer: str
    active: bool = True
    order: int = 0

class FAQCreate(FAQBase):
    pass

class FAQUpdate(BaseModel):
    category: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class FAQResponse(FAQBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Glossary Term schemas
class GlossaryTermBase(BaseModel):
    letter: str
    term: str
    definition: str
    active: bool = True
    order: int = 0

class GlossaryTermCreate(GlossaryTermBase):
    pass

class GlossaryTermUpdate(BaseModel):
    letter: Optional[str] = None
    term: Optional[str] = None
    definition: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class GlossaryTermResponse(GlossaryTermBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Writer schemas
class WriterBase(BaseModel):
    name: str
    role: str = "Colunista"
    image_url: Optional[str] = None
    active: bool = True
    order: int = 0

class WriterCreate(WriterBase):
    pass

class WriterUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class WriterResponse(WriterBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Article Category schemas
class ArticleCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    slug: Optional[str] = None
    active: bool = True
    order: int = 0

class ArticleCategoryCreate(ArticleCategoryBase):
    pass

class ArticleCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class ArticleCategoryResponse(ArticleCategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Article schemas
class ArticleBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str
    category_id: int
    writer_id: int
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    active: bool = True
    order: int = 0

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    writer_id: Optional[int] = None
    image_url: Optional[str] = None
    file_url: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class ArticleResponse(ArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ArticleWithDetailsResponse(ArticleBase):
    id: int
    writer_name: Optional[str] = None
    writer_role: Optional[str] = None
    writer_image_url: Optional[str] = None
    category_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Sponsor schemas
class SponsorBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    active: bool = True
    order: int = 0

class SponsorCreate(SponsorBase):
    pass

class SponsorUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None

class SponsorResponse(SponsorBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
