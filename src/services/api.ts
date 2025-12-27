/**
 * Cliente HTTP para comunicação com a API
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '@/types/whatsapp';

// Cria instância do Axios com configurações padrão
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (quando implementado)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Adicionar token de autenticação quando implementado
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.data);
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    
    // Tratamento de erros específicos
    if (error.response?.status === 401) {
      // TODO: Redirecionar para login
      console.error('[API] Unauthorized - redirect to login');
    }
    
    return Promise.reject(error);
  }
);

// Funções helper para requisições
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<ApiResponse<T>>(url, config).then(res => res.data),
    
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data),
    
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data),
    
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data),
};

export default apiClient;
