import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConnectionLog } from "@/types/whatsapp";

interface WhatsAppConnectionLogsProps {
  logs: ConnectionLog[];
  onClose: () => void;
}

const logTypeStyles: Record<ConnectionLog["type"], string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-whatsapp/10 text-whatsapp",
  warning: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
};

export function WhatsAppConnectionLogs({
  logs,
  onClose,
}: WhatsAppConnectionLogsProps) {
  return (
    <div className="w-[320px] border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Logs de conexão</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum log disponível
          </p>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3"
            >
              <span className="text-xs text-primary font-mono min-w-[45px]">
                {new Date(log.timestamp).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  {log.message.split(" ").map((word, i) => {
                    if (word === "QR" || word === "code") {
                      return (
                        <Badge
                          key={i}
                          variant="secondary"
                          className={cn("mx-0.5 text-xs", logTypeStyles[log.type])}
                        >
                          {word}
                        </Badge>
                      );
                    }
                    return word + " ";
                  })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Warning Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            O WhatsApp desconecta automaticamente após algumas horas de
            inatividade. Não feche o app do celular e mantenha-o conectado à
            internet.
          </p>
        </div>
      </div>
    </div>
  );
}
