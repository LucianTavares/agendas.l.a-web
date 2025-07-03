import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('Iniciando requisição para:', config.url);
    console.log('Método:', config.method);
    console.log('Dados:', config.data);
    
    const token = getCookie('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Resposta bem-sucedida:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro do servidor:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', {
        url: error.config?.url,
        request: error.request
      });
    } else {
      // Erro na configuração da requisição
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 