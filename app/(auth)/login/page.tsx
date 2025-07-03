"use client"

import type React from "react"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { authService } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await authService.login({ email, senha: password })
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Erro no login:', error)
      setError(error.response?.data?.message || 'Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Lado esquerdo - Imagem/Banner */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=600')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/80 via-purple-600/80 to-indigo-700/80"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
            <Calendar className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Marquei</h1>
          <p className="text-xl font-light text-center max-w-md">
            Gerencie seus agendamentos com eficiência e elegância
          </p>

          <div className="mt-12 space-y-6 max-w-md">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Agendamentos Simplificados</h3>
                <p className="text-white/80">Gerencie todos os seus agendamentos em um só lugar</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Notificações Automáticas</h3>
                <p className="text-white/80">Lembretes automáticos para seus clientes</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Segurança Garantida</h3>
                <p className="text-white/80">Seus dados e de seus clientes sempre protegidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
        <div className="w-full max-w-md">
          {/* Logo para mobile */}
          <div className="flex items-center justify-center md:hidden mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Marquei
            </h1>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-pink-100">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Bem-vindo(a) de volta</h2>
              <p className="text-gray-600 mt-1">Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-white/50 border-pink-200 focus:border-pink-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Senha
                  </Label>
                  <a href="#" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/50 border-pink-200 focus:border-pink-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                >
                  Lembrar de mim
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-11 text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <a href="#" className="font-medium text-pink-600 hover:text-pink-700 transition-colors">
                  Entre em contato
                </a>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2024 Marquei. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 