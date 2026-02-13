"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, MapPin, Globe, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

interface Sponsor {
  id: number
  name: string
  logo_url: string | null
  website_url: string | null
}

export function Footer() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [whatsappDisplay, setWhatsappDisplay] = useState("")
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/settings")
        if (response.ok) {
          const data = await response.json()
          const settingsMap: Record<string, string> = {}
          data.forEach((setting: { key: string; value: string }) => {
            settingsMap[setting.key] = setting.value
          })
          const number = settingsMap.whatsapp_number || ""
          setWhatsappNumber(number)
          if (number.length >= 12) {
            const ddd = number.slice(2, 4)
            const part1 = number.slice(4, 9)
            const part2 = number.slice(9)
            setWhatsappDisplay(`(${ddd}) ${part1}-${part2}`)
          }
        }
      } catch {
        console.error("Erro ao carregar configurações do footer")
      }
    }

    const loadSponsors = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/sponsors")
        if (response.ok) {
          const data = await response.json()
          setSponsors(Array.isArray(data) ? data : [])
        }
      } catch {
        console.error("Erro ao carregar patrocinadores")
      }
    }

    loadSettings()
    loadSponsors()
  }, [])

  return (
    <footer className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a] text-white mt-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
          <div>
            <h3 className="font-bold text-xl mb-4 text-[#FFD700] flex items-center gap-2">
              <span className="w-1.5 h-8 bg-[#FFD700] rounded-full" />
              Reforma Tributária News
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Sistema de Consulta e Informação Tributária Inteligente. Inteligência Fiscal e Tributária para sua
              empresa.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/ctributaria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#FFD700] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/ctributaria_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#FFD700] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/ctributaria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#FFD700] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-[#FFD700] flex items-center gap-2">
              <span className="w-1.5 h-8 bg-[#FFD700] rounded-full" />
              Contato
            </h3>
            <div className="text-sm text-white/90 space-y-3">
              <a
                href="tel:+553432240123"
                className="flex items-center gap-3 hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                (34) 3224-0123
              </a>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-[#FFD700] transition-colors cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  {whatsappDisplay}
                </a>
              )}
              <a
                href="mailto:ReformaNews@ctributaria.com.br"
                className="flex items-center gap-3 hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                ReformaNews@ctributaria.com.br
              </a>
              <a
                href="https://ctributaria.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                <Globe className="h-4 w-4" />
                ctributaria.com.br
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-[#FFD700] flex items-center gap-2">
              <span className="w-1.5 h-8 bg-[#FFD700] rounded-full" />
              Endereço
            </h3>
            <div className="text-sm text-white/90 space-y-2 flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <div>
                <p>Av. Ver. Carlito Cordeiro, 1291</p>
                <p>Jardim Inconfidência</p>
                <p>Uberlândia - MG</p>
                <p>CEP 38.410-665</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-[#FFD700] flex items-center gap-2">
              <span className="w-1.5 h-8 bg-[#FFD700] rounded-full" />
              Links Rápidos
            </h3>
            <div className="text-sm text-white/90 space-y-3">
              <a href="#" className="block hover:text-[#FFD700] transition-colors hover:translate-x-2 duration-300">
                → Reforma Tributária
              </a>
              <a href="#" className="block hover:text-[#FFD700] transition-colors hover:translate-x-2 duration-300">
                → Calendário Fiscal
              </a>
              <a href="#" className="block hover:text-[#FFD700] transition-colors hover:translate-x-2 duration-300">
                → Simulação IBS/CBS
              </a>
              <a href="#" className="block hover:text-[#FFD700] transition-colors hover:translate-x-2 duration-300">
                → Consultoria
              </a>
            </div>
          </div>
        </div>

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <div className="border-t border-white/20 pt-8 pb-8">
            <p className="text-center text-sm font-semibold text-[#FFD700] mb-6">
              Conheça os nossos patrocinadores:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website_url || "#"}
                  target={sponsor.website_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#FFD700]/30 group-hover:border-[#FFD700] group-hover:shadow-lg group-hover:shadow-yellow-500/10 transition-all duration-300 group-hover:scale-105">
                    {sponsor.logo_url ? (
                      <Image
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm font-bold bg-white/95 w-full h-full flex items-center justify-center">{sponsor.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs text-white/70 group-hover:text-[#FFD700] transition-colors text-center max-w-[100px] truncate">
                    {sponsor.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/20 pt-8 text-center space-y-2">
          <p className="text-sm text-white/80 font-medium">
            Reforma Tributária News © 2025 – Inteligência Fiscal e Tributária | Todos os direitos reservados
          </p>
          <p className="text-xs text-white/60">
            Versão Beta 1.0 – Reforma Tributária News | Desenvolvido com tecnologia avançada
          </p>
        </div>
      </div>
    </footer>
  )
}
