"use client"

import { Button } from "./button"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface DomainData {
  name: string;
}

async function fetchDomainData() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }

    const response = await fetch('http://localhost:3333/domain', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    return null
  }
}

export function Header() {
  const [domainData, setDomainData] = useState<DomainData | null>(null)

  useEffect(() => {
    fetchDomainData().then(data => {
      if (data) {
        setDomainData(data)
      }
    })
  }, [])

  return (
    <header className="border-b border-pink-100 bg-white/70 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4">
        <div className="w-[200px]">
          <img src="/logo.png" alt="Marquei" className="h-8" />
        </div>

        <div className="flex-1 flex justify-center">
          <DateSelector />
        </div>

        <div className="w-[200px] flex justify-end">
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200"
          >
            {domainData?.name?.charAt(0)?.toUpperCase() || 'M'}
          </Button>
        </div>
      </div>
    </header>
  )
}

function formatDate() {
  const date = new Date()
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  const day = date.getDate().toString()
  const month = date.toLocaleDateString('pt-BR', { month: 'long' })
  const year = date.getFullYear().toString()
  
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    day,
    month,
    year
  }
}

export function DateSelector() {
  const { weekday, day, month, year } = formatDate()
  
  return (
    <Button
      variant="outline"
      className={cn(
        "bg-white/50 backdrop-blur-sm border-pink-100 hover:bg-white/70 shadow-sm",
        "flex items-center space-x-4 px-8 py-3 h-auto min-w-[400px] justify-center group"
      )}
    >
      <Calendar className="h-6 w-6 text-pink-500 group-hover:text-pink-600" />
      <div className="flex items-center text-xl">
        <span className="font-semibold text-gray-700">{weekday}</span>
        <span className="mx-2 text-gray-400">{day}</span>
        <span className="text-gray-500">de</span>
        <span className="mx-2 text-gray-600">{month}</span>
        <span className="text-gray-500">de</span>
        <span className="ml-2 text-gray-700">{year}</span>
      </div>
    </Button>
  )
} 