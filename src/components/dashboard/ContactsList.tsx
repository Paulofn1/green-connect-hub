import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const contacts = [
  {
    id: 1,
    name: "Maria Santos",
    phone: "+55 11 99999-1234",
    lastMessage: "Obrigada pelo atendimento!",
    time: "2 min",
    status: "online",
    mode: "bot",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    phone: "+55 21 98888-5678",
    lastMessage: "Quando chega meu pedido?",
    time: "5 min",
    status: "online",
    mode: "human",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Ana Costa",
    phone: "+55 31 97777-9012",
    lastMessage: "Quero saber mais sobre...",
    time: "12 min",
    status: "offline",
    mode: "bot",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Pedro Souza",
    phone: "+55 41 96666-3456",
    lastMessage: "Vocês têm disponível?",
    time: "25 min",
    status: "online",
    mode: "bot",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Julia Lima",
    phone: "+55 51 95555-7890",
    lastMessage: "Perfeito, muito obrigada!",
    time: "1h",
    status: "offline",
    mode: "human",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
];

export function ContactsList() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl border border-border h-full"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Contatos Recentes
            </h3>
            <p className="text-sm text-muted-foreground">5 ativos agora</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="w-3 h-3" />
            24 novas
          </Badge>
        </div>
      </div>

      <div className="divide-y divide-border">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="contact-item p-4 hover:bg-muted/50"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
                  contact.status === "online" ? "bg-success" : "bg-muted-foreground"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {contact.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {contact.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {contact.lastMessage}
              </p>
            </div>

            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                contact.mode === "bot"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {contact.mode === "bot" ? (
                <Bot className="w-3 h-3" />
              ) : (
                <User className="w-3 h-3" />
              )}
              <span className="capitalize">{contact.mode}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary font-medium hover:underline">
          Ver todos os contatos →
        </button>
      </div>
    </motion.div>
  );
}