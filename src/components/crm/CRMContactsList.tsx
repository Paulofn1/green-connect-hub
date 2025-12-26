import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CRMContactsListProps {
  contacts: Contact[];
  selectedId?: string;
  onSelect: (contact: Contact) => void;
}

const stageColors = {
  lead: "bg-muted text-muted-foreground",
  qualified: "bg-primary/10 text-primary",
  negotiation: "bg-warning/10 text-warning",
  closed: "bg-success/10 text-success",
};

const stageLabels = {
  lead: "Lead",
  qualified: "Qualificado",
  negotiation: "Negociação",
  closed: "Fechado",
};

export function CRMContactsList({
  contacts,
  selectedId,
  onSelect,
}: CRMContactsListProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Contatos
            </h3>
            <p className="text-sm text-muted-foreground">
              {contacts.length} contatos encontrados
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(contact)}
            className={cn(
              "contact-item p-4 border-b border-border last:border-b-0",
              selectedId === contact.id && "contact-item-active bg-primary/5"
            )}
          >
            <div className="relative">
              <Avatar className="h-11 w-11">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
                  contact.status === "online"
                    ? "bg-success"
                    : "bg-muted-foreground"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-foreground truncate">
                  {contact.name}
                </p>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {contact.phone}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(contact.lastInteractionAt, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
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
              </div>
              <Badge
                variant="secondary"
                className={cn("text-[10px] px-2 py-0.5", stageColors[contact.stage])}
              >
                {stageLabels[contact.stage]}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}