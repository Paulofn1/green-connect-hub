export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "expired";

export interface WhatsAppAccount {
  id: string;
  name: string;
  phone: string;
  status: ConnectionStatus;
  lastConnectedAt?: Date;
  botActive: boolean;
}

export interface ConnectionLog {
  id: string;
  accountId: string;
  timestamp: Date;
  message: string;
  type: "info" | "success" | "warning" | "error";
}
