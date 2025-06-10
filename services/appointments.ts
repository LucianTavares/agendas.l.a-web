import api from '@/lib/api';
import { authService } from './auth';

export interface Appointment {
  id: string;
  time: string;
  duration: string;
  client: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
  };
  service: string;
  professional: {
    id: string;
    name: string;
  };
  status: 'confirmado' | 'em-andamento' | 'pendente' | 'cancelado';
  price: number;
}

export interface CreateAppointmentData {
  clientId: string;
  professionalId: string;
  serviceId: string;
  dateTime: string;
  duration: number;
  price: number;
}

export const appointmentService = {
  async getAppointments(date?: string): Promise<Appointment[]> {
    try {
      const negocioId = authService.getNegocioId();
      console.log('Buscando agendamentos para o negócio:', negocioId);
      
      if (!negocioId) {
        console.error('ID do negócio não encontrado no localStorage');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      const response = await api.get<Appointment[]>(`/agendamentos/negocio/${negocioId}`, {
        params: { date }
      });
      
      console.log('Agendamentos recebidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await api.post<Appointment>('/agendamentos', data);
      console.log('Agendamento criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    try {
      const response = await api.put<Appointment>(`/agendamentos/${id}/status`, { status });
      console.log('Status do agendamento atualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      throw error;
    }
  }
}; 