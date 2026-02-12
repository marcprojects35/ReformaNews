"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle2
} from "lucide-react"

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [whatsappDisplay, setWhatsappDisplay] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  })

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
        console.error("Erro ao carregar configurações do contato")
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
    setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF9500] p-4 rounded-2xl shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0046B3] to-[#0046B3]/80 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                Fale Conosco
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Entre em contato com nossos especialistas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Envie sua mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {enviado ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Mensagem enviada com sucesso!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Em breve entraremos em contato.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto *</Label>
                        <Input
                          id="assunto"
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleChange}
                          placeholder="Assunto da mensagem"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Descreva como podemos ajudar..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#FF9500]">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#FF7A00] to-[#FF9500] text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">WhatsApp</h3>
                <p className="text-white/90 mb-4">
                  Atendimento rápido e personalizado pelo WhatsApp
                </p>
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-white text-[#FF7A00] hover:bg-gray-100">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {whatsappDisplay}
                    </Button>
                  </a>
                ) : (
                  <Button className="w-full bg-white/50 text-[#FF7A00] cursor-default" disabled>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Carregando...
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Telefone</h4>
                    <p className="text-gray-600 dark:text-gray-400">(34) 3224-0123</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">E-mail</h4>
                    <p className="text-gray-600 dark:text-gray-400">ReformaNews@ctributaria.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Endereço</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Uberlândia - MG
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Horário</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Segunda a Sexta: 8h às 18h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
