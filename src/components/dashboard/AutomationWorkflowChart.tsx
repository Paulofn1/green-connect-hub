import { motion } from "framer-motion";
import { Play, Pause, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const workflows = [
  {
    id: 1,
    name: "Boas-vindas",
    status: "active",
    executions: 1234,
    successRate: 98.5,
  },
  {
    id: 2,
    name: "Recuperação de Carrinho",
    status: "active",
    executions: 856,
    successRate: 94.2,
  },
  {
    id: 3,
    name: "Pós-venda",
    status: "paused",
    executions: 432,
    successRate: 96.8,
  },
  {
    id: 4,
    name: "Reativação",
    status: "error",
    executions: 89,
    successRate: 78.5,
  },
];

const statusConfig = {
  active: {
    icon: Play,
    label: "Ativo",
    className: "bg-success/10 text-success",
  },
  paused: {
    icon: Pause,
    label: "Pausado",
    className: "bg-warning/10 text-warning",
  },
  error: {
    icon: AlertCircle,
    label: "Erro",
    className: "bg-destructive/10 text-destructive",
  },
};

export function AutomationWorkflowChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Automações Ativas
          </h3>
          <p className="text-sm text-muted-foreground">
            4 fluxos configurados
          </p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">
          Ver todos
        </button>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow, index) => {
          const status = statusConfig[workflow.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  status.className
                )}
              >
                <StatusIcon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {workflow.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {workflow.executions.toLocaleString()} execuções
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-medium text-foreground">
                    {workflow.successRate}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Taxa de sucesso</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}