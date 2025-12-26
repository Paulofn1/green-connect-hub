import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { WhatsAppAccountsList } from "@/components/whatsapp/WhatsAppAccountsList";
import { WhatsAppConnectionPanel } from "@/components/whatsapp/WhatsAppConnectionPanel";
import { WhatsAppConnectionLogs } from "@/components/whatsapp/WhatsAppConnectionLogs";
import type { WhatsAppAccount, ConnectionLog } from "@/types/whatsapp";

// Mock data - será substituído por dados reais do backend
const mockAccounts: WhatsAppAccount[] = [
  {
    id: "1",
    name: "Vendas",
    phone: "+55 11 98765-4321",
    status: "connected",
    lastConnectedAt: new Date(),
    botActive: true,
  },
  {
    id: "2",
    name: "Suporte",
    phone: "+55 11 91234-5678",
    status: "connecting",
    lastConnectedAt: undefined,
    botActive: false,
  },
  {
    id: "3",
    name: "Cobrança",
    phone: "+55 11 99876-5432",
    status: "disconnected",
    lastConnectedAt: new Date(Date.now() - 86400000),
    botActive: false,
  },
];

const mockLogs: ConnectionLog[] = [
  {
    id: "1",
    accountId: "2",
    timestamp: new Date(),
    message: "Nova sessão criada, gerando QR code...",
    type: "info",
  },
  {
    id: "2",
    accountId: "2",
    timestamp: new Date(),
    message: "QR code renovado agora",
    type: "success",
  },
  {
    id: "3",
    accountId: "2",
    timestamp: new Date(Date.now() - 120000),
    message: "Sessão expirada, desconectando...",
    type: "warning",
  },
  {
    id: "4",
    accountId: "2",
    timestamp: new Date(Date.now() - 120000),
    message: "Sessão expirada",
    type: "error",
  },
];

// Mock QR Code placeholder (em produção viria do Baileys via WebSocket)
const MOCK_QR_CODE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmYiLz48ZyBmaWxsPSIjMDAwIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjxyZWN0IHg9IjE1MCIgeT0iMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjxyZWN0IHg9IjEwIiB5PSIxNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMTYwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iMjAiIHk9IjE2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iNjAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSI4MCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjcwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iOTAiIHk9IjcwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiLz48cmVjdCB4PSI2MCIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIxMzAiIHk9IjEwMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iNzAiIHk9IjEzMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iMTEwIiB5PSIxMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjE1MCIgeT0iMTUwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIxNzAiIHk9IjE3MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iMTMwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIi8+PC9nPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9IiMyNWQ0NjYiLz48cGF0aCBkPSJNOTUgMTAwbDMgM2w3LTciIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+";

export default function WhatsAppConnection() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>(mockAccounts);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>("2");
  const [logs, setLogs] = useState<ConnectionLog[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(MOCK_QR_CODE);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || null;
  const accountLogs = logs.filter((l) => l.accountId === selectedAccountId);

  const handleAddAccount = useCallback(() => {
    // TODO: Abrir modal para adicionar novo número
    console.log("Adicionar novo número");
  }, []);

  const handleConnect = useCallback(() => {
    if (!selectedAccountId) return;

    setIsLoading(true);

    // Simula conexão - em produção, isso viria do WebSocket com Baileys
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccountId ? { ...a, status: "connecting" as const } : a
        )
      );

      // Adiciona log
      const newLog: ConnectionLog = {
        id: Date.now().toString(),
        accountId: selectedAccountId,
        timestamp: new Date(),
        message: "Nova sessão criada, gerando QR code...",
        type: "info",
      };
      setLogs((prev) => [newLog, ...prev]);

      setIsLoading(false);
      setQrCode(MOCK_QR_CODE);
    }, 1500);
  }, [selectedAccountId]);

  const handleDisconnect = useCallback(() => {
    if (!selectedAccountId) return;

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === selectedAccountId ? { ...a, status: "disconnected" as const } : a
      )
    );
    setQrCode(null);

    const newLog: ConnectionLog = {
      id: Date.now().toString(),
      accountId: selectedAccountId,
      timestamp: new Date(),
      message: "Desconectado pelo usuário",
      type: "warning",
    };
    setLogs((prev) => [newLog, ...prev]);
  }, [selectedAccountId]);

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
        />

        {/* Center Panel - Connection */}
        <WhatsAppConnectionPanel
          account={selectedAccount}
          qrCode={qrCode}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isLoading={isLoading}
        />

        {/* Right Panel - Logs */}
        {showLogs && (
          <WhatsAppConnectionLogs
            logs={accountLogs}
            onClose={() => setShowLogs(false)}
          />
        )}
      </motion.div>
    </MainLayout>
  );
}
