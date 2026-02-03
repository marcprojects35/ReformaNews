import { Mail, Phone, MapPin, Globe, Instagram, Linkedin } from "lucide-react"

export function Footer() {
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
              <a
                href="https://wa.me/5534998623164"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#FFD700] transition-colors cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                (34) 99862-3164
              </a>
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
