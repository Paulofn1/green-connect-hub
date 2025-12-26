import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MessageAnalyticsChart } from "@/components/dashboard/MessageAnalyticsChart";
import { AutomationWorkflowChart } from "@/components/dashboard/AutomationWorkflowChart";
import { ContactsList } from "@/components/dashboard/ContactsList";
import {
  MessageSquare,
  Users,
  Workflow,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Visão geral do seu WhatsApp">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatsCard
          title="Mensagens Enviadas"
          value="12.847"
          change={12.5}
          icon={MessageSquare}
          variant="primary"
          delay={0}
        />
        <StatsCard
          title="Mensagens Respondidas"
          value="10.234"
          change={8.3}
          icon={CheckCircle2}
          variant="success"
          delay={0.05}
        />
        <StatsCard
          title="Taxa de Resposta"
          value="79.6%"
          change={5.2}
          icon={TrendingUp}
          variant="default"
          delay={0.1}
        />
        <StatsCard
          title="Contatos Ativos"
          value="3.421"
          change={15.8}
          icon={Users}
          variant="default"
          delay={0.15}
        />
        <StatsCard
          title="Automações Ativas"
          value="24"
          change={-2.1}
          icon={Workflow}
          variant="warning"
          delay={0.2}
        />
        <StatsCard
          title="Erros Hoje"
          value="7"
          change={-45.2}
          icon={AlertCircle}
          variant="default"
          delay={0.25}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <MessageAnalyticsChart />
          <AutomationWorkflowChart />
        </div>

        {/* Right Column - Contacts */}
        <div className="col-span-12 lg:col-span-4">
          <ContactsList />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;