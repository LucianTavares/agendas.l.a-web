"use client"

import LoginPage from "../../login"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const senha = formData.get('password')

    try {
      const response = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }

      // Salva o token de acesso
      localStorage.setItem('token', data.access_token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return <LoginPage />
}
