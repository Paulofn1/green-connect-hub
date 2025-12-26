import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Bot,
  User,
  Phone,
  Mail,
  Tag,
  Play,
  Pause,
  UserX,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact, Message, Activity, Automation } from "@/types/crm";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactDetailPanelProps {
  contact: Contact;
}

const mockMessages: Message[] = [
  {
    id: "1",
    contactId: "1",
    type: "incoming",
    sender: "user",
    content: "Olá, gostaria de saber mais sobre o produto",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    contactId: "1",
    type: "outgoing",
    sender: "bot",
    content: "Olá! Claro, ficarei feliz em ajudar. Qual produto você tem interesse?",
    createdAt: new Date(Date.now() - 1000 * 60 * 28),
  },
  {
    id: "3",
    contactId: "1",
    type: "incoming",
    sender: "user",
    content: "O plano premium, quanto custa?",
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: "4",
    contactId: "1",
    type: "outgoing",
    sender: "agent",
    content: "O plano premium custa R$ 197/mês e inclui todas as funcionalidades. Posso te enviar mais detalhes?",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "5",
    contactId: "1",
    type: "system",
    sender: "system",
    content: "Atendimento transferido para humano",
    createdAt: new Date(Date.now() - 1000 * 60 * 22),
  },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    contactId: "1",
    type: "message_received",
    description: "Mensagem recebida do contato",
    createdAt: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "2",
    contactId: "1",
    type: "tag_added",
    description: "Tag 'interessado' adicionada",
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    contactId: "1",
    type: "stage_changed",
    description: "Estágio alterado para 'Lead'",
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "4",
    contactId: "1",
    type: "automation_started",
    description: "Automação 'Boas-vindas' iniciada",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const mockAutomations: Automation[] = [
  {
    id: "1",
    contactId: "1",
    flowId: "flow-1",
    flowName: "Boas-vindas",
    status: "active",
    currentStep: 3,
    totalSteps: 5,
    lastExecutionAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "2",
    contactId: "1",
    flowId: "flow-2",
    flowName: "Nutrição de Leads",
    status: "paused",
    currentStep: 1,
    totalSteps: 8,
    lastExecutionAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const stageLabels = {
  lead: "Lead",
  qualified: "Qualificado",
  negotiation: "Negociação",
  closed: "Fechado",
};

export function ContactDetailPanel({ contact }: ContactDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="text-xl">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-card",
                contact.status === "online"
                  ? "bg-success"
                  : "bg-muted-foreground"
              )}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {contact.name}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                {contact.phone}
              </div>
              {contact.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Enviar Mensagem
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              {contact.mode === "bot" ? (
                <>
                  <User className="w-4 h-4" />
                  Assumir
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  Voltar ao Bot
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="summary"
            className="tab-trigger rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Resumo
          </TabsTrigger>
          <TabsTrigger
            value="conversations"
            className="tab-trigger rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Conversas
          </TabsTrigger>
          <TabsTrigger
            value="automations"
            className="tab-trigger rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Automações
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="tab-trigger rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Atividades
          </TabsTrigger>
        </TabsList>

        <div className="p-6 max-h-[450px] overflow-y-auto">
          <TabsContent value="summary" className="m-0">
            <SummaryTab contact={contact} />
          </TabsContent>

          <TabsContent value="conversations" className="m-0">
            <ConversationsTab messages={mockMessages} />
          </TabsContent>

          <TabsContent value="automations" className="m-0">
            <AutomationsTab automations={mockAutomations} />
          </TabsContent>

          <TabsContent value="activities" className="m-0">
            <ActivitiesTab activities={mockActivities} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function SummaryTab({ contact }: { contact: Contact }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Informações</h4>
        <div className="space-y-3">
          <InfoRow label="Telefone" value={contact.phone} />
          <InfoRow label="Email" value={contact.email || "-"} />
          <InfoRow label="Origem" value={contact.source} />
          <InfoRow label="Responsável" value={contact.owner} />
          <InfoRow label="Estágio" value={stageLabels[contact.stage]} />
          <InfoRow
            label="Última interação"
            value={formatDistanceToNow(contact.lastInteractionAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Ações Rápidas</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" size="sm">
            <Send className="w-4 h-4" />
            Enviar mensagem
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" size="sm">
            <Play className="w-4 h-4" />
            Iniciar automação
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" size="sm">
            <Pause className="w-4 h-4" />
            Pausar bot
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            size="sm"
          >
            <UserX className="w-4 h-4" />
            Bloquear contato
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function ConversationsTab({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex gap-3",
            message.type === "outgoing" && "flex-row-reverse"
          )}
        >
          {message.type !== "system" && (
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                message.sender === "user" && "bg-secondary text-muted-foreground",
                message.sender === "bot" && "bg-primary/10 text-primary",
                message.sender === "agent" && "bg-warning/10 text-warning"
              )}
            >
              {message.sender === "user" && <User className="w-4 h-4" />}
              {message.sender === "bot" && <Bot className="w-4 h-4" />}
              {message.sender === "agent" && <User className="w-4 h-4" />}
            </div>
          )}

          <div
            className={cn(
              "max-w-[70%] rounded-2xl px-4 py-2.5",
              message.type === "incoming" && "bg-secondary text-foreground",
              message.type === "outgoing" && "bg-primary text-primary-foreground",
              message.type === "system" &&
                "w-full max-w-full bg-muted/50 text-center text-muted-foreground text-xs py-2"
            )}
          >
            <p className="text-sm">{message.content}</p>
            {message.type !== "system" && (
              <p
                className={cn(
                  "text-[10px] mt-1",
                  message.type === "outgoing"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {format(message.createdAt, "HH:mm")}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AutomationsTab({ automations }: { automations: Automation[] }) {
  return (
    <div className="space-y-4">
      {automations.map((automation) => (
        <motion.div
          key={automation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-secondary/50 border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  automation.status === "active" && "bg-success/10 text-success",
                  automation.status === "paused" && "bg-warning/10 text-warning",
                  automation.status === "error" && "bg-destructive/10 text-destructive",
                  automation.status === "completed" && "bg-primary/10 text-primary"
                )}
              >
                {automation.status === "active" && <Play className="w-5 h-5" />}
                {automation.status === "paused" && <Pause className="w-5 h-5" />}
                {automation.status === "error" && <AlertCircle className="w-5 h-5" />}
                {automation.status === "completed" && <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-foreground">{automation.flowName}</p>
                <p className="text-sm text-muted-foreground">
                  Etapa {automation.currentStep} de {automation.totalSteps}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {automation.status === "active" ? "Pausar" : "Retomar"}
            </Button>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(automation.currentStep / automation.totalSteps) * 100}%`,
              }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Última execução:{" "}
            {formatDistanceToNow(automation.lastExecutionAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </motion.div>
      ))}

      <Button variant="outline" className="w-full gap-2">
        <Play className="w-4 h-4" />
        Iniciar nova automação
      </Button>
    </div>
  );
}

function ActivitiesTab({ activities }: { activities: Activity[] }) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "message_sent":
        return <Send className="w-4 h-4" />;
      case "message_received":
        return <MessageSquare className="w-4 h-4" />;
      case "tag_added":
        return <Tag className="w-4 h-4" />;
      case "stage_changed":
        return <ArrowRight className="w-4 h-4" />;
      case "automation_started":
        return <Play className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative pl-10"
          >
            <div className="absolute left-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground">
              {getActivityIcon(activity.type)}
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-sm text-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(activity.createdAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}