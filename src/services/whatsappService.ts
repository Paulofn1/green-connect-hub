/**
 * Serviço para operações WhatsApp via API REST
 */
import { api } from './api';
import { API_CONFIG } from '@/config/api';
import type {
  WhatsAppAccount,
  CreateAccountPayload,
  UpdateAccountPayload,
  ConnectionLog,
  QRCodeResponse,
  SendMessagePayload,
  BulkMessagePayload,
  WhatsAppMessage,
} from '@/types/whatsapp';

const { endpoints } = API_CONFIG;

export const whatsappService = {
  // ==================== ACCOUNTS ====================
  
  /**
   * Lista todas as contas/instâncias de WhatsApp
   */
  async getAccounts(): Promise<WhatsAppAccount[]> {
    const response = await api.get<WhatsAppAccount[]>(endpoints.accounts.list);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar contas');
    }
    return response.data;
  },
  
  /**
   * Busca uma conta específica por ID
   */
  async getAccount(id: string): Promise<WhatsAppAccount> {
    const response = await api.get<WhatsAppAccount>(endpoints.accounts.get(id));
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar conta');
    }
    return response.data;
  },
  
  /**
   * Cria uma nova conta/instância
   */
  async createAccount(payload: CreateAccountPayload): Promise<WhatsAppAccount> {
    const response = await api.post<WhatsAppAccount>(endpoints.accounts.create, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao criar conta');
    }
    return response.data;
  },
  
  /**
   * Atualiza uma conta existente
   */
  async updateAccount(id: string, payload: UpdateAccountPayload): Promise<WhatsAppAccount> {
    const response = await api.patch<WhatsAppAccount>(endpoints.accounts.update(id), payload);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao atualizar conta');
    }
    return response.data;
  },
  
  /**
   * Remove uma conta
   */
  async deleteAccount(id: string): Promise<void> {
    const response = await api.delete(endpoints.accounts.delete(id));
    if (!response.success) {
      throw new Error(response.error?.message || 'Erro ao remover conta');
    }
  },
  
  // ==================== CONNECTION ====================
  
  /**
   * Inicia conexão de uma conta (gera QR Code)
   */
  async connect(accountId: string): Promise<void> {
    const response = await api.post(endpoints.connection.connect(accountId));
    if (!response.success) {
      throw new Error(response.error?.message || 'Erro ao iniciar conexão');
    }
  },
  
  /**
   * Desconecta uma conta
   */
  async disconnect(accountId: string): Promise<void> {
    const response = await api.post(endpoints.connection.disconnect(accountId));
    if (!response.success) {
      throw new Error(response.error?.message || 'Erro ao desconectar');
    }
  },
  
  /**
   * Busca status de conexão de uma conta
   */
  async getStatus(accountId: string): Promise<WhatsAppAccount> {
    const response = await api.get<WhatsAppAccount>(endpoints.connection.status(accountId));
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar status');
    }
    return response.data;
  },
  
  /**
   * Busca QR Code atual de uma conta
   */
  async getQRCode(accountId: string): Promise<QRCodeResponse> {
    const response = await api.get<QRCodeResponse>(endpoints.connection.qrCode(accountId));
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar QR Code');
    }
    return response.data;
  },
  
  // ==================== MESSAGES ====================
  
  /**
   * Envia uma mensagem
   */
  async sendMessage(payload: SendMessagePayload): Promise<WhatsAppMessage> {
    const response = await api.post<WhatsAppMessage>(endpoints.messages.send, payload);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao enviar mensagem');
    }
    return response.data;
  },
  
  /**
   * Envia mensagens em massa
   */
  async sendBulkMessages(payload: BulkMessagePayload): Promise<{ total: number; sent: number; failed: number }> {
    const response = await api.post<{ total: number; sent: number; failed: number }>(
      endpoints.messages.sendBulk,
      payload
    );
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao enviar mensagens em massa');
    }
    return response.data;
  },
  
  /**
   * Busca histórico de mensagens de um contato
   */
  async getMessageHistory(contactId: string): Promise<WhatsAppMessage[]> {
    const response = await api.get<WhatsAppMessage[]>(endpoints.messages.history(contactId));
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar histórico');
    }
    return response.data;
  },
  
  // ==================== LOGS ====================
  
  /**
   * Busca logs de conexão de uma conta
   */
  async getConnectionLogs(accountId: string): Promise<ConnectionLog[]> {
    const response = await api.get<ConnectionLog[]>(endpoints.logs.connection(accountId));
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Erro ao buscar logs');
    }
    return response.data;
  },
};

export default whatsappService;
