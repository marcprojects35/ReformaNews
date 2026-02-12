"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, Loader2, Save, Bot, MessageCircle, Database,
  HelpCircle, Settings, Send, Check, X, Search, Plus,
  Trash2, Edit2, Eye, EyeOff, RefreshCw
} from "lucide-react"

interface ChatKnowledge {
  id: number
  question: string
  answer: string
  keywords: string[] | null
  category: string
  source: string
  active: boolean
  created_at: string
  updated_at: string
}

interface UnansweredQuestion {
  id: number
  question: string
  redirected_whatsapp: boolean
  resolved: boolean
  created_at: string
}

interface ChatSettings {
  id: number
  welcome_message: string
  fallback_message: string
  whatsapp_number: string
  active: boolean
  updated_at: string
}

interface TrainMessage {
  text: string
  isUser: boolean
  timestamp: Date
  canSave?: boolean
}

export default function AdminChatbot() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("train")

  // Knowledge state
  const [knowledge, setKnowledge] = useState<ChatKnowledge[]>([])
  const [editingKnowledge, setEditingKnowledge] = useState<ChatKnowledge | null>(null)
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false)
  const [knowledgeForm, setKnowledgeForm] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "geral"
  })

  // Unanswered state
  const [unanswered, setUnanswered] = useState<UnansweredQuestion[]>([])
  const [searchingQuestion, setSearchingQuestion] = useState<number | null>(null)
  const [searchResult, setSearchResult] = useState<string>("")

  // Settings state
  const [settings, setSettings] = useState<ChatSettings | null>(null)
  const [settingsForm, setSettingsForm] = useState({
    welcome_message: "",
    fallback_message: "",
    whatsapp_number: ""
  })
  const [savingSettings, setSavingSettings] = useState(false)

  // Training state
  const [trainMessages, setTrainMessages] = useState<TrainMessage[]>([
    {
      text: "Olá! Use este chat para fazer perguntas e treinar a IA. As respostas que você aprovar serão salvas na base de conhecimento.",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [trainInput, setTrainInput] = useState("")
  const [isTraining, setIsTraining] = useState(false)
  const [lastQuestion, setLastQuestion] = useState("")
  const trainMessagesEndRef = useRef<HTMLDivElement>(null)

  // Save to knowledge modal
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveForm, setSaveForm] = useState({
    question: "",
    answer: "",
    keywords: "",
    category: "geral"
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    trainMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [trainMessages])

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin")
      return
    }

    try {
      const response = await fetch("http://localhost:8001/api/auth/check", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!response.ok) throw new Error("Unauthorized")

      await loadData()
    } catch (error) {
      localStorage.removeItem("admin_token")
      router.push("/admin")
    }
  }

  const loadData = async () => {
    setLoading(true)
    const token = localStorage.getItem("admin_token")

    try {
      const [knowledgeRes, unansweredRes, settingsRes] = await Promise.all([
        fetch("http://localhost:8001/api/chatbot/knowledge", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("http://localhost:8001/api/chatbot/unanswered", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("http://localhost:8001/api/chatbot/settings")
      ])

      if (knowledgeRes.ok) {
        const data = await knowledgeRes.json()
        setKnowledge(data)
      }

      if (unansweredRes.ok) {
        const data = await unansweredRes.json()
        setUnanswered(data)
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data)
        setSettingsForm({
          welcome_message: data.welcome_message,
          fallback_message: data.fallback_message,
          whatsapp_number: data.whatsapp_number
        })
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Training functions
  const handleTrain = async () => {
    if (!trainInput.trim() || isTraining) return

    const userMessage: TrainMessage = {
      text: trainInput,
      isUser: true,
      timestamp: new Date()
    }
    setTrainMessages(prev => [...prev, userMessage])
    setLastQuestion(trainInput)
    setTrainInput("")
    setIsTraining(true)

    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/chatbot/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage.text })
      })

      if (response.ok) {
        const data = await response.json()
        setTrainMessages(prev => [...prev, {
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          canSave: true
        }])
      } else {
        throw new Error("Erro na resposta")
      }
    } catch (error) {
      setTrainMessages(prev => [...prev, {
        text: "Erro ao consultar a IA. Tente novamente.",
        isUser: false,
        timestamp: new Date()
      }])
    } finally {
      setIsTraining(false)
    }
  }

  const openSaveModal = (answer: string) => {
    setSaveForm({
      question: lastQuestion,
      answer: answer,
      keywords: "",
      category: "geral"
    })
    setShowSaveModal(true)
  }

  const handleSaveKnowledge = async () => {
    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/chatbot/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: saveForm.question,
          answer: saveForm.answer,
          keywords: saveForm.keywords.split(",").map(k => k.trim()).filter(k => k),
          category: saveForm.category,
          source: "training"
        })
      })

      if (response.ok) {
        alert("Conhecimento salvo com sucesso!")
        setShowSaveModal(false)
        loadData()
      }
    } catch (error) {
      alert("Erro ao salvar conhecimento")
    }
  }

  // Knowledge CRUD functions
  const handleCreateKnowledge = async () => {
    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/chatbot/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: knowledgeForm.question,
          answer: knowledgeForm.answer,
          keywords: knowledgeForm.keywords.split(",").map(k => k.trim()).filter(k => k),
          category: knowledgeForm.category,
          source: "manual"
        })
      })

      if (response.ok) {
        setShowKnowledgeForm(false)
        setKnowledgeForm({ question: "", answer: "", keywords: "", category: "geral" })
        loadData()
      }
    } catch (error) {
      alert("Erro ao criar conhecimento")
    }
  }

  const handleUpdateKnowledge = async () => {
    if (!editingKnowledge) return
    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch(`http://localhost:8001/api/chatbot/knowledge/${editingKnowledge.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: knowledgeForm.question,
          answer: knowledgeForm.answer,
          keywords: knowledgeForm.keywords.split(",").map(k => k.trim()).filter(k => k),
          category: knowledgeForm.category
        })
      })

      if (response.ok) {
        setEditingKnowledge(null)
        setKnowledgeForm({ question: "", answer: "", keywords: "", category: "geral" })
        loadData()
      }
    } catch (error) {
      alert("Erro ao atualizar conhecimento")
    }
  }

  const handleDeleteKnowledge = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este conhecimento?")) return

    const token = localStorage.getItem("admin_token")

    try {
      await fetch(`http://localhost:8001/api/chatbot/knowledge/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      loadData()
    } catch (error) {
      alert("Erro ao excluir conhecimento")
    }
  }

  const handleToggleKnowledge = async (item: ChatKnowledge) => {
    const token = localStorage.getItem("admin_token")

    try {
      await fetch(`http://localhost:8001/api/chatbot/knowledge/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ active: !item.active })
      })
      loadData()
    } catch (error) {
      alert("Erro ao alterar status")
    }
  }

  // Unanswered functions
  const handleSearchGoogle = async (question: UnansweredQuestion) => {
    setSearchingQuestion(question.id)
    setSearchResult("")

    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/chatbot/search-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ query: question.question })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResult(data.response)
      }
    } catch (error) {
      alert("Erro ao pesquisar")
    } finally {
      setSearchingQuestion(null)
    }
  }

  const handleApproveSearchResult = async (question: UnansweredQuestion) => {
    const token = localStorage.getItem("admin_token")

    try {
      // Criar conhecimento
      const createRes = await fetch("http://localhost:8001/api/chatbot/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          question: question.question,
          answer: searchResult,
          keywords: question.question.toLowerCase().split(" ").filter(w => w.length > 3),
          category: "geral",
          source: "google"
        })
      })

      if (createRes.ok) {
        const knowledge = await createRes.json()

        // Marcar como resolvida
        await fetch(`http://localhost:8001/api/chatbot/unanswered/${question.id}/resolve?knowledge_id=${knowledge.id}`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        })

        setSearchResult("")
        loadData()
        alert("Resposta aprovada e adicionada ao banco!")
      }
    } catch (error) {
      alert("Erro ao aprovar resposta")
    }
  }

  const handleDeleteUnanswered = async (id: number) => {
    const token = localStorage.getItem("admin_token")

    try {
      await fetch(`http://localhost:8001/api/chatbot/unanswered/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      loadData()
    } catch (error) {
      alert("Erro ao excluir pergunta")
    }
  }

  // Settings functions
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const token = localStorage.getItem("admin_token")

    try {
      const response = await fetch("http://localhost:8001/api/chatbot/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      })

      if (response.ok) {
        alert("Configuracoes salvas com sucesso!")
        loadData()
      }
    } catch (error) {
      alert("Erro ao salvar configuracoes")
    } finally {
      setSavingSettings(false)
    }
  }

  const startEditKnowledge = (item: ChatKnowledge) => {
    setEditingKnowledge(item)
    setKnowledgeForm({
      question: item.question,
      answer: item.answer,
      keywords: (item.keywords || []).join(", "),
      category: item.category
    })
  }

  const categories = [
    { value: "geral", label: "Geral" },
    { value: "ibs", label: "IBS" },
    { value: "cbs", label: "CBS" },
    { value: "gtin", label: "GTIN" },
    { value: "split_payment", label: "Split Payment" },
    { value: "imposto_seletivo", label: "Imposto Seletivo" },
    { value: "reforma", label: "Reforma Tributaria" },
    { value: "cronograma", label: "Cronograma" },
    { value: "compliance", label: "Compliance" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#FFD700]" />
              <h1 className="text-lg font-bold text-white">Gerenciador do Chatbot</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="train" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              <MessageCircle className="w-4 h-4 mr-2" />
              Treinamento
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              <Database className="w-4 h-4 mr-2" />
              Base de Conhecimento
            </TabsTrigger>
            <TabsTrigger value="unanswered" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              <HelpCircle className="w-4 h-4 mr-2" />
              Sem Resposta
              {unanswered.length > 0 && (
                <Badge className="ml-2 bg-red-500">{unanswered.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-gray-900">
              <Settings className="w-4 h-4 mr-2" />
              Configuracoes
            </TabsTrigger>
          </TabsList>

          {/* Training Tab */}
          <TabsContent value="train">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#FFD700]" />
                    Chat de Treinamento
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Converse com a IA e aprove respostas para o banco
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-900 rounded-lg space-y-3">
                    {trainMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isUser
                            ? "bg-[#FFD700] text-gray-900"
                            : "bg-gray-700 text-white"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          {msg.canSave && (
                            <Button
                              size="sm"
                              onClick={() => openSaveModal(msg.text)}
                              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Salvar no Banco
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTraining && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 text-white p-3 rounded-lg flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Consultando IA...
                        </div>
                      </div>
                    )}
                    <div ref={trainMessagesEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={trainInput}
                      onChange={(e) => setTrainInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleTrain()}
                      placeholder="Faca uma pergunta para treinar..."
                      className="bg-gray-900 border-gray-600 text-white"
                      disabled={isTraining}
                    />
                    <Button
                      onClick={handleTrain}
                      disabled={isTraining || !trainInput.trim()}
                      className="bg-[#FFD700] hover:bg-[#FFC107] text-gray-900"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold">1</div>
                    <p>Faca perguntas sobre tributacao para a IA (Gemini)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold">2</div>
                    <p>Revise as respostas geradas pela IA</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold">3</div>
                    <p>Clique em &quot;Salvar no Banco&quot; para aprovar</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold">4</div>
                    <p>Defina palavras-chave para melhorar a busca</p>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      <strong>Dica:</strong> Quanto mais palavras-chave voce definir, mais facil sera para os usuarios encontrarem esta resposta.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Base de Conhecimento ({knowledge.length} itens)
              </h2>
              <Button
                onClick={() => {
                  setShowKnowledgeForm(true)
                  setEditingKnowledge(null)
                  setKnowledgeForm({ question: "", answer: "", keywords: "", category: "geral" })
                }}
                className="bg-[#FFD700] hover:bg-[#FFC107] text-gray-900"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {(showKnowledgeForm || editingKnowledge) && (
              <Card className="bg-gray-800/50 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingKnowledge ? "Editar Conhecimento" : "Novo Conhecimento"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Pergunta</label>
                    <Input
                      value={knowledgeForm.question}
                      onChange={(e) => setKnowledgeForm({...knowledgeForm, question: e.target.value})}
                      className="bg-gray-900 border-gray-600 text-white"
                      placeholder="Ex: O que e IBS?"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Resposta</label>
                    <Textarea
                      value={knowledgeForm.answer}
                      onChange={(e) => setKnowledgeForm({...knowledgeForm, answer: e.target.value})}
                      className="bg-gray-900 border-gray-600 text-white min-h-[200px]"
                      placeholder="Resposta detalhada..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Palavras-chave (separadas por virgula)</label>
                      <Input
                        value={knowledgeForm.keywords}
                        onChange={(e) => setKnowledgeForm({...knowledgeForm, keywords: e.target.value})}
                        className="bg-gray-900 border-gray-600 text-white"
                        placeholder="ibs, imposto, bens, servicos"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Categoria</label>
                      <select
                        value={knowledgeForm.category}
                        onChange={(e) => setKnowledgeForm({...knowledgeForm, category: e.target.value})}
                        className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={editingKnowledge ? handleUpdateKnowledge : handleCreateKnowledge}
                      className="bg-[#FFD700] hover:bg-[#FFC107] text-gray-900"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingKnowledge ? "Atualizar" : "Salvar"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowKnowledgeForm(false)
                        setEditingKnowledge(null)
                      }}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {knowledge.map((item) => (
                <Card key={item.id} className={`border-gray-700 ${item.active ? "bg-gray-800/50" : "bg-gray-800/20 opacity-60"}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.active ? "default" : "secondary"}>
                            {categories.find(c => c.value === item.category)?.label || item.category}
                          </Badge>
                          <Badge variant="outline" className="text-gray-400">
                            {item.source}
                          </Badge>
                          {!item.active && (
                            <Badge variant="destructive">Inativo</Badge>
                          )}
                        </div>
                        <h3 className="text-white font-semibold mb-2">{item.question}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.answer}</p>
                        {item.keywords && item.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.keywords.map((kw, i) => (
                              <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleKnowledge(item)}
                          className="text-gray-400 hover:text-white"
                        >
                          {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditKnowledge(item)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteKnowledge(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Unanswered Tab */}
          <TabsContent value="unanswered">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                Perguntas Sem Resposta ({unanswered.length})
              </h2>
              <p className="text-gray-400">Perguntas que a IA nao conseguiu responder</p>
            </div>

            {unanswered.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-300">Todas as perguntas foram respondidas!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {unanswered.map((q) => (
                  <Card key={q.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-white font-medium">{q.question}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(q.created_at).toLocaleString("pt-BR")}
                            {q.redirected_whatsapp && (
                              <span className="ml-2 text-yellow-500">Redirecionado ao WhatsApp</span>
                            )}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUnanswered(q.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSearchGoogle(q)}
                          disabled={searchingQuestion === q.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {searchingQuestion === q.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 mr-2" />
                          )}
                          Pesquisar no Google
                        </Button>
                      </div>

                      {searchResult && searchingQuestion === null && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Resultado da Pesquisa:</h4>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{searchResult}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveSearchResult(q)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Aprovar e Adicionar ao Banco
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSearchResult("")}
                              className="border-gray-600 text-gray-300"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Descartar
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#FFD700]" />
                  Configuracoes do Chatbot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400">Mensagem de Boas-vindas</label>
                  <Textarea
                    value={settingsForm.welcome_message}
                    onChange={(e) => setSettingsForm({...settingsForm, welcome_message: e.target.value})}
                    className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                    placeholder="Mensagem inicial do chatbot..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">Mensagem de Fallback (quando nao sabe responder)</label>
                  <Textarea
                    value={settingsForm.fallback_message}
                    onChange={(e) => setSettingsForm({...settingsForm, fallback_message: e.target.value})}
                    className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                    placeholder="Mensagem quando nao encontra resposta..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">Numero do WhatsApp para Redirecionamento</label>
                  <Input
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => setSettingsForm({...settingsForm, whatsapp_number: e.target.value})}
                    className="bg-gray-900 border-gray-600 text-white"
                    placeholder="5534998623164"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: codigo do pais + DDD + numero (sem espacos)
                  </p>
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-[#FFD700] hover:bg-[#FFC107] text-gray-900"
                >
                  {savingSettings ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Configuracoes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Save Knowledge Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Salvar no Banco de Conhecimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Pergunta</label>
                <Input
                  value={saveForm.question}
                  onChange={(e) => setSaveForm({...saveForm, question: e.target.value})}
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Resposta</label>
                <Textarea
                  value={saveForm.answer}
                  onChange={(e) => setSaveForm({...saveForm, answer: e.target.value})}
                  className="bg-gray-900 border-gray-600 text-white min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Palavras-chave</label>
                  <Input
                    value={saveForm.keywords}
                    onChange={(e) => setSaveForm({...saveForm, keywords: e.target.value})}
                    className="bg-gray-900 border-gray-600 text-white"
                    placeholder="palavra1, palavra2, palavra3"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Categoria</label>
                  <select
                    value={saveForm.category}
                    onChange={(e) => setSaveForm({...saveForm, category: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-md p-2"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveKnowledge}
                  className="bg-[#FFD700] hover:bg-[#FFC107] text-gray-900"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
