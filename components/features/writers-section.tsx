"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PenLine, Users } from "lucide-react"

interface Writer {
  id: number
  name: string
  role: string
  image_url: string | null
}

export function WritersSection() {
  const [writers, setWriters] = useState<Writer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWriters = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/writers")
        if (response.ok) {
          const data = await response.json()
          setWriters(data)
        }
      } catch {
        console.error("Erro ao carregar redatores")
      } finally {
        setLoading(false)
      }
    }
    loadWriters()
  }, [])

  if (loading || writers.length === 0) return null

  return (
    <section className="relative mt-20 mb-8">
      {/* Linha separadora com destaque */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#FFD700]/60 to-[#FFD700]" />
        <div className="flex items-center gap-2 bg-[#FFD700] text-[#1a1a1a] px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wider">
          <PenLine className="h-4 w-4" />
          Artigos
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#FFD700]/60 to-[#FFD700]" />
      </div>

      {/* Titulo */}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-12">
        Conheça nossos <span className="text-[#FFD700]">Redatores</span>
      </h2>

      {/* Grid de redatores */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-16 mb-12">
        {writers.map((writer) => (
          <div
            key={writer.id}
            className="flex flex-col items-center group"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[3px] border-[#FFD700]/70 group-hover:border-[#FFD700] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              {writer.image_url ? (
                <Image
                  src={writer.image_url}
                  alt={writer.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>
            <h3 className="mt-4 text-white font-semibold text-sm md:text-base text-center max-w-[160px] group-hover:text-[#FFD700] transition-colors duration-300">
              {writer.name}
            </h3>
            <span className="text-white/50 text-xs mt-1">{writer.role}</span>
          </div>
        ))}
      </div>

      {/* Botao para artigos */}
      <div className="flex justify-center">
        <Link
          href="/artigos"
          className="inline-flex items-center gap-3 bg-[#FFD700] hover:bg-[#FFC107] text-[#1a1a1a] font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
        >
          Ver todos os artigos
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}
