import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { WhatsAppAccountsList } from "@/components/whatsapp/WhatsAppAccountsList";
import { WhatsAppConnectionPanel } from "@/components/whatsapp/WhatsAppConnectionPanel";
import { WhatsAppConnectionLogs } from "@/components/whatsapp/WhatsAppConnectionLogs";
import { useWhatsAppSocket } from "@/hooks/useWhatsAppSocket";
import { whatsappService } from "@/services/whatsappService";
import { useToast } from "@/hooks/use-toast";
import type { 
  WhatsAppAccount, 
  ConnectionLog, 
  ConnectionStatusEvent,
  QRCodeEvent,
  LogEvent,
  ErrorEvent,
} from "@/types/whatsapp";

export default function WhatsAppConnection() {
  // Estado principal
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, ConnectionLog[]>>({});
  const [qrCodes, setQrCodes] = useState<Record<string, string | null>>({});
  
  // Estados de loading
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  
  // Estados de UI
  const [showLogs, setShowLogs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Callbacks para eventos do WebSocket
  const handleStatusChange = useCallback((event: ConnectionStatusEvent) => {
    console.log('[Page] Status change:', event);
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === event.accountId
          ? { 
              ...a, 
              status: event.status,
              phone: event.phone || a.phone,
              lastConnectedAt: event.status === 'connected' ? new Date().toISOString() : a.lastConnectedAt,
            }
          : a
      )
    );
    
    // Limpa QR code quando conecta
    if (event.status === 'connected') {
      setQrCodes((prev) => ({ ...prev, [event.accountId]: null }));
      toast({
        title: "WhatsApp conectado!",
        description: `O número ${event.phone || ''} foi conectado com sucesso.`,
      });
    }
  }, [toast]);

  const handleQRCode = useCallback((event: QRCodeEvent) => {
    console.log('[Page] QR Code received for:', event.accountId);
    setQrCodes((prev) => ({ ...prev, [event.accountId]: event.qrCode }));
    
    // Atualiza status para qr_ready
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === event.accountId ? { ...a, status: 'qr_ready' as const } : a
      )
    );
  }, []);

  const handleLog = useCallback((event: LogEvent) => {
    console.log('[Page] Log received:', event);
    setLogs((prev) => ({
      ...prev,
      [event.accountId]: [event.log, ...(prev[event.accountId] || [])].slice(0, 100), // Mantém últimos 100 logs
    }));
  }, []);

  const handleError = useCallback((event: ErrorEvent) => {
    console.error('[Page] Error:', event);
    setError(event.message);
    toast({
      variant: "destructive",
      title: "Erro",
      description: event.message,
    });
    
    // Limpa erro após 5s
    setTimeout(() => setError(null), 5000);
  }, [toast]);

  const handleConnected = useCallback((event: ConnectionStatusEvent) => {
    console.log('[Page] WhatsApp connected:', event);
    handleStatusChange(event);
  }, [handleStatusChange]);

  const handleDisconnected = useCallback((event: ConnectionStatusEvent) => {
    console.log('[Page] WhatsApp disconnected:', event);
    handleStatusChange(event);
    toast({
      variant: "destructive",
      title: "WhatsApp desconectado",
      description: "A sessão foi encerrada.",
    });
  }, [handleStatusChange, toast]);

  // Hook do WebSocket
  const { 
    isConnected: isSocketConnected, 
    joinAccountRoom, 
    leaveAccountRoom,
  } = useWhatsAppSocket({
    onStatusChange: handleStatusChange,
    onQRCode: handleQRCode,
    onLog: handleLog,
    onError: handleError,
    onConnected: handleConnected,
    onDisconnected: handleDisconnected,
    autoConnect: true,
  });

  // Derivações
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || null;
  const accountLogs = selectedAccountId ? (logs[selectedAccountId] || []) : [];
  const currentQRCode = selectedAccountId ? qrCodes[selectedAccountId] : null;

  // Carrega contas ao montar
  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setError(null);
    
    try {
      const data = await whatsappService.getAccounts();
      setAccounts(data);
      
      // Seleciona a primeira conta se nenhuma estiver selecionada
      if (data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data[0].id);
      }
    } catch (err) {
      console.error('[Page] Error fetching accounts:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar contas';
      setError(message);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: message,
      });
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [selectedAccountId, toast]);

  // Carrega logs quando seleciona uma conta
  const fetchLogs = useCallback(async (accountId: string) => {
    if (logs[accountId]?.length > 0) return; // Já tem logs carregados
    
    setIsLoadingLogs(true);
    try {
      const data = await whatsappService.getConnectionLogs(accountId);
      setLogs((prev) => ({ ...prev, [accountId]: data }));
    } catch (err) {
      console.error('[Page] Error fetching logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [logs]);

  // Efeito para carregar contas
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Efeito para entrar na room da conta selecionada e carregar logs
  useEffect(() => {
    if (selectedAccountId && isSocketConnected) {
      joinAccountRoom(selectedAccountId);
      fetchLogs(selectedAccountId);
    }
    
    return () => {
      if (selectedAccountId && isSocketConnected) {
        leaveAccountRoom(selectedAccountId);
      }
    };
  }, [selectedAccountId, isSocketConnected, joinAccountRoom, leaveAccountRoom, fetchLogs]);

  // Handlers de ações
  const handleAddAccount = useCallback(async () => {
    // TODO: Abrir modal para adicionar novo número
    const name = prompt('Nome do número (ex: Vendas, Suporte):');
    if (!name) return;
    
    setIsLoadingAction(true);
    try {
      const newAccount = await whatsappService.createAccount({ name });
      setAccounts((prev) => [...prev, newAccount]);
      setSelectedAccountId(newAccount.id);
      toast({
        title: "Número criado",
        description: `"${name}" foi adicionado. Conecte agora!`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar número';
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoadingAction(false);
    }
  }, [toast]);

  const handleConnect = useCallback(async () => {
    if (!selectedAccountId) return;
    
    setIsLoadingAction(true);
    setError(null);
    
    try {
      // Atualiza status local imediatamente
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccountId ? { ...a, status: 'connecting' as const } : a
        )
      );
      
      await whatsappService.connect(selectedAccountId);
      
      // Adiciona log local
      const log: ConnectionLog = {
        id: Date.now().toString(),
        accountId: selectedAccountId,
        timestamp: new Date().toISOString(),
        message: 'Iniciando conexão, gerando QR Code...',
        type: 'info',
      };
      setLogs((prev) => ({
        ...prev,
        [selectedAccountId]: [log, ...(prev[selectedAccountId] || [])],
      }));
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar';
      setError(message);
      
      // Reverte status
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccountId ? { ...a, status: 'disconnected' as const } : a
        )
      );
      
      toast({
        variant: "destructive",
        title: "Erro ao conectar",
        description: message,
      });
    } finally {
      setIsLoadingAction(false);
    }
  }, [selectedAccountId, toast]);

  const handleDisconnect = useCallback(async () => {
    if (!selectedAccountId) return;
    
    setIsLoadingAction(true);
    
    try {
      await whatsappService.disconnect(selectedAccountId);
      
      // Atualiza estado local
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccountId ? { ...a, status: 'disconnected' as const } : a
        )
      );
      setQrCodes((prev) => ({ ...prev, [selectedAccountId]: null }));
      
      // Adiciona log local
      const log: ConnectionLog = {
        id: Date.now().toString(),
        accountId: selectedAccountId,
        timestamp: new Date().toISOString(),
        message: 'Desconectado pelo usuário',
        type: 'warning',
      };
      setLogs((prev) => ({
        ...prev,
        [selectedAccountId]: [log, ...(prev[selectedAccountId] || [])],
      }));
      
      toast({
        title: "Desconectado",
        description: "A sessão foi encerrada.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao desconectar';
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } finally {
      setIsLoadingAction(false);
    }
  }, [selectedAccountId, toast]);

  return (
    <MainLayout title="Conexão WhatsApp">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[calc(100vh-80px)] -m-6 bg-muted/30"
      >
        {/* Left Panel - Accounts List */}
        <WhatsAppAccountsList
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
          onAddAccount={handleAddAccount}
          isLoading={isLoadingAccounts}
          onRefresh={fetchAccounts}
        />

        {/* Center Panel - Connection */}
        <WhatsAppConnectionPanel
          account={selectedAccount}
          qrCode={currentQRCode}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isLoading={isLoadingAction}
          isSocketConnected={isSocketConnected}
          error={error}
        />

        {/* Right Panel - Logs */}
        {showLogs && (
          <WhatsAppConnectionLogs
            logs={accountLogs}
            onClose={() => setShowLogs(false)}
            isLoading={isLoadingLogs}
          />
        )}
      </motion.div>
    </MainLayout>
  );
}
