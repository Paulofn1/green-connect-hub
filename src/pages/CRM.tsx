import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { CRMContactsList } from "@/components/crm/CRMContactsList";
import { ContactDetailPanel } from "@/components/crm/ContactDetailPanel";
import { CRMFilters } from "@/components/crm/CRMFilters";
import type { Contact } from "@/types/crm";

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Maria Santos",
    phone: "+55 11 99999-1234",
    email: "maria@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    status: "online",
    mode: "bot",
    stage: "lead",
    tags: ["interessado", "produto-a"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 2),
    source: "landing-page",
    owner: "João Dias",
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    phone: "+55 21 98888-5678",
    email: "carlos@empresa.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    status: "online",
    mode: "human",
    stage: "negotiation",
    tags: ["vip", "urgente"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 5),
    source: "indicação",
    owner: "Ana Costa",
  },
  {
    id: "3",
    name: "Ana Costa",
    phone: "+55 31 97777-9012",
    email: "ana.costa@gmail.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    status: "offline",
    mode: "bot",
    stage: "qualified",
    tags: ["retorno"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 45),
    source: "instagram",
    owner: "João Dias",
  },
  {
    id: "4",
    name: "Pedro Souza",
    phone: "+55 41 96666-3456",
    email: "pedro.souza@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "online",
    mode: "bot",
    stage: "lead",
    tags: ["novo"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 120),
    source: "whatsapp",
    owner: "João Dias",
  },
  {
    id: "5",
    name: "Julia Lima",
    phone: "+55 51 95555-7890",
    email: "julia@corporativo.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    status: "offline",
    mode: "human",
    stage: "closed",
    tags: ["cliente", "premium"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    source: "site",
    owner: "Ana Costa",
  },
  {
    id: "6",
    name: "Roberto Silva",
    phone: "+55 61 94444-2345",
    email: "roberto.silva@empresa.com.br",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "online",
    mode: "bot",
    stage: "lead",
    tags: ["interessado"],
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 8),
    source: "facebook",
    owner: "João Dias",
  },
];

const CRM = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  return (
    <MainLayout title="CRM" subtitle="Gerencie seus contatos e conversas">
      <CRMFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Contacts List */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <CRMContactsList
            contacts={filteredContacts}
            selectedId={selectedContact?.id}
            onSelect={setSelectedContact}
          />
        </div>

        {/* Contact Detail Panel */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            {selectedContact ? (
              <motion.div
                key={selectedContact.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ContactDetailPanel contact={selectedContact} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] bg-card rounded-xl border border-border flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Selecione um contato
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Escolha um contato na lista para ver detalhes, histórico de
                    conversas e gerenciar automações.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default CRM;