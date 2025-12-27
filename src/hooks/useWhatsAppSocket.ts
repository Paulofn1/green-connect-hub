/**
 * Hook para conexão WebSocket com Socket.IO
 * Gerencia conexão, reconexão e eventos em tempo real do Baileys
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/config/api';
import type {
  ConnectionStatusEvent,
  QRCodeEvent,
  ErrorEvent,
  LogEvent,
} from '@/types/whatsapp';

interface UseWhatsAppSocketOptions {
  onStatusChange?: (event: ConnectionStatusEvent) => void;
  onQRCode?: (event: QRCodeEvent) => void;
  onLog?: (event: LogEvent) => void;
  onError?: (event: ErrorEvent) => void;
  onConnected?: (event: ConnectionStatusEvent) => void;
  onDisconnected?: (event: ConnectionStatusEvent) => void;
  autoConnect?: boolean;
}

interface UseWhatsAppSocketReturn {
  isConnected: boolean;
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  joinAccountRoom: (accountId: string) => void;
  leaveAccountRoom: (accountId: string) => void;
}

export function useWhatsAppSocket(options: UseWhatsAppSocketOptions = {}): UseWhatsAppSocketReturn {
  const {
    onStatusChange,
    onQRCode,
    onLog,
    onError,
    onConnected,
    onDisconnected,
    autoConnect = true,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Função para conectar ao WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('[WS] Already connected');
      return;
    }

    console.log('[WS] Connecting to:', API_CONFIG.wsUrl);

    socketRef.current = io(API_CONFIG.wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Eventos de conexão Socket.IO
    socket.on('connect', () => {
      console.log('[WS] Connected, socket id:', socket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WS] Connection error:', error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('[WS] Max reconnect attempts reached');
        onError?.({
          code: 'SOCKET_CONNECTION_FAILED',
          message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('[WS] Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    // Eventos do WhatsApp/Baileys
    socket.on(API_CONFIG.wsEvents.CONNECTION_STATUS, (event: ConnectionStatusEvent) => {
      console.log('[WS] Status change:', event);
      onStatusChange?.(event);
    });

    socket.on(API_CONFIG.wsEvents.QR_CODE, (event: QRCodeEvent) => {
      console.log('[WS] QR Code received for account:', event.accountId);
      onQRCode?.(event);
    });

    socket.on(API_CONFIG.wsEvents.CONNECTED, (event: ConnectionStatusEvent) => {
      console.log('[WS] WhatsApp connected:', event);
      onConnected?.(event);
    });

    socket.on(API_CONFIG.wsEvents.DISCONNECTED, (event: ConnectionStatusEvent) => {
      console.log('[WS] WhatsApp disconnected:', event);
      onDisconnected?.(event);
    });

    socket.on(API_CONFIG.wsEvents.LOG, (event: LogEvent) => {
      console.log('[WS] Log:', event);
      onLog?.(event);
    });

    socket.on(API_CONFIG.wsEvents.ERROR, (event: ErrorEvent) => {
      console.error('[WS] Error:', event);
      onError?.(event);
    });

    socket.on(API_CONFIG.wsEvents.AUTH_FAILURE, (event: ErrorEvent) => {
      console.error('[WS] Auth failure:', event);
      onError?.(event);
    });

    socket.connect();
  }, [onStatusChange, onQRCode, onLog, onError, onConnected, onDisconnected]);

  // Função para desconectar
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('[WS] Disconnecting...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Entrar na room de uma conta específica (para receber eventos apenas dela)
  const joinAccountRoom = useCallback((accountId: string) => {
    if (socketRef.current?.connected) {
      console.log('[WS] Joining room:', accountId);
      socketRef.current.emit('join:account', accountId);
    }
  }, []);

  // Sair da room de uma conta
  const leaveAccountRoom = useCallback((accountId: string) => {
    if (socketRef.current?.connected) {
      console.log('[WS] Leaving room:', accountId);
      socketRef.current.emit('leave:account', accountId);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    socket: socketRef.current,
    connect,
    disconnect,
    joinAccountRoom,
    leaveAccountRoom,
  };
}
