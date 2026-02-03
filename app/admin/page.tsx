"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Settings } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()
      localStorage.setItem("admin_token", data.access_token)
      router.push("/admin/dashboard")
    } catch (err) {
      setError("Usuário ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2D3748] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-full mb-4 shadow-lg">
            <Settings className="w-10 h-10 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal Administrativo</h1>
          <p className="text-gray-400">Reforma Tributária News CMS</p>
        </div>

        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD700] text-gray-900 font-semibold"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Credenciais padrão: admin / admin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
