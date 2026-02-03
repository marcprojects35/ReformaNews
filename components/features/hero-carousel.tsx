"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Slide {
  id: number
  image_url: string
  alt: string
  order: number
  active: boolean
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  // Load slides from backend
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/banner")
        if (response.ok) {
          const data = await response.json()
          setSlides(data)
        }
      } catch (error) {
        console.error("Erro ao carregar slides:", error)
        // Fallback para slides padrão se API falhar
        setSlides([
          {
            id: 1,
            image_url: "https://customer-assets.emergentagent.com/job_0ff25268-ccab-4938-90f3-8865a3898b46/artifacts/siwe24tv_CAPA%2010%20ENCONTRO%20%281%29%201.jpg",
            alt: "10º Encontro - Precificação na Prática",
            order: 0,
            active: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadSlides()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl bg-gray-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Nenhum slide disponível</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
      data-testid="hero-carousel"
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image_url}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 rounded-full"
            data-testid="carousel-prev-button"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 rounded-full"
            data-testid="carousel-next-button"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 bg-[#FFD700]"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              data-testid={`carousel-indicator-${index}`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  )
}
