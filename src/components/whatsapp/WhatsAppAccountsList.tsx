import { motion } from "framer-motion";
import { Plus, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsAppAccount, ConnectionStatus } from "@/types/whatsapp";

interface WhatsAppAccountsListProps {
  accounts: WhatsAppAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (id: string) => void;
  onAddAccount: () => void;
}

const statusColors: Record<ConnectionStatus, string> = {
  connected: "bg-whatsapp",
  disconnected: "bg-muted-foreground",
  connecting: "bg-warning",
  expired: "bg-destructive",
};

export function WhatsAppAccountsList({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddAccount,
}: WhatsAppAccountsListProps) {
  return (
    <div className="w-[280px] border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-whatsapp" />
          </div>
          <h2 className="font-semibold text-foreground">Conectar WhatsApp</h2>
        </div>
        <Button
          onClick={onAddAccount}
          className="w-full bg-whatsapp hover:bg-whatsapp/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo número
        </Button>
      </div>

      {/* Accounts List */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-medium text-muted-foreground mb-3 px-2">
          Números de WhatsApp
        </p>
        <div className="space-y-1">
          {accounts.map((account) => (
            <motion.button
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors",
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
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {account.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {account.phone}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1 rounded-lg hover:bg-muted-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
