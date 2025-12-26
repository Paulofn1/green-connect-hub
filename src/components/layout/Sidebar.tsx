import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Workflow,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Smartphone, label: "WhatsApp", to: "/whatsapp" },
  { icon: Users, label: "CRM", to: "/crm" },
  { icon: MessageSquare, label: "Mensagens", to: "/messages" },
  { icon: Workflow, label: "Automações", to: "/automations" },
  { icon: BarChart3, label: "Relatórios", to: "/reports" },
];

const bottomNavItems = [
  { icon: Settings, label: "Configurações", to: "/settings" },
  { icon: HelpCircle, label: "Ajuda", to: "/help" },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-40 h-screen w-[72px] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6"
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
          <MessageSquare className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-sidebar-accent rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                  {item.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-2 mt-auto">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {item.label}
            </div>
          </NavLink>
        ))}
        
        <button className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Sair
          </div>
        </button>
      </div>
    </motion.aside>
  );
}