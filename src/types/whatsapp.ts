/**
 * Tipos para integração com WhatsApp/Baileys
 * Alinhados com o backend Node.js
 */

// Status de conexão do WhatsApp
export type ConnectionStatus = 
  | 'disconnected'   // Desconectado
  | 'connecting'     // Iniciando conexão
  | 'qr_ready'       // QR Code disponível
  | 'authenticating' // Escaneou QR, autenticando
  | 'connected'      // Conectado e pronto
  | 'expired';       // Sessão expirada

// Conta/Instância do WhatsApp
export interface WhatsAppAccount {
  id: string;
  name: string;
  phone: string;
  status: ConnectionStatus;
  lastConnectedAt?: string | Date;
  botActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Payload de criação de conta
export interface CreateAccountPayload {
  name: string;
  phone?: string; // Opcional, pois será obtido após conexão
}

// Payload de atualização de conta
export interface UpdateAccountPayload {
  name?: string;
  botActive?: boolean;
}

// Tipo de log de conexão
export type LogType = 'info' | 'success' | 'warning' | 'error';

// Log de conexão
export interface ConnectionLog {
  id: string;
  accountId: string;
  timestamp: string | Date;
  message: string;
  type: LogType;
  metadata?: Record<string, unknown>;
}

// Resposta do QR Code
export interface QRCodeResponse {
  qrCode: string; // Base64 do QR Code
  expiresAt: string;
}

// Status de conexão via WebSocket
export interface ConnectionStatusEvent {
  accountId: string;
  status: ConnectionStatus;
  phone?: string;
  pushName?: string;
  timestamp: string;
}

// Evento de QR Code via WebSocket
export interface QRCodeEvent {
  accountId: string;
  qrCode: string;
  attempt: number;
  expiresAt: string;
}

// Evento de erro via WebSocket
export interface ErrorEvent {
  accountId?: string;
  code: string;
  message: string;
  timestamp: string;
}

// Evento de log via WebSocket
export interface LogEvent {
  accountId: string;
  log: ConnectionLog;
}

// Mensagem do WhatsApp
export interface WhatsAppMessage {
  id: string;
  accountId: string;
  contactId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker';
  direction: 'incoming' | 'outgoing';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  mediaUrl?: string;
  quotedMessageId?: string;
}

// Payload para envio de mensagem
export interface SendMessagePayload {
  accountId: string;
  phone: string;
  message: string;
  mediaUrl?: string;
}

// Payload para envio em massa
export interface BulkMessagePayload {
  accountId: string;
  phones: string[];
  message: string;
  delayBetweenMessages?: number; // ms entre cada envio
  mediaUrl?: string;
}

// Resposta da API padrão
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Estado do store WhatsApp
export interface WhatsAppState {
  accounts: WhatsAppAccount[];
  selectedAccountId: string | null;
  logs: Record<string, ConnectionLog[]>; // Logs por accountId
  qrCodes: Record<string, string | null>; // QR codes por accountId
  isLoading: boolean;
  error: string | null;
  isSocketConnected: boolean;
}
