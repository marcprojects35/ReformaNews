# CTributária News - Portal de Notícias Tributárias

## Overview
CTributária News is a comprehensive Brazilian tax news and information portal built with Next.js 16. The platform provides news, calculators, glossary, and tools related to Brazilian tax reform, GTIN requirements, IBS/CBS taxation, and fiscal documentation.

**Project Type:** Next.js Frontend Application  
**Language:** TypeScript  
**Framework:** Next.js 16 (with Turbopack)  
**UI Library:** React 19 with Radix UI components  
**Styling:** Tailwind CSS v4

## Current State
- Fully configured and running on Replit
- Development server running on port 5000
- Production deployment configured
- All dependencies installed (with legacy peer deps due to React 19 compatibility)
- ChatBot AI funcionando com Google Gemini + fallback para respostas comuns
- Next.js configured for Replit proxy environment with allowedDevOrigins

## Project Architecture

### Directory Structure (Organized)
```
app/                        # Next.js App Router pages
  ├── api/chat/             # ChatBot API route
  ├── biblioteca/           # Document library page
  ├── contato/              # Contact page
  ├── faq/                  # FAQ page
  ├── ferramentas/          # Tools page (all calculators)
  ├── glossario/            # Glossary page
  ├── noticias/             # News listing page
  ├── noticia/[id]/         # Individual news article pages
  ├── globals.css           # Global styles
  ├── layout.tsx            # Root layout with metadata
  └── page.tsx              # Home page

components/                 # React components (organized in subfolders)
  ├── calculators/          # Calculator components
  │   ├── agenda-tributaria.tsx
  │   ├── calculadora-tributaria-automatica.tsx  # NEW: Auto calculator by product
  │   ├── darf-generator.tsx
  │   ├── difal-calculator.tsx
  │   ├── ibs-cbs-calculator.tsx
  │   ├── iss-calculator.tsx
  │   ├── reform-timeline.tsx
  │   ├── regime-simulator.tsx
  │   └── split-payment-simulator.tsx
  ├── features/             # Feature components
  │   ├── chat-bot.tsx
  │   ├── floating-calculator-button.tsx
  │   ├── hero-news.tsx
  │   ├── news-grid.tsx
  │   ├── newsletter-download.tsx
  │   ├── search-bar.tsx
  │   └── share-dialog.tsx
  ├── layout/               # Layout components
  │   ├── header.tsx
  │   ├── footer.tsx
  │   └── sidebar.tsx
  ├── ui/                   # Reusable UI components (Radix UI based)
  └── theme-provider.tsx    # Theme context provider

lib/                        # Utility functions
  ├── noticias-data.ts      # News data and helpers
  ├── produtos-data.ts      # Products database (64 products with IBS/CBS 2026 rates from spreadsheet)
  └── utils.ts              # General utilities

hooks/                      # Custom React hooks
  ├── use-mobile.ts
  └── use-toast.ts

public/                     # Static assets
  ├── documentos/           # Downloadable documents (xlsx)
  └── images/               # Image assets
```

### Key Features
1. **News Portal**: Latest tax news and updates with categorization
2. **Calculators**: IBS/CBS, ISS, DIFAL, DARF, Regime Tributário
3. **Calculadora Tributária Automática**: Search products by name/GTIN/NCM, auto-load tax data, calculate taxes, generate PDF report
4. **Biblioteca**: Documentos e planilhas para download
5. **Glossary**: Tax terminology reference
6. **FAQ**: Frequently asked questions
7. **Search**: Full-text search across news and documentation
8. **Theme Support**: Light/dark mode toggle
9. **Floating Tools**: Calculator button and ChatBot
10. **Agenda Tributária**: Calendário de obrigações fiscais

### Technology Stack
- **Frontend Framework**: Next.js 16.0.0 with App Router
- **React**: Version 19.2.0
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1.9 with PostCSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Date Handling**: date-fns
- **Theme**: next-themes
- **PDF Generation**: jsPDF

## Development

### Running Locally
The development server is configured to run on port 5000 with host binding to 0.0.0.0 for Replit compatibility.

```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Important Notes
- Dependencies are installed with `--legacy-peer-deps` flag due to React 19 compatibility
- TypeScript build errors are ignored in production (configured in next.config.mjs)
- Images are unoptimized for better Replit compatibility
- Cache-Control headers are set to prevent stale content in the Replit iframe
- allowedDevOrigins configured for Replit proxy domains

## Deployment
Configured for Replit Autoscale deployment:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 5000
- **Deployment Type**: Autoscale (stateless, scales automatically)

## Recent Changes

### December 10, 2025
- **Imported 102,070 products to PostgreSQL database** from Excel spreadsheet
- Created API endpoint `/api/produtos/search` for searching products by name, GTIN, NCM, or category
- Updated Calculadora Tributaria Automatica to use the database API with debounced search
- Tax rates reflect the 2026 transition phase of Brazilian tax reform:
  - CBS: ~0.78% average (test phase - replaces PIS/COFINS in 2027)
  - IBS Estadual: ~0.09% average (test phase - replaces ICMS by 2033)
  - IBS Municipal: 0% (not active until later)
  - ICMS: varies by product (average 17.9%)
- Products include diverse categories from all NCM chapters
- Added error handling and user feedback for API errors

### Tax Reform Timeline (Reference)
- **2026**: Test phase - CBS 0.9%, IBS 0.1%, compensable with PIS/COFINS
- **2027**: Full CBS (~8.8%), PIS/COFINS extinct
- **2029-2032**: Gradual ICMS/ISS transition to IBS
- **2033**: Full IVA Dual system - CBS ~8.8% + IBS ~17.7% = ~26.5% total

## User Preferences
None documented yet.
