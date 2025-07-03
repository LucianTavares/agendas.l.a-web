import api from '@/lib/api';

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
  negocio: {
    id: string;
    email: string;
    nome: string;
  };
}

const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${process.env.NODE_ENV === 'production' ? ';Secure' : ''}`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Tentando fazer login com:', { email: data.email });
      
      const response = await api.post<AuthResponse>('/auth/login', data);
      console.log('Login bem-sucedido:', response.data);
      
      // Salva o token em um cookie
      setCookie('token', response.data.access_token);
      
      // Salva os dados do negócio em um cookie
      setCookie('negocio', JSON.stringify(response.data.negocio));
      
      // Configura o token para próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      return response.data;
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    deleteCookie('token');
    deleteCookie('negocio');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    return !!getCookie('token');
  },

  getNegocio(): { id: string; email: string; nome: string } | null {
    try {
      const negocioStr = getCookie('negocio');
      if (!negocioStr) return null;
      return JSON.parse(negocioStr);
    } catch (error) {
      console.error('Erro ao obter dados do negócio:', error);
      return null;
    }
  }
}; 