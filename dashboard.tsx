"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { Header } from "@/components/ui/header"
import { DailySchedule } from "@/components/ui/daily-schedule"

// Dados mockados para exemplo
const mockProfessionals = [
  { id: "1", name: "Ana Costa" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Pedro Oliveira" },
]

// Dados mockados de agendamentos para demonstração
const mockAppointments = [
  {
    id: "1",
    startTime: "09:00",
    endTime: "10:00",
    clientName: "Ana Paula Silva",
    procedure: "Corte + Escova",
    status: "agendado",
    professionalId: "1",
    price: 80
  },
  {
    id: "2",
    startTime: "11:00",
    endTime: "12:00",
    clientName: "Carla Santos",
    procedure: "Coloração",
    status: "confirmado",
    professionalId: "1",
    price: 120
  },
  {
    id: "3",
    startTime: "14:00",
    endTime: "15:00",
    clientName: "Mariana Costa",
    procedure: "Hidratação",
    status: "em_execucao",
    professionalId: "1",
    price: 60
  },
  {
    id: "4",
    startTime: "09:00",
    endTime: "10:00",
    clientName: "Juliana Lima",
    procedure: "Manicure",
    status: "finalizado",
    professionalId: "2",
    price: 40
  },
  {
    id: "5",
    startTime: "13:00",
    endTime: "14:00",
    clientName: "Patricia Melo",
    procedure: "Mechas",
    status: "confirmado",
    professionalId: "2",
    price: 150
  },
  {
    id: "6",
    startTime: "16:00",
    endTime: "17:00",
    clientName: "Fernanda Santos",
    procedure: "Corte",
    status: "agendado",
    professionalId: "2",
    price: 50
  },
  {
    id: "7",
    startTime: "10:00",
    endTime: "11:00",
    clientName: "Beatriz Oliveira",
    procedure: "Design",
    status: "finalizado",
    professionalId: "3",
    price: 70
  },
  {
    id: "8",
    startTime: "12:00",
    endTime: "13:00",
    clientName: "Amanda Souza",
    procedure: "Limpeza",
    status: "em_execucao",
    professionalId: "3",
    price: 90
  },
  {
    id: "9",
    startTime: "15:00",
    endTime: "16:00",
    clientName: "Carolina Dias",
    procedure: "Massagem",
    status: "agendado",
    professionalId: "3",
    price: 110
  }
]

export default function Component() {
  const [appointments] = useState(mockAppointments)

  const totalRevenue = appointments.length * 150 // Valor estimado por agendamento

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />

      {/* Agenda do Dia - Componente Principal */}
      <div className="p-6">
        <DailySchedule
          professionals={mockProfessionals}
          appointments={appointments}
        />
      </div>

      {/* Stats Cards e outros componentes */}
      <div className="px-6 pb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
              <p className="text-xs text-green-600 font-medium">+{appointments.length} que ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Receita do Dia</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-green-600 font-medium">+0% que ontem</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-blue-600 font-medium">Únicos hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-indigo-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Taxa de Ocupação</CardTitle>
              <Clock className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0%</div>
              <p className="text-xs text-indigo-600 font-medium">Muito baixa</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
