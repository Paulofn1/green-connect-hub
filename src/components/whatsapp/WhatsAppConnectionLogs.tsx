import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2, Info, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConnectionLog, LogType } from "@/types/whatsapp";

interface WhatsAppConnectionLogsProps {
  logs: ConnectionLog[];
  onClose: () => void;
  isLoading?: boolean;
}

const logTypeConfig: Record<LogType, { 
  className: string;
  icon: React.ReactNode;
}> = {
  info: {
    className: "bg-primary/10 text-primary",
    icon: <Info className="w-3 h-3" />,
  },
  success: {
    className: "bg-whatsapp/10 text-whatsapp",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  warning: {
    className: "bg-warning/10 text-warning",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  error: {
    className: "bg-destructive/10 text-destructive",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export function WhatsAppConnectionLogs({
  logs,
  onClose,
  isLoading = false,
}: WhatsAppConnectionLogsProps) {
  return (
    <div className="w-[320px] border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Logs de conexão</h3>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Info className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum log disponível
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Os logs aparecerão aqui quando você conectar
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => {
              const config = logTypeConfig[log.type];
              return (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex gap-3"
                >
                  <span className="text-xs text-primary font-mono min-w-[45px] pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs px-1.5 py-0.5 gap-1", config.className)}
                      >
                        {config.icon}
                        {log.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Warning Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            O WhatsApp pode desconectar automaticamente após algumas horas de
            inatividade. Mantenha o app do celular conectado à internet.
          </p>
        </div>
      </div>
    </div>
  );
}
