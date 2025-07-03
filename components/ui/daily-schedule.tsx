"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card } from "./card"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./avatar"
import { Phone, MessageSquare, Clock, AlertTriangle, UserPlus, ScissorsSquare, X } from "lucide-react"
import { Button } from "./button"
import { FaWhatsapp } from "react-icons/fa"

interface Appointment {
  id: string
  startTime: string
  endTime: string
  clientName: string
  procedure: string
  status: "agendado" | "confirmado" | "em_execucao" | "finalizado"
  professionalId: string
  price: number
}

interface Professional {
  id: string
  name: string
}

interface DailyScheduleProps {
  professionals: Professional[]
  appointments: Appointment[]
}

// Função para converter horário em minutos
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Gerando slots de horário das 8:00 às 18:00
const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8
  return `${hour.toString().padStart(2, '0')}:00`
})

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    startTime: "09:00",
    endTime: "10:00",
    clientName: "Maria Silva",
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

const getStatusStyles = (status: Appointment["status"]) => {
  const styles = {
    agendado: {
      card: "bg-blue-50 border-l-blue-500 hover:bg-blue-100",
      badge: "bg-blue-100 text-blue-800",
      time: "text-blue-800",
      border: "border-blue-200"
    },
    confirmado: {
      card: "bg-green-50 border-l-green-500 hover:bg-green-100",
      badge: "bg-green-100 text-green-800",
      time: "text-green-800",
      border: "border-green-200"
    },
    em_execucao: {
      card: "bg-purple-50 border-l-purple-500 hover:bg-purple-100",
      badge: "bg-purple-100 text-purple-800",
      time: "text-purple-800",
      border: "border-purple-200"
    },
    finalizado: {
      card: "bg-red-50 border-l-red-500 hover:bg-red-100",
      badge: "bg-red-100 text-red-800",
      time: "text-red-800",
      border: "border-red-200"
    }
  }
  return styles[status]
}

const getStatusText = (status: Appointment["status"]) => {
  const texts = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    em_execucao: "Em Execução",
    finalizado: "Finalizado"
  }
  return texts[status]
}

// Cores para os profissionais
const professionalColors = {
  "1": { from: "from-blue-500", to: "to-blue-700" },
  "2": { from: "from-emerald-500", to: "to-emerald-700" },
  "3": { from: "from-amber-500", to: "to-amber-700" }
}

// Função para verificar se um horário está ocupado
const isTimeSlotOccupied = (time: string, professionalId: string, appointments: Appointment[]) => {
  const timeMinutes = timeToMinutes(time)
  return appointments.some(appointment => {
    if (appointment.professionalId !== professionalId) return false
    const startMinutes = timeToMinutes(appointment.startTime)
    const endMinutes = timeToMinutes(appointment.endTime)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
  })
}

// Função para obter o agendamento em um horário específico
const getAppointmentAtTime = (time: string, professionalId: string, appointments: Appointment[]) => {
  const timeMinutes = timeToMinutes(time)
  return appointments.find(appointment => {
    if (appointment.professionalId !== professionalId) return false
    const startMinutes = timeToMinutes(appointment.startTime)
    const endMinutes = timeToMinutes(appointment.endTime)
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
  })
}

export function DailySchedule({ professionals, appointments = mockAppointments }: DailyScheduleProps) {
  const [showModal, setShowModal] = useState(false)
  const [showProfessionalModal, setShowProfessionalModal] = useState(false)
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [form, setForm] = useState({
    clientName: '',
    procedure: '',
    startTime: '',
    endTime: '',
    professionalId: professionals[0]?.id || '',
    price: '',
    status: 'agendado',
  })
  const [professionalName, setProfessionalName] = useState('')
  const [procedureForm, setProcedureForm] = useState({ name: '', price: '' })

  // Refs para as modais
  const modalRef = useRef<HTMLDivElement>(null)
  const professionalModalRef = useRef<HTMLDivElement>(null)
  const procedureModalRef = useRef<HTMLDivElement>(null)

  // Função para fechar modal ao clicar fora
  const handleClickOutside = (event: MouseEvent, modalRef: React.RefObject<HTMLDivElement>, setShowModal: (show: boolean) => void) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false)
    }
  }

  // Event listeners para fechar modais ao clicar fora
  useEffect(() => {
    const handleModalClickOutside = (event: MouseEvent) => {
      if (showModal) {
        handleClickOutside(event, modalRef, setShowModal)
      }
      if (showProfessionalModal) {
        handleClickOutside(event, professionalModalRef, setShowProfessionalModal)
      }
      if (showProcedureModal) {
        handleClickOutside(event, procedureModalRef, setShowProcedureModal)
      }
    }

    if (showModal || showProfessionalModal || showProcedureModal) {
      document.addEventListener('mousedown', handleModalClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleModalClickOutside)
    }
  }, [showModal, showProfessionalModal, showProcedureModal])

  // Foco automático e scroll para centralizar quando modal abrir
  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Foca no primeiro input da modal
      const firstInput = modalRef.current.querySelector('input') as HTMLInputElement
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }, [showModal])

  useEffect(() => {
    if (showProfessionalModal && professionalModalRef.current) {
      professionalModalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstInput = professionalModalRef.current.querySelector('input') as HTMLInputElement
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }, [showProfessionalModal])

  useEffect(() => {
    if (showProcedureModal && procedureModalRef.current) {
      procedureModalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstInput = procedureModalRef.current.querySelector('input') as HTMLInputElement
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100)
      }
    }
  }, [showProcedureModal])

  // Linha do tempo atual
  const hourHeight = 96 // 1 hora = 96px (h-24)
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const topNow = ((nowMinutes - 480) / 60) * hourHeight // 480 = 8:00

  // Função para tooltip customizado
  const [tooltip, setTooltip] = useState<{x: number, y: number, content: string} | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Certifique-se de que price é número
    const agendamento = { ...form, price: Number(form.price) }
    // Aqui você pode adicionar o agendamento ao estado, se desejar
    setShowModal(false)
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-pink-100 ring-4 ring-violet-300/30 shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Agenda do Dia
        </h2>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow transition-all font-semibold text-sm"
            onClick={() => setShowModal(true)}
          >
            <span className="text-lg">+</span> Cadastrar agendamento
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition-all text-sm font-semibold"
            onClick={() => setShowProfessionalModal(true)}
          >
            <UserPlus className="h-4 w-4" /> Profissional
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition-all text-sm font-semibold"
            onClick={() => setShowProcedureModal(true)}
          >
            <ScissorsSquare className="h-4 w-4" /> Procedimento
          </button>
        </div>
      </div>
      {/* Modal de cadastro */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border-2 border-gray-100/50 ring-4 ring-violet-300 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 group"
              onClick={() => setShowModal(false)}
              aria-label="Fechar"
            >
              <X className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-pink-600">Novo Agendamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do cliente</label>
                <input name="clientName" value={form.clientName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Procedimento</label>
                <input name="procedure" value={form.procedure} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Início</label>
                  <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Fim</label>
                  <input name="endTime" type="time" value={form.endTime} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profissional</label>
                <select name="professionalId" value={form.professionalId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  {professionals.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="em_execucao">Em Execução</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de cadastro de profissional */}
      {showProfessionalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div ref={professionalModalRef} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border-2 border-gray-100/50 ring-4 ring-violet-300 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 group"
              onClick={() => setShowProfessionalModal(false)}
              aria-label="Fechar"
            >
              <X className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-pink-600">Novo Profissional</h3>
            <form onSubmit={e => { e.preventDefault(); setShowProfessionalModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do profissional</label>
                <input value={professionalName} onChange={e => setProfessionalName(e.target.value)} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProfessionalModal(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de cadastro de procedimento */}
      {showProcedureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div ref={procedureModalRef} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative border-2 border-gray-100/50 ring-4 ring-violet-300 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 group"
              onClick={() => setShowProcedureModal(false)}
              aria-label="Fechar"
            >
              <X className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-pink-600">Novo Procedimento</h3>
            <form onSubmit={e => { e.preventDefault(); setShowProcedureModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do procedimento</label>
                <input value={procedureForm.name} onChange={e => setProcedureForm(f => ({ ...f, name: e.target.value }))} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <input type="number" min="0" step="0.01" value={procedureForm.price} onChange={e => setProcedureForm(f => ({ ...f, price: e.target.value }))} required className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProcedureModal(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        {/* Cabeçalho dos profissionais */}
        <div className="grid" style={{ gridTemplateColumns: `120px repeat(${professionals.length}, minmax(220px, 1fr))` }}>
          <div></div>
          {professionals.map((professional) => {
            const colors = professionalColors[professional.id as keyof typeof professionalColors]
            return (
              <div key={professional.id} className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={cn(
                    "bg-gradient-to-r",
                    colors.from,
                    colors.to,
                    "text-white"
                  )}>
                    {professional.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                  <p className="text-sm text-gray-500">Profissional</p>
                </div>
              </div>
            )
          })}
        </div>
        {/* Linhas de horários e cards */}
        <div className="grid relative" style={{ gridTemplateColumns: `120px repeat(${professionals.length}, minmax(220px, 1fr))` }}>
          {/* Linha do tempo atual */}
          {topNow >= 0 && topNow <= hourHeight * timeSlots.length && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
              style={{ top: `${topNow}px` }}
            >
              <span className="absolute -left-10 -top-2 text-xs text-red-600 font-bold">Agora</span>
            </div>
          )}
          {timeSlots.map((time, rowIdx) => (
            <React.Fragment key={`row-${time}-${rowIdx}`}>
              {/* Coluna de horário */}
              <div className="h-24 flex items-center justify-end pr-4">
                <span className="text-base text-gray-500 font-semibold select-none">
                  {time}
                </span>
              </div>
              {/* Cards dos profissionais */}
              {professionals.map((professional) => {
                const appointment = getAppointmentAtTime(time, professional.id, appointments)
                const isOccupied = isTimeSlotOccupied(time, professional.id, appointments)
                // Indicador de atraso
                let isLate = false
                if (appointment && appointment.status === 'em_execucao') {
                  const endMinutes = timeToMinutes(appointment.endTime)
                  if (nowMinutes > endMinutes) isLate = true
                }
                return (
                  <div key={`slot-${professional.id}-${time}-${rowIdx}`} className="h-24 flex items-center justify-center">
                    {isOccupied && appointment ? (
                      // Card de agendamento
                      <div
                        className="w-full h-full p-1 relative"
                        onMouseEnter={e => setTooltip({
                          x: e.currentTarget.getBoundingClientRect().left + e.currentTarget.offsetWidth/2,
                          y: e.currentTarget.getBoundingClientRect().top,
                          content: `<b>${appointment.clientName}</b><br/>${appointment.procedure}<br/>${appointment.startTime} - ${appointment.endTime}<br/>Profissional: ${professionals.find(p => p.id === appointment.professionalId)?.name || ''}<br/>Valor: R$ ${appointment.price !== undefined && !isNaN(Number(appointment.price)) ? Number(appointment.price).toFixed(2) : 'N/I'}<br/>Status: ${getStatusText(appointment.status)}`
                        })}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <div className={cn(
                          "h-full rounded-lg p-3 border-l-4 transition-all duration-200 cursor-pointer overflow-hidden",
                          getStatusStyles(appointment.status).card,
                          getStatusStyles(appointment.status).border,
                          isLate ? "ring-2 ring-red-400 bg-red-50/60" : ""
                        )}>
                          {/* Linha 1: Horário + status */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span className={cn("text-xs font-medium", getStatusStyles(appointment.status).time)}>
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                            </div>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getStatusStyles(appointment.status).badge
                            )}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>
                          {/* Linha 2: Nome, valor, WhatsApp, indicador de atraso */}
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate max-w-[110px]">
                                {appointment.clientName}
                              </h4>
                              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                                R$ {appointment.price !== undefined && !isNaN(Number(appointment.price)) ? Number(appointment.price).toFixed(2) : 'N/I'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isLate && <AlertTriangle className="text-red-500 h-4 w-4" />}
                              <FaWhatsapp className="text-green-500 h-5 w-5 flex-shrink-0 cursor-pointer" title="Enviar WhatsApp" />
                            </div>
                          </div>
                          {/* Linha 3: Procedimento */}
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {appointment.procedure}
                          </p>
                        </div>
                        {/* Tooltip customizado */}
                        {tooltip && tooltip.content && (
                          <div
                            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-xs text-gray-800"
                            style={{ left: tooltip.x, top: tooltip.y - 60, minWidth: 180, maxWidth: 260 }}
                            dangerouslySetInnerHTML={{ __html: tooltip.content }}
                          />
                        )}
                      </div>
                    ) : (
                      // Horário livre com hover discreto
                      <div className="w-full h-full p-2">
                        <div className="h-full border border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-white/80 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer group">
                          <span className="text-sm text-gray-400 group-hover:text-gray-600 font-medium">
                            Horário livre
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Card>
  )
} 