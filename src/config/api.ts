/**
 * Configuração da API Backend
 * 
 * Para produção, defina a variável de ambiente VITE_API_URL
 * Exemplo: VITE_API_URL=https://api.seudominio.com
 */

export const API_CONFIG = {
  // URL base da API REST
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // URL do WebSocket (geralmente mesma base)
  wsUrl: import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Timeout padrão para requisições (ms)
  timeout: 30000,
  
  // Endpoints da API
  endpoints: {
    // Accounts
    accounts: {
      list: '/api/whatsapp/accounts',
      create: '/api/whatsapp/accounts',
      get: (id: string) => `/api/whatsapp/accounts/${id}`,
      update: (id: string) => `/api/whatsapp/accounts/${id}`,
      delete: (id: string) => `/api/whatsapp/accounts/${id}`,
    },
    
    // Connection
    connection: {
      connect: (accountId: string) => `/api/whatsapp/accounts/${accountId}/connect`,
      disconnect: (accountId: string) => `/api/whatsapp/accounts/${accountId}/disconnect`,
      status: (accountId: string) => `/api/whatsapp/accounts/${accountId}/status`,
      qrCode: (accountId: string) => `/api/whatsapp/accounts/${accountId}/qr`,
    },
    
    // Messages
    messages: {
      send: '/api/whatsapp/messages/send',
      sendBulk: '/api/whatsapp/messages/bulk',
      history: (contactId: string) => `/api/whatsapp/messages/${contactId}`,
    },
    
    // Contacts
    contacts: {
      list: '/api/contacts',
      create: '/api/contacts',
      get: (id: string) => `/api/contacts/${id}`,
      update: (id: string) => `/api/contacts/${id}`,
      delete: (id: string) => `/api/contacts/${id}`,
      import: '/api/contacts/import',
    },
    
    // Logs
    logs: {
      connection: (accountId: string) => `/api/whatsapp/accounts/${accountId}/logs`,
    },
  },
  
  // Eventos WebSocket
  wsEvents: {
    // Eventos de conexão
    CONNECTION_STATUS: 'whatsapp:status',
    QR_CODE: 'whatsapp:qr',
    CONNECTED: 'whatsapp:connected',
    DISCONNECTED: 'whatsapp:disconnected',
    AUTH_FAILURE: 'whatsapp:auth_failure',
    
    // Eventos de mensagem
    MESSAGE_RECEIVED: 'whatsapp:message:received',
    MESSAGE_SENT: 'whatsapp:message:sent',
    MESSAGE_ACK: 'whatsapp:message:ack',
    
    // Eventos de log
    LOG: 'whatsapp:log',
    
    // Eventos de erro
    ERROR: 'whatsapp:error',
  },
} as const;

export type ApiEndpoints = typeof API_CONFIG.endpoints;
export type WsEvents = typeof API_CONFIG.wsEvents;
