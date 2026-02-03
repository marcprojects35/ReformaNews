"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Bot, Sparkles, Loader2 } from 'lucide-react'

const WHATSAPP_NUMBER = "5534998623164"
const WHATSAPP_MESSAGE = "Olá! Preciso de ajuda com questões tributárias."

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([
    {
      text: "Olá! 👋 Sou a IA Tributária do Reforma Tributária News. Estou aqui para ajudar com suas dúvidas sobre IBS/CBS, GTIN, Split Payment, Imposto Seletivo e muito mais. Como posso ajudar você?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar a pergunta")
      }

      return data.response
    } catch (error) {
      console.error("[ChatBot] Erro:", error)
      return "Desculpe, tive um problema técnico ao processar sua pergunta. Por favor, tente novamente."
    }
  }

  const shouldRedirectToWhatsApp = (aiResponse: string): boolean => {
    const uncertainPhrases = [
      "não tenho informações",
      "não sei",
      "não posso ajudar",
      "não tenho certeza",
      "desculpe",
      "tive um problema",
      "erro",
      "não encontrei",
      "não consigo",
    ]
    
    return uncertainPhrases.some(phrase => aiResponse.toLowerCase().includes(phrase))
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = { text: input, isUser: true, timestamp: new Date() }
    setMessages([...messages, userMessage])
    const userInput = input
    setInput("")
    setIsTyping(true)

    try {
      const response = await getAIResponse(userInput)
      
      if (shouldRedirectToWhatsApp(response)) {
        setMessages((prev) => [
          ...prev,
          { 
            text: "Desculpe, não consegui encontrar uma resposta precisa. Nossa equipe está pronta para ajudar pessoalmente!", 
            isUser: false, 
            timestamp: new Date() 
          },
        ])
        
        setTimeout(() => {
          const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE + "\n\nMinha dúvida: " + userInput)}`
          window.open(whatsappUrl, '_blank')
        }, 1000)
      } else {
        setMessages((prev) => [...prev, { text: response, isUser: false, timestamp: new Date() }])
      }
    } catch (error) {
      console.error("[v0] Erro ao processar mensagem:", error)
      setMessages((prev) => [
        ...prev,
        {
          text: "Desculpe, ocorreu um erro. Vou redirecionar você para nossos especialistas via WhatsApp!",
          isUser: false,
          timestamp: new Date(),
        },
      ])
      
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
        window.open(whatsappUrl, '_blank')
      }, 1500)
    } finally {
      setIsTyping(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 h-16 w-16 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] shadow-2xl shadow-yellow-500/40 hover:shadow-3xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 z-50 text-gray-900"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-8 left-8 w-[440px] max-h-[680px] shadow-2xl border-2 border-[#FFD700]/20 overflow-hidden animate-scale-in z-50 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-[#1a1a1a] to-[#2D3748] text-white flex flex-row items-center justify-between p-5 relative overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 bg-[#FFD700]/20 rounded-lg backdrop-blur-sm">
            <Bot className="h-5 w-5 text-[#FFD700]" />
          </div>
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              IA Tributária Reforma News
              <Sparkles className="h-4 w-4 text-[#FFD700] animate-pulse" />
            </CardTitle>
            <p className="text-xs text-white/90 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Online agora
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/20 rounded-full relative z-10 transition-all"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-md ${
                  message.isUser
                    ? "bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-gray-900 rounded-br-sm"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-bl-sm shadow-md flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#FFD700]" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Analisando sua pergunta...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("O que é IBS e CBS?")}
              className="text-xs border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:text-[#1a1a1a]"
            >
              IBS e CBS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Como funciona o Split Payment?")}
              className="text-xs border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:text-[#1a1a1a]"
            >
              Split Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("O que é GTIN?")}
              className="text-xs border-[#FFD700]/30 hover:bg-[#FFD700]/10 hover:text-[#1a1a1a]"
            >
              GTIN
            </Button>
          </div>
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSend()}
              placeholder="Pergunte sobre tributação..."
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 focus:border-[#FFD700] rounded-xl shadow-sm px-4 dark:bg-gray-800 dark:text-white"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-105 rounded-xl w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
