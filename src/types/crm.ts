export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: "online" | "offline";
  mode: "bot" | "human";
  stage: "lead" | "qualified" | "negotiation" | "closed";
  tags: string[];
  lastInteractionAt: Date;
  source: string;
  owner: string;
}

export interface Message {
  id: string;
  contactId: string;
  type: "incoming" | "outgoing" | "system";
  sender: "user" | "bot" | "agent" | "system";
  content: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  contactId: string;
  type: "message_sent" | "message_received" | "tag_added" | "stage_changed" | "automation_started";
  description: string;
  createdAt: Date;
}

export interface Automation {
  id: string;
  contactId: string;
  flowId: string;
  flowName: string;
  status: "active" | "paused" | "completed" | "error";
  currentStep: number;
  totalSteps: number;
  lastExecutionAt: Date;
}