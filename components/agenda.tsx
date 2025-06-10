"use client"

import { cn } from "@/lib/utils"

interface Agendamento {
  id: string
  cliente: string
  servico: string
  inicio: string // formato HH:mm
  duracao: number // em minutos
  cor: string
}

const agendamentosMock: Agendamento[] = [
  {
    id: '1',
    cliente: 'Maria Silva',
    servico: 'Corte e Escova',
    inicio: '09:00',
    duracao: 90, // 1h30
    cor: 'bg-pink-100'
  },
  {
    id: '2',
    cliente: 'João Santos',
    servico: 'Barba',
    inicio: '10:00',
    duracao: 30,
    cor: 'bg-blue-100'
  },
  {
    id: '3',
    cliente: 'Ana Oliveira',
    servico: 'Coloração',
    inicio: '11:00',
    duracao: 120, // 2h
    cor: 'bg-purple-100'
  },
  {
    id: '4',
    cliente: 'Pedro Costa',
    servico: 'Corte Masculino',
    inicio: '13:30',
    duracao: 45,
    cor: 'bg-green-100'
  }
]

const horarios = Array.from({ length: 12 }, (_, i) => {
  const hora = 8 + Math.floor(i)
  return `${hora.toString().padStart(2, '0')}:00`
})

function calcularAlturaCard(duracao: number): string {
  // Cada hora equivale a 120px de altura
  const alturaBase = 120
  return `${(duracao / 60) * alturaBase}px`
}

function calcularPosicaoTop(inicio: string): string {
  const [horas, minutos] = inicio.split(':').map(Number)
  const horasDesdeInicio = horas - 8 // 8h é o início do expediente
  const minutosTotais = horasDesdeInicio * 60 + minutos
  return `${(minutosTotais / 60) * 120}px` // 120px por hora
}

export function Agenda() {
  return (
    <div className="relative border rounded-lg bg-white shadow-sm">
      {/* Linhas de horário */}
      <div className="absolute inset-0">
        {horarios.map((horario, index) => (
          <div
            key={horario}
            className="border-t border-gray-100"
            style={{ top: `${index * 120}px`, height: '120px' }}
          >
            <span className="absolute -left-16 -mt-3 text-sm text-gray-500">
              {horario}
            </span>
          </div>
        ))}
      </div>

      {/* Cards de agendamento */}
      <div className="relative ml-2 min-h-[960px]"> {/* 8h de expediente = 960px */}
        {agendamentosMock.map((agendamento) => (
          <div
            key={agendamento.id}
            className={cn(
              "absolute left-0 right-4 p-3 rounded-lg shadow-sm",
              agendamento.cor,
              "hover:brightness-95 transition-all cursor-pointer"
            )}
            style={{
              top: calcularPosicaoTop(agendamento.inicio),
              height: calcularAlturaCard(agendamento.duracao),
            }}
          >
            <div className="flex flex-col h-full">
              <span className="font-medium text-gray-800">
                {agendamento.cliente}
              </span>
              <span className="text-sm text-gray-600">
                {agendamento.servico}
              </span>
              <span className="text-xs text-gray-500 mt-auto">
                {agendamento.inicio} - {(() => {
                  const [horas, minutos] = agendamento.inicio.split(':').map(Number)
                  const fimMinutos = horas * 60 + minutos + agendamento.duracao
                  const fimHoras = Math.floor(fimMinutos / 60)
                  const fimMinutosRestantes = fimMinutos % 60
                  return `${fimHoras.toString().padStart(2, '0')}:${fimMinutosRestantes.toString().padStart(2, '0')}`
                })()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 