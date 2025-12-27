import { motion } from "framer-motion";
import { Check, Loader2, X, AlertTriangle, QrCode, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsAppAccount, ConnectionStatus } from "@/types/whatsapp";

interface WhatsAppConnectionPanelProps {
  account: WhatsAppAccount | null;
  qrCode: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
  isSocketConnected?: boolean;
  error?: string | null;
}

const statusConfig: Record<
  ConnectionStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  connected: {
    label: "Conectado",
    color: "text-whatsapp",
    icon: <Check className="w-4 h-4" />,
  },
  disconnected: {
    label: "Desconectado",
    color: "text-muted-foreground",
    icon: <X className="w-4 h-4" />,
  },
  connecting: {
    label: "Conectando...",
    color: "text-warning",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  qr_ready: {
    label: "QR Code pronto",
    color: "text-primary",
    icon: <QrCode className="w-4 h-4" />,
  },
  authenticating: {
    label: "Autenticando...",
    color: "text-warning",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  expired: {
    label: "Sessão expirada",
    color: "text-destructive",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
};

export function WhatsAppConnectionPanel({
  account,
  qrCode,
  onConnect,
  onDisconnect,
  isLoading,
  isSocketConnected = true,
  error,
}: WhatsAppConnectionPanelProps) {
  if (!account) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Selecione um número para conectar
          </p>
        </div>
      </div>
    );
  }

  const status = statusConfig[account.status];
  const showQR = account.status === 'qr_ready' || account.status === 'connecting';
  const canConnect = account.status === 'disconnected' || account.status === 'expired';
  const canDisconnect = account.status !== 'disconnected';

  return (
    <div className="flex-1 p-8 bg-background/50">
      {/* Socket connection warning */}
      {!isSocketConnected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
        >
          <WifiOff className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">
            Conexão com servidor perdida. Reconectando...
          </span>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {account.name}
          </h2>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={cn("flex items-center gap-1.5 text-sm font-medium", status.color)}>
                {status.icon}
                {status.label}
              </span>
            </div>
            {account.phone && (
              <div className="text-sm text-muted-foreground">
                {account.phone}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Última conexão:{" "}
              {account.lastConnectedAt
                ? new Date(account.lastConnectedAt).toLocaleString("pt-BR")
                : "—"}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-whatsapp/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-whatsapp" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Conectar WhatsApp
              </p>
              <p className="text-xs text-muted-foreground">
                Escaneie o código com seu celular
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-whatsapp" />
              <span>Abra o WhatsApp no celular</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-whatsapp" />
              <span>Vá em Configurações → Dispositivos conectados</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-whatsapp" />
              <span>Clique em "Conectar dispositivo" e escaneie</span>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 bg-white rounded-xl border border-border flex items-center justify-center overflow-hidden">
              {isLoading || account.status === "connecting" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-whatsapp animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Gerando QR Code...
                  </span>
                </div>
              ) : qrCode && showQR ? (
                <motion.img
                  key={qrCode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={qrCode}
                  alt="QR Code WhatsApp"
                  className="w-full h-full object-contain p-4"
                />
              ) : account.status === "connected" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-whatsapp/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-whatsapp" />
                  </div>
                  <span className="text-sm text-whatsapp font-medium">
                    Conectado!
                  </span>
                </div>
              ) : account.status === "authenticating" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">
                    Autenticando...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-4">
                  <QrCode className="w-16 h-16 text-muted-foreground/30" />
                  <span className="text-sm text-muted-foreground text-center">
                    Clique em "Conectar" para gerar o QR Code
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canConnect ? (
              <Button
                onClick={onConnect}
                disabled={isLoading || !isSocketConnected}
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  "Conectar"
                )}
              </Button>
            ) : account.status === 'connecting' || account.status === 'qr_ready' ? (
              <Button
                onClick={onConnect}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar novo QR
              </Button>
            ) : null}
            
            <Button
              onClick={onDisconnect}
              variant="secondary"
              disabled={!canDisconnect || isLoading}
              className="flex-1"
            >
              Desconectar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
