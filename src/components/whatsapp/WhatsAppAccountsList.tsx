import { motion } from "framer-motion";
import { Plus, Phone, MoreVertical, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsAppAccount, ConnectionStatus } from "@/types/whatsapp";

interface WhatsAppAccountsListProps {
  accounts: WhatsAppAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onAddAccount: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const statusColors: Record<ConnectionStatus, string> = {
  connected: "bg-whatsapp",
  disconnected: "bg-muted-foreground",
  connecting: "bg-warning",
  qr_ready: "bg-primary",
  authenticating: "bg-warning",
  expired: "bg-destructive",
};

const statusLabels: Record<ConnectionStatus, string> = {
  connected: "Conectado",
  disconnected: "Desconectado",
  connecting: "Conectando",
  qr_ready: "QR Pronto",
  authenticating: "Autenticando",
  expired: "Expirado",
};

export function WhatsAppAccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
  isLoading = false,
  onRefresh,
}: WhatsAppAccountsListProps) {
  return (
    <div className="w-[280px] border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-whatsapp" />
            </div>
            <h2 className="font-semibold text-foreground">WhatsApp</h2>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          )}
        </div>
        <Button
          onClick={onAddAccount}
          className="w-full bg-whatsapp hover:bg-whatsapp/90 text-white"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo número
        </Button>
      </div>

      {/* Accounts List */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
          Números de WhatsApp ({accounts.length})
        </p>
        
        {isLoading && accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum número cadastrado
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Clique em "Novo número" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {accounts.map((account) => (
              <motion.button
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors group",
                  selectedAccountId === account.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-whatsapp" />
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                      statusColors[account.status]
                    )}
                    title={statusLabels[account.status]}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {account.phone || "Aguardando conexão"}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Abrir menu de opções (editar, excluir)
                  }}
                  className="p-1 rounded-lg hover:bg-muted-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
