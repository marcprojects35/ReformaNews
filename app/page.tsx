"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Sidebar } from "@/components/layout/sidebar"
import { NewsGrid } from "@/components/features/news-grid"
import { ChatBot } from "@/components/features/chat-bot"
import { FloatingCalculatorButton } from "@/components/features/floating-calculator-button"
import { SearchBar } from "@/components/features/search-bar"
import { NewsletterDownload } from "@/components/features/newsletter-download"
import { HeroCarousel } from "@/components/features/hero-carousel"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = (query: string, filters: string[]) => {
    setSearchQuery(query)
    setActiveFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <SearchBar onSearch={handleSearch} />

        {/* Hero Carousel Section */}
        <div className="mb-12 mt-8">
          <HeroCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <NewsGrid searchQuery={searchQuery} activeFilters={activeFilters} />
            <NewsletterDownload />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
        <FloatingCalculatorButton />
        <ChatBot />
      </main>
      <Footer />
    </div>
  )
}
