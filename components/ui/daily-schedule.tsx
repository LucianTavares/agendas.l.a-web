"use client"

import { Card } from "./card"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./avatar"
import { Phone, MessageSquare } from "lucide-react"
import { Button } from "./button"

interface Appointment {
  id: string
  startTime: string
  endTime: string
  clientName: string
  procedure: string
  status: "agendado" | "confirmado" | "fazendo" | "finalizado"
  professionalId: string
}

interface Professional {
  id: string
  name: string
}

interface DailyScheduleProps {
  professionals: Professional[]
  appointments: Appointment[]
}

const timeSlots = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9
  return `${hour.toString().padStart(2, '0')}:00`
}).concat('18:00')

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    startTime: "09:00",
    endTime: "11:30",
    clientName: "Maria Silva",
    procedure: "Progressiva",
    status: "finalizado",
    professionalId: "1"
  },
  {
    id: "2",
    startTime: "12:00",
    endTime: "14:00",
    clientName: "Ana Paula",
    procedure: "Coloração + Hidratação",
    status: "fazendo",
    professionalId: "1"
  },
  {
    id: "3",
    startTime: "14:30",
    endTime: "16:00",
    clientName: "Juliana Santos",
    procedure: "Mechas",
    status: "confirmado",
    professionalId: "1"
  },
  {
    id: "4",
    startTime: "16:30",
    endTime: "18:00",
    clientName: "Carla Oliveira",
    procedure: "Corte + Escova",
    status: "agendado",
    professionalId: "1"
  },
  {
    id: "5",
    startTime: "09:00",
    endTime: "12:00",
    clientName: "Patricia Lima",
    procedure: "Mechas + Matização",
    status: "finalizado",
    professionalId: "2"
  },
  {
    id: "6",
    startTime: "13:00",
    endTime: "15:30",
    clientName: "Fernanda Costa",
    procedure: "Coloração + Hidratação",
    status: "fazendo",
    professionalId: "2"
  },
  {
    id: "7",
    startTime: "16:00",
    endTime: "17:30",
    clientName: "Beatriz Mendes",
    procedure: "Corte + Escova",
    status: "agendado",
    professionalId: "2"
  },
  {
    id: "8",
    startTime: "09:30",
    endTime: "11:00",
    clientName: "Luciana Ferreira",
    procedure: "Hidratação + Escova",
    status: "confirmado",
    professionalId: "3"
  },
  {
    id: "9",
    startTime: "11:30",
    endTime: "14:30",
    clientName: "Amanda Souza",
    procedure: "Mechas + Corte",
    status: "fazendo",
    professionalId: "3"
  },
  {
    id: "10",
    startTime: "15:00",
    endTime: "17:00",
    clientName: "Regina Castro",
    procedure: "Progressiva",
    status: "agendado",
    professionalId: "3"
  }
]

const getStatusStyles = (status: Appointment["status"]) => {
  const styles = {
    agendado: {
      card: "bg-yellow-50 border-l-yellow-500 hover:bg-yellow-100",
      badge: "bg-yellow-100 text-yellow-800",
      time: "text-yellow-800",
      border: "border-yellow-200"
    },
    confirmado: {
      card: "bg-blue-50 border-l-blue-500 hover:bg-blue-100",
      badge: "bg-blue-100 text-blue-800",
      time: "text-blue-800",
      border: "border-blue-200"
    },
    fazendo: {
      card: "bg-green-50 border-l-green-500 hover:bg-green-100",
      badge: "bg-green-100 text-green-800",
      time: "text-green-800",
      border: "border-green-200"
    },
    finalizado: {
      card: "bg-purple-50 border-l-purple-500 hover:bg-purple-100",
      badge: "bg-purple-100 text-purple-800",
      time: "text-purple-800",
      border: "border-purple-200"
    }
  }
  return styles[status]
}

const getStatusText = (status: Appointment["status"]) => {
  const texts = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    fazendo: "Em Andamento",
    finalizado: "Finalizado"
  }
  return texts[status]
}

// Cores para os profissionais
const professionalColors = {
  "1": {
    from: "from-blue-500",
    to: "to-blue-700"
  },
  "2": {
    from: "from-emerald-500",
    to: "to-emerald-700"
  },
  "3": {
    from: "from-amber-500",
    to: "to-amber-700"
  }
}

export function DailySchedule({ professionals }: DailyScheduleProps) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-pink-100 shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Agenda do Dia
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map((professional) => {
          const colors = professionalColors[professional.id as keyof typeof professionalColors]
          return (
            <div key={professional.id} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <Avatar className="h-12 w-12">
                  <AvatarFallback 
                    className={cn(
                      "bg-gradient-to-r text-white text-lg",
                      colors.from,
                      colors.to
                    )}
                  >
                    {professional.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold text-gray-800">
                    {professional.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Profissional
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Coluna de horários fixa */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col">
                  {timeSlots.map((timeSlot) => (
                    <div 
                      key={`time-${timeSlot}`}
                      className="h-24 flex items-center justify-center text-gray-400 font-medium"
                    >
                      {timeSlot}
                    </div>
                  ))}
                </div>

                {/* Container para os agendamentos */}
                <div className="ml-16 relative min-h-[600px]">
                  {mockAppointments
                    .filter(apt => apt.professionalId === professional.id)
                    .map((appointment) => {
                      const startHour = parseInt(appointment.startTime.split(':')[0])
                      const endHour = parseInt(appointment.endTime.split(':')[0])
                      const startMinutes = parseInt(appointment.startTime.split(':')[1])
                      const endMinutes = parseInt(appointment.endTime.split(':')[1])
                      
                      const duration = (endHour - startHour) + (endMinutes - startMinutes) / 60
                      const top = ((startHour - 9) * 96) + (startMinutes / 60 * 96) // 96px é a altura de cada slot (h-24)
                      const height = duration * 96

                      const styles = getStatusStyles(appointment.status)
                      
                      return (
                        <Card
                          key={appointment.id}
                          className={cn(
                            "border-l-4 transition-all duration-200 hover:shadow-md absolute w-full",
                            styles.card
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className={cn("text-sm font-medium", styles.time)}>
                                  {appointment.startTime} - {appointment.endTime}
                                </div>
                                <div className={cn("ml-2 px-2 py-1 rounded-full text-xs font-medium", styles.badge)}>
                                  {getStatusText(appointment.status)}
                                </div>
                              </div>
                            </div>
                            <div className="text-base font-semibold text-gray-800 mb-1">
                              {appointment.clientName}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                              {appointment.procedure}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className={cn("flex-1", styles.border)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Ligar
                              </Button>
                              <Button variant="outline" size="sm" className={cn("flex-1", styles.border)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                WhatsApp
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
} 