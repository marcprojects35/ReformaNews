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
